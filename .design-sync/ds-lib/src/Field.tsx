import * as React from 'react'

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Field label, rendered muted above the control. */
  label: React.ReactNode
  /** The control — an `Input`, `Select`, `Textarea`, or `SegmentedControl`. */
  children: React.ReactNode
}

/**
 * Labeled form field wrapper. Pairs a muted label with any control below it.
 */
export function Field({ label, className = '', children, ...rest }: FieldProps) {
  return (
    <div className={['field', className].filter(Boolean).join(' ')} {...rest}>
      <label>{label}</label>
      {children}
    </div>
  )
}
