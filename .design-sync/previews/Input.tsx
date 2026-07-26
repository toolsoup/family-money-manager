import * as React from 'react'
import { Input } from 'fmm-design-system'

export const Placeholder = () => (
  <div style={{ width: 320 }}>
    <Input placeholder="Account nickname" />
  </div>
)

export const WithValue = () => (
  <div style={{ width: 320 }}>
    <Input defaultValue="Joint checking" />
  </div>
)

export const Amount = () => (
  <div style={{ width: 320 }}>
    <Input type="text" inputMode="decimal" defaultValue="$2,400.00" />
  </div>
)
