import * as React from 'react'
import { Card, Amount, Tag, Meter } from 'fmm-design-system'

export const NetWorth = () => (
  <div style={{ width: 300 }}>
    <Card kicker="Net worth" title={<Amount tone="positive">$482,900</Amount>} meta="Updated today">
      Assets minus everything you owe across all connected accounts.
    </Card>
  </div>
)

export const DebtCard = () => (
  <div style={{ width: 300 }}>
    <Card kicker="Total debt" title={<Amount tone="negative">$213,400</Amount>} meta={<Tag variant="accent-2">3 accounts</Tag>}>
      Mortgage, auto loan, and one credit card balance.
    </Card>
  </div>
)

export const GoalCard = () => (
  <div style={{ width: 300 }}>
    <Card kicker="Emergency fund" title={<Amount>$8,600 / $15,000</Amount>}>
      <Meter value={57} />
    </Card>
  </div>
)

export const Row = () => (
  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
    <div style={{ width: 240 }}>
      <Card kicker="Cash" title={<Amount tone="positive">$24,180</Amount>} meta="2 accounts" />
    </div>
    <div style={{ width: 240 }}>
      <Card kicker="Investments" title={<Amount tone="positive">$196,500</Amount>} meta="Brokerage + 401k" />
    </div>
  </div>
)
