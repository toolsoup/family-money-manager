import * as React from 'react'

export interface CanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Interior padding around the content. Defaults to a comfortable page inset. */
  padded?: boolean
}

/**
 * The Midnight Gold page backdrop — the near-black canvas with the faint gold +
 * blue radial auras, default text color, and body font. In the app this lives on
 * `body`; wrap a screen's root in `Canvas` to reproduce the branded background on
 * a standalone surface.
 */
export function Canvas({ padded = true, className = '', style, children, ...rest }: CanvasProps) {
  return (
    <div
      className={['fmm-canvas', className].filter(Boolean).join(' ')}
      style={{
        minHeight: '100%',
        background:
          'radial-gradient(1100px 620px at 12% -8%, rgba(245, 166, 35, 0.10), transparent 60%), ' +
          'radial-gradient(900px 500px at 100% 0%, rgba(56, 90, 130, 0.10), transparent 55%), ' +
          'var(--color-canvas)',
        color: 'var(--color-text)',
        fontFamily: 'var(--font-body)',
        padding: padded ? 'var(--space-6)' : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}
