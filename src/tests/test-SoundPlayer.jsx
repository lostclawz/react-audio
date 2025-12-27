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

      updateCallback = jest.fn();
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

   it.todo('adds a disabled class to div wrapper if url won\'t load');
});
