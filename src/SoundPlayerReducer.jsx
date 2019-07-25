import { UPDATE_PARAM, REMOVE_PLAYER } from './SoundPlayerActions';
import { soundPlayerUpdater, removeById } from './SoundPlayerLens';
import { funcReducer } from './utils/redux-utils';

const soundPlayerReducer = funcReducer({
   [UPDATE_PARAM]: ({ instanceId, param, value }) => (
      soundPlayerUpdater(instanceId, param, value)
   ),
   [REMOVE_PLAYER]: ({ id }) => removeById(id),
});
export default soundPlayerReducer;
