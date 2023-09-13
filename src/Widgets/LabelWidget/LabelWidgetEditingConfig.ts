import { provideEditingConfig } from 'scrivito'
import { LabelWidget } from './LabelWidgetClass'

provideEditingConfig(LabelWidget, {
  title: 'Label',
  properties: (widget) =>
    widget.get('hasHtmlSupport')
      ? ['valueSize', 'hasHtmlSupport', 'value']
      : ['valueSize', 'hasHtmlSupport'],
  initialContent: {
    label: 'Label',
    value: 'Value',
    valueSize: 'body-font-size',
  },
})
