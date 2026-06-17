import { signInWithEmail, updateAuthUser } from '@shared/api'
import { useMutation } from '@tanstack/react-query'

export const useChangeEmail = (currentEmail: string) => {
  const mutation = useMutation({
    mutationFn: async ({ newEmail, password }: { newEmail: string; password: string }) => {
      await signInWithEmail(currentEmail, password)
      await updateAuthUser({ email: newEmail })
    },
  })
  return mutation
}
