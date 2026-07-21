import { clsx } from 'clsx'

const variants = {
  primary: 'bg-ink hover:bg-ink/90 text-surface',
  outline: 'border border-line hover:border-ink/30 text-muted hover:text-ink bg-transparent',
  ghost:   'bg-transparent hover:bg-cream text-muted',
  danger:  'bg-red-100 hover:bg-red-200 text-red-700',
}

export default function Button({ children, variant = 'primary', className, ...props }) {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded-2xl text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
