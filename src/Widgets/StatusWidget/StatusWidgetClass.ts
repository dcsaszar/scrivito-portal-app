import { provideWidgetClass } from 'scrivito'

export const StatusWidget = provideWidgetClass('StatusWidget', {
  attributes: {
    label: 'string',
    mapping: 'string',
    valueSize: [
      'enum',
      {
        values: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body-font-size'],
      },
    ],
    customFieldName: 'string',
    details: 'string',
  },
  extractTextAttributes: ['label', 'details'],
})
