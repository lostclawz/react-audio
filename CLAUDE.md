# CLAUDE.md - React Audio Project Guide

## Project Overview

**React-Audio** is a React component library for building Web Audio API-based audio players. It provides reusable React components that wrap the browser's Web Audio API, enabling developers to create custom audio playback interfaces with advanced audio control features.

- **Repository**: https://github.com/lostclawz/react-audio
- **Author**: Philip Kuperberg
- **Version**: 0.0.1 (early development)
- **License**: ISC

## Core Technologies

- **React** (^19.2.3) - UI framework
- **Web Audio API** - Browser's native audio processing
- **Redux** - State management (via reducer pattern)
- **Ramda** (^0.32.0) - Functional programming with lenses for immutable state updates
- **SCSS** - Component styling

## Development Tools

- **Jest** (^30.2.0) - Test runner and framework
- **React Testing Library** (^16.3.1) - Component testing utilities
- **@testing-library/user-event** (^14.6.1) - User interaction simulation
- **@testing-library/jest-dom** (^6.9.1) - Custom Jest matchers
- **Babel** - JavaScript transpilation for tests

## Architecture Patterns

### 1. Component Structure
- **Pure Components**: [SoundPlayer.jsx](src/SoundPlayer.jsx) contains core audio logic
- **Container Pattern**: [SoundPlayerContainer.jsx](src/SoundPlayerContainer.jsx) wraps with Redux state
- **Composition**: Small, reusable UI components in [src/ui/](src/ui/)

### 2. State Management
The project uses a **hybrid approach**:
- **Redux pattern** via reducer ([SoundPlayerReducer.jsx](src/SoundPlayerReducer.jsx)) and actions ([SoundPlayerActions.js](src/SoundPlayerActions.js))
- **Ramda lenses** ([SoundPlayerLens.js](src/SoundPlayerLens.js)) for functional state transformations
- **React Context** ([WebAudioContext.jsx](src/context/WebAudioContext.jsx)) for sharing AudioContext instance

**State shape**:
```javascript
{
  loop: false,
  duration: null,
  playbackRate: 1,
  detune: 0,
  gain: 1
}
```

### 3. Web Audio Integration
- Singleton `AudioContext` provided via React Context
- Audio buffers loaded asynchronously from URLs
- Real-time parameter control via `AudioParam` nodes

## Key Files & Components

### Core Components

| File | Purpose | Key Features |
|------|---------|--------------|
| [SoundPlayer.jsx](src/SoundPlayer.jsx) | Main audio player (1,800+ lines) | Play/stop, speed/detune/gain sliders, loop controls, buffer loading |
| [SoundPlayerContainer.jsx](src/SoundPlayerContainer.jsx) | Redux-connected wrapper | State integration, unique instance IDs |
| [SoundDuration.jsx](src/SoundDuration.jsx) | Duration display | Shows audio length in milliseconds |
| [SoundLoader.jsx](src/SoundLoader.jsx) | File upload component | Handles audio file loading |
| [SoundPlayerLoader.jsx](src/SoundPlayerLoader.jsx) | Combined player + loader | Full-featured player with file input |

### UI Components ([src/ui/](src/ui/))

| Component | Purpose | Props |
|-----------|---------|-------|
| [Button.jsx](src/ui/Button.jsx) | Custom button | `onClick`, `className`, `children`, keyboard support |
| [Toggle.jsx](src/ui/Toggle.jsx) | Boolean toggle | `value`, `onChange`, `onLabel`, `offLabel` |
| [Slider.jsx](src/ui/Slider.jsx) | Range slider | `value`, `min`, `max`, `step`, `onChange`, `label`, `showValue`, `showTicks` |

### State Management

| File | Purpose |
|------|---------|
| [SoundPlayerReducer.jsx](src/SoundPlayerReducer.jsx) | Redux reducer for player state |
| [SoundPlayerActions.js](src/SoundPlayerActions.js) | Action creators: `UPDATE_PARAM`, `REMOVE_PLAYER` |
| [SoundPlayerLens.js](src/SoundPlayerLens.js) | Ramda lenses for functional state updates |

### Utilities

| File | Purpose | Key Functions |
|------|---------|---------------|
| [web-audio-utils.js](src/utils/web-audio-utils.js) | Web Audio API helpers | `getAudioContext()`, `loadSoundIntoBuffer()`, `makeSoundSource()`, `isPlayableAudioFile()` |
| [testing-utils.js](src/utils/testing-utils.js) | Test helpers | Action and reducer testing utilities |
| [useID.js](src/hooks/useID.js) | Custom React hook | Generates persistent UUID for component instances |

### Styling

- [_sound-player.scss](src/_sound-player.scss) - Sound player styles
- [_slider.scss](src/ui/_slider.scss) - Slider component styles

## Common Development Tasks

### Adding a New Audio Control Parameter

1. Add to initial state in [SoundPlayerLens.js](src/SoundPlayerLens.js)
2. Create lens getter/setter functions
3. Add reducer case in [SoundPlayerReducer.jsx](src/SoundPlayerReducer.jsx)
4. Add UI control in [SoundPlayer.jsx](src/SoundPlayer.jsx)
5. Connect to Web Audio API `AudioParam` node

### Creating a New UI Component

1. Create component in [src/ui/](src/ui/)
2. Add corresponding test in [src/ui/tests/](src/ui/tests/)
3. Create SCSS file if needed
4. Follow existing patterns: keyboard support, prop-types, classnames

