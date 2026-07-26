import * as React from 'react'
import { Meter, Amount } from 'fmm-design-system'

export const Progress = () => (
  <div style={{ width: 320 }}>
    <Meter value={57} />
  </div>
)

export const Levels = () => (
  <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 18 }}>
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span className="text-muted">Emergency fund</span>
        <Amount>57%</Amount>
      </div>
      <Meter value={57} />
    </div>
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span className="text-muted">Vacation</span>
        <Amount>92%</Amount>
      </div>
      <Meter value={92} />
    </div>
  </div>
)

export const OverBudget = () => (
  <div style={{ width: 320 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
      <span className="text-muted">Dining out</span>
      <Amount tone="negative">108%</Amount>
    </div>
    <Meter value={100} muted />
  </div>
)
