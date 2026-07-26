import * as React from 'react'
import { Radio } from 'fmm-design-system'

export const PayoffStrategy = () => {
  const [value, setValue] = React.useState('avalanche')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Radio
        name="strategy"
        label="Avalanche — highest interest first"
        checked={value === 'avalanche'}
        onChange={() => setValue('avalanche')}
      />
      <Radio
        name="strategy"
        label="Snowball — smallest balance first"
        checked={value === 'snowball'}
        onChange={() => setValue('snowball')}
      />
    </div>
  )
}
