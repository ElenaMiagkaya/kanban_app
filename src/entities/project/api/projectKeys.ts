export const projectKeys = {
  all: ['projects'] as const, //ключ для всех проектов
  list: (ownerId: string) => [...projectKeys.all, 'list', ownerId] as const, //ключ для списка проектов по ownerId
  detail: (projectId: string) => [...projectKeys.all, 'detail', projectId] as const, //ключ для проекта по id
}
