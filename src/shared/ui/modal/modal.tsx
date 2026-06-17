import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  isCloseDisabled?: boolean //для блокировки закрытия модалки,пока идет мутация
  onClose: () => void
  title: string
  children: React.ReactNode
  description?: string | null //описание модального окна
}

const Modal = ({ isOpen, onClose, title, children, description, isCloseDisabled }: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return //если модальное окно не открыто, не выполняем эффект

    const currentOverflow = document.body.style.overflow //сохраняем текущее значение overflow body, чтобы потом вернуть его
    document.body.style.overflow = 'hidden' //устанавливаем overflow body в hidden, чтобы не было прокрутки при открытом модальном окне

    const handleKeyDown = (e: KeyboardEvent) => {
      //обработчик нажатия клавиши Escape
      if (e.key === 'Escape' && !isCloseDisabled) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown) //подписываемся на событие нажатия клавиши Escape
    return () => {
      document.removeEventListener('keydown', handleKeyDown) //отписываемся от события нажатия клавиши Escape
      document.body.style.overflow = currentOverflow //возвращаем overflow body в текущее значение
    }
  }, [isOpen, onClose, isCloseDisabled])

  if (!isOpen) return null //если модальное окно не открыто

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
      }}
      onClick={isCloseDisabled ? undefined : onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        style={{
          position: 'relative',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          width: '500px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h1 id="modal-title">{title}</h1>
        {description && <p>{description}</p>}
        <button
          onClick={isCloseDisabled ? undefined : onClose}
          aria-label="Закрыть модальное окно"
          style={{ position: 'absolute', top: 10, right: 10 }}
          disabled={isCloseDisabled}
        >
          Закрыть
        </button>
        {children}
      </div>
    </div>
  )
}

export default Modal
