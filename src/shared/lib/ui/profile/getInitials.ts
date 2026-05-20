export const getInitials = (name: string) => {
  const initials = name.trim().split(/\s+/).filter(Boolean).slice(0, 2)
  return initials
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
}
