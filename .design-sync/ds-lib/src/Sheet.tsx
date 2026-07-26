import * as React from 'react'

export interface SheetProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Add comfortable interior padding. Off by default so you control the inset. */
  padded?: boolean
}

/**
 * The primary content surface — a rounded panel floating on the darker canvas
 * with a hairline border and soft shadow. Wrap page sections, sidebars, and
 * dialog-free panels in a `Sheet`.
 */
export function Sheet({ padded = false, className = '', style, children, ...rest }: SheetProps) {
  return (
    <div
      className={['sheet', className].filter(Boolean).join(' ')}
      style={padded ? { padding: 'var(--space-6)', ...style } : style}
      {...rest}
    >
      {children}
    </div>
  )
}
