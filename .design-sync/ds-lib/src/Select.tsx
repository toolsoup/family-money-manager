import * as React from 'react'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

/**
 * Native select styled to match `Input` — surface fill, hairline border, gold
 * focus ring. Wrap in `Field` for a label.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className = '', children, ...rest },
  ref,
) {
  return (
    <select ref={ref} className={['select', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </select>
  )
})
