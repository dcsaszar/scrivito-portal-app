import { provideWidgetClass } from 'scrivito'

export const FormOptionsWidget = provideWidgetClass('FormOptionsWidget', {
  attributes: {
    customFieldName: 'string',
    label: 'string',
    required: 'boolean',
    helpText: 'html',
    mapping: 'string',
  },
})
