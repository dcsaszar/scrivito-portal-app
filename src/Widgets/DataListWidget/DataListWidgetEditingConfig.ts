import { provideEditingConfig } from 'scrivito'
import { DataListWidget } from './DataListWidgetClass'

provideEditingConfig(DataListWidget, {
  title: 'Data list',
  attributes: {
    nrOfColumns: {
      title: 'Number of columns',
      description: 'Default: 1',
    },
  },
  properties: ['nrOfColumns', 'showSearch', 'searchPlaceholder'],
  initialContent: {
    nrOfColumns: '1',
    searchPlaceholder: 'Search by typing',
  },
})
