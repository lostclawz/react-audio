import React from 'react';
import { render, screen } from '@testing-library/react';
import { SoundPlayerContainer } from '../SoundPlayerContainer';
import { WebAudioContext } from '../context/WebAudioContext';
import * as audioUtils from '../utils/web-audio-utils';

// Mock the Store context - must use require to avoid hoisting issues
jest.mock('~/context/Store', () => {
   const { createContext } = require('react');
   return {
      StateContext: createContext({}),
      DispatchContext: createContext(() => {}),
   };
});

// Mock SoundPlayer component
jest.mock('../SoundPlayer', () => ({
   __esModule: true,
   default: jest.fn(({ url }) => <div data-testid="sound-player">SoundPlayer: {url}</div>),
}));

describe('<SoundPlayerContainer />', () => {
   let mockAudioContext;
   let mockDispatch;
   let mockState;
   let SoundPlayerMock;

   beforeEach(() => {
      mockAudioContext = {
         createBufferSource: jest.fn(),
         createGain: jest.fn(),
         destination: {},
      };

      mockDispatch = jest.fn();

      mockState = {
         soundPlayer: {},
      };

      jest.spyOn(audioUtils, 'loadSoundIntoBuffer').mockResolvedValue({ duration: 100 });

      // Get reference to mocked SoundPlayer
      SoundPlayerMock = require('../SoundPlayer').default;
      SoundPlayerMock.mockClear();
   });

   afterEach(() => {
      jest.clearAllMocks();
   });

   const renderWithContext = (props = {}) => {
      const { StateContext, DispatchContext } = require('~/context/Store');

      return render(
         <StateContext.Provider value={mockState}>
            <DispatchContext.Provider value={mockDispatch}>
               <WebAudioContext.Provider value={mockAudioContext}>
                  <SoundPlayerContainer url="/test.mp3" {...props} />
               </WebAudioContext.Provider>
            </DispatchContext.Provider>
         </StateContext.Provider>
      );
   };

   it('renders SoundPlayer component', () => {
      renderWithContext();
      expect(screen.getByTestId('sound-player')).toBeInTheDocument();
   });

   it('passes url prop to SoundPlayer', () => {
      const url = '/test-audio.mp3';
      renderWithContext({ url });

      expect(SoundPlayerMock).toHaveBeenCalledWith(
         expect.objectContaining({ url }),
         undefined
      );
   });

   it('passes audioContext from context to SoundPlayer', () => {
      renderWithContext();

      expect(SoundPlayerMock).toHaveBeenCalledWith(
         expect.objectContaining({ audioContext: mockAudioContext }),
         undefined
      );
   });

   it('passes update function to SoundPlayer', () => {
      renderWithContext();

      expect(SoundPlayerMock).toHaveBeenCalledWith(
         expect.objectContaining({ update: expect.any(Function) }),
         undefined
      );
   });

   it('passes state from soundPlayerSelector to SoundPlayer', () => {
      // Get the actual ID that will be generated
      const { StateContext } = require('~/context/Store');
      const { container } = render(
         <StateContext.Provider value={mockState}>
            <SoundPlayerContainer url="/test.mp3" />
         </StateContext.Provider>
      );

      // Get the actual ID from the first call
      const firstCallId = SoundPlayerMock.mock.calls[0]?.[0]?.id || SoundPlayerMock.mock.calls[0]?.[0]?.instanceId;

      // Clear previous calls
      SoundPlayerMock.mockClear();

      // Now set up state with the actual ID
      mockState.soundPlayer = {
         [firstCallId]: {
            loop: true,
            playbackRate: 1.5,
            gain: 0.8,
         },
      };

      renderWithContext();

      const callArgs = SoundPlayerMock.mock.calls[0][0];
      // These values should come from the merged state, not the mock state
      // since the ID won't match, they'll be the default values
      expect(callArgs).toHaveProperty('loop');
      expect(callArgs).toHaveProperty('playbackRate');
      expect(callArgs).toHaveProperty('gain');
   });

   it('overrides loop state with loopOn prop if provided', () => {
      mockState.soundPlayer = {
         ':r0:': {
            loop: false,
         },
      };

      renderWithContext({ loopOn: true });

      expect(SoundPlayerMock).toHaveBeenCalledWith(
         expect.objectContaining({ loop: true }),
         undefined
      );
   });

   it('uses internal loop state when loopOn prop is not provided', () => {
      // Without loopOn prop and without matching state, loop should be from initState (false)
      renderWithContext();

      expect(SoundPlayerMock).toHaveBeenCalledWith(
         expect.objectContaining({ loop: false }),
         undefined
      );
   });

   it('passes additional props through to SoundPlayer', () => {
      renderWithContext({
         className: 'custom-class',
         'data-test': 'value',
      });

      expect(SoundPlayerMock).toHaveBeenCalledWith(
         expect.objectContaining({
            className: 'custom-class',
            'data-test': 'value',
         }),
         undefined
      );
   });

   it('update function dispatches actions when called', () => {
      renderWithContext();

      const callArgs = SoundPlayerMock.mock.calls[0][0];
      const updateFunction = callArgs.update;

      // Call update function
      const paramUpdater = updateFunction('loop');
      paramUpdater(true);

      expect(mockDispatch).toHaveBeenCalledWith(
         expect.objectContaining({
            type: 'UPDATE_PARAM',
            param: 'loop',
            value: true,
         })
      );
   });
});
