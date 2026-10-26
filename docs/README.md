# Qingchu 清楚 — Website

A static website for the [Qingchu programming language](https://innovationearthprojects.org),
styled after the design system of [innovationearthprojects.org](https://innovationearthprojects.org):
teal / cyan / lime palette, glassy cards, animated background orbs, scroll reveals,
and micro-interactions.

All content is drawn from the Qingchu repository: the README (design principles,
keyword table, status, project structure, FAQ) and `examples/` (`hello.qc`,
`grade_calculator.qc`, `everything.qc`).

## Pages

| File            | Purpose                                                              |
|-----------------|----------------------------------------------------------------------|
| `index.html`    | Home — hero with a live-style code window, features, why readable,   |
|                 | get-started steps, vocabulary chips, status/roadmap timeline,        |
|                 | project structure, FAQ, final CTA                                    |
| `docs.html`     | Language reference — declarations, types, context markers, constants,|
|                 | print/ask, if/else, when loops, define/calculate, comments & escapes,|
|                 | error format, full cheat sheet (sticky TOC with active highlighting) |
| `examples.html` | Example programs from the repo, shown in code windows with outputs   |

## Shared assets (`shared/`)

| File          | Purpose                                                          |
|---------------|------------------------------------------------------------------|
| `tokens.css`  | Design tokens (colors, type scale, spacing, radii, shadows)      |
| `base.css`    | Reset + typography + buttons, chips, section headers             |
| `nav.css`     | Sticky glass nav + mobile drawer + footer                        |
| `motion.css`  | Reveal / stagger / shimmer / pulse / float animation classes     |
| `nav.js`      | Injects the shared nav + footer, marks active link, wires drawer |
| `motion.js`   | `QCmotion` engine: scroll reveals, stagger, progress bar,        |
|               | back-to-top, ripple, cursor glow — all honoring                  |
|               | `prefers-reduced-motion`                                         |

Page-specific styles live in `styles.css`.

## Run locally

Any static server works:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Or simply open `index.html` in a browser (the nav/footer are injected by
`shared/nav.js`, so keep the folder structure intact).

## Notes

- No build step, no frameworks — plain HTML/CSS/ES5 JavaScript.
- Fonts: Inter + JetBrains Mono (Google Fonts); icons: Font Awesome 6 (CDN).
- External links point to the GitHub repo; everything else is self-contained.
- Responsive down to small phones; reduced-motion users get a fully static page.
