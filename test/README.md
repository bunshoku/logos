# Test Documentation

## Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

The test suite includes 8+ comprehensive tests covering:

### 1. Hotkey Functionality

- **Test 1**: "c" opens capture when not typing
- Verifies the capture hotkey works globally

### 2. Typing Guard

- **Test 2**: "c" does not open capture when focused in input
- Ensures hotkeys don't interfere with typing

### 3. Capture Flow

- **Test 3**: Enter in capture saves Inbox item and navigates to Inbox
- Tests the complete capture → inbox flow
- Verifies state updates and navigation

### 4. Clarify Flow

- **Test 4**: Clarify creates Next Action and removes Inbox item
- Tests the complete inbox → next action clarification flow
- Verifies atomic state changes (item removed + action created)

### 5. Page Rendering

- **Test 5**: Next Actions page shows clarified action
- Ensures actions appear correctly after clarification
- Tests selector functionality

### 6. Action Toggle

- **Test 6**: Toggle done updates UI
- Tests bidirectional done/undone toggling
- Verifies active count calculations

### 7. Theme Persistence

- **Test 7**: Theme toggles and persists to localStorage
- Tests theme state management
- Verifies localStorage persistence

### 8. Filtering & Search

- **Test 8**: Filters + search affect results (multiple sub-tests)
  - Search query filtering
  - Context filtering
  - Energy filtering
  - Show/hide completed actions

## Test Utilities

The test suite includes custom utilities in `test/setup.js`:

- `waitFor()` - Wait for async conditions
- `waitForElement()` - Wait for DOM elements
- `fireEvent()` - Trigger custom events
- `fireKeyboardEvent()` - Simulate keyboard input
- `typeIntoElement()` - Simulate user typing

## Architecture

Tests are written using:

- **Vitest** - Fast, Vite-native test runner
- **@testing-library/dom** - DOM utilities
- **JSDOM** - DOM environment for Node.js

Tests focus on:

1. State management correctness
2. User interaction flows
3. Integration between components
4. Selector logic
5. Persistence mechanisms
