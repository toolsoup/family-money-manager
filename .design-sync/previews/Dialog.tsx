import * as React from 'react'
import { Dialog, Field, Input, Select, Button } from 'fmm-design-system'

export const AddAccount = () => (
  <Dialog
    open
    title="Add an account"
    description="Connect a bank or add one manually to track it here."
    actions={
      <>
        <Button variant="ghost">Cancel</Button>
        <Button variant="primary">Add account</Button>
      </>
    }
  >
    <Field label="Account nickname">
      <Input placeholder="e.g. Joint checking" />
    </Field>
    <Field label="Type">
      <Select defaultValue="checking">
        <option value="checking">Checking</option>
        <option value="savings">Savings</option>
        <option value="brokerage">Brokerage</option>
        <option value="mortgage">Mortgage</option>
      </Select>
    </Field>
    <Field label="Current balance">
      <Input defaultValue="$0.00" />
    </Field>
  </Dialog>
)

export const Confirm = () => (
  <Dialog
    open
    title="Remove this debt?"
    description="This deletes the auto loan and its payoff history. You can’t undo this."
    actions={
      <>
        <Button variant="ghost">Keep it</Button>
        <Button variant="danger">Remove debt</Button>
      </>
    }
  />
)
