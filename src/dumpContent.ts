#!npx vite-node
import fs from 'fs'
import { kebabCase } from 'lodash-es'
import { configure, createRestApiClient } from 'scrivito'
import { loadEnv } from 'vite'

type ObjData = {
  _id: string
  _path?: string
  _permalink?: string
  _language?: string
  _site_id?: string
  _widget_pool?: Record<string, WidgetData>
  pisa_url?: unknown
} & { [key: string]: [string, unknown] }
type WidgetData = { _obj_class: string } & {
  [key: string]: [string, unknown]
}
type SearchData = { continuation?: string; objs: ObjData[] }
type BlobsData = { private_access: { get: { url: string } } }
type BlobMetadata = {
  meta_data: { content_type: ['string', string]; filename: ['string', string] }
}

const DUMP_PATH = 'contentDump'

const env = loadEnv('development', process.cwd(), '')

const API_CLIENT_ID = env.CONTENT_MASTER_API_CLIENT_ID || ''
const API_CLIENT_SECRET = env.CONTENT_MASTER_API_CLIENT_SECRET || ''
const INSTANCE_ID = env.CONTENT_MASTER_SCRIVITO_TENANT || ''

const scrivitoClient = createRestApiClient(
  `https://api.scrivito.com/tenants/${INSTANCE_ID}`,
  { headers: { 'Scrivito-Access-As': 'editor' } },
)

if (API_CLIENT_ID && API_CLIENT_SECRET && INSTANCE_ID) {
  configure({
    tenant: INSTANCE_ID,
    apiKey: {
      clientId: API_CLIENT_ID,
      clientSecret: API_CLIENT_SECRET,
    },
    priority: 'background',
  })

  clearDump()
  await dumpContent()
  console.log(`\n✅ Dump complete (${fileStats()}).`)
} else {
  console.error(
    'Please provide CONTENT_MASTER_SCRIVITO_TENANT and credentials:',
    'CONTENT_MASTER_API_CLIENT_ID, CONTENT_MASTER_API_CLIENT_SECRET.',
  )
  process.exitCode = -1
}

function clearDump() {
  fs.rmSync(DUMP_PATH, { force: true, recursive: true })
  fs.mkdirSync(DUMP_PATH, { recursive: true })
}

function fileStats() {
  const files = fs.readdirSync(DUMP_PATH)
  return `${files.length} files`
}

async function dumpContent() {
  let continuation: string | undefined
  const objDatas = []
  const objIds = []
  const idMap: Record<string, string> = {}

  do {
    const data = (await scrivitoClient.put('workspaces/published/objs/search', {
      data: {
        continuation,
        query: [
          {
            field: '_site_id',
            operator: 'equals',
            value: ['portalDe', 'portalEn'],
          },
          {
            field: '_path',
            negate: true,
            operator: 'equals',
            value: ['/', null],
          },
        ],
        include_objs: true,
        options: { site_aware: true },
        size: 10,
      },
    })) as SearchData
    process.stdout.write('.')

    for (const objData of data.objs) {
      if (
        ['helpdesk', 'helpdesk/chat', 'en/helpdesk/chat', 'profile'].includes(
          objData._permalink || '?',
        )
      ) {
        continue
      }
      objDatas.push(objData)
      idMap[objData._id] = objData._id.split('').reverse().join('')
    }

    continuation = data.continuation
  } while (continuation)

  const mappedObjData = []

  for (const objData of objDatas) {
    let mappedData = objData

    const processedObjData = migrate(
      JSON.parse(
        JSON.stringify(ignorePerInstanceData(objData)).replace(
          /\b[0-9a-f]{16}\b/g,
          (v) => idMap[v] || v,
        ),
      ),
    )
    mappedData = JSON.parse(
      JSON.stringify(processedObjData)
        .replaceAll('"subhealine":', '"headline":')
        .replaceAll('"DocumentationPage"', '"Page"')
        .replaceAll('"DocumentationHomePage"', '"Page"')
        .replaceAll('"TrainingPage"', '"Page"')
        .replaceAll('"TrainingHomePage"', '"Page"')
        .replaceAll('"ProfilePage"', '"Page"')
        .replaceAll('"ChatPage"', '"Page"')
        .replaceAll(
          '"ContentSectionWidget","body"',
          '"SectionWidget","content"',
        )
        .replaceAll('"DeviderWidget"', '"DividerWidget"')
        .replaceAll('"DashboardHeaderWidget"', '"HeadlineWidget"') // incomplete, not important
        .replaceAll('"PageHeaderWidget"', '"HeadlineWidget"') // incomplete
        .replaceAll('"DocumentationTileWidget"', '"TextWidget"')
        .replaceAll('"ProductLinkWidget"', '"TextWidget"') // incomplete, not important
        .replaceAll('"portalDe"', '"dc07b5fb5abd4c35"')
        .replaceAll('"portalEn"', '"56a14d0750cc844e"'),
    )

    mappedObjData.push(mappedData)
  }

  const leafIdMap: Record<string, string> = {}

  for (const objData of mappedObjData) {
    if (objData._path?.split('/').length !== 5) continue
    const parentObjData = mappedObjData.find(
      ({ _path }) => _path === objData._path?.replace(/\/[^/]+$/, ''),
    )!
    leafIdMap[objData._id] = parentObjData._id
  }

  for (const objData of mappedObjData) {
    const childrenMigratedObjData = migrateChildren(objData, mappedObjData)

    if (leafIdMap[objData._id]) continue

    const processedObjData = JSON.parse(
      JSON.stringify(childrenMigratedObjData).replace(
        /\b[0-9a-f]{16}\b/g,
        (v) => leafIdMap[v] || v,
      ),
    )

    await dumpObj(processedObjData)
    objIds.push(processedObjData._id)
  }

  dumpManifest(objIds)
}