### Testing

- **Framework**: Jest + React Testing Library
- **Test Runner**: Jest with jsdom environment
- **Utilities**: @testing-library/user-event for user interactions
- **Test location**: [src/tests/](src/tests/) for core components, [src/ui/tests/](src/ui/tests/) for UI components
- **Coverage**: 106 tests across 14 test suites - all passing
- **Run tests**: `npm test` (single run), `npm run test:watch` (watch mode), `npm run test:coverage` (with coverage)

#### Test Files

| File | Coverage |
|------|----------|
| [test-SoundPlayer.jsx](src/tests/test-SoundPlayer.jsx) | Core player functionality (22 tests) |
| [test-SoundPlayerContainer.jsx](src/tests/test-SoundPlayerContainer.jsx) | Redux integration (8 tests) |
| [test-SoundPlayerLoader.jsx](src/tests/test-SoundPlayerLoader.jsx) | File upload + player (10 tests) |
| [test-SoundLoader.jsx](src/tests/test-SoundLoader.jsx) | File upload only (6 tests) |
| [test-SoundDuration.jsx](src/tests/test-SoundDuration.jsx) | Duration display (4 tests) |
| [test-WebAudioContext.jsx](src/tests/test-WebAudioContext.jsx) | Context provider (7 tests) |
| [test-web-audio-utils.js](src/tests/test-web-audio-utils.js) | Web Audio utilities (8 tests) |
| [test-redux-utils.js](src/tests/test-redux-utils.js) | Redux helpers (6 tests) |
| [test-SoundPlayerActions.js](src/tests/test-SoundPlayerActions.js) | Action creators (3 tests) |
| [test-SoundPlayerReducer.js](src/tests/test-SoundPlayerReducer.js) | State reducer (3 tests) |
| [test-SoundPlayerLens.js](src/tests/test-SoundPlayerLens.js) | Ramda lenses (3 tests) |
| [test-Button.jsx](src/ui/tests/test-Button.jsx) | Button component (6 tests) |
| [test-Toggle.jsx](src/ui/tests/test-Toggle.jsx) | Toggle component (4 tests) |
| [test-Slider.jsx](src/ui/tests/test-Slider.jsx) | Slider component (16 tests) |

#### Writing Tests

When adding new features:
1. Create test file with `test-` prefix matching component name
2. Use React Testing Library's `render`, `screen`, and `userEvent`
3. Mock Web Audio API components (AudioContext, BufferSource, etc.)
4. Test user interactions, not implementation details
5. Use `waitFor` or `findBy*` for async operations

## Important Concepts

### Web Audio API Lifecycle

1. **AudioContext** creation (singleton via context)
2. **Buffer loading** from URL (`fetch` → `arrayBuffer` → `decodeAudioData`)
3. **Source creation** (`createBufferSource()`) - one-time use only
4. **Parameter control** via `AudioParam` nodes (playbackRate, detune, gain)
5. **Cleanup** on component unmount or re-creation

### Multi-Instance Support

- Each `SoundPlayerContainer` gets a unique ID via `useID` hook
- State is keyed by instance ID in Redux store
- Allows multiple players on one page without conflicts

### Loop Controls

Loop functionality allows:
- Start point (`loopStart` in seconds)
- End point (`loopEnd` in seconds)
- Toggle on/off
- Implemented via `BufferSourceNode.loop` API

## Dependencies to Know

- **ramda** - Used for lenses (functional state updates), not full lodash-style utilities
- **classnames** - Conditional CSS class joining
- **prop-types** - Runtime prop validation (React < 15.5 pattern)
- **uuid** - v4 UUID generation for instance IDs

## Current Limitations

- Version 0.0.1 - early development stage
- No build/bundling configured (Webpack, Rollup, etc.)
- SCSS compilation not set up
- No published npm package yet

## Known Issues

- **isPlayableAudioFile() bug**: `AUDIO_CONTENT_TYPES` in [constants.js](src/constants.js) is defined as an array but accessed as an object in [web-audio-utils.js](src/utils/web-audio-utils.js:45), causing the function to always return `false`

## File Naming Conventions

- **Components**: PascalCase with `.jsx` extension
- **Utilities**: kebab-case with `.js` extension
- **Styles**: underscore-prefix with `.scss` extension (e.g., `_sound-player.scss`)
- **Tests**: `test-` prefix matching component name

## Getting Started with Changes

1. **Read first**: Always read the file you're modifying
2. **Check tests**: Look for corresponding test file to understand expected behavior
3. **State changes**: Update lens, reducer, and actions together
4. **Web Audio**: Be careful with AudioContext lifecycle and source node one-time-use limitation
5. **Cleanup**: Always clean up Web Audio nodes in `useEffect` cleanup or `componentWillUnmount`

## Web Audio Gotchas

- `AudioBufferSourceNode` can only be started once - create new source for each play
- `AudioContext` must be resumed on user interaction in some browsers
- Parameters like `playbackRate` have min/max ranges enforced by browser
- Detune is in cents (100 cents = 1 semitone)
- Always disconnect nodes to prevent memory leaks

## Questions to Ask

When working on this project, consider:

1. **State location**: Should this state be in Redux or local component state?
2. **Reusability**: Is this UI component reusable or specific to SoundPlayer?
3. **Web Audio API**: Does this require new AudioNode types or parameter connections?
4. **Multi-instance**: Will this work correctly with multiple players on the page?
5. **Performance**: Are we creating/destroying AudioNodes efficiently?
