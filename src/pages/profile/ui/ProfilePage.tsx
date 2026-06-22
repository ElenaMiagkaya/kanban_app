import { ProfileWidget } from '@widgets/profile'
import { SignOut } from '@features/sign-out'
import { ProjectsListWidgets } from '@widgets/projects-list'

const ProfilePage = () => {
  return (
    <div>
      <ProfileWidget />
      <ProjectsListWidgets />
      <SignOut />
    </div>
  )
}

export default ProfilePage
