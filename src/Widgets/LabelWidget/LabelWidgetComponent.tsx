import { provideComponent, ContentTag, useDataItem } from 'scrivito'
import { LabelWidget } from './LabelWidgetClass'

provideComponent(LabelWidget, ({ widget }) => {
  const valueCssClassNames = ['text-multiline']

  const hasHtmlSupport = widget.get('hasHtmlSupport')
  const showIfEmpty = widget.get('showIfEmpty')

  const valueSize = widget.get('valueSize')
  if (valueSize && valueSize !== 'body-font-size') {
    valueCssClassNames.push(valueSize)
  }

  const dataItem = useDataItem()

  if (!showIfEmpty) {
    if (
      widget
        .get('value')
        .replace(/__[a-z]+\.([a-z]+)__/gi, (_, attributeName) => {
          return (dataItem?.get(attributeName) as string) || '<empty>'
        })
        .includes('<empty>')
    ) {
      return null
    }
  }

  let htmlValue

  if (hasHtmlSupport) {
    const value = widget
      .get('value')
      .replace(/__[a-z]+\.([a-z]+)__/gi, (_, attributeName) => {
        return (dataItem?.get(attributeName) as string) || 'n.A.'
      })

    if (value.includes('<')) htmlValue = value
  }

  return (
    <div>
      <ContentTag
        content={widget}
        attribute="label"
        className="text-bold opacity-60 text-extra-small text-uppercase"
      />
      {htmlValue ? (
        <div
          className={valueCssClassNames.join(' ')}
          dangerouslySetInnerHTML={{ __html: htmlValue }}
        ></div>
      ) : (
        <ContentTag
          content={widget}
          attribute="value"
          className={valueCssClassNames.join(' ')}
        />
      )}
      <ContentTag
        content={widget}
        attribute="details"
        tag="span"
        className="list-value text-muted text-small text-multiline"
      />
    </div>
  )
})
