# Family Money Manager — Midnight Gold

A dark, premium, high-contrast design system: warm-charcoal surfaces on a near-black
canvas with a faint gold aura, a **gold accent** (`#f5a623`) that carries a soft glow,
Space Grotesk for display/numerals over Plus Jakarta Sans for body. Money semantics:
**income/positive = emerald, debt/negative = rose.**

Import components from the library and assign nothing yourself — they already carry the
system's classes. Available: `Button`, `Card`, `Tag`, `Badge`, `Amount`, `Meter`,
`Input`, `Field`, `Select`, `Textarea`, `SegmentedControl`, `Radio`, `Table`, `Sheet`,
`Dialog`, `Nav`, `Canvas`.

## Wrapping — start every screen in `Canvas`

The Midnight Gold backdrop (near-black canvas + gold/blue radial auras + default text
color + body font) lives on `Canvas`. In the app it's on `<body>`; on a standalone
surface you must wrap the screen's root in it, or text renders on the wrong background
and the aura is missing:

```jsx
<Canvas>
  <Badge>Overview</Badge>
  <h2>Good morning</h2>
  <Card kicker="Net worth" title={<Amount tone="positive">$482,900</Amount>} meta="Updated today" />
</Canvas>
```

## Styling idiom — tokens + component classes (NOT utility classes)

This is a **CSS-variable + component-class** system. There is no Tailwind utility layer.
Style two ways only:

1. **Compose the components** above — they carry the look.
2. **For your own layout glue**, reference the design tokens as CSS variables and use the
   system's classes. Never hard-code hex colors, px spacing, or fonts — use the tokens so
   light/theme changes flow from `globals.css`.

**Color tokens:** `--color-canvas` `--color-bg` `--color-surface` `--color-surface-2`
`--color-text` `--color-text-dim` `--color-border` `--color-border-strong`
`--color-accent` (gold `#f5a623`, ramp `--color-accent-100…900`)
`--color-accent-2` (rose, ramp `-100/-500/-700/-800/-900`)
`--color-positive` (emerald) `--color-negative` (rose). Gold treatments:
`--grad-gold` (gradient), `--glow-gold` (accent shadow).

**Scale tokens:** spacing `--space-1`(5px)…`--space-8`(40px); radius `--radius-sm/md/lg`
(6/10/16px); shadow `--shadow-sm/md/lg`. **Fonts:** `--font-heading` (Space Grotesk,
display + numerals), `--font-body` (Plus Jakarta Sans).

**Utility classes:** `.text-muted` (dim text), `.tnum` (tabular numerals),
`.amt-pos` (emerald money), `.amt-warn` (rose money), `.badge`, `.hr` (divider).

**Component classes** (the components apply these; use directly only for custom markup):
`.btn` + `.btn-primary/-secondary/-ghost/-danger/-icon/-block`; `.card` +
`.card-kicker/-title/-body/-meta`; `.tag` + `.tag-accent/-accent-2/-neutral/-outline`;
`.table`; `.meter`; `.input` `.field` `.select` `.seg`/`.seg-opt` `.radio`;
`.sheet`; `.dialog`/`.dialog-backdrop`/`.dialog-title/-body/-actions`; `.nav`/`.nav-brand`.

## Money rule

Always render currency with `Amount` — it uses tabular numerals so columns align. Set
`tone="positive"` for income/gains (emerald), `tone="negative"` for debt/spending (rose),
default for neutral balances. Mirror the tone in tags: `Tag variant="accent"` for good
states, `variant="accent-2"` for debt/over-budget.

## Where the truth lives

- **`styles.css`** and its `@import` of **`_ds_bundle.css`** hold the full theme — every
  token and component class. Read them before styling custom markup.
- Per-component API is in each `<Name>.d.ts`; usage is in each `<Name>.prompt.md`.

## One idiomatic build

```jsx
<Canvas>
  <Nav brand="Family Money"><a href="#" aria-current="page">Overview</a><a href="#">What we own</a></Nav>
  <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
    <Card kicker="Net worth" title={<Amount tone="positive">$482,900</Amount>} meta="Updated today" />
    <Card kicker="Total debt" title={<Amount tone="negative">$213,400</Amount>} meta={<Tag variant="accent-2">3 accounts</Tag>} />
  </div>
  <Sheet padded style={{ marginTop: 'var(--space-4)' }}>
    <Badge>Emergency fund</Badge>
    <Amount style={{ fontSize: 30 }}>$8,600</Amount> <span className="text-muted">of $15,000</span>
    <Meter value={57} />
  </Sheet>
</Canvas>
```
