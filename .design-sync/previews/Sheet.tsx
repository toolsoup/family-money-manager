import * as React from 'react'
import { Sheet, Badge, Amount, Meter, Button } from 'fmm-design-system'

export const Panel = () => (
  <div style={{ width: 420 }}>
    <Sheet padded>
      <Badge>Emergency fund</Badge>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '10px 0 14px' }}>
        <Amount style={{ fontSize: 30 }}>$8,600</Amount>
        <span className="text-muted">of $15,000</span>
      </div>
      <Meter value={57} />
      <div style={{ marginTop: 16 }}>
        <Button variant="secondary">Add funds</Button>
      </div>
    </Sheet>
  </div>
)

export const Plain = () => (
  <div style={{ width: 420 }}>
    <Sheet padded>
      <h3 style={{ marginTop: 0 }}>This month</h3>
      <p className="text-muted" style={{ margin: 0 }}>
        You brought in more than you spent — nice work. Net cash flow is positive for the third month running.
      </p>
    </Sheet>
  </div>
)
