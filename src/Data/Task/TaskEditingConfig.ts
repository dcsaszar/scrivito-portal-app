import { provideEditingConfig } from 'scrivito'
import { TaskData } from './TaskDataClass'

provideEditingConfig(TaskData, {
  title: 'Task',
  attributes: {
    name: { title: 'Task name' },
    description: { title: 'Description' },
    assignee: { title: 'Assigned person' },
    contact: { title: 'Client contact person' },
    begin_date: { title: 'Begin date' },
    end_date: { title: 'End date' },
    status: { title: 'Task status' },
  },
})
