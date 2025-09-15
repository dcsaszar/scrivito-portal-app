import { provideEditingConfig } from 'scrivito'
import { Image } from './ImageObjClass'
import { ImageTagsEditor } from '../../Components/ScrivitoExtensions/ImageTagsEditor'

provideEditingConfig(Image, {
  title: 'Image',
  attributes: {
    alternativeText: {
      title: 'Alternative text',
      description:
        'Text that helps visually impaired users understand the purpose or function of the image.' +
        ' Leave empty if only decorative.' +
        ' See https://www.w3.org/WAI/tutorials/images/decision-tree/',
    },
    tags: {
      title: 'Tags',
      description: 'Make it easier to find this Image by adding some tags.',
    },
  },
  properties: ['alternativeText', 'tags'],
  propertiesGroups: [
    {
      title: 'Tags',
      component: ImageTagsEditor,
      properties: ['tags'],
      key: 'tags',
    },
  ],
})
