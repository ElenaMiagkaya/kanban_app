import { useState, useEffect } from 'react'
import { getInitials } from '../lib/ui/profile/getInitials'

interface UserAvatarProps {
  src?: string
  name?: string | null
  size?: number | string
}

const UserAvatar = ({ src, name, size = 100 }: UserAvatarProps) => {
  // Состояние для отслеживания ошибки загрузки картинки
  const [hasError, setHasError] = useState(false)

  // Сбрасываем ошибку, если вдруг src поменялся динамически
  useEffect(() => {
    setHasError(false)
  }, [src])

  // Логика определения, что именно рендерить внутри аватарки
  const renderAvatar = () => {
    // Если есть ссылка И не было ошибки загрузки — рендерим img
    if (src && !hasError) {
      return (
        <img
          src={src}
          alt={name ?? ''}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={() => setHasError(true)} // Если ссылка битая, сработает этот триггер
        />
      )
    }

    // Если картинки нет ИЛИ она оказалась битой — проверяем имя для инициалов
    if (name) {
      return <div>{getInitials(name)}</div>
    }

    // Дефолтный пустой фон, если нет ни картинки, ни имени
    return <div style={{ backgroundColor: '#fcb75e', width: '100%', height: '100%' }}></div>
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        border: '1px solid #fcb75e',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {renderAvatar()}
    </div>
  )
}

export default UserAvatar
