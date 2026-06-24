interface ButtonProps {
  onClick?: () => void
  width?: string
  height?: string
  backgroundColor?: string
  color?: string
  borderRadius?: string
  border?: string
  fontSize?: string
  disabled?: boolean
  padding?: string
  type?: 'button' | 'submit' | 'reset'
  children: React.ReactNode
}

const Button = ({
  onClick,
  width = '80px',
  height = '40px',
  backgroundColor = '#aa3bff',
  color = '#fff',
  borderRadius = '5px',
  border = 'none',
  fontSize = '16px',
  padding = '0',
  disabled = false,
  children,
  type = 'button',
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{ width, height, backgroundColor, color, borderRadius, border, fontSize, padding }}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
