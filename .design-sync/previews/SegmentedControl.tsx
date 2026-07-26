import * as React from 'react'
import { SegmentedControl } from 'fmm-design-system'

export const TimeRange = () => {
  const [value, setValue] = React.useState('quarter')
  return (
    <SegmentedControl
      value={value}
      onChange={setValue}
      options={[
        { label: 'Month', value: 'month' },
        { label: 'Quarter', value: 'quarter' },
        { label: 'Year', value: 'year' },
      ]}
    />
  )
}

export const AccountKind = () => {
  const [value, setValue] = React.useState('asset')
  return (
    <SegmentedControl
      value={value}
      onChange={setValue}
      options={[
        { label: 'Asset', value: 'asset' },
        { label: 'Debt', value: 'debt' },
      ]}
    />
  )
}
