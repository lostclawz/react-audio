import React, { createContext, useRef } from 'react';
import { getAudioContext } from '../utils/web-audio-utils';


export const WebAudioContext = createContext(null);

const WebAudioContextProvider = ({ children }) => {
   const webAudioCtx = useRef(getAudioContext());
   return (
      <WebAudioContext.Provider value={webAudioCtx.current}>
         {children}
      </WebAudioContext.Provider>
   );
};
WebAudioContextProvider.displayName = 'WebAudioContextProvider';

export default WebAudioContextProvider;
