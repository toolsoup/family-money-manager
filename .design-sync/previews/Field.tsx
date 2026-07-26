import * as React from 'react'
import { Field, Input, Select } from 'fmm-design-system'

export const TextField = () => (
  <div style={{ width: 320 }}>
    <Field label="Account nickname">
      <Input placeholder="e.g. Joint checking" />
    </Field>
  </div>
)

export const SelectField = () => (
  <div style={{ width: 320 }}>
    <Field label="Account type">
      <Select defaultValue="checking">
        <option value="checking">Checking</option>
        <option value="savings">Savings</option>
        <option value="brokerage">Brokerage</option>
        <option value="mortgage">Mortgage</option>
      </Select>
    </Field>
  </div>
)

export const FormRow = () => (
  <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 16 }}>
    <Field label="Goal name">
      <Input placeholder="Emergency fund" />
    </Field>
    <Field label="Target amount">
      <Input defaultValue="$15,000" />
    </Field>
  </div>
)
