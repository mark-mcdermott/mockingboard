# Mockingboard

> Drop mockups. Arrange freely. Export one beautiful PNG.

A free, open source tool for arranging mockups into a single shareable image. No accounts, no upload servers, no settings. Drop your screenshots in, rearrange them, and export one PNG.

**Live:** [mockingboard.design](https://mockingboard.design) *(placeholder — update with the real domain after deployment)*

![Mockingboard homepage](./branding/mocks/desktop-light.png)

## Features

- Drag-and-drop image upload (PNG, JPG, SVG, WebP, GIF)
- Masonry layout that reflows automatically
- Drag-to-reorder tiles, with full keyboard accessibility
- Export to PNG at three scales (Standard 2x, Large 3x, Max safe auto-detect)
- iOS canvas-limit-aware export with informative warnings
- Persistence via `localStorage` — your board survives page refreshes
- Light + dark mode (system preference)
- Mobile-first responsive design
- 100% client-side processing — your images never leave your device
- Keyboard shortcuts: `Cmd/Ctrl + E` to export, `Backspace`/`Delete` to remove the focused tile

## Getting started

Requirements: Node.js 20.x or higher.

` ` ` sh
git clone https://github.com/mark-mcdermott/mockingboard.git
cd mockingboard
npm install
npm run dev
` ` `

The dev server runs at http://localhost:5173.

To build for production:

` ` ` sh
npm run build
` ` `

The static output lands in `dist/` — drop it on Vercel, Netlify, or any static host.

## Tech stack

- **React 18+** with TypeScript
- **Vite** for dev server and build
- **Tailwind CSS v4** for styling
- **React Router v7** for routing (declarative mode)
- **@dnd-kit** for drag-and-drop tile reordering
- **html-to-image** for PNG export via the browser's canvas API
- **Lucide** for icons
- **Bodoni Moda** (Google Fonts) for the wordmark

## Design philosophy

Mockingboard is a quiet tool. It does one thing — let you arrange screenshots into a board and export the result. It runs entirely in your browser; there is no backend, no database, no account system. Everything you do stays on your device.

The visual language is editorial and minimal: off-white canvas, soft borders, mono filenames, serif headlines. Detailed look-and-feel guidelines live in `branding/docs/design-system.md`. The build strategy (constraints, scope, anti-goals) lives in `branding/docs/build-strategy.md`.

## Known limitations

This is an MVP. The following are documented, conscious tradeoffs.

### Storage

- **`localStorage` quota.** Persistence stores each image as a base64 data URL. Browsers cap localStorage at ~5–10 MB per origin. A few small screenshots fit comfortably; ten large screenshots may exceed the quota. The app degrades gracefully — your work stays in memory for the session, just doesn't persist across reloads. The console logs a `QuotaExceededError` warning when the save fails.
  - *Future: switch to IndexedDB for blob storage. No base64 inflation, much higher quota, more flexible.*
- **Single-tab persistence.** Edits made in one tab don't sync to other open tabs until refresh.
- **No format upgrade path.** If we change the `Mockup` shape (add a field, rename one), existing stored boards may need a manual migration. The localStorage key is `mockingboard:images` — bumping to `mockingboard:images:v2` and writing a migration on read is the future-proof approach.

### Export

- **Snapshot of current view.** The exported PNG is a snapshot of your board *as it currently looks in the browser.* Window width affects column count, which affects board height, which affects export dimensions. A board that fits at 3x on desktop may exceed iOS canvas limits on a phone. The About page explains this for users.
  - *Future: render exports to a fixed-width offscreen container so viewport size doesn't affect output.*
- **No live status display.** When a board is too large to export at the chosen scale, you only find out at click time. No "scale viability" indicators, no progress bar showing how close you are to the limit.
- **No "smart remove."** When the size-warning modal triggers in `'remove'` mode (board too big even at 1x), the only fix is removing tiles one by one. We don't suggest *which* tiles to remove, and we don't auto-remove until it fits.
- **No persistent over-limit banner.** If the board exceeds 1x, we show a modal at export time but no in-context warning before then.

### Functionality

- **Single board.** No save/switch between multiple boards.
- **No annotations.** Can't add text, arrows, or highlight markers on top of mockups.
- **No layout customization.** Masonry is automatic. You can reorder tiles, but can't pin specific images to specific columns.
- **No clipboard paste.** You drop or pick files; pasting an image directly from clipboard isn't wired up yet.

## Contributing

Issues and pull requests welcome. The project uses conventional commits (`type(scope): description`).

## License

[MIT](./LICENSE)

## Credits

Built by [floating.is](https://floating.is). Brand mark and visual system courtesy of the same.
```

(Note: in the actual file, the three-backtick code fences for the shell blocks should be without the spaces — we wrote them as `` ` ` ` ` here so they don't break this tutorial's own markdown rendering. Use plain triple-backticks in the file.)

### Walking through the structure

A few things worth pointing out:

#### Tagline as a blockquote

```md
> Drop mockups. Arrange freely. Export one beautiful PNG.
```

GitHub renders blockquotes with a subtle left border. It's a clean way to make the tagline stand out under the title without using bold or italics.

#### Screenshot path

```md
![Mockingboard homepage](./branding/mocks/desktop-light.png)
```

We're pointing at the design mock, not a real app screenshot. Why: until the app is deployed and we have a stable URL with sample content, the mock is the most polished representative image we have. Once you have a live deploy, swap to a real screenshot.

#### Code fences with language tags

```md
` ` ` sh
git clone ...
` ` `