import React, {
   useCallback, useState, useContext
} from 'react';
import SoundPlayer from './SoundPlayer';
import useID from './hooks/useID';
import { WebAudioContext } from './context/WebAudioContext';
import { updater } from './SoundPlayerActions';
import { DispatchContext } from './context/Store';

const SoundPlayerLoader = () => {
   const id = useID();
   const [url, setFileUrl] = useState(null);
   const audioContext = useContext(WebAudioContext);
   const dispatch = useContext(DispatchContext);
   const update = updater(id)(dispatch);
   const onChangeFile = useCallback((e) => {
      const { files } = e.target;
      setFileUrl(
         URL.createObjectURL(files[0])
      );
   }, []);
   return (
      <>
         {!url && (
            <input
               type="file"
               accept="audio/*"
               onChange={onChangeFile}
            />
         )}
         {url && (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <SoundPlayer
               url={url}
               id={id}
               audioContext={audioContext}
               update={update}
            />
         )}
      </>
   );
};
export default SoundPlayerLoader;
