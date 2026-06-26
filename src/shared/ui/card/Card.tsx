interface CardProps {
  children: React.ReactNode
  className?: string
}

const Card = ({ children, className }: CardProps) => {
  return (
    <article className={className ? `project-title ${className}` : 'project-title'}>
      {children}
    </article>
  )
}

export default Card
