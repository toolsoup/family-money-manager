---
category: Content
---

# Sheet

The primary content surface — a rounded panel floating on the darker canvas with a hairline border and soft shadow. Wrap page sections and sidebars in a `Sheet`; add `padded` for interior spacing.

```jsx
<Sheet padded>
  <Badge>Emergency fund</Badge>
  <Amount style={{fontSize:30}}>$8,600</Amount>
  <Meter value={57} />
</Sheet>
```
