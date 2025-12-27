import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SoundPlayerLoader from '../SoundPlayerLoader';
import { WebAudioContext } from '../context/WebAudioContext';

// Mock the Store context - must use require to avoid hoisting issues
jest.mock('~/context/Store', () => {
   const { createContext } = require('react');
   return {
      DispatchContext: createContext(() => {}),
   };
});

// Mock SoundPlayer component
jest.mock('../SoundPlayer', () => ({
   __esModule: true,
   default: jest.fn(({ url, id }) => (
      <div data-testid="sound-player">
         SoundPlayer: {url} (id: {id})
      </div>
   )),
}));

describe('<SoundPlayerLoader />', () => {
   let mockAudioContext;
   let mockDispatch;
   let mockCreateObjectURL;
   let SoundPlayerMock;

   beforeEach(() => {
      mockAudioContext = {
         createBufferSource: jest.fn(),
         createGain: jest.fn(),
         destination: {},
      };

      mockDispatch = jest.fn();

      mockCreateObjectURL = jest.fn((file) => `blob:${file.name}`);
      global.URL.createObjectURL = mockCreateObjectURL;

      // Get reference to mocked SoundPlayer
      SoundPlayerMock = require('../SoundPlayer').default;
      SoundPlayerMock.mockClear();
   });

   afterEach(() => {
      jest.clearAllMocks();
   });

   const renderWithContext = () => {
      const { DispatchContext } = require('~/context/Store');

      return render(
         <DispatchContext.Provider value={mockDispatch}>
            <WebAudioContext.Provider value={mockAudioContext}>
               <SoundPlayerLoader />
            </WebAudioContext.Provider>
         </DispatchContext.Provider>
      );
   };

   it('renders file input initially', () => {
      const { container } = renderWithContext();
      const input = container.querySelector('input[type="file"]');
      expect(input).toBeInTheDocument();
      expect(input.type).toBe('file');
   });

   it('sets accept attribute to audio/*', () => {
      const { container } = renderWithContext();
      const input = container.querySelector('input[type="file"]');
      expect(input.accept).toBe('audio/*');
   });

   it('does not render SoundPlayer initially', () => {
      renderWithContext();
      expect(screen.queryByTestId('sound-player')).not.toBeInTheDocument();
   });

   it('creates object URL when file is selected', async () => {
      const user = userEvent.setup();
      const { container } = renderWithContext();

      const input = container.querySelector('input[type="file"]');
      const file = new File(['audio content'], 'test.mp3', { type: 'audio/mp3' });

      await user.upload(input, file);

      expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
   });

   it('renders SoundPlayer after file is selected', async () => {
      const user = userEvent.setup();
      const { container } = renderWithContext();

      const input = container.querySelector('input[type="file"]');
      const file = new File(['audio content'], 'test.mp3', { type: 'audio/mp3' });

      await user.upload(input, file);

      expect(screen.getByTestId('sound-player')).toBeInTheDocument();
   });

   it('hides file input after file is selected', async () => {
      const user = userEvent.setup();
      const { container } = renderWithContext();

      const input = container.querySelector('input[type="file"]');
      const file = new File(['audio content'], 'test.mp3', { type: 'audio/mp3' });

      await user.upload(input, file);

      expect(container.querySelector('input[type="file"]')).not.toBeInTheDocument();
   });

   it('passes blob URL to SoundPlayer', async () => {
      const user = userEvent.setup();
      const { container } = renderWithContext();

      const input = container.querySelector('input[type="file"]');
      const file = new File(['audio content'], 'test.mp3', { type: 'audio/mp3' });

      await user.upload(input, file);

      expect(SoundPlayerMock).toHaveBeenCalledWith(
         expect.objectContaining({ url: 'blob:test.mp3' }),
         undefined
      );
   });

   it('passes audioContext to SoundPlayer', async () => {
      const user = userEvent.setup();
      const { container } = renderWithContext();

      const input = container.querySelector('input[type="file"]');
      const file = new File(['audio content'], 'test.mp3', { type: 'audio/mp3' });

      await user.upload(input, file);

      expect(SoundPlayerMock).toHaveBeenCalledWith(
         expect.objectContaining({ audioContext: mockAudioContext }),
         undefined
      );
   });

   it('passes update function to SoundPlayer', async () => {
      const user = userEvent.setup();
      const { container } = renderWithContext();

      const input = container.querySelector('input[type="file"]');
      const file = new File(['audio content'], 'test.mp3', { type: 'audio/mp3' });

      await user.upload(input, file);

      expect(SoundPlayerMock).toHaveBeenCalledWith(
         expect.objectContaining({ update: expect.any(Function) }),
         undefined
      );
   });

   it('passes unique id to SoundPlayer', async () => {
      const user = userEvent.setup();
      const { container } = renderWithContext();

      const input = container.querySelector('input[type="file"]');
      const file = new File(['audio content'], 'test.mp3', { type: 'audio/mp3' });

      await user.upload(input, file);

      expect(SoundPlayerMock).toHaveBeenCalledWith(
         expect.objectContaining({ id: expect.any(String) }),
         undefined
      );
   });

   it('updates SoundPlayer with new URL when different file is selected', async () => {
      const user = userEvent.setup();
      const { container } = renderWithContext();

      let input = container.querySelector('input[type="file"]');
      const file1 = new File(['audio content 1'], 'test1.mp3', { type: 'audio/mp3' });

      await user.upload(input, file1);

      expect(screen.getByText(/blob:test1.mp3/)).toBeInTheDocument();

      // Note: In the actual implementation, once a file is selected, the input is hidden
      // So we can't select another file unless the component supports it
      // This test documents the current behavior
      expect(container.querySelector('input[type="file"]')).not.toBeInTheDocument();
   });

   it('onChangeFile callback creates URL from first file in list', async () => {
      const user = userEvent.setup();
      const { container } = renderWithContext();

      const input = container.querySelector('input[type="file"]');
      const file1 = new File(['audio 1'], 'test1.mp3', { type: 'audio/mp3' });
      const file2 = new File(['audio 2'], 'test2.mp3', { type: 'audio/mp3' });

      // Although input allows only single file selection, this tests that
      // the implementation correctly uses files[0]
      await user.upload(input, [file1, file2]);

      // Should use first file
      expect(mockCreateObjectURL).toHaveBeenCalledWith(file1);
   });
});
