import * as React from 'react'

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text shown next to the radio dot. */
  label: React.ReactNode
}

/**
 * Single radio option with a gold-filled dot when selected. Group several by
 * sharing a `name`.
 */
export function Radio({ label, className = '', ...rest }: RadioProps) {
  return (
    <label className={['radio', className].filter(Boolean).join(' ')}>
      <input type="radio" {...rest} />
      <span className="dot" />
      {label}
    </label>
  )
}
