import * as React from 'react'
import { Textarea } from 'fmm-design-system'

export const Notes = () => (
  <div style={{ width: 360 }}>
    <Textarea placeholder="Add a note about this account…" />
  </div>
)

export const WithValue = () => (
  <div style={{ width: 360 }}>
    <Textarea defaultValue="Auto-transfer $500 here on the 1st of every month toward the down-payment fund." />
  </div>
)
