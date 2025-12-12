# Quickstart: MyPokeDex

**Date**: 2025-12-10
**Plan**: specs/001-mypokedex/plan.md

## Prerequisites

- Node.js 18+
- npm or yarn
- Git

## Setup

1. **Clone and navigate**:
   ```bash
   git clone <repository-url>
   cd mypokedex
   git checkout 001-mypokedex
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment setup** (if needed):
   - No environment variables required
   - PokeAPI has no API key requirement

4. **Start development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open browser**:
   - Navigate to `http://localhost:3000`
   - Application should load with Pokemon search

## Development Workflow

### Code Quality
- Run linter: `npm run lint`
- Run type check: `npm run type-check`
- Format code: `npm run format`

### Testing
- Unit tests: `npm run test:unit`
- Integration tests: `npm run test:integration`
- E2E tests: `npm run test:e2e`
- All tests: `npm run test`

### Building
- Production build: `npm run build`
- Preview production: `npm run preview`

## Key Files

```
src/
├── App.tsx              # Main application component
├── pages/
│   ├── Home.tsx         # Search and browse page
│   ├── PokemonDetail.tsx # Pokemon detail view
│   └── Favorites.tsx    # User favorites page
├── components/
│   ├── SearchBar.tsx    # Search with auto-complete
│   ├── PokemonCard.tsx  # Pokemon display card
│   ├── CategoryBrowser.tsx # Category navigation
│   └── FavoriteButton.tsx # Favorite toggle
├── services/
│   ├── pokeApi.ts       # PokeAPI client
│   └── localStorage.ts  # Local storage utilities
└── utils/
    ├── accessibility.ts # A11y helpers
    └── performance.ts   # Performance monitoring
```

## API Usage

- **PokeAPI v2**: External Pokemon data source
- **Local Storage**: User favorites persistence
- No backend required - fully client-side application

## Troubleshooting

### Common Issues

1. **API Rate Limited**: Wait 1 minute, requests are cached
2. **Images Not Loading**: Fallback to placeholder images implemented
3. **Local Storage Full**: Application handles quota exceeded errors
4. **TypeScript Errors**: Run `npm run type-check` for details

### Performance

- Initial load: <2s (code splitting + caching)
- Search: <500ms (client-side filtering)
- Details: <2s (cached API responses)

## Deployment

1. Build production bundle: `npm run build`
2. Deploy `dist/` folder to static hosting (Netlify, Vercel, etc.)
3. No server configuration needed

## Testing Checklist

- [ ] Search Pokemon by name
- [ ] Auto-complete suggestions appear
- [ ] Browse by type and generation
- [ ] View Pokemon details with image
- [ ] Mark/unmark favorites
- [ ] Favorites persist across sessions
- [ ] Mobile responsive design
- [ ] Keyboard navigation works
- [ ] Screen reader compatible