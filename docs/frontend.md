# Frontend

## Stack

- **React 18** with TypeScript (strict mode)
- **Vite 5** — dev server on port 3000, production build to `dist/`
- **Tailwind CSS 3** — utility-first styling with custom CSS variables
- **Vitest** + **Testing Library** — unit and component tests

## Development

```bash
cd notes-web

npm install       # first time only
npm run dev       # dev server → http://localhost:3000
npm run build     # production build → dist/
npm run preview   # preview production build locally
```

## Testing

```bash
npm test              # run all tests once
npm run test:watch    # watch mode
npm run typecheck     # TypeScript type check only
```

Tests live next to the files they test:

```
src/
├── App.test.tsx
└── components/
    └── Note.test.tsx
```

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:5272/api/Notes` | API base URL |

- `.env` — local development values
- `.env.production` — production / Docker values (uses nginx proxy `/api/Notes`)

## Styling system

CSS custom properties are defined in `src/index.css` under `:root`:

| Variable | Value | Usage |
|----------|-------|-------|
| `--background` | `#0F172A` | Page background |
| `--foreground` | `#F1F5F9` | Primary text |
| `--primary` | `#3B82F6` | Blue accent |
| `--card` | `#1E293B` | Card background |
| `--muted-foreground` | `#94A3B8` | Secondary text |

Reusable component classes (`.note-card`, `.btn-primary`, `.modal-box`, etc.) are defined in `@layer components` inside `index.css`.

## Project structure

```
notes-web/
├── index.html              # Vite HTML entry
├── vite.config.ts          # Vite + Vitest config
├── tsconfig.json           # TypeScript config
├── tailwind.config.js      # Tailwind config (ESM)
├── postcss.config.js       # PostCSS config
├── nginx.conf              # nginx config for Docker
├── .env                    # Local env vars
├── .env.production         # Production env vars
└── src/
    ├── main.tsx            # React DOM entry
    ├── App.tsx             # Root component
    ├── App.test.tsx        # App tests
    ├── App.css             # (empty — styles in index.css)
    ├── index.css           # Global styles + Tailwind
    ├── setupTests.ts       # Vitest + jest-dom setup
    ├── components/
    │   ├── Note.tsx        # Note card component
    │   └── Note.test.tsx   # Note component tests
    └── types/
        └── note.ts         # TypeScript interfaces
```