function dumpManifest(objIds: string[]) {
  fs.writeFileSync(
    `${DUMP_PATH}/index.json`,
    JSON.stringify({ objIds }, null, 2),
  )
}

function ignorePerInstanceData(objData: ObjData): ObjData {
  delete objData.pisa_url

  return objData
}

function migrateChildren(objData: ObjData, allObjData: ObjData[]): ObjData {
  const path = objData._path!

  let randomId = 10000000 + (parseInt(objData._id, 16) % 100000)

  const isMetaOverviewPage = objData._permalink?.startsWith('academy/')

  if (!objData.body || !objData.child_order) return objData

  const bodyWidgetIds = objData.body[1] as Array<string>
  const childIds = objData.child_order![1] as string[]
  const childObjDatas = childIds
    .map((id) => allObjData.find(({ _id }) => _id === id))
    .filter((v) => !!v)

  const titles: [string, string][] = childObjDatas
    .map((childObjData) => {
      const headlineWidget = Object.values(childObjData._widget_pool!).find(
        (w) => w._obj_class === 'HeadlineWidget',
      )!
      const headline = headlineWidget.headline![1]!.toString()
      return [childObjData.title![1]!.toString(), headline]
    })
    .filter((t): t is [string, string] => !!t)

  const topWidget = objData._widget_pool![bodyWidgetIds[0]!]!

  const hasCardWidget = topWidget._obj_class === 'CardWidget'

  const isOverviewPage = path.split('/').length === 3
  const isLeafPage = path.split('/').length === 4

  let sections: ObjData[][] = []
  if (isOverviewPage) sections = [childObjDatas]
  if (isMetaOverviewPage) {
    sections = childObjDatas.map((o) =>
      (o.child_order ? (o.child_order[1] as string[]) : [])
        .map((id) => allObjData.find(({ _id }) => _id === id))
        .filter((v) => !!v),
    )
  }

  if (sections.length) {
    sections.forEach((itemsObjData, i) => {
      const pool = objData._widget_pool!

      if (isMetaOverviewPage) {
        randomId += 1
        objData.body[1].push(`${randomId}`)
        pool[randomId] = {
          _obj_class: 'HeadlineWidget',
          style: ['string', 'h3'],
          headline: childObjDatas[i]!.title,
        }
      }

      const columns = isMetaOverviewPage ? 4 : itemsObjData.length < 3 ? 2 : 3
      while (itemsObjData.length) {
        const items = itemsObjData.splice(0, columns)
        randomId += 1
        objData.body[1].push(`${randomId}`)
        pool[randomId] = {
          _obj_class: 'ColumnContainerWidget',
          alignment: ['string', 'stretch'],
          layout_mode: ['string', 'grid'],
          columns: [
            'widgetlist',
            Array(columns)
              .fill(null)
              .map((_, i) => `${randomId + 1000 * (i + 1)}`),
          ],
        }
        for (let i = 0; i < columns; i++) {
          const item = items[i]
          const baseId = randomId + 1000 * (i + 1)
          if (item) {
            pool[baseId + 10000] = {
              _obj_class: 'CardWidget',
              background_color: ['string', 'primary'],
              background_animate_on_hover: ['boolean', true],
              padding: ['string', isMetaOverviewPage ? 'p-2' : 'p-3'],
              margin: ['string', 'mb-4'],
              image: item.teaser_image,
              background_image: isMetaOverviewPage ? null : item.teaser_image,
              card_body: ['widgetlist', [`${baseId + 20000}`]],
              link_to: ['link', { obj_id: item._id }],
            }
            pool[baseId + 20000] = {
              _obj_class: 'HeadlineWidget',
              style: ['string', 'h5'],
              alignment: ['string', 'center'],
              headline: item.title,
            }
          }
          pool[baseId] = {
            _obj_class: 'ColumnWidget',
            col_size: ['number', 12 / columns],
            content: ['widgetlist', item ? [`${baseId + 10000}`] : []],
          }
        }
      }
    })

    return objData
  }

  if (!isLeafPage) {
    return objData
  }

  if (titles.length > 1 && hasCardWidget) {
    const cardWidgetIds = topWidget.card_body![1] as Array<string>

    const widgetId = randomId.toString()
    cardWidgetIds.splice(1, 0, widgetId)
    objData._widget_pool![widgetId] = {
      _obj_class: 'TextWidget',
      text: [
        'html',
        '<ul>\n' +
          titles
            .map(
              ([title, headline]) =>
                `<li><a href="#${kebabCase(headline.toLowerCase())}">${title}</a></li>`,
            )
            .join('\n') +
          '\n</ul>',
      ],
    }
  }

  childObjDatas.forEach((childObjData) => {
    if (!childObjData) return

    bodyWidgetIds.push(...(childObjData.body![1] as Array<string>))
    objData._widget_pool = {
      ...objData._widget_pool,
      ...childObjData._widget_pool,
    }
  })
  return objData
}

