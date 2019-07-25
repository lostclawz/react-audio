import React, {
   useCallback, useState, useEffect, useRef
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { loadSoundIntoBuffer } from './utils/web-audio-utils';
import Button from './ui/Button';
import Toggle from './ui/Toggle';
import Slider from './ui/Slider';
import { SoundDuration } from './SoundDuration';


const SoundPlayer = ({
   url,
   id,
   showDuration = true,
   // toggle sound playing when changed
   triggerPlay = false,
   loopStart = 0,
   loopEnd,
   loopOn,
   exposeDuration,
   // controlled aspects
   loop,
   duration,
   playbackRate,
   gain,
   detune,
   update,
   // callbacks
   onEnded,
   audioContext,
}) => {
   const [buffer, setBuffer] = useState(false);
   const [isPlaying, setPlayStatus] = useState(false);
   const [disabled, setDisabled] = useState(false);

   // source is stored in ref so we can stop it later
   const sourceRef = useRef(null);
   const gainRef = useRef(null);

   const updateDuration = update('duration');

   // preload sound into buffer
   useEffect(() => {
      setBuffer(false);
      if (!url) {
         return;
      }
      loadSoundIntoBuffer(url, audioContext)
         .then((b) => {
            setBuffer(b);
            updateDuration(b.duration);
            if (typeof exposeDuration === 'function') {
               exposeDuration(b.duration);
            }
         })
         .catch((e) => {
            console.warn(e);
            setDisabled(true);
         });
   }, [url]);

   const togglePlay = useCallback((forcePlay) => {
      if (!buffer) {
         return;
      }
      if (isPlaying && !forcePlay) {
         sourceRef.current.stop();
      }
      else {
         const src = audioContext.createBufferSource();
         src.buffer = buffer;

         // connect gain node
         const gainNode = audioContext.createGain();

         // source -> gainNode
         src.connect(gainNode);

         // gainNode -> destination
         gainNode.connect(audioContext.destination);

         // set start gain
         gainNode.gain.value = gain;

         // store gain ref to change later
         gainRef.current = gainNode;

         // update UI on end
         src.onended = (e) => {
            setPlayStatus(false);
            if (typeof onEnded === 'function') {
               onEnded(e);
            }
         };

         // set detune
         src.detune.value = detune;


         // set playback rate
         src.playbackRate.value = playbackRate;

         // set loop
         src.loop = loop;
         if (loop && loopStart) {
            src.loopStart = Math.max(0, loopStart);
         }
         if (loop && loopEnd) {
            src.loopEnd = Math.min(loopEnd, duration);
         }

         // begin playback
         src.start(0);
         sourceRef.current = src;
         setPlayStatus(true);
      }
   }, [
      buffer,
      isPlaying,
      loop,
      gain,
      playbackRate,
      loopStart,
      loopEnd,
      duration,
   ]);

   // update sound params in real-time if playing
   useEffect(() => {
      if (sourceRef.current) {
         sourceRef.current.loop = loop;
         sourceRef.current.loopStart = loopStart;
         sourceRef.current.loopEnd = loopEnd;
         sourceRef.current.playbackRate.value = playbackRate;
         sourceRef.current.detune.value = detune;
         gainRef.current.gain.value = gain;
      }
   }, [playbackRate, detune, gain, loopStart, loopEnd, loop]);

   // external play trigger
   useEffect(() => {
      // stop no matter what if playing
      if (isPlaying) {
         sourceRef.current.stop();
      }
      if (triggerPlay === true) {
         togglePlay(true);
      }
   }, [triggerPlay]);

   // stop playing when component unmounts
   useEffect(() => () => {
      if (isPlaying) {
         sourceRef.current.stop();
      }
   }, []);

   return url && (
      <div
         className={classNames(
            'sound-player',
            { disabled }
         )}
         title={disabled ? 'File Not Found' : undefined}
      >
         <Button
            onClick={togglePlay}
            disabled={sourceRef.current === false}
            className={classNames(
               'btn-play',
               { playing: isPlaying },
               { 'loading-file': !buffer }
            )}
         />
         {loopOn === undefined && (
            <Toggle
               className="btn-loop"
               value={loop}
               onChange={update('loop')}
            />
         )}
         <Slider
            id={`speed-${id}`}
            label="speed"
            value={playbackRate}
            onChange={update('playbackRate')}
            min={0.1}
            max={20}
            defaultValue={1}
            step={0.2}
            showValue
         />
         <Slider
            id={`detune-${id}`}
            label="detune"
            value={detune}
            onChange={update('detune')}
            min={-1200}
            max={1200}
            step={0.5}
            defaultValue={0}
            showValue
         />
         <Slider
            id={`gain-${id}`}
            label="gain"
            value={gain}
            title={gain}
            onChange={update('gain')}
            defaultValue={1}
            min={0}
            max={1}
            step={0.25}
         />
         {showDuration && (
            <div className="sound-info">
               {duration && <SoundDuration value={duration} />}
            </div>
         )}
      </div>
   );
};

SoundPlayer.propTypes = {
   // an instance of AudioContext
   audioContext: PropTypes.shape({
      createBufferSource: PropTypes.func,
      createGain: PropTypes.func,
      destination: PropTypes.any,
   }).isRequired,
};

export default SoundPlayer;
