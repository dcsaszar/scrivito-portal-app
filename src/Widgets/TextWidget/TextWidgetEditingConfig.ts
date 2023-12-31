import { provideEditingConfig } from 'scrivito'
import { TextWidget } from './TextWidgetClass'

provideEditingConfig(TextWidget, {
  title: 'Text',
  attributes: {
    alignment: {
      title: 'Alignment',
      description: 'Default: Left',
      values: [
        { value: 'left', title: 'Left' },
        { value: 'center', title: 'Center' },
        { value: 'right', title: 'Right' },
      ],
    },
    text: {
      title: 'Content',
    },
  },
  properties: ['alignment', 'text'],
  initialContent: {
    alignment: 'left',
  },
})
