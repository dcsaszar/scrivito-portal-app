import * as Scrivito from 'scrivito'

export const TaskData = Scrivito.provideDataClass('TaskData', {
  connection: {
    get: async (id: string) =>
      (await fetchIndex()).results.find((item) => item.id === id) || null,
    index: async (params: {
      continuation(): string | undefined
      search: () => string
    }) => fetchIndex(params.continuation()),
  },
})

async function fetchIndex(_continuation?: string) {
  return {
    results: [
      {
        id: '00112233445566778899aabbccddeeff',
        name: 'Test one',
        assignee: 'Richter',
        begin_date: '2022',
        contact: 'Mrs. Jane Done',
        description: 'Plain text description\nFoo bar.\n',
        end_date: '2023',
        status: 'OPN',
      },
      {
        id: '00112233445566778899aabbccddeefe',
        name: 'Test two',
        assignee: 'Richter',
        begin_date: '2021',
        contact: 'Ms. Lisa Smith',
        description: '<i>HTML</i> description<br>Foo bar.',
        end_date: '2022',
        status: 'OPN',
      },
      {
        id: '00112233445566778899aabbccddeefd',
        name: 'Old task',
        assignee: 'Richter',
        begin_date: '2020',
        contact: 'Ms. Lisa Smith',
        description: '<h2>HTML FTW!</h2>',
        end_date: '2020',
        status: 'DON',
      },
    ],
  }
}
