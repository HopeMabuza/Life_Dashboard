import { clsx } from 'clsx'

const priorityStyles = {
  high:   'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low:    'bg-[#F0EBDD] text-[#8A8570]',
}

const areaStyles = {
  Health:        'bg-green-100 text-green-700',
  Work:          'bg-blue-100 text-blue-700',
  Growth:        'bg-purple-100 text-purple-700',
  Finance:       'bg-yellow-100 text-yellow-700',
  Relationships: 'bg-pink-100 text-pink-700',
}

export default function Badge({ label, variant = 'area' }) {
  const cls = variant === 'priority'
    ? (priorityStyles[label] ?? 'bg-line text-muted')
    : (areaStyles[label]     ?? 'bg-line text-muted')

  return (
    <span className={clsx('px-2.5 py-0.5 rounded-pill text-[10px] font-extrabold uppercase tracking-wide', cls)}>
      {label}
    </span>
  )
}
