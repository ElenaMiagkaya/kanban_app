interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  description?: string | null //описание модального окна
}

const Modal = ({ isOpen, onClose, title, children, description }: ModalProps) => {
  if (!isOpen) return null
  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      <button onClick={onClose}>Закрыть</button>
      {children}
    </div>
  )
}

export default Modal
