import { Obj, connect } from 'scrivito'
import { isHomepage } from '../Objs/Homepage/HomepageObjClass'
import { Helmet } from 'react-helmet-async'
import { useEffect, useState } from 'react'

export const DesignAdjustments = connect(function DesignAdjustments() {
  const [fontBodyDataUrl, setFontBodyDataUrl] = useState<string | undefined>()
  const [fontDisplayDataUrl, setFontHeadlinesDataUrl] = useState<
    string | undefined
  >()
  const root = Obj.root()

  const fontBodyContentType = isHomepage(root)
    ? root.get('siteFontBody')?.contentType()
    : undefined
  const fontBodyUrl = isHomepage(root)
    ? root.get('siteFontBody')?.contentUrl()
    : undefined

  const fontDisplayContentType = isHomepage(root)
    ? root.get('siteFontDisplay')?.contentType()
    : undefined
  const fontDisplayUrl = isHomepage(root)
    ? root.get('siteFontDisplay')?.contentUrl()
    : undefined

  useEffect(() => {
    loadFont(fontBodyContentType, fontBodyUrl, setFontBodyDataUrl)
  }, [fontBodyContentType, fontBodyUrl])

  useEffect(() => {
    loadFont(fontDisplayContentType, fontDisplayUrl, setFontHeadlinesDataUrl)
  }, [fontDisplayContentType, fontDisplayUrl])

  if (!isHomepage(root)) return null

  const styles: string[] = []

  const primary = root.get('siteColorPrimary')
  if (primary) styles.push(`--bs-primary: ${primary};`)

  const primaryLighten = root.get('siteColorPrimaryLighten')
  if (primaryLighten) styles.push(`--bs-primary-lighten: ${primaryLighten};`)

  const primaryDarken = root.get('siteColorPrimaryDarken')
  if (primaryDarken) styles.push(`--bs-primary-darken: ${primaryDarken};`)

  const secondary = root.get('siteColorSecondary')
  if (secondary) styles.push(`--bs-secondary: ${secondary};`)

  const secondaryLighten = root.get('siteColorSecondaryLighten')
  if (secondaryLighten) {
    styles.push(`--bs-secondary-lighten: ${secondaryLighten};`)
  }

  const secondaryDarken = root.get('siteColorSecondaryDarken')
  if (secondaryDarken) styles.push(`--bs-secondary-darken: ${secondaryDarken};`)

  const dropShadow = root.get('siteDropShadow')
  if (!dropShadow) styles.push('--jr-box-shadow: none;')

  const roundedCorners = root.get('siteRoundedCorners')
  if (!roundedCorners) styles.push('--jr-border-radius: 0;')

  const fonts: string[] = []

  if (fontBodyDataUrl) {
    fonts.push(
      `@font-face { font-family: 'CustomBodyFont'; src: url(${fontBodyDataUrl}); }`,
    )
    styles.push("--bs-body-font-family: 'CustomBodyFont';")
  }

  if (fontDisplayDataUrl) {
    fonts.push(
      `@font-face { font-family: 'CustomHeadlinesFont'; src: url(${fontDisplayDataUrl}); }`,
    )
    styles.push("--bs-font-sans-serif: 'CustomHeadlinesFont';")
  }

  return (
    <Helmet
      style={[
        {
          cssText: `
            ${fonts.join(' ')}
            :root {
              ${styles.join(' ')}
            }
          `,
        },
      ]}
    />
  )
})

async function loadFont(
  contentType: string | undefined,
  url: string | undefined,
  callback: (dataUrl?: string) => void,
) {
  callback(undefined)
  if (!contentType || !url) return
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result?.toString()))
  reader.readAsDataURL(await (await fetch(url)).blob())
}
