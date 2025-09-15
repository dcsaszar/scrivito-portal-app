import { canEdit, isComparisonActive, load, uiContext, urlFor } from 'scrivito'
import { ImageInstance } from '../../Objs/Image/ImageObjClass'
import './SocialCardsTab.scss'
import { useEffect, useState } from 'react'
import { useChatCompletion } from './useChatCompletion'

export function ImageTagsEditor({ page }: { page: ImageInstance }) {
  const image = page
  const [isRunning, setIsRunning] = useState(false)
  const { theme } = uiContext() || { theme: null }

  const { messages, loading, submitPrompt } = useChatCompletion()

  useEffect(() => {
    const value =
      messages.find((m) => m.role === 'assistant')?.content?.toString() || ''
    if (value) console.log(value)
    if (value) save(image, value)

    if (!loading && isRunning) setIsRunning(false)
  }, [messages, loading, image, isRunning])

  const readOnly = !canEdit(page) || isComparisonActive()
  const disabled = loading || isRunning || readOnly

  if (!theme) return null

  return (
    <div className={`scrivito_detail_content scrivito_${theme}`}>
      <div className="row">
        <div className="col-sm-6">
          <div className="scrivito_detail_label">
            <span>Tags</span>
          </div>

          <div className="input-group mb-3">
            <input
              style={{ border: 'none', boxShadow: 'none' }}
              type="text"
              disabled={disabled}
              className="form-control form-control-sm"
              placeholder={disabled ? '' : 'Enter tags'}
              value={image.get('tags').join(' ')}
              onChange={(e) => save(image, e.target.value)}
            />
            <div className="input-group-append">
              <button
                style={{ border: 'none', background: '#426698' }}
                title="Generate tags"
                className="btn btn-outline-secondary"
                type="button"
                disabled={disabled}
                onClick={async () => {
                  setIsRunning(true)
                  const base64 = await getBase64(image)
                  submitPrompt([
                    {
                      role: 'system',
                      content:
                        'You are an automated image tagging endpoint. You look at the given image and return a single line of text. The line contains a list of tags matching the image content. If there is text in the image, use the main word for the first tag. Tags are lowercase strings. Compound words are dash-separated. Tags are space separated. Avoid minor details. No repetition. 1 to 6 tags. Less is better.',
                    },
                    {
                      role: 'user',
                      content: [
                        { type: 'image_url', image_url: { url: base64 } },
                      ],
                    },
                  ])
                }}
              >
                <span
                  style={{
                    filter: 'contrast(0) brightness(10) grayscale(1)',
                  }}
                >
                  {disabled ? '⏳' : '✨'}
                </span>
              </button>
            </div>
          </div>
          <div className="scrivito_notice_body">Tags are space-separated</div>
        </div>
      </div>
    </div>
  )
}

function save(image: ImageInstance, tagsString: string) {
  image.update({
    tags: tagsString
      .replace(/\s+/g, ' ')
      .replace(/ $/, '\u00a0')
      .split(/ +/)
      .filter((v) => !!v),
  })
}

async function getBase64(image: ImageInstance) {
  const [contentType, url] = await load(() => {
    const binary = image.get('blob')!.optimizeFor({ width: 362, height: 362 })
    return [image.contentType(), urlFor(binary)]
  })
  if (contentType.includes('image/svg')) return await svgToPngDataUri(url)
  return await imageUrlToBase64(url)
}

async function svgToPngDataUri(svgDataUri: string) {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      const width = img.width || 362
      const height = img.height || 362
      const ratio = width / height
      const canvas = document.createElement('canvas')
      canvas.width = 362 * ratio
      canvas.height = 362
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      const pngDataUri = canvas.toDataURL('image/png')
      resolve(pngDataUri)
    }

    img.src = svgDataUri
  })
}

async function imageUrlToBase64(url: string): Promise<string> {
  const response = await fetch(url)
  const blob = await response.blob()

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result!.toString())
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
