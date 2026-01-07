# use-modal-toggle

A lightweight React hook that enables native back button support for modals and dialogs. Press the back button to close modals instead of navigating away from the page.

[![npm version](https://img.shields.io/npm/v/use-modal-toggle.svg)](https://www.npmjs.com/package/use-modal-toggle)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/use-modal-toggle)](https://bundlephobia.com/package/use-modal-toggle)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎯 **Simple API** - Built-in state management, no need for extra useState
- 📱 **Mobile-First** - Perfect UX for mobile users
- ⚡ **Lightweight** - Zero dependencies, minimal footprint
- 🔧 **Flexible** - Works with any modal library or custom implementation
- 🎨 **TypeScript** - Full type safety included
- ⚙️ **SSR Safe** - Works with Next.js and other SSR frameworks

## Installation

```bash
npm install use-modal-toggle
```

```bash
yarn add use-modal-toggle
```

```bash
pnpm add use-modal-toggle
```

## The Problem

When a modal is open and users press the back button (especially on mobile), the browser navigates to the previous page instead of closing the modal. This breaks the expected user experience and can cause data loss.

## The Solution

This hook intercepts back button presses and closes your modal instead, creating an intuitive mobile-native experience that users expect.

## Usage

### Basic Example

```jsx
import { useModalToggle } from 'use-modal-toggle';

function MyComponent() {
  const { isOpen, open, close } = useModalToggle();

  return (
    <div>
      <button onClick={open}>
        Open Modal
      </button>

      {isOpen && (
        <div className="modal">
          <h2>My Modal</h2>
          <button onClick={close}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}
```

### With Popular Modal Libraries

#### React Modal

```jsx
import Modal from 'react-modal';
import { useModalToggle } from 'use-modal-toggle';

function MyComponent() {
  const { isOpen, open, close } = useModalToggle();

  return (
    <>
      <button onClick={open}>Open Modal</button>
      
      <Modal isOpen={isOpen} onRequestClose={close}>
        <h2>Hello Modal</h2>
        <button onClick={close}>Close</button>
      </Modal>
    </>
  );
}
```

#### Material-UI (MUI)

```jsx
import { Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import { useModalToggle } from 'use-modal-toggle';

function MyComponent() {
  const { isOpen, open, close } = useModalToggle();

  return (
    <>
      <Button onClick={open}>Open Dialog</Button>
      
      <Dialog open={isOpen} onClose={close}>
        <DialogTitle>Hello Dialog</DialogTitle>
        <DialogContent>
          Content here
        </DialogContent>
      </Dialog>
    </>
  );
}
```

#### Headless UI

```jsx
import { Dialog } from '@headlessui/react';
import { useModalToggle } from 'use-modal-toggle';

function MyComponent() {
  const { isOpen, open, close } = useModalToggle();

  return (
    <>
      <button onClick={open}>Open</button>
      
      <Dialog open={isOpen} onClose={close}>
        <Dialog.Panel>
          <Dialog.Title>Title</Dialog.Title>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
```

## Options

```typescript
const { isOpen, open, close, toggle } = useModalToggle({
  key: 'my-modal',
  enabled: true,
  pushStateOnOpen: true,
  cleanupOnClose: true,
  autoCloseOthersOnOpen: false
});
```

### Option Details

- **`key`**: A unique identifier for the modal. Useful when you have multiple modals. Auto-generated if not provided.

- **`enabled`**: Set to `false` to temporarily disable the hook without unmounting.

- **`pushStateOnOpen`**: When `true` (default), adds a history entry when the modal opens. Set to `false` if you manage history yourself.

- **`cleanupOnClose`**: When `true` (default), removes the history entry when you close the modal programmatically (e.g., clicking a close button). Set to `false` to keep the history entry.

## How It Works

The hook manages browser history to create seamless back button support:

1. **Modal Opens**: Pushes a new history entry to the browser stack
2. **Back Button Pressed**: Intercepts the `popstate` event and closes the modal
3. **Modal Closed Programmatically**: Automatically removes the history entry to prevent navigation issues
4. **Smart Detection**: Distinguishes between back button closes and programmatic closes to handle cleanup correctly

This ensures the back button works exactly as users expect, without breaking browser navigation.

## API Reference

### `useModalToggle(options?)`

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `options` | `UseModalToggleOptions` | No | Configuration options |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `isOpen` | `boolean` | Current state of the modal |
| `open` | `() => void` | Function to open the modal |
| `close` | `() => void` | Function to close the modal |
| `toggle` | `() => void` | Function to toggle modal state |

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `key` | `string` | auto-generated | Unique identifier for the modal. Useful when managing multiple modals |
| `enabled` | `boolean` | `true` | Enable or disable the hook without unmounting |
| `pushStateOnOpen` | `boolean` | `true` | Whether to push a history entry when modal opens |
| `cleanupOnClose` | `boolean` | `true` | Whether to remove history entry when modal closes programmatically |
| `autoCloseOthersOnOpen` | `boolean` | `false` | When `true`, opening this modal will automatically close other modals that also have this flag enabled |

## TypeScript

Full TypeScript support is included with complete type definitions.

```typescript
import { 
  useModalToggle, 
  UseModalToggleOptions,
  UseModalToggleReturn 
} from 'use-modal-toggle';

const options: UseModalToggleOptions = {
  key: 'my-modal',
  enabled: true,
  pushStateOnOpen: true,
  cleanupOnClose: true
};

const { isOpen, open, close, toggle }: UseModalToggleReturn = useModalToggle(options);
```

## Advanced Usage

### Multiple Modals

When working with multiple modals, provide unique keys to avoid conflicts:

```jsx
function App() {
  const settings = useModalToggle({ key: 'settings-modal', autoCloseOthersOnOpen: true });
  const profile = useModalToggle({ key: 'profile-modal', autoCloseOthersOnOpen: true });

  return (
    <>
      <button onClick={settings.open}>Open Settings</button>
      <button onClick={profile.open}>Open Profile</button>
      
      {settings.isOpen && <SettingsModal onClose={settings.close} />}
      {profile.isOpen && <ProfileModal onClose={profile.close} />}
    </>
  );
}
```

### Toggle Function

Use the built-in toggle function for convenience:

```jsx
function App() {
  const { isOpen, toggle } = useModalToggle();

  return (
    <>
      <button onClick={toggle}>
        {isOpen ? 'Close' : 'Open'} Modal
      </button>
      
      {isOpen && <Modal onClose={toggle} />}
    </>
  );
}
```

### Conditional Enabling

Disable the hook based on conditions without unmounting:

```jsx
const isMobile = useMediaQuery('(max-width: 768px)');

const { isOpen, open, close } = useModalToggle({
  enabled: isMobile
});
```

### Custom History Management

If you manage history yourself, disable automatic pushing:

```jsx
const { isOpen, open, close } = useModalToggle({
  pushStateOnOpen: false
});
```

## Browser Support

Works in all modern browsers that support the History API:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- iOS Safari (latest)
- Chrome Android (latest)

## FAQ

**Q: Does this work with Next.js?**  
A: Yes! The hook is SSR-safe and works perfectly with Next.js and other SSR frameworks.

**Q: Can I use this with multiple modals?**  
A: Yes, provide a unique `key` option for each modal instance.

**Q: Does this affect my router?**  
A: No, the hook only manages history when the modal is open and cleans up properly.

**Q: What happens if I press back multiple times?**  
A: Only the modal close is handled. Further back presses will navigate normally through your app's history.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT