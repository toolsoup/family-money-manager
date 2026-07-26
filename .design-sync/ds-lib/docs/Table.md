---
category: Data
---

# Table

Data table in the Midnight Gold style (uppercase muted headers, hairline dividers, row hover). Define `columns` (set `align:"right"` for money) and pass `rows` keyed by column `key`; values may be nodes like `Amount` or `Tag`.

```jsx
<Table
  columns={[{key:'name',header:'Account'},{key:'balance',header:'Balance',align:'right'}]}
  rows={[{name:'Joint checking', balance:<Amount tone="positive">$8,420</Amount>}]} />
```
