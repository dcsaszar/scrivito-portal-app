import { provideEditingConfig } from 'scrivito'
import { IconWidget } from './IconWidgetClass'
import Thumbnail from './thumbnail.svg'
import { ScrivitoBootstrapIconEditor } from '../../scrivito-icon-picker'
import { IconEditorTab } from '../../Components/IconEditorTab2/IconEditorTab'

provideEditingConfig(IconWidget, {
  title: 'Icon',
  thumbnail: Thumbnail,
  attributes: {
    alignment: {
      title: 'Alignment',
      description: 'A icon list widget ignores this setting. Default: Left',
      values: [
        { value: 'left', title: 'Left' },
        { value: 'center', title: 'Center' },
        { value: 'right', title: 'Right' },
      ],
    },
    icon: {
      title: 'Icon',
      description:
        'Default: "bi-box". The full list of names can be found at https://icons.getbootstrap.com/',
    },
    link: {
      title: 'Link (optional)',
      description: 'The link where this icon should lead.',
    },
    size: {
      title: 'Size',
    },
  },
  propertiesGroups: [
    {
      title: 'Icon (design)',
      component: IconEditorTab,
      key: 'icon-group2',
    },
    {
      component: ScrivitoBootstrapIconEditor,
      key: 'icon-group',
      properties: ['icon'],
      title: 'Icon',
    },
    {
      title: 'Optional attributes',
      properties: ['size', 'alignment', 'link'],
      key: 'optional-attributes-group',
    },
  ],
  initialContent: {
    icon: 'bi-box',
    size: 'bi-1x',
    alignment: 'left',
  },
})
