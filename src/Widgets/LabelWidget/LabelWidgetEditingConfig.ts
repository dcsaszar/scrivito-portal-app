import { provideEditingConfig } from 'scrivito'
import { LabelWidget } from './LabelWidgetClass'

provideEditingConfig(LabelWidget, {
  title: 'Label',
  properties: (widget) =>
    widget.get('hasHtmlSupport')
      ? ['valueSize', 'showIfEmpty', 'hasHtmlSupport', 'value']
      : ['valueSize', 'showIfEmpty', 'hasHtmlSupport'],
  initialContent: {
    label: 'Label',
    value: 'Value',
    valueSize: 'body-font-size',
  },
})
