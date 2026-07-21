import { clsx } from 'clsx'

const colors = {
  Health:        'bg-green-900 text-green-300',
  Work:          'bg-blue-900 text-blue-300',
  Growth:        'bg-purple-900 text-purple-300',
  Finance:       'bg-yellow-900 text-yellow-300',
  Relationships: 'bg-pink-900 text-pink-300',
}

export default function Badge({ label }) {
  return (
    <span className={clsx('px-2 py-0.5 rounded text-xs font-medium', colors[label] ?? 'bg-gray-800 text-gray-300')}>
      {label}
    </span>
  )
}
