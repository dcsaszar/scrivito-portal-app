import { provideObjClass } from 'scrivito'

export const Font = provideObjClass('Font', {
  attributes: { blob: 'binary', title: 'string' },
})
