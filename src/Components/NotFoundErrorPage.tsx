import { useEffect } from 'react'
import {
  connect,
  ContentTag,
  Obj,
  NotFoundErrorPage as ScrivitoNotFoundErrorPage,
} from 'scrivito'

// Make sure, that you have a proxy running for these URLs, otherwise you'll see an endless loop.
const RELOAD_SUBPATHS = ['/auth']

export const NotFoundErrorPage = connect(function NotFoundErrorPage() {
  return (
    <>
      <ScrivitoNotFoundErrorPage>
        <NotFound />
      </ScrivitoNotFoundErrorPage>
    </>
  )
})

const NotFound = connect(function NotFound() {
  const root = Obj.root()

  // Workaround for issue #10292
  useEffect(() => {
    if (
      RELOAD_SUBPATHS.some(
        (reloadSubpath) =>
          location.pathname === reloadSubpath ||
          location.pathname.startsWith(`${reloadSubpath}/`),
      )
    ) {
      location.reload()
    }
  }, [])

  if (!root) {
    return <div>Page not found.</div>
  }

  // TODO: Consolidate with HomepageLayoutComponent

  return (
    <>
      {!!root.get('layoutShowHeader') && (
        <ContentTag tag="header" content={root} attribute="layoutHeader" />
      )}
      <ContentTag
        tag="main"
        id="main"
        content={root}
        attribute="siteNotFound"
      />
      {!!root.get('layoutShowFooter') && (
        <ContentTag tag="footer" content={root} attribute="layoutFooter" />
      )}
    </>
  )
})
