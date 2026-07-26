import * as React from 'react'

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Small uppercase gold label above the title (e.g. "NET WORTH"). */
  kicker?: React.ReactNode
  /** Card heading. */
  title?: React.ReactNode
  /** Muted meta row shown at the bottom (e.g. "Updated today"). */
  meta?: React.ReactNode
}

/**
 * Midnight Gold surface card — a subtle top-lit gradient over the surface color
 * with a hairline border. Pass `kicker`/`title`/`meta` for the standard stat-card
 * layout, or just children for freeform content.
 */
export function Card({ kicker, title, meta, className = '', children, ...rest }: CardProps) {
  return (
    <div className={['card', className].filter(Boolean).join(' ')} {...rest}>
      {kicker != null && <span className="card-kicker">{kicker}</span>}
      {title != null && <div className="card-title">{title}</div>}
      {children != null && <div className="card-body">{children}</div>}
      {meta != null && <div className="card-meta">{meta}</div>}
    </div>
  )
}
