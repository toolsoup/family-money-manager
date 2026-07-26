import * as React from 'react'

export interface NavProps extends React.HTMLAttributes<HTMLElement> {
  /** Brand / wordmark shown at the left. */
  brand?: React.ReactNode
  /** Nav links / actions, laid out after the brand. */
  children?: React.ReactNode
}

/**
 * Horizontal navigation bar. The `brand` sits at the left and pushes links to
 * the right; mark the active link with `aria-current="page"` to color it gold.
 */
export function Nav({ brand, className = '', children, ...rest }: NavProps) {
  return (
    <nav className={['nav', className].filter(Boolean).join(' ')} {...rest}>
      {brand != null && <span className="nav-brand">{brand}</span>}
      {children}
    </nav>
  )
}
