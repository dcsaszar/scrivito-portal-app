import { provideEditingConfig } from 'scrivito'
import { FormOptionsWidget } from './FormOptionsWidgetClass'

provideEditingConfig(FormOptionsWidget, {
  title: 'Form Options',
  attributes: {
    required: { title: 'Mandatory' },
    mapping: { options: { multiLine: true } },
    type: {
      title: 'Input type',
      values: [
        { value: 'accept_terms', title: 'Accept terms' },
        ...(import.meta.env.ENABLE_NEOLETTER_FORM_BUILDER_SUBSCRIPTION_FEATURE
          ? [{ value: 'subscription', title: 'Subscription' }]
          : []),
        { value: 'custom', title: 'Custom' },
      ],
    },
    customFieldName: { title: 'Field name' },
    helpText: { title: 'Help text' },
  },
  properties: ['customFieldName', 'label', 'required', 'helpText', 'mapping'],
  initialContent: {
    customFieldName: 'custom_option',
    label: 'Please send me your free printed product catalog.',
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
