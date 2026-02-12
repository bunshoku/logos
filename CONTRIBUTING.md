# Contributing to lo•gos

Thank you for contributing! This document outlines our development guidelines.

## Development Setup

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
4. Open http://localhost:5173

## Code Style

### JavaScript

We use ESLint and Prettier for code consistency.

#### Rules

- **ES Modules only** - Use `import`/`export`
- **No decorators** - Use `customElements.define()` instead of `@customElement`
- **Named exports preferred** - Easier to refactor and test
- **Async/await** - Use instead of `.then()` chains
- **Const by default** - Use `let` only when reassignment is needed

#### Example Component

```javascript
import { LitElement, html, css } from 'lit';

class MyComponent extends LitElement {
  static properties = {
    prop: { type: String },
  };

  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`<div>${this.prop}</div>`;
  }
}

customElements.define('my-component', MyComponent);
```

### CSS Architecture

We use **BEM** (Block Element Modifier) naming with **CSS variables** for theming.

#### BEM Naming Convention

```css
/* Block */
.component {
}

/* Element */
.component__element {
}

/* Modifier */
.component--modifier {
}
.component__element--modifier {
}
```

#### Real Examples

```css
/* Block: action-card */
.action-card {
  padding: var(--space-md);
  background: var(--color-surface);
}

/* Element: action-card__text */
.action-card__text {
  font-size: var(--font-size-base);
}

/* Modifier: action-card--done */
.action-card--done {
  opacity: 0.6;
}

/* Element + Modifier: action-card__text--done */
.action-card__text--done {
  text-decoration: line-through;
}
```

#### CSS Variables

All design tokens are defined in `src/styles/tokens.css`:

**Spacing**

```css
--space-xs: 0.25rem;
--space-sm: 0.5rem;
--space-md: 1rem;
--space-lg: 1.5rem;
--space-xl: 2rem;
```

**Typography**

```css
--font-size-xs: 0.75rem;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;
--font-size-2xl: 1.5rem;
```

**Colors (Theme-specific)**

```css
[data-theme='light'] {
  --color-bg: #ffffff;
  --color-surface: #f5f5f5;
  --color-border: #e0e0e0;
  --color-text: #333333;
  --color-text-secondary: #666666;
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-success: #10b981;
  --color-danger: #ef4444;
}

[data-theme='dark'] {
  /* Dark theme overrides */
}
```

**Transitions**

```css
--transition-fast: 150ms ease;
--transition-base: 250ms ease;
```

#### Styling Guidelines

1. **Use CSS variables for all design tokens**: Never hardcode colors, spacing, or font sizes
2. **Shadow DOM styles in components**: Component-specific styles use `static styles = css\`...\``
3. **Global styles in stylesheets**: Layout and shared utilities in `src/styles/`
4. **Mobile-first**: Write base styles for mobile, add `@media` for larger screens
5. **Transitions**: Use `var(--transition-fast)` or `var(--transition-base)`

#### File Organization

```
src/styles/
├── tokens.css       # CSS variables only
├── base.css         # Resets, base element styles
├── layout.css       # Layout utilities (.flex, .container, etc.)
└── components.css   # BEM component styles
```

### State Management

#### Actions

Action creators return plain objects:

```javascript
// ✅ Good
export const setQuery = (query) => ({
  type: SET_QUERY,
  payload: query,
});

// ❌ Bad - no side effects in action creators
export const setQuery = (query) => {
  console.log('Setting query');
  return { type: SET_QUERY, payload: query };
};
```

#### Reducers

Reducers must be pure functions that return new state:

```javascript
// ✅ Good - immutable update
case UPDATE_ACTION:
  return {
    ...state,
    actions: state.actions.map((a) =>
      a.id === action.payload.id ? { ...a, ...action.payload.updates } : a
    ),
  };

// ❌ Bad - mutation
case UPDATE_ACTION:
  state.actions.find(a => a.id === action.payload.id).text = action.payload.text;
  return state;
```

#### Selectors

Use selectors for derived data:

```javascript
// ✅ Good - selector computes derived data
export function getFilteredActions(state) {
  return state.data.actions.filter(/* ... */);
}

// ❌ Bad - computing in components repeatedly
render() {
  const filtered = this._state.data.actions.filter(/* ... */);
}
```

### Components

#### Lit Components

1. **No decorators** - Use `customElements.define()` at the end of the file
2. **Static properties** - Define `static properties` for reactive props
3. **Shadow DOM by default** - Lit components use shadow DOM
4. **Event naming** - Use kebab-case for custom events
5. **Dispatch events for parent communication**

```javascript
// Emit custom event
this.dispatchEvent(
  new CustomEvent('item-selected', {
    detail: { id: this.itemId },
    bubbles: true,
    composed: true, // Cross shadow boundary
  })
);
```

#### Component Structure

```javascript
import { LitElement, html, css } from 'lit';

class MyComponent extends LitElement {
  // 1. Properties
  static properties = {
    prop: { type: String },
  };

  // 2. Styles
  static styles = css`
    /* Component styles */
  `;

  // 3. Constructor
  constructor() {
    super();
    this.prop = '';
  }

  // 4. Lifecycle
  connectedCallback() {
    super.connectedCallback();
    // Setup
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Cleanup
  }

  // 5. Private methods
  _handleClick() {
    // Handler
  }

  // 6. Render
  render() {
    return html`<div>${this.prop}</div>`;
  }
}

// 7. Registration
customElements.define('my-component', MyComponent);
```

### Testing

#### Test Structure

```javascript
import { describe, it, expect, beforeEach } from 'vitest';

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
  });

  it('should do something specific', () => {
    // Test
    expect(actual).toBe(expected);
  });
});
```

#### Test Guidelines

1. **Integration over unit** - Test complete flows, not isolated functions
2. **Test behavior, not implementation** - Test what users see/do
3. **Clear test names** - "should [expected behavior] when [condition]"
4. **Arrange-Act-Assert** - Setup, execute, verify
5. **Cleanup** - Reset state between tests

### Git Workflow

1. **Branch naming**:
   - `feature/description` - New features
   - `fix/description` - Bug fixes
   - `refactor/description` - Code refactoring
   - `docs/description` - Documentation updates

2. **Commit messages**:

   ```
   type: short description (max 50 chars)

   Longer explanation if needed (wrap at 72 chars).
   Explain what and why, not how.
   ```

   Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

3. **Before committing**:
   ```bash
   npm run lint
   npm run format
   npm test
   ```

## Architecture Decisions

### Why Lit?

- Lightweight (~5KB)
- Standards-based (Web Components)
- No virtual DOM overhead
- Great for small-to-medium apps

### Why No TypeScript?

- Simpler setup
- Faster iteration
- Runtime validation with Zod covers type safety where it matters
- Can always add later if needed

### Why Vanilla CSS?

- No build step complexity
- CSS variables provide theming
- BEM provides structure
- Modern CSS is very capable

### Why Redux-Style Store?

- Predictable state updates
- Easy to test
- Simple mental model
- No external dependencies (custom implementation)

### Why No Framework Router?

- @lit-labs/router is lightweight and sufficient
- Tight integration with Lit
- Small API surface

## Key Constraints

1. **Capture goes ONLY to Inbox** - Maintain GTD principle
2. **Next Actions created ONLY by clarifying** - No shortcuts
3. **No heavy frameworks** - Keep bundle small
4. **Keyboard-first** - Essential shortcuts always work
5. **Theme via data attribute** - `<html data-theme="...">`

## Questions?

Open an issue for discussion before starting major changes.
