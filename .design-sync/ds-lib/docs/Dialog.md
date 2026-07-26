---
category: Overlays
---

# Dialog

Centered modal with a blurred backdrop. Compose form `Field`s as children and `Button`s in `actions` (typically a ghost cancel + primary confirm). Renders nothing when `open` is false.

```jsx
<Dialog open title="Add an account" description="Connect a bank or add one manually."
  actions={<><Button variant="ghost">Cancel</Button><Button variant="primary">Add account</Button></>}>
  <Field label="Nickname"><Input placeholder="e.g. Joint checking" /></Field>
</Dialog>
```
