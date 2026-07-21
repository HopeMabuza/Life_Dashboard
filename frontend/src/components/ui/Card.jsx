import { clsx } from 'clsx'

export default function Card({ children, className }) {
  return (
    <div className={clsx('bg-surface border border-line rounded-card p-6', className)}>
      {children}
    </div>
  )
}
