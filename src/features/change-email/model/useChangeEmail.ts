import { signInWithEmail } from '@shared/api/auth/signInWithEmail'
import { updateAuthUser } from '@shared/api/auth/updateAuthUser'
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
