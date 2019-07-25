import { AUDIO_CONTENT_TYPES } from '~/constants';

/**
 * Connects a buffer to an audio context
 * and returns the buffer
 * @param {AudioContext} ctx
 */
export const makeSoundSource = ctx => (buffer) => {
   const source = ctx.createBufferSource();
   source.buffer = buffer;
   source.connect(ctx.destination);
   return source;
};

/**
 * Return an AudioContext
 */
export const getAudioContext = () => {
   window.AudioContext = window.AudioContext || window.webkitAudioContext;
   return new AudioContext();
};

/**
 * Loads a sound file with a XMLHttpRequest and
 * returns an AudioBuffer
 * @param {string} url
 * @param {AudioContext} ctx
 */
export const loadSoundIntoBuffer = (url, ctx) => (
   new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.open('GET', url, true);
      req.responseType = 'arraybuffer';
      req.onload = () => {
         ctx.decodeAudioData(req.response, (buffer) => {
            resolve(buffer);
         }, (err) => {
            reject(err);
         });
      };
      req.send();
   })
);

export const isPlayableAudioFile = ext => AUDIO_CONTENT_TYPES[`.${ext}`] !== undefined;
