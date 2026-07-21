import { clsx } from 'clsx'

const variants = {
  primary:  'bg-brand-500 hover:bg-brand-600 text-white',
  ghost:    'bg-transparent hover:bg-gray-800 text-gray-300',
  danger:   'bg-red-600 hover:bg-red-700 text-white',
  outline:  'border border-gray-700 hover:bg-gray-800 text-gray-300',
}

export default function Button({ children, variant = 'primary', className, ...props }) {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
