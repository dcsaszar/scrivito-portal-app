import { provideComponent, ContentTag, useDataItem } from 'scrivito'
import { StatusWidget } from './StatusWidgetClass'

provideComponent(StatusWidget, ({ widget }) => {
  const dataItem = useDataItem()

  const valueCssClassNames = ['text-multiline']

  const customFieldName = widget.get('customFieldName')
  let mapping: Record<string, { title: string }> = {}
  try {
    mapping = JSON.parse(widget.get('mapping'))
  } catch {
    // skip
  }
  const rawValue = dataItem?.get(customFieldName)
  const value: { title: unknown } = (typeof rawValue === 'string'
    ? mapping[rawValue]
    : undefined) ?? {
    title: dataItem?.get(customFieldName),
  }

  const valueSize = widget.get('valueSize')
  if (valueSize && valueSize !== 'body-font-size') {
    valueCssClassNames.push(valueSize)
  }

  return (
    <div>
      <ContentTag
        content={widget}
        attribute="label"
        className="text-bold opacity-60 text-extra-small text-uppercase"
      />
      <div className={valueCssClassNames.join(' ')}>
        {value.title as string}
      </div>
      <ContentTag
        content={widget}
        attribute="details"
        tag="span"
        className="list-value text-muted text-small text-multiline"
      />
    </div>
  )
})