function migrate(objData: ObjData): ObjData {
  const language = objData._site_id === 'portalDe' ? 'de' : 'en'
  const path = objData._path!
  const permalink = objData._permalink
  const pool = objData._widget_pool!

  const isSingleSection =
    objData.body?.[1]?.length === 1 &&
    pool[objData.body?.[1]![0]]?._obj_class === 'SectionWidget'
  objData._language = language
  objData.layout_main_background_color = ['string', 'light-grey']
  objData.layout_show_right_sidebar = ['boolean', false]
  objData.hide_in_navigation = ['boolean', false]
  objData.exclude_from_search = ['boolean', false]
  objData.layout_right_sidebar = ['widgetlist', []]

  if (permalink?.startsWith('documentation/') || permalink === 'neoletter') {
    objData._path = '/f533f129b8f42400' + path
  }

  if (permalink && ['helpdesk', 'profile'].includes(permalink)) {
    objData.hide_in_navigation = ['boolean', true]
  }

  if (permalink?.startsWith('academy/')) objData.title![1] += ' Academy'

  let randomId = 10000 + (parseInt(objData._id, 16) % 80000)

  const insertAfter: Record<string, string> = {}
  const purgeIds: string[] = []

  Object.keys(pool).forEach((id) => {
    randomId++
    const widget = pool[id]
    if (!widget) return
    switch (widget._obj_class) {
      case 'AccordionListWidget':
        widget._obj_class = 'CardWidget'
        widget.background_color = ['string', 'success']
        widget.show_footer = ['boolean', true]
        widget.card_body = widget.sections
        widget.sections = null
        widget.card_footer = ['widgetlist', ['000' + randomId]]
        pool['000' + randomId] = {
          _obj_class: 'HeadlineWidget',
          style: ['string', 'h5'],
          headline: widget.header_title,
        }
        break
      case 'AccordionSectionWidget':
        widget._obj_class = 'LinkContainerWidget'
        widget.links = widget.link_list
        widget.link_list = null
        break
      case 'ColumnContainerWidget':
        widget.alignment = ['string', 'stretch']
        break
      case 'ContentNavigationMultipleSliderWidget':
        purgeIds.push(id)
        delete pool[id]
        break
      case 'ContentNavigationSliderWidget':
        purgeIds.push(id)
        delete pool[id]
        break
      case 'CourseAttachmentWidget':
        widget._obj_class = 'CardWidget'
        widget.background_color = ['string', 'light-grey']
        widget.background_animate_on_hover = ['boolean', true]
        widget.padding = ['string', 'p-3']
        widget.margin = ['string', 'mb-4']
        if (!widget.headline) widget.headline = widget.description
        pool['000' + randomId] = {
          _obj_class: 'HeadlineWidget',
          style: ['string', 'h6'],
          headline:
            widget.type?.[1] === 'file'
              ? ['string', language === 'de' ? 'PDF anzeigen' : 'View PDF']
              : widget.headline,
        }
        pool['001' + randomId] = {
          _obj_class: 'TextWidget',
          text: ['html', `<p>${widget.description![1] || ''}</p>`],
        }
        if (widget.type?.[1] === 'file') {
          pool['002' + randomId] = {
            _obj_class: 'IconWidget',
            alignment: ['string', 'left'],
            icon: ['string', 'bi-file-pdf'],
            size: ['string', 'bi-5x'],
          }
        }
        widget.card_body = [
          'widgetlist',
          [
            '000' + randomId,
            '001' + randomId,
            ...(widget.type?.[1] === 'file' ? ['002' + randomId] : []),
          ],
        ]
        if (widget.link) {
          widget.link_to = [
            'link',
            {
              fragment: null,
              obj_id: (widget.link as string[])[1],
              query: null,
              target: widget.type?.[1] === 'file' ? '_blank' : null,
              title: null,
              url: null,
            },
          ]
          widget.background_animate_on_hover = ['boolean', true]
        }
        widget.link = null
        widget.type = null
        break
      case 'FaqListWidget': // quick and dirty
      case 'FaqListItemWidget': // quick and dirty
      case 'LinkBoxWidget':
        widget._obj_class = 'CardWidget'
        widget.background_color = ['string', 'middle-grey']
        pool['000' + randomId] = {
          _obj_class: 'HeadlineWidget',
          style: ['string', 'h5'],
          headline: widget.headline,
        }
        widget.card_body = [
          'widgetlist',
          ['000' + randomId, ...(widget.body as [string, string[]])[1]],
        ]
        widget.body = null
        break
      case 'HeadlineWidget':
        if (isSingleSection) {
          widget.style = ['string', 'h1']
          widget.headline = objData.title!
        }
        if (widget.headline?.[1]?.toString().match(/^\d:/)) {
          widget.headline[1] = widget.headline[1]!.toString().replace(
            /^\d:\s*/,
            '',
          )
        }
        break
      case 'LinkListWidget':
        widget._obj_class = 'ButtonWidget'
        widget.target = widget.links // incomplete, only the first link is migrated
        widget.links = null
        break
      case 'SectionWidget':
        widget._obj_class = 'CardWidget'
        widget.card_body = widget.content
        widget.background_color = ['string', 'white']
        if (isSingleSection) {
          const content = widget.content![1] as string[]
          widget.card_body = ['widgetlist', [content.shift()]]
          content.forEach((id) => {
            purgeIds.push(id)
            delete pool[id]
          })
        }
        widget.content = null
        break
      case 'TextWidget':
        if (
          widget.text?.[1]
            ?.toString()
            .includes(
              'Have a quick tour through the PisaSales Academy and see how to make your first steps in PisaSales.',
            )
        ) {
          purgeIds.push(id)
          delete pool[id]
        }
        break
      case 'TeaserBoxWidget':
        widget._obj_class = 'CardWidget'
        widget.card_body = ['widgetlist', ['000' + randomId]]
        widget.background_color = ['string', 'success']
        widget.link_to = widget.link
        widget.link = null
        pool['000' + randomId] = {
          _obj_class: 'HeadlineWidget',
          headline: widget.headline,
          style: ['string', 'h5'],
        }
        break
      case 'DocumentationTileWidget':
        if (widget.text && widget.text[1]?.toString().includes('<iframe')) {
          const html = widget.text![1] as string
          const src = html.match(/https:[^"]+/)?.toString()
          if (!src) throw new Error('missing iframe src')
          widget.text![1] = getEmbedCss().replace('SRC', src)

          pool[(insertAfter[id] = '000' + randomId)] = {
            _obj_class: 'SpaceWidget',
            size: ['number', 2],
          }
        }
        break
      case 'YoutubeVideoWidget':
        if (widget.youtube_video_id?.[1] === 'a1rx8zJeSj4') {
          purgeIds.push(id)
          delete pool[id]
        } else if (
          JSON.stringify(objData).includes(`"${id}",`) // not the last item in a widgetlist
        ) {
          pool[(insertAfter[id] = '000' + randomId)] = {
            _obj_class: 'SpaceWidget',
            size: ['number', 2],
          }
        }
        break
      default:
        break
    }
  })

  let json = JSON.stringify(objData)

  Object.entries(insertAfter).forEach(([where, what]) => {
    json = json.replace(new RegExp(`"${where}"(?!:)`), `"${where}","${what}"`)
  })

  purgeIds.forEach((id) => {
    json = json
      .replace(new RegExp(`,"${id}"(?!,)`), '')
      .replace(new RegExp(`"${id}",?`), '')
  })

  return mergeVideosToColumns(JSON.parse(json), randomId + 1)
}

function mergeVideosToColumns(objData: ObjData, randomId: number): ObjData {
  const pool = objData._widget_pool!
  let start = 0
  let count = 0
  let endsInSpace = false
  const cardWithMultipleVideos = Object.values(pool).find((widgetData, i) => {
    if (widgetData._obj_class !== 'CardWidget') return
    const ids = widgetData.card_body![1]! as string[]
    count = ids.filter((widgetId, i) => {
      const nextWidget = [
        pool[ids[i + 1] || '?'],
        pool[ids[i + 2] || '?'],
        pool[ids[i + 3] || '?'],
      ]
      const hasSpace = nextWidget[0]?._obj_class === 'SpaceWidget'
      const hasMore =
        nextWidget[1]?._obj_class === 'YoutubeVideoWidget' ||
        nextWidget[1]?.text?.[1]?.toString().includes('<iframe')
      const hasMoreSpace = nextWidget[2]?._obj_class === 'SpaceWidget'
      const isVideo =
        pool[widgetId]?._obj_class === 'YoutubeVideoWidget' ||
        pool[widgetId]?.text?.[1]?.toString().includes('<iframe')

      const canBeMerged = isVideo && hasSpace && hasMore
      if (canBeMerged && start === 0) start = i
      if (canBeMerged) endsInSpace = hasMoreSpace
      return canBeMerged
    }).length
    return count >= 1
  })
  if (!cardWithMultipleVideos) return objData

  const widgetIds = cardWithMultipleVideos.card_body![1]! as string[]
  const deleteCount = count * 2 + (endsInSpace ? 2 : 1)
  const transferIds = widgetIds.splice(start, deleteCount)

  while (transferIds.length) {
    randomId += 1
    cardWithMultipleVideos.card_body![1].splice(start, 0, 'f000' + randomId)
    start += 1
    pool['f000' + randomId] = {
      _obj_class: 'ColumnContainerWidget',
      alignment: ['string', 'stretch'],
      layout_mode: ['string', 'grid'],
      columns: [
        'widgetlist',
        Array(2)
          .fill(null)
          .map((_, i) => `f01${i}${randomId}`),
      ],
    }
    for (let i = 0; i < 2; i++) {
      pool[`f01${i}${randomId}`] = {
        _obj_class: 'ColumnWidget',
        col_size: ['number', 12 / 2],
        content: ['widgetlist', transferIds.splice(0, 2)],
      }
    }
  }
  return objData
}

async function dumpObjAndBinaries(objData: ObjData) {
  await dumpBinaries(objData)
  dumpObj(objData)
}

async function dumpBinaries(data: ObjData | WidgetData) {
  for (const value of Object.values(data)) {
    if (isBinaryAttribute(value)) {
      const { id } = value[1]
      await Promise.all([dumpBinary(id), dumpMetadata(id)])
    }
  }

  const widgetPool = data._widget_pool || {}
  for (const widget of Object.values(widgetPool)) await dumpBinaries(widget)
}

function isBinaryAttribute(data: unknown): data is ['binary', { id: string }] {
  if (!Array.isArray(data)) return false
  const [attributeType, attributeValue] = data
  return (
    attributeType === 'binary' &&
    !!attributeValue &&
    typeof attributeValue === 'object' &&
    typeof attributeValue.id === 'string'
  )
}

async function dumpBinary(binaryId: string) {
  const binary = (await scrivitoClient.get(
    `blobs/${encodeURIComponent(binaryId)}`,
  )) as BlobsData
  process.stdout.write('.')
  const url = binary.private_access.get.url
  const response = await fetch(url)
  if (response.status !== 200) throw new Error(`Failed to fetch ${url}`)
  const blob = await response.blob()
  fs.writeFileSync(
    `${DUMP_PATH}/blob-${urlSafeBase64(binaryId)}`,
    Buffer.from(await blob.arrayBuffer()),
  )
}

async function dumpMetadata(binaryId: string) {
  const {
    meta_data: {
      content_type: [, contentType],
      filename: [, filename],
    },
  } = (await scrivitoClient.get(
    `blobs/${encodeURIComponent(binaryId)}/meta_data`,
  )) as BlobMetadata
  process.stdout.write('.')
  fs.writeFileSync(
    `${DUMP_PATH}/blob-metadata-${urlSafeBase64(binaryId)}.json`,
    JSON.stringify({ contentType, filename }, null, 2),
  )
}

function urlSafeBase64(id: string): string {
  return btoa(id).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+/, '')
}

function dumpObj(objData: ObjData) {
  fs.writeFileSync(
    `${DUMP_PATH}/obj-${objData._id}.json`,
    JSON.stringify(objData, null, 2),
  )
}

function getEmbedCss() {
  return `
<label class="embed-toggle">
  <iframe src="SRC" frameborder="0"></iframe>
  <input type="checkbox"
/></label>
<style>
  .embed-toggle {
    display: block;
    position: relative;
    aspect-ratio: 1.778;
    outline: 1px solid #ddd;
  }

  .embed-toggle * {
    appearance: none;
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .embed-toggle iframe {
    background: #fff;
  }

  .embed-toggle:not(:has(:checked)) iframe {
    width: 200%;
    height: 200%;
    transform: translate(-25%, -25%) scale(0.5);
  }

  .card:has(.embed-toggle :checked), body:has(.embed-toggle :checked) .top-navigation-widget {
    z-index: 2;
  }

  .embed-toggle:has(:checked) {
    animation: pop 0.2s ease-out;
    aspect-ratio: unset;
    box-sizing: content-box;
    max-width: calc(100vw - 80px);
    max-height: calc(100vh - 80px);
    overflow: visible;
    position: fixed;
    top: min(-50vh, -50vw);
    bottom: min(-50vh, -50vw);
    margin: auto;
    left: min(-50vh, -50vw);
    right: min(-50vh, -50vw);
    border: max(50vh, 50vw) solid transparent;
    background-color: rgba(128, 128, 128, 0.8);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23eee' viewBox='0 0 123 123'%3E%3Cpath d='M18 18A61.5 61.5 0 1 1 0 61.4 61.3 61.3 0 0 1 18 18Zm59.4 21 6.5 6.5a4 4 0 0 1 0 5.7L73.6 61.4l10.3 10.4a4 4 0 0 1 0 5.6l-6.5 6.5a4 4 0 0 1-5.7 0L61.5 73.6 51.1 83.9a4 4 0 0 1-5.6 0L39 77.4a4 4 0 0 1 0-5.7l10.3-10.3L39 51.1a4 4 0 0 1 0-5.6l6.5-6.5a4 4 0 0 1 5.6 0l10.3 10.3L71.8 39a4 4 0 0 1 5.6 0Zm-16-28.5a51 51 0 1 0 36 15 50.8 50.8 0 0 0-36-15Z'/%3E%3C/svg%3E"),
      radial-gradient(circle, rgba(0, 0, 0, 0.4) 13px, transparent 18px);
    background-size:
      30px 30px,
      50px 50px;
    background-repeat: no-repeat;
    background-position:
      right -27px top -27px,
      right -37px top -37px;
    z-index: 2147483647;
  }

  .embed-toggle:has(:checked) iframe {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .embed-toggle:has(:checked) input {
    left: unset;
    bottom: unset;
    top: -30px;
    right: -30px;
    width: 35px;
    height: 35px;
  }

  @keyframes pop {
    0% {
      transform: scale(0.75);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
`
}
