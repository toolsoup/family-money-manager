---
category: Content
---

# Card

Surface card with a subtle top-lit gradient. Pass `kicker` (gold eyebrow), `title`, and `meta` for the standard stat-card layout, or just children for freeform content. Put an `Amount` in the title for money stats.

```jsx
<Card kicker="Net worth" title={<Amount tone="positive">$482,900</Amount>} meta="Updated today" />
```
