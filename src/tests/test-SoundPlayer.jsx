import React from 'react';
import { render } from '@testing-library/react';
import * as audioUtils from '../utils/web-audio-utils';
import SoundPlayer from '../SoundPlayer';

const mockAudioContext = () => ({
   createBufferSource: jest.fn(),
   createGain: jest.fn(),
   destination: {},
});

describe('<SoundPlayer/>', () => {
   let loadSoundIntoBuffer;
   let updateCallback;
   let mockContext;

   const goodUrl = '/localhost:8080/whatever.mp3';
   const badUrl = '/localhost:8080/whatever2.mp3';

   const testBuffer = {
      duration: 1000,
   };

   beforeEach(() => {
      mockContext = mockAudioContext();
      loadSoundIntoBuffer = jest.spyOn(audioUtils, 'loadSoundIntoBuffer');
      loadSoundIntoBuffer.mockImplementation((url) => {
         if (url === goodUrl) {
            return Promise.resolve(testBuffer);
         }
         if (url === badUrl) {
            return Promise.reject(new Error('Bad URL'));
         }
         return Promise.reject(new Error('Unknown URL'));
      });

      // Update callback returns a function that can be called with a value
      updateCallback = jest.fn(() => jest.fn());
   });

   afterEach(() => {
      loadSoundIntoBuffer.mockRestore();
      jest.clearAllMocks();
   });

   it('renders', () => {
      const { container } = render(
         <SoundPlayer
            url={goodUrl}
            update={updateCallback}
            audioContext={mockContext}
         />
      );
      expect(container.firstChild).toBeInTheDocument();
   });

   it('calls loadSoundIntoBuffer with the URL and audioContext on mount', () => {
      render(
         <SoundPlayer
            url={goodUrl}
            update={updateCallback}
            audioContext={mockContext}
         />
      );
      expect(loadSoundIntoBuffer).toHaveBeenCalledTimes(1);
      expect(loadSoundIntoBuffer).toHaveBeenCalledWith(goodUrl, mockContext);
   });

   it('adds a disabled class to div wrapper if url won\'t load', async () => {
      const { container } = render(
         <SoundPlayer
            url={badUrl}
            update={updateCallback}
            audioContext={mockContext}
         />
      );

      // Wait for the promise to reject and state to update
      await new Promise((resolve) => setTimeout(resolve, 50));

      const wrapper = container.querySelector('.sound-player');
      expect(wrapper).toHaveClass('disabled');
   });

   it('sets disabled state and logs warning when buffer load fails', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      render(
         <SoundPlayer
            url={badUrl}
            update={updateCallback}
            audioContext={mockContext}
         />
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
   });

   it('calls updateDuration callback when buffer is loaded', async () => {
      render(
         <SoundPlayer
            url={goodUrl}
            update={updateCallback}
            audioContext={mockContext}
            gain={1}
         />
      );

      // Wait for async buffer load
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(updateCallback).toHaveBeenCalledWith('duration');
   });

   it('calls exposeDuration callback if provided when buffer loads', async () => {
      const exposeDuration = jest.fn();

      render(
         <SoundPlayer
            url={goodUrl}
            update={updateCallback}
            audioContext={mockContext}
            exposeDuration={exposeDuration}
            gain={1}
         />
      );

      // Wait for async buffer load
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(exposeDuration).toHaveBeenCalledWith(testBuffer.duration);
   });

   it('renders play button', () => {
      const { container } = render(
         <SoundPlayer
            url={goodUrl}
            update={updateCallback}
            audioContext={mockContext}
         />
      );

      const playButton = container.querySelector('.btn-play');
      expect(playButton).toBeInTheDocument();
   });

   it('renders loop toggle if loopOn prop is not provided', () => {
      const { container } = render(
         <SoundPlayer
            url={goodUrl}
            update={updateCallback}
            audioContext={mockContext}
         />
      );

      const loopToggle = container.querySelector('.btn-loop');
      expect(loopToggle).toBeInTheDocument();
   });

   it('does not render loop toggle if loopOn prop is provided', () => {
      const { container } = render(
         <SoundPlayer
            url={goodUrl}
            update={updateCallback}
            audioContext={mockContext}
            loopOn={true}
         />
      );

      const loopToggle = container.querySelector('.btn-loop');
      expect(loopToggle).not.toBeInTheDocument();
   });

   it('renders speed slider', () => {
      const { container } = render(
         <SoundPlayer
            url={goodUrl}
            update={updateCallback}
            audioContext={mockContext}
         />
      );

      const speedSlider = container.querySelector('#speed-undefined');
      expect(speedSlider).toBeInTheDocument();
   });

   it('renders detune slider', () => {
      const { container } = render(
         <SoundPlayer
            url={goodUrl}
            update={updateCallback}
            audioContext={mockContext}
         />
      );

      const detuneSlider = container.querySelector('#detune-undefined');
      expect(detuneSlider).toBeInTheDocument();
   });

   it('renders gain slider', () => {
      const { container } = render(
         <SoundPlayer
            url={goodUrl}
            update={updateCallback}
            audioContext={mockContext}
         />
      );

      const gainSlider = container.querySelector('#gain-undefined');
      expect(gainSlider).toBeInTheDocument();
   });

   it('renders duration display if showDuration is true', async () => {
      render(
         <SoundPlayer
            url={goodUrl}
            update={updateCallback}
            audioContext={mockContext}
            showDuration={true}
            duration={1.234}
         />
      );

      const soundInfo = document.querySelector('.sound-info');
      expect(soundInfo).toBeInTheDocument();
   });

   it('does not render duration display if showDuration is false', () => {
      render(
         <SoundPlayer
            url={goodUrl}
            update={updateCallback}
            audioContext={mockContext}
            showDuration={false}
         />
      );

      const soundInfo = document.querySelector('.sound-info');
      expect(soundInfo).not.toBeInTheDocument();
   });

   it('sets disabled title when file fails to load', async () => {
      const { container } = render(
         <SoundPlayer
            url={badUrl}
            update={updateCallback}
            audioContext={mockContext}
         />
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const wrapper = container.querySelector('.sound-player');
      expect(wrapper.title).toBe('File Not Found');
   });

   it('creates buffer source with correct settings when playing', async () => {
      const mockSource = {
         buffer: null,
         loop: false,
         loopStart: 0,
         loopEnd: 0,
         playbackRate: { value: 1 },
         detune: { value: 0 },
         connect: jest.fn(),
         start: jest.fn(),
         stop: jest.fn(),
         onended: null,
      };

      const mockGainNode = {
         gain: { value: 1 },
         connect: jest.fn(),
      };

      mockContext.createBufferSource.mockReturnValue(mockSource);
      mockContext.createGain.mockReturnValue(mockGainNode);

      const { container } = render(
         <SoundPlayer
            url={goodUrl}
            update={updateCallback}
            audioContext={mockContext}
            playbackRate={1.5}
            detune={100}
            gain={0.8}
            loop={true}
         />
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const playButton = container.querySelector('.btn-play');
      playButton.click();

      expect(mockSource.playbackRate.value).toBe(1.5);
      expect(mockSource.detune.value).toBe(100);
      expect(mockGainNode.gain.value).toBe(0.8);
      expect(mockSource.loop).toBe(true);
   });

   it('does not render anything if url is not provided', () => {
      const { container } = render(
         <SoundPlayer
            update={updateCallback}
            audioContext={mockContext}
         />
      );

      expect(container.firstChild).toBeNull();
   });

   it('reloads buffer when url changes', async () => {
      const { rerender } = render(
         <SoundPlayer
            url={goodUrl}
            update={updateCallback}
            audioContext={mockContext}
         />
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(loadSoundIntoBuffer).toHaveBeenCalledTimes(1);

      const newUrl = '/localhost:8080/different.mp3';
      loadSoundIntoBuffer.mockResolvedValue({ duration: 200 });

      rerender(
         <SoundPlayer
            url={newUrl}
            update={updateCallback}
            audioContext={mockContext}
         />
      );

      expect(loadSoundIntoBuffer).toHaveBeenCalledTimes(2);
      expect(loadSoundIntoBuffer).toHaveBeenCalledWith(newUrl, mockContext);
   });
});
