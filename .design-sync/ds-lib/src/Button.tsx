import * as React from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. `primary` is the gold gradient CTA; `secondary` is the neutral outline; `ghost` is a low-emphasis gold text button; `danger` is the rose destructive action. */
  variant?: ButtonVariant
  /** Square 38×38 icon-only button (no text). */
  iconOnly?: boolean
  /** Full-width button, e.g. the primary action in a dialog or form. */
  block?: boolean
}

/**
 * Midnight Gold button. The primary variant carries the gold gradient + glow;
 * use exactly one primary per view as the main call to action.
 */
export function Button({
  variant = 'secondary',
  iconOnly = false,
  block = false,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const cls = [
    'btn',
    `btn-${variant}`,
    iconOnly ? 'btn-icon' : '',
    block ? 'btn-block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  )
}
