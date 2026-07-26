import * as React from 'react'

export interface MeterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Fill percentage, 0–100. Values are clamped. */
  value: number
  /** Render the fill in muted neutral instead of the gold gradient. */
  muted?: boolean
}

/**
 * Thin progress / spending meter — a gold gradient fill on a dark track.
 * Use `muted` for secondary or over-budget bars.
 */
export function Meter({ value, muted = false, className = '', ...rest }: MeterProps) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div
      className={['meter', className].filter(Boolean).join(' ')}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      {...rest}
    >
      <i className={muted ? 'mute' : undefined} style={{ width: `${pct}%` }} />
    </div>
  )
}
