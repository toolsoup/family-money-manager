---
category: Forms
---

# Field

Labeled form-field wrapper: a muted label above any control (`Input`, `Select`, `Textarea`, `SegmentedControl`). Stack several `Field`s to build a form.

```jsx
<Field label="Account type">
  <Select defaultValue="checking">
    <option value="checking">Checking</option>
    <option value="savings">Savings</option>
  </Select>
</Field>
```
