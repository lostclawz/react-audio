import React, { useContext } from 'react';
// import { paramReducer, initState } from './SoundPlayerReducers';
// import { initState } from './SoundPlayerLens';
import { updater } from './SoundPlayerActions';
import SoundPlayer from './SoundPlayer';
import { soundPlayerSelector } from './SoundPlayerLens';
import { StateContext, DispatchContext } from '~/context/Store';
import useID from './hooks/useID';
import { WebAudioContext } from './context/WebAudioContext';


export const SoundPlayerContainer = ({ loopOn, ...props }) => {
   // state internally managed
   // const [state, dispatch] = useReducer(paramReducer, initState);
   // const { loop } = state;

   // global redux state
   const state = useContext(StateContext);
   const dispatch = useContext(DispatchContext);
   const audioContext = useContext(WebAudioContext);

   // id of component instance
   const id = useID();

   // generic param updater
   const update = updater(id)(dispatch);

   // instance-specific
   const selector = soundPlayerSelector(id);
   const soundPlayerState = selector(state);

   // remove player from state on unmount
   // useEffect(() => () => {
   //    dispatch(removePlayer(id));
   // }, []);

   return (
      <SoundPlayer
         {...props}
         {...soundPlayerState}
         // loopOn prop overrides internal state
         loop={loopOn || soundPlayerState.loop}
         update={update}
         audioContext={audioContext}
      />
   );
};
