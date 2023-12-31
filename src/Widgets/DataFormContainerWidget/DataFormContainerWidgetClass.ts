import { provideWidgetClass } from 'scrivito'

export const DataFormContainerWidget = provideWidgetClass(
  'DataFormContainerWidget',
  {
    attributes: {
      content: 'widgetlist',
      redirectAfterCreate: 'reference',
      createdMessage: 'string',
    },
  },
)
