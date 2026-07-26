---
category: Forms
---

# SegmentedControl

A row of mutually exclusive options; the selected one fills with the gold gradient. Use for small mode switches (time range, asset vs. debt). Controlled via `value` / `onChange`.

```jsx
const [v, setV] = React.useState('quarter')
<SegmentedControl value={v} onChange={setV}
  options={[{label:'Month',value:'month'},{label:'Quarter',value:'quarter'},{label:'Year',value:'year'}]} />
```
