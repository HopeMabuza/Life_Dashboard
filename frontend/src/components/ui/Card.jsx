import { clsx } from 'clsx'

export default function Card({ children, className }) {
  return (
    <div className={clsx('bg-gray-900 border border-gray-800 rounded-xl p-6', className)}>
      {children}
    </div>
  )
}
