---
category: Data
---

# Amount

Tabular-numeral money value so columns of figures align. **Always render currency with `Amount`.** Set `tone="positive"` for income/gains (emerald), `tone="negative"` for debt/spending (rose), default for neutral balances. Pass the formatted string as children.

```jsx
<Amount tone="positive">+$4,200</Amount>
<Amount tone="negative">−$1,850</Amount>
<Amount>$482,900</Amount>
```
