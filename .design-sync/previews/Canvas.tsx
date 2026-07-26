import * as React from 'react'
import { Canvas, Card, Amount, Badge } from 'fmm-design-system'

export const PageBackdrop = () => (
  <Canvas padded>
    <Badge>Overview</Badge>
    <h2 style={{ margin: '8px 0 20px' }}>Good morning</h2>
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <div style={{ width: 220 }}>
        <Card kicker="Net worth" title={<Amount tone="positive">$482,900</Amount>} meta="Updated today" />
      </div>
      <div style={{ width: 220 }}>
        <Card kicker="Total debt" title={<Amount tone="negative">$213,400</Amount>} meta="3 accounts" />
      </div>
    </div>
  </Canvas>
)
