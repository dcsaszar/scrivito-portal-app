import { provideComponent, ContentTag, useDataItem } from 'scrivito'
import { StatusWidget } from './StatusWidgetClass'

import './StatusWidget.scss'

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
  const value: Record<string, unknown> = (typeof rawValue === 'string'
    ? mapping[rawValue]
    : undefined) ?? {
    title: dataItem?.get(customFieldName),
  }

  const valueSize = widget.get('valueSize')
  if (valueSize && valueSize !== 'body-font-size') {
    valueCssClassNames.push(valueSize)
  }

  const { color, percent, title } = value

  return (
    <div>
      <ContentTag
        content={widget}
        attribute="label"
        className="text-bold opacity-60 text-extra-small text-uppercase"
      />
      {color === undefined && (
        <div className={valueCssClassNames.join(' ')}>{title as string}</div>
      )}
      {color !== undefined && (
        <div className="progress-bar">
          <div
            className="progress-bar-color"
            style={{ backgroundColor: `${color}`, width: `${percent}%` }}
          ></div>
          <div className="progress-bar-label">{title as string}</div>
        </div>
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
