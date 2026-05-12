import { SignInByEmail } from '@features/sign-in-by-email'
import { NavigateToSignUp } from '@features/navigate-to-sign-up'

const SignInPage = () => {
  return (
    <div>
      <SignInByEmail />
      <NavigateToSignUp />
    </div>
  )
}

export default SignInPage
