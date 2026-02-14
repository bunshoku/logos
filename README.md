# lo•gos

A lightweight GTD (Getting Things Done) task management application built with Lit and vanilla CSS.

## Features

- **Quick Capture** - Press `c` to capture anything instantly
- **Inbox Processing** - Clarify captured items into actionable next actions
- **Smart Filtering** - Search, filter by context, energy level, and completion status
- **Clean UI** - Minimal design with light/dark theme support
- **Keyboard First** - Essential shortcuts for efficient workflow
- **Data Validation** - Runtime validation with Zod schemas

## Tech Stack

- **UI**: Lit (Web Components, no decorators)
- **Routing**: @lit-labs/router
- **State**: Redux-style store with pub/sub
- **Styling**: Vanilla CSS with BEM naming and CSS variables
- **IDs**: nanoid
- **Dates**: date-fns
- **Validation**: Zod
- **Testing**: Vitest + @testing-library/dom
- **Build**: Vite

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

## Keyboard Shortcuts

| Key                           | Action                               |
| ----------------------------- | ------------------------------------ |
| `c`                           | Open quick capture (when not typing) |
| `Enter` (in capture)          | Save to Inbox and navigate to Inbox  |
| `Cmd/Ctrl+Enter` (in capture) | Alternative save shortcut            |
| `Esc`                         | Close capture modal or drawer        |
| `ArrowDown` / `j`             | Move to next item in Inbox/Next      |
| `ArrowUp` / `k`               | Move to previous item in Inbox/Next  |
| `?`                           | Toggle keyboard shortcuts modal       |

## Navigation

- **Next Actions** - `/next` (default) - Your active tasks
- **Inbox** - `/inbox` - Items to clarify
- **Notes** - `/notes` - (placeholder)
- **Review** - `/review` - (placeholder)
- **Habits** - `/habits` - (placeholder)
- **Settings** - `/settings` - (placeholder)

## GTD Workflow

### 1. Capture

Press `c` anywhere to capture a thought, task, or idea. It goes directly to your Inbox.

### 2. Clarify

Visit your Inbox and click "Clarify → Next Action" on each item. Fill in:

- **Title** (required)
- **Context** (work, home, personal, errands, online)
- **Energy Level** (low, medium, high)
- **Due Date** (optional)
- **Notes** (optional)

This removes the item from Inbox and creates a Next Action.

### 3. Organize

Use filters and search in Next Actions:

- Search by text or notes
- Filter by context
- Filter by energy level
- Show/hide completed actions

### 4. Do

- Check off actions as you complete them
- Click any action to view details and edit
- Actions are sorted by due date (soonest first), then by creation date

## Project Structure

```
logos/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── inbox/          # Inbox-specific components
│   │   ├── next-actions/   # Next Actions-specific components
│   │   └── overlays/       # Modals and drawers
│   ├── pages/              # Route-level page components
│   ├── state/              # State management
│   │   ├── actions.js      # Action creators
│   │   ├── reducers.js     # Pure reducers
│   │   ├── selectors.js    # Derived data
│   │   ├── schema.js       # Zod schemas
│   │   ├── seed.js         # Sample data
│   │   └── store.js        # Store implementation
│   ├── styles/             # Global styles
│   │   ├── tokens.css      # CSS variables
│   │   ├── base.css        # Base/reset styles
│   │   ├── layout.css      # Layout utilities
│   │   └── components.css  # Component styles (BEM)
│   ├── utils/              # Utility functions
│   │   ├── format.js       # Date formatting
│   │   ├── hotkeys.js      # Keyboard shortcuts
│   │   └── dom.js          # DOM utilities
│   ├── app.js              # Root app component
│   ├── main.js             # Entry point
│   └── router.js           # Route configuration
├── test/                   # Test files
├── index.html              # HTML entry point
├── vite.config.js          # Vite configuration
├── vitest.config.js        # Vitest configuration
└── package.json            # Dependencies and scripts
```

## State Management

The app uses a simple Redux-style store:

```javascript
import { store } from './state/store.js';
import { myAction } from './state/actions.js';

// Get current state
const state = store.getState();

// Dispatch actions
store.dispatch(myAction(payload));

// Subscribe to changes
const unsubscribe = store.subscribe((newState) => {
  console.log('State updated:', newState);
});
```

### State Shape

```javascript
{
  ui: {
    theme: 'light' | 'dark',
    route: string,
    query: string,
    showDone: boolean,
    contextFilter: string,
    energyFilter: string,
    captureOpen: boolean,
    captureText: string,
    drawerOpen: boolean,
    drawerKind: 'inbox' | 'action',
    drawerSelectedId: string,
    drawerDraft: object
  },
  data: {
    inbox: InboxItem[],
    actions: Action[]
  }
}
```

## Design Principles

1. **Capture goes ONLY to Inbox** - No direct action creation
2. **Next Actions created ONLY by clarifying Inbox** - Enforces GTD workflow
3. **No heavy frameworks** - Lit + vanilla CSS keeps it lightweight
4. **BEM naming** - Consistent, predictable CSS class names
5. **CSS variables** - Theme via `data-theme` attribute on `<html>`
6. **Keyboard-first** - Essential shortcuts with typing guards
7. **Immutable state** - Pure reducers, predictable updates

## Browser Support

Modern browsers with Web Components support:

- Chrome/Edge 90+
- Firefox 90+
- Safari 14.1+

## License

MIT - See [LICENSE](LICENSE)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.
