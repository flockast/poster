export const normalizeEmail = (email: string): string => {
  return email.trim().toLocaleLowerCase()
}
