import * as React from 'react'

export type TagVariant = 'accent' | 'accent-2' | 'neutral' | 'outline'

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** `accent` = gold tint, `accent-2` = rose tint, `neutral` = charcoal chip, `outline` = gold hairline. */
  variant?: TagVariant
}

/**
 * Small pill label. Use `accent` for positive/highlight states, `accent-2` for
 * debt/negative states, `neutral` for categories, `outline` for quiet emphasis.
 */
export function Tag({ variant = 'neutral', className = '', children, ...rest }: TagProps) {
  return (
    <span className={['tag', `tag-${variant}`, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </span>
  )
}
