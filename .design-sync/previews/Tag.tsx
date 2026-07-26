import * as React from 'react'
import { Tag } from 'fmm-design-system'

export const Accent = () => <Tag variant="accent">On track</Tag>

export const AccentTwo = () => <Tag variant="accent-2">Over budget</Tag>

export const Neutral = () => <Tag variant="neutral">Groceries</Tag>

export const Outline = () => <Tag variant="outline">Recurring</Tag>

export const AllVariants = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
    <Tag variant="accent">On track</Tag>
    <Tag variant="accent-2">Over budget</Tag>
    <Tag variant="neutral">Groceries</Tag>
    <Tag variant="outline">Recurring</Tag>
  </div>
)
