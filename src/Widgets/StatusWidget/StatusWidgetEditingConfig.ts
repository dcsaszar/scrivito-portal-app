import { provideEditingConfig } from 'scrivito'
import { StatusWidget } from './StatusWidgetClass'

provideEditingConfig(StatusWidget, {
  attributes: { mapping: { options: { multiLine: true } } },
  title: 'Status',
  properties: ['valueSize', 'customFieldName', 'mapping'],
  initialContent: {
    customFieldName: 'status',
    label: 'Label',
    valueSize: 'body-font-size',
  },
  validations: [
    [
      'mapping',
      (mapping) => {
        try {
          JSON.parse(mapping as string)
        } catch {
          return 'Please input a valid JSON mapping.'
        }
      },
    ],
  ],
})
