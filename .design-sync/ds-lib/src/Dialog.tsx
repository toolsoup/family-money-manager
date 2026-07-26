import * as React from 'react'

export interface DialogProps {
  /** Whether the dialog is shown. */
  open: boolean
  /** Dialog heading. */
  title: React.ReactNode
  /** Optional muted description under the title. */
  description?: React.ReactNode
  /** Body content — form fields, text, etc. */
  children?: React.ReactNode
  /** Footer actions, right-aligned — typically a ghost cancel + primary confirm `Button`. */
  actions?: React.ReactNode
  /** Called when the backdrop is clicked. */
  onClose?: () => void
}

/**
 * Centered modal dialog with a blurred backdrop. Compose form `Field`s as
 * children and `Button`s in `actions`. Renders nothing when `open` is false.
 */
export function Dialog({ open, title, description, children, actions, onClose }: DialogProps) {
  if (!open) return null
  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-title">{title}</div>
        {description != null && <div className="dialog-body">{description}</div>}
        {children}
        {actions != null && <div className="dialog-actions">{actions}</div>}
      </div>
    </div>
  )
}
