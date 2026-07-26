import * as React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Text input styled for Midnight Gold — surface fill, hairline border, gold focus
 * ring and caret. Wrap in `Field` to add a label. Compose with any input `type`.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = '', ...rest },
  ref,
) {
  return <input ref={ref} className={['input', className].filter(Boolean).join(' ')} {...rest} />
})
