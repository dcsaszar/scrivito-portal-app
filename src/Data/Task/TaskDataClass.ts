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

async function fetchIndex(continuation?: string) {
  return Scrivito.unstable_JrRestApi.fetch(
    '../pisa-api/tasks',
    continuation ? { params: { continuation } } : {},
  ) as Promise<{ results: [{ id: string }]; continuation?: string }>
}
