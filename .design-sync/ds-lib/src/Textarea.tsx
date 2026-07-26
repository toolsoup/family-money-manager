import * as React from 'react'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/**
 * Multi-line text input, vertically resizable, styled to match `Input`.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className = '', ...rest },
  ref,
) {
  return <textarea ref={ref} className={['input', className].filter(Boolean).join(' ')} {...rest} />
})
