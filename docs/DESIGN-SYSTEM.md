# Design system

The site has one source of styling truth: the tokens in
[`styles/globals.css`](../styles/globals.css). Everything else consumes them.

Three gates keep it that way. Run all three with `npm run verify`.

| Gate | Command | What it enforces |
|---|---|---|
| Types | `npm run typecheck` | `tsc --noEmit` |
| Design system | `npm run lint` | `@shadcn/lint` — no raw colours, no arbitrary values, no inline styles, no unknown classes, no restyling a primitive |
| Contrast | `npm run contrast` | Every token pair against WCAG 1.4.3 and 1.4.11, in both themes |

---

## The tokens

21 role names, two palettes. A token is named for the **role** it plays, never
for the colour it holds — so `bg-primary`, never `bg-teal`. Rebranding is a
change to this file and nowhere else.

| Role | Used for |
|---|---|
| `background` / `foreground` | The page and its body text |
| `card` / `card-foreground` | Anything raised off the page. `popover` is aliased to this |
| `primary` / `primary-foreground` | The main call to action, links, active states |
| `secondary` / `secondary-foreground` | A quieter filled button or chip |
| `muted` / `muted-foreground` | Alternating section surfaces, secondary text |
| `accent` / `accent-foreground` | The hover and selected surface inside primitives |
| `highlight` / `highlight-foreground` | The brand accent: category chips, course levels, one CTA |
| `destructive` / `destructive-foreground` | Errors and delete actions |
| `border` | Decorative hairlines |
| `input` | Field borders and other **interactive** boundaries |
| `ring` | The focus indicator |
| `brand-from` / `brand-to` / `on-brand` / `on-brand-muted` | The gradient band and text that is legible on it |

Plus `--font-sans` (Raleway), `--font-heading` (Montserrat), one `--radius`
with derived steps, and two shadows.

### Why `accent` is not the brand colour

shadcn's primitives use `accent` as the quiet surface behind a hovered
dropdown row or a selected item. Putting the brand amber there would turn
every hover amber. The brand accent is `highlight`, which is why both exist.

### Why `input` is darker than `border`

They are the same value in stock shadcn. They cannot be here: a field border is
often the only thing indicating a control, which makes it a UI component
boundary owing **3:1** under WCAG 1.4.11. The decorative hairline is far
lighter than that. `npm run contrast` checks `input` against both `background`
and `card`, and the card is the binding constraint in dark mode.

### Why dark `destructive-foreground` is dark

An error colour light enough to read as text on the dark page is also too
light to carry white text — white on it reaches only 3.08:1. So the dark theme
pairs it with a near-black foreground. Do not "simplify" this back to white.

---

## Working in it

**Colour comes from a token.** If you reach for `bg-gray-100` or `#1E2C2D`,
the linter stops you and names the nearest token. If no token fits, that is a
design decision: add one here, and the contrast gate will immediately tell you
whether it is legible.

**Size comes from the scale.** `text-[38px]` is not a decision anyone made
twice. Use `text-4xl`.

**Layout is the caller's, styling is the component's.** You may pass `h-full`
or `mt-6` to a primitive. You may not pass `border-t` or `text-sm` — add a
variant in `components/ui/` instead, which is how `Card`'s `interactive`,
`CardFooter`'s `meta`, `Button`'s `xl` / `highlight` / `on-brand`, and
`Skeleton`'s `shape` came to exist.

**Spacing between sections is `<Section>`'s job**, not a spacer div.

### Composition

```
PageShell            header + main landmark + footer + skip link
  Section            vertical rhythm + surface tone (default/muted/card/brand)
    Container        max width + gutter
      SectionHeading eyebrow + heading (correct level) + description
      CardGrid       the 2/3/4-column grid
```

`Section tone="brand"` is the only place the brand gradient belongs. It used
to be the background of every page, behind white body text that measured
2.65:1 against the gradient's light stop.

### Documented exceptions

Four, each scoped in `eslint.config.mjs` with its reason:

- `components/ui/**` may use arbitrary values. It is the implementation layer,
  and enforcing the scale there would mean rewriting upstream on every
  `shadcn add`. `no-raw-colors` still applies.
- `components/brand/**` may use literal colours. A third-party mark is
  reproduced in its owner's colours or not at all.
- `app/**/opengraph-image.tsx` may use inline styles. Satori supports neither
  classes nor custom properties.
- `not-prose` and `toaster` are allowed class names. Both are real — one from
  `@tailwindcss/typography`, one from Sonner — but neither is generated from
  the theme.

---

## Adding a token

1. Add it to **both** `:root` and `.dark` in `styles/globals.css`.
2. Map it in the `@theme inline` block so Tailwind generates utilities.
3. Add the pairs it participates in to `PAIRS` in `scripts/contrast.mjs`.
4. `npm run contrast`.

Step 3 is the one worth insisting on. A token with no pair in that list is a
colour nobody has checked.
