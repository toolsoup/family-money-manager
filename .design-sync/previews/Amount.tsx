import * as React from 'react'
import { Amount } from 'fmm-design-system'

export const Positive = () => (
  <Amount tone="positive" style={{ fontSize: 28 }}>
    +$4,200
  </Amount>
)

export const Negative = () => (
  <Amount tone="negative" style={{ fontSize: 28 }}>
    −$1,850
  </Amount>
)

export const Neutral = () => (
  <Amount style={{ fontSize: 28 }}>$482,900</Amount>
)

export const Ledger = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '8px 32px', fontSize: 18 }}>
    <span className="text-muted">Paycheck</span>
    <Amount tone="positive" style={{ textAlign: 'right' }}>+$5,400</Amount>
    <span className="text-muted">Mortgage</span>
    <Amount tone="negative" style={{ textAlign: 'right' }}>−$2,180</Amount>
    <span className="text-muted">Groceries</span>
    <Amount tone="negative" style={{ textAlign: 'right' }}>−$742</Amount>
  </div>
)
