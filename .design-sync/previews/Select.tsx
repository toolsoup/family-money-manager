import * as React from 'react'
import { Select } from 'fmm-design-system'

export const AccountType = () => (
  <div style={{ width: 320 }}>
    <Select defaultValue="savings">
      <option value="checking">Checking</option>
      <option value="savings">Savings</option>
      <option value="brokerage">Brokerage</option>
      <option value="mortgage">Mortgage</option>
    </Select>
  </div>
)

export const TimeRange = () => (
  <div style={{ width: 320 }}>
    <Select defaultValue="ytd">
      <option value="30d">Last 30 days</option>
      <option value="ytd">Year to date</option>
      <option value="12m">Last 12 months</option>
    </Select>
  </div>
)
