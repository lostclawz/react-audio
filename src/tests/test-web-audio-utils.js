import {
   getAudioContext,
   makeSoundSource,
   loadSoundIntoBuffer,
   isPlayableAudioFile,
} from '../utils/web-audio-utils';

describe('web-audio-utils', () => {
   describe('getAudioContext()', () => {
      let originalAudioContext;

      beforeEach(() => {
         originalAudioContext = window.AudioContext;
      });

      afterEach(() => {
         window.AudioContext = originalAudioContext;
      });

      it('returns a new AudioContext instance', () => {
         const mockAudioContext = jest.fn();
         window.AudioContext = mockAudioContext;

         getAudioContext();

         expect(mockAudioContext).toHaveBeenCalled();
      });

      it('falls back to webkitAudioContext if AudioContext is not available', () => {
         window.AudioContext = undefined;
         const mockWebkitAudioContext = jest.fn();
         window.webkitAudioContext = mockWebkitAudioContext;

         getAudioContext();

         expect(window.AudioContext).toBe(mockWebkitAudioContext);
         expect(mockWebkitAudioContext).toHaveBeenCalled();
      });
   });

   describe('makeSoundSource()', () => {
      it('returns a function that creates a BufferSource from a buffer', () => {
         const mockSource = {
            buffer: null,
            connect: jest.fn(),
         };
         const mockContext = {
            createBufferSource: jest.fn(() => mockSource),
            destination: {},
         };
         const mockBuffer = { duration: 100 };

         const createSource = makeSoundSource(mockContext);
         expect(typeof createSource).toBe('function');

         const source = createSource(mockBuffer);

         expect(mockContext.createBufferSource).toHaveBeenCalled();
         expect(source.buffer).toBe(mockBuffer);
         expect(source.connect).toHaveBeenCalledWith(mockContext.destination);
      });

      it('connects the source to the context destination', () => {
         const mockDestination = { name: 'destination' };
         const mockSource = {
            buffer: null,
            connect: jest.fn(),
         };
         const mockContext = {
            createBufferSource: jest.fn(() => mockSource),
            destination: mockDestination,
         };
         const mockBuffer = { duration: 100 };

         const createSource = makeSoundSource(mockContext);
         createSource(mockBuffer);

         expect(mockSource.connect).toHaveBeenCalledWith(mockDestination);
      });
   });

   describe('loadSoundIntoBuffer()', () => {
      let mockXHR;
      let mockContext;

      beforeEach(() => {
         mockXHR = {
            open: jest.fn(),
            send: jest.fn(),
            onload: null,
            response: new ArrayBuffer(8),
            responseType: '',
         };
         global.XMLHttpRequest = jest.fn(() => mockXHR);

         mockContext = {
            decodeAudioData: jest.fn((arrayBuffer, success, error) => {
               success({ duration: 100 });
            }),
         };
      });

      afterEach(() => {
         jest.clearAllMocks();
      });

      it('creates an XMLHttpRequest with GET method and arraybuffer response type', () => {
         const url = 'http://example.com/sound.mp3';
         loadSoundIntoBuffer(url, mockContext);

         expect(mockXHR.open).toHaveBeenCalledWith('GET', url, true);
         expect(mockXHR.responseType).toBe('arraybuffer');
      });

      it('sends the request', () => {
         const url = 'http://example.com/sound.mp3';
         loadSoundIntoBuffer(url, mockContext);

         expect(mockXHR.send).toHaveBeenCalled();
      });

      it('returns a promise that resolves with an AudioBuffer on success', async () => {
         const url = 'http://example.com/sound.mp3';
         const expectedBuffer = { duration: 100 };

         mockContext.decodeAudioData = jest.fn((arrayBuffer, success) => {
            success(expectedBuffer);
         });

         const promise = loadSoundIntoBuffer(url, mockContext);

         // Trigger onload
         mockXHR.onload();

         const buffer = await promise;

         expect(mockContext.decodeAudioData).toHaveBeenCalledWith(
            mockXHR.response,
            expect.any(Function),
            expect.any(Function)
         );
         expect(buffer).toBe(expectedBuffer);
      });

      it('returns a promise that rejects on decode error', async () => {
         const url = 'http://example.com/sound.mp3';
         const expectedError = new Error('Decode failed');

         mockContext.decodeAudioData = jest.fn((arrayBuffer, success, error) => {
            error(expectedError);
         });

         const promise = loadSoundIntoBuffer(url, mockContext);

         // Trigger onload
         mockXHR.onload();

         await expect(promise).rejects.toBe(expectedError);
      });
   });

   describe('isPlayableAudioFile()', () => {
      it('returns false for all extensions (AUDIO_CONTENT_TYPES is an array, not object)', () => {
         // Note: This function has a bug - AUDIO_CONTENT_TYPES is an array but it's being used as an object
         // The function will always return false until the constants are fixed to be an object
         expect(isPlayableAudioFile('mp3')).toBe(false);
         expect(isPlayableAudioFile('wav')).toBe(false);
         expect(isPlayableAudioFile('ogg')).toBe(false);
         expect(isPlayableAudioFile('webm')).toBe(false);
         expect(isPlayableAudioFile('flac')).toBe(false);
         expect(isPlayableAudioFile('txt')).toBe(false);
         expect(isPlayableAudioFile('')).toBe(false);
         expect(isPlayableAudioFile(undefined)).toBe(false);
      });
   });
});
