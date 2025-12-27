# React Audio

A React component library for building Web Audio API-based audio players with advanced playback controls.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Tests](https://img.shields.io/badge/tests-106%20passing-brightgreen.svg)](package.json)

## Features

- 🎵 **Web Audio API Integration** - Full control over audio playback using the browser's native Web Audio API
- 🎛️ **Advanced Controls** - Speed, pitch (detune), and gain controls with real-time parameter updates
- 🔁 **Loop Support** - Configurable loop points with start/end controls
- 📦 **Reusable Components** - Modular UI components (sliders, toggles, buttons)
- 🔄 **Redux-Style State** - Predictable state management with reducers and actions
- 🎯 **Multi-Instance Support** - Multiple independent audio players on a single page
- 🧪 **Fully Tested** - 106 tests covering all functionality

## Installation

```bash
npm install react-audio
```

## Quick Start

### Basic Audio Player

```jsx
import React from 'react';
import { SoundPlayer } from 'react-audio';
import { WebAudioContextProvider } from 'react-audio/context';

function App() {
  return (
    <WebAudioContextProvider>
      <SoundPlayer
        url="/path/to/audio.mp3"
        showDuration={true}
      />
    </WebAudioContextProvider>
  );
}
```

### With File Upload

```jsx
import { SoundPlayerLoader } from 'react-audio';
import { WebAudioContextProvider } from 'react-audio/context';
import { DispatchContext } from 'react-audio/context/Store';

function App() {
  const dispatch = useReducer(soundPlayerReducer, {});

  return (
    <WebAudioContextProvider>
      <DispatchContext.Provider value={dispatch}>
        <SoundPlayerLoader />
      </DispatchContext.Provider>
    </WebAudioContextProvider>
  );
}
```

### With Redux State Management

```jsx
import { SoundPlayerContainer } from 'react-audio';
import { WebAudioContextProvider } from 'react-audio/context';
import { StateContext, DispatchContext } from 'react-audio/context/Store';

function App() {
  const [state, dispatch] = useReducer(soundPlayerReducer, {});

  return (
    <WebAudioContextProvider>
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <SoundPlayerContainer
            url="/path/to/audio.mp3"
            loopOn={false}
          />
        </DispatchContext.Provider>
      </StateContext.Provider>
    </WebAudioContextProvider>
  );
}
```

## Components

### `<SoundPlayer />`

The core audio player component with full playback controls.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `url` | `string` | **required** | URL of the audio file to play |
| `audioContext` | `AudioContext` | **required** | Web Audio API AudioContext instance |
| `update` | `function` | **required** | Callback function for state updates |
| `showDuration` | `boolean` | `true` | Show/hide duration display |
| `loop` | `boolean` | `false` | Enable audio looping |
| `loopStart` | `number` | `0` | Loop start point in seconds |
| `loopEnd` | `number` | `undefined` | Loop end point in seconds |
| `loopOn` | `boolean` | `undefined` | Override loop control (hides toggle) |
| `playbackRate` | `number` | `1` | Playback speed (0.1 - 20) |
| `detune` | `number` | `0` | Pitch adjustment in cents (-1200 - 1200) |
| `gain` | `number` | `1` | Volume level (0 - 1) |
| `duration` | `number` | `null` | Audio duration in seconds |
| `triggerPlay` | `boolean` | `false` | Programmatically trigger playback |
| `onEnded` | `function` | `undefined` | Callback when playback ends |
| `exposeDuration` | `function` | `undefined` | Callback to expose duration value |

#### Example

```jsx
<SoundPlayer
  url="/audio/track.mp3"
  audioContext={audioContext}
  update={updateParam}
  playbackRate={1.5}
  detune={100}
  gain={0.8}
  loop={true}
  loopStart={10}
  loopEnd={30}
  showDuration={true}
  onEnded={(e) => console.log('Playback ended', e)}
/>
```

### `<SoundPlayerContainer />`

Redux-connected wrapper for `SoundPlayer` with automatic state management.

#### Props

All `SoundPlayer` props, plus:

| Prop | Type | Description |
|------|------|-------------|
| `loopOn` | `boolean` | Override internal loop state |

### `<SoundPlayerLoader />`

Combined file upload and player component.

```jsx
<SoundPlayerLoader />
```

Automatically renders:
- File input (before file selection)
- `SoundPlayer` (after file selection)

### `<SoundLoader />`

Simple file upload component with native HTML5 audio player.

```jsx
<SoundLoader />
```

### UI Components

#### `<Slider />`

Customizable range slider with labels, tick marks, and value display.

```jsx
import { Slider } from 'react-audio/ui';

<Slider
  value={playbackRate}
  onChange={setPlaybackRate}
  min={0.1}
  max={2}
  step={0.1}
  defaultValue={1}
  label="Speed"
  showValue={true}
  numTicks={10}
  valueUnits="x"
/>
```

#### `<Toggle />`

Boolean toggle button.

```jsx
import { Toggle } from 'react-audio/ui';

<Toggle
  value={isLooping}
  onChange={setIsLooping}
  onLabel="Loop On"
  offLabel="Loop Off"
/>
```

#### `<Button />`

Customizable button with keyboard support.

```jsx
import { Button } from 'react-audio/ui';

<Button
  onClick={handleClick}
  selected={isSelected}
  passback="customData"
>
  Click Me
</Button>
```

### `<SoundDuration />`

Displays audio duration in milliseconds.

```jsx
import { SoundDuration } from 'react-audio';

<SoundDuration value={durationInSeconds} />
// Renders: "Duration: 1234.57ms"
```

## Context Providers

### `<WebAudioContextProvider />`

Provides a singleton AudioContext to all child components.

```jsx
import { WebAudioContextProvider } from 'react-audio/context';

<WebAudioContextProvider>
  <YourApp />
</WebAudioContextProvider>
```

### State Management

The library uses a Redux-style state management pattern with contexts:

```jsx
import { StateContext, DispatchContext } from 'react-audio/context/Store';
import { soundPlayerReducer } from 'react-audio';

const [state, dispatch] = useReducer(soundPlayerReducer, {});

<StateContext.Provider value={state}>
  <DispatchContext.Provider value={dispatch}>
    {/* Your components */}
  </DispatchContext.Provider>
</StateContext.Provider>
```

## Utilities

### Web Audio Utils

```jsx
import {
  getAudioContext,
  loadSoundIntoBuffer,
  makeSoundSource,
  isPlayableAudioFile
} from 'react-audio/utils';

// Create AudioContext
const ctx = getAudioContext();

// Load audio file into buffer
const buffer = await loadSoundIntoBuffer('/audio.mp3', ctx);

// Create buffer source
const createSource = makeSoundSource(ctx);
const source = createSource(buffer);

// Check if file is playable
const canPlay = isPlayableAudioFile('mp3'); // true
```

### State Management Utils

```jsx
import { funcReducer } from 'react-audio/utils';

// Create a reducer from handler object
const reducer = funcReducer({
  UPDATE_VALUE: (action) => (state) => ({
    ...state,
    value: action.value
  }),
  RESET: () => () => ({})
});
```

## Actions

```jsx
import { updateParam, removePlayer } from 'react-audio/actions';

// Update a parameter
dispatch(updateParam('player-1', 'playbackRate', 1.5));

// Remove a player instance
dispatch(removePlayer('player-1'));
```

## State Shape

```javascript
{
  soundPlayer: {
    'player-id-1': {
      loop: false,
      duration: null,
      playbackRate: 1,
      detune: 0,
      gain: 1
    },
    'player-id-2': {
      // ... another player instance
    }
  }
}
```

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/lostclawz/react-audio.git
cd react-audio

# Install dependencies
npm install
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

**Test Coverage:**
- 14 test suites
- 106 tests passing
- Components, utilities, state management, and integration tests

### Project Structure

```
react-audio/
├── src/
│   ├── components/
│   │   ├── SoundPlayer.jsx          # Main player component
│   │   ├── SoundPlayerContainer.jsx # Redux-connected wrapper
│   │   ├── SoundPlayerLoader.jsx    # Player with file upload
│   │   ├── SoundLoader.jsx          # Simple file upload
│   │   └── SoundDuration.jsx        # Duration display
│   ├── ui/
│   │   ├── Button.jsx               # Button component
│   │   ├── Toggle.jsx               # Toggle component
│   │   ├── Slider.jsx               # Slider component
│   │   └── tests/                   # UI component tests
│   ├── context/
│   │   ├── WebAudioContext.jsx      # AudioContext provider
│   │   └── Store.jsx                # State/Dispatch contexts
│   ├── utils/
│   │   ├── web-audio-utils.js       # Web Audio API helpers
│   │   ├── redux-utils.js           # State management helpers
│   │   └── testing-utils.js         # Test utilities
│   ├── SoundPlayerActions.js        # Action creators
│   ├── SoundPlayerReducer.jsx       # State reducer
│   ├── SoundPlayerLens.js           # Ramda lenses for state
│   ├── constants.js                 # App constants
│   └── tests/                       # Component tests
└── package.json
```

## Browser Support

Requires browsers with Web Audio API support:
- Chrome 34+
- Firefox 25+
- Safari 14.1+
- Edge 79+

## Web Audio API Concepts

### AudioContext Lifecycle

1. Create a singleton AudioContext (provided by `WebAudioContextProvider`)
2. Load audio files into AudioBuffers
3. Create BufferSourceNodes for playback (one-time use)
4. Control playback parameters in real-time
5. Clean up nodes on component unmount

### Important Notes

- **BufferSourceNode** can only be started once - create a new source for each play
- **AudioContext** should be a singleton - shared across components
- **Parameters** (playbackRate, detune, gain) can be updated in real-time
- **Detune** is measured in cents (100 cents = 1 semitone)
- Always **disconnect nodes** to prevent memory leaks

## Examples

### Custom Playback Controls

```jsx
function CustomPlayer({ url }) {
  const audioContext = useContext(WebAudioContext);
  const [params, setParams] = useState({
    playbackRate: 1,
    detune: 0,
    gain: 1
  });

  const updateParam = (param) => (value) => {
    setParams(prev => ({ ...prev, [param]: value }));
  };

  return (
    <SoundPlayer
      url={url}
      audioContext={audioContext}
      update={updateParam}
      {...params}
    />
  );
}
```

### Loop with Custom Points

```jsx
<SoundPlayer
  url="/audio/track.mp3"
  audioContext={audioContext}
  update={updateParam}
  loop={true}
  loopStart={15}      // Start loop at 15 seconds
  loopEnd={45}        // End loop at 45 seconds
/>
```

### Multiple Players

```jsx
function MultiPlayer() {
  return (
    <WebAudioContextProvider>
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <SoundPlayerContainer url="/track1.mp3" />
          <SoundPlayerContainer url="/track2.mp3" />
          <SoundPlayerContainer url="/track3.mp3" />
        </DispatchContext.Provider>
      </StateContext.Provider>
    </WebAudioContextProvider>
  );
}
```

## Known Issues

- `isPlayableAudioFile()` has a bug where `AUDIO_CONTENT_TYPES` is an array but accessed as an object, causing it to always return `false`

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

ISC © Philip Kuperberg

## Links

- [GitHub Repository](https://github.com/lostclawz/react-audio)
- [Issue Tracker](https://github.com/lostclawz/react-audio/issues)
- [Web Audio API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

---

Built with ❤️ using React and the Web Audio API
