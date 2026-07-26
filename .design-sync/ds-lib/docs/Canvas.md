---
category: Layout
---

# Canvas

The Midnight Gold page backdrop — near-black canvas with faint gold/blue auras, default text color, and body font. In the app this lives on `<body>`; **wrap every screen's root in `Canvas`** so text sits on the right background and the aura shows.

```jsx
<Canvas>
  <Badge>Overview</Badge>
  <h2>Good morning</h2>
  {/* cards, tables, etc. */}
</Canvas>
```
