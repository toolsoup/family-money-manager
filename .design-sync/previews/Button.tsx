import * as React from 'react'
import { Button } from 'fmm-design-system'

export const Primary = () => <Button variant="primary">Add account</Button>

export const Secondary = () => <Button variant="secondary">Cancel</Button>

export const Ghost = () => <Button variant="ghost">Edit budget</Button>

export const Danger = () => <Button variant="danger">Remove debt</Button>

export const AllVariants = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
    <Button variant="primary">Add account</Button>
    <Button variant="secondary">Cancel</Button>
    <Button variant="ghost">Edit budget</Button>
    <Button variant="danger">Remove</Button>
  </div>
)

export const Disabled = () => (
  <Button variant="primary" disabled>
    Add account
  </Button>
)

export const FullWidth = () => (
  <div style={{ width: 320 }}>
    <Button variant="primary" block>
      Save changes
    </Button>
  </div>
)
