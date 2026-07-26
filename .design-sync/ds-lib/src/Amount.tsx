import * as React from 'react'

export type AmountTone = 'neutral' | 'positive' | 'negative'

export interface AmountProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Money tone: `positive` = emerald (income), `negative` = rose (debt/spend), `neutral` = default text. */
  tone?: AmountTone
}

/**
 * Tabular-numeral money value. Uses the display font with tabular figures so
 * columns of numbers align. Wrap the formatted string as children
 * (e.g. `<Amount tone="positive">+$4,200</Amount>`).
 */
export function Amount({ tone = 'neutral', className = '', children, ...rest }: AmountProps) {
  const toneClass = tone === 'positive' ? 'amt-pos' : tone === 'negative' ? 'amt-warn' : ''
  return (
    <span className={['tnum', toneClass, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </span>
  )
}
