import * as React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {}

/**
 * Uppercase, letter-spaced gold eyebrow label — used above section titles and
 * on hero surfaces. Text only; for chips use `Tag`.
 */
export function Badge({ className = '', children, ...rest }: BadgeProps) {
  return (
    <span className={['badge', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </span>
  )
}
