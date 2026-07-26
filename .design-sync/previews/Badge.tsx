import * as React from 'react'
import { Badge } from 'fmm-design-system'

export const Default = () => <Badge>This month</Badge>

export const Examples = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <Badge>Savings goal</Badge>
    <Badge>Net worth</Badge>
    <Badge>Cash flow</Badge>
  </div>
)
