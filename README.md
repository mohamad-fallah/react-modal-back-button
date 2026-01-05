# react-modal-back-button

A lightweight React hook that enables native back button support for modals and dialogs. Press the back button to close modals instead of navigating away from the page.

[![npm version](https://img.shields.io/npm/v/react-modal-back-button.svg)](https://www.npmjs.com/package/react-modal-back-button)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/react-modal-back-button)](https://bundlephobia.com/package/react-modal-back-button)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎯 **Simple API** - Just pass `isOpen` and `onClose` to get started
- 📱 **Mobile-First** - Perfect UX for mobile users
- ⚡ **Lightweight** - Zero dependencies, minimal footprint
- 🔧 **Flexible** - Works with any modal library or custom implementation
- 🎨 **TypeScript** - Full type safety included
- ⚙️ **SSR Safe** - Works with Next.js and other SSR frameworks

## Installation

```bash
npm install react-modal-back-button
```

```bash
yarn add react-modal-back-button
```

```bash
pnpm add react-modal-back-button
```

## The Problem

When a modal is open and users press the back button (especially on mobile), the browser navigates to the previous page instead of closing the modal. This breaks the expected user experience and can cause data loss.

## The Solution

This hook intercepts back button presses and closes your modal instead, creating an intuitive mobile-native experience that users expect.

## Usage

### Basic Example

```jsx
import { useState } from 'react';
import { useModalBackButton } from 'react-modal-back-button';

function MyComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useModalBackButton(isModalOpen, () => setIsModalOpen(false));

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>
        Open Modal
      </button>

      {isModalOpen && (
        <div className="modal">
          <h2>My Modal</h2>
          <button onClick={() => setIsModalOpen(false)}>
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
import { useState } from 'react';
import Modal from 'react-modal';
import { useModalBackButton } from 'react-modal-back-button';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  
  useModalBackButton(isOpen, () => setIsOpen(false));

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      
      <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
        <h2>Hello Modal</h2>
        <button onClick={() => setIsOpen(false)}>Close</button>
      </Modal>
    </>
  );
}
```

#### Material-UI (MUI)

```jsx
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import { useModalBackButton } from 'react-modal-back-button';

function MyComponent() {
  const [open, setOpen] = useState(false);
  
  useModalBackButton(open, () => setOpen(false));

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      
      <Dialog open={open} onClose={() => setOpen(false)}>
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
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useModalBackButton } from 'react-modal-back-button';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  
  useModalBackButton(isOpen, () => setIsOpen(false));

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open</button>
      
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
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
useModalBackButton(isOpen, onClose, {
  key: 'my-modal',
  enabled: true,
  pushStateOnOpen: true,
  cleanupOnClose: true
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

### `useModalBackButton(isOpen, onClose, options?)`

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `isOpen` | `boolean` | Yes | Whether the modal is currently open |
| `onClose` | `() => void` | Yes | Callback function to close the modal |
| `options` | `UseModalBackButtonOptions` | No | Configuration options |

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `key` | `string` | auto-generated | Unique identifier for the modal. Useful when managing multiple modals |
| `enabled` | `boolean` | `true` | Enable or disable the hook without unmounting |
| `pushStateOnOpen` | `boolean` | `true` | Whether to push a history entry when modal opens |
| `cleanupOnClose` | `boolean` | `true` | Whether to remove history entry when modal closes programmatically |

## TypeScript

Full TypeScript support is included with complete type definitions.

```typescript
import { useModalBackButton, UseModalBackButtonOptions } from 'react-modal-back-button';

const options: UseModalBackButtonOptions = {
  key: 'my-modal',
  enabled: true,
  pushStateOnOpen: true,
  cleanupOnClose: true
};

useModalBackButton(isOpen, onClose, options);
```

## Advanced Usage

### Multiple Modals

When working with multiple modals, provide unique keys to avoid conflicts:

```jsx
function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useModalBackButton(settingsOpen, () => setSettingsOpen(false), {
    key: 'settings-modal'
  });

  useModalBackButton(profileOpen, () => setProfileOpen(false), {
    key: 'profile-modal'
  });

  return (/* ... */);
}
```

### Conditional Enabling

Disable the hook based on conditions without unmounting:

```jsx
const [isOpen, setIsOpen] = useState(false);
const isMobile = useMediaQuery('(max-width: 768px)');

useModalBackButton(isOpen, () => setIsOpen(false), {
  enabled: isMobile
});
```

### Custom History Management

If you manage history yourself, disable automatic pushing:

```jsx
useModalBackButton(isOpen, () => setIsOpen(false), {
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