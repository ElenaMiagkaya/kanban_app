export const profileKeys = {
  all: ['profile'] as const,
  detail: (id: string) => [...profileKeys.all, id] as const,
}
