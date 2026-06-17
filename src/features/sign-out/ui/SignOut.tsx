import { useState } from 'react'
import { useAuth, mapAuthErrorToMessage } from '@/shared/lib'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@shared/config'

const SignOut = () => {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSignOut = async () => {
    setErrorMessage(null) //очищаем сообщение об ошибке
    setIsProcessing(true)
    try {
      await signOut()
      navigate(ROUTES.signIn, { replace: true })
    } catch (error) {
      setErrorMessage(mapAuthErrorToMessage(error))
    } finally {
      setIsProcessing(false)
    }
  }
  return (
    <div>
      <button disabled={isProcessing} onClick={handleSignOut}>
        Выйти
      </button>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  )
}

export default SignOut
