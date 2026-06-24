import { useState } from 'react'
import { Modal } from '@shared/ui'
import { Button } from '@shared/ui'
import { changePasswordSchema } from '../model/validation'
import { useChangePassword } from '../model/useChangePassword'
import { mapAuthErrorToMessage } from '@shared/lib'

const ChangePassword = ({ userEmail }: { userEmail: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [errorValidation, setErrorValidation] = useState<string | null>(null)
  const description = `Убедитесь, что ваш новый пароль содержит 8 и более символов и не совпадает со старым паролем`

  const { mutate: changePassword, isPending, isError, reset, error } = useChangePassword(userEmail)

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorValidation(null)
    reset()

    const formData = new FormData(e.target)
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const currentPassword = formData.get('currentPassword') as string

    const parsed = changePasswordSchema.safeParse({ newPassword, confirmPassword, currentPassword })
    if (!parsed.success) {
      setErrorValidation(parsed.error.issues[0].message)
      return
    }
    changePassword({ newPassword, currentPassword })
  }

  const handleChange = () => {
    setErrorValidation(null)
    reset()
  }

  const handleOpen = () => {
    setIsOpen(true)
    setErrorValidation(null)
    reset()
  }

  return (
    <div>
      {!isOpen ? <button onClick={handleOpen}>Изменить пароль</button> : null}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Изменить пароль"
        description={description}
        isCloseDisabled={isPending}
      >
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Новый пароль"
            name="newPassword"
            onChange={handleChange}
            autoComplete="new-password"
          />
          <input
            type="password"
            placeholder="Подтвердите пароль"
            name="confirmPassword"
            onChange={handleChange}
            autoComplete="new-password"
          />
          <input
            type="password"
            placeholder="Ваш пароль"
            name="currentPassword"
            onChange={handleChange}
            autoComplete="current-password"
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Изменение...' : 'Изменить пароль'}
          </Button>
          {isError && error && <p>Ошибка: {mapAuthErrorToMessage(error)}</p>}
          {errorValidation && <p>{errorValidation}</p>}
        </form>
      </Modal>
    </div>
  )
}

export default ChangePassword
