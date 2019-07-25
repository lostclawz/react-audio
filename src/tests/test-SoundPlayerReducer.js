
import { expect } from 'chai';
import { updateParam, removePlayer } from '../SoundPlayerActions';
import soundPlayerReducer from '../SoundPlayerReducer';
import { initState } from '../SoundPlayerLens';

describe('soundPlayerReducer', () => {
   it('merges initState with update if empty', () => {
      const id = 'test';
      const currentState = {};
      const action = updateParam(id, 'loop', true);
      expect(
         soundPlayerReducer(currentState, action)
      ).to.deep.equal({
         [id]: {
            ...initState,
            loop: true,
         },
      });
   });
   it('handles UPDATE_PARAM action', () => {
      const id = 'test';
      const action = updateParam(id, 'loop', true);
      let next = soundPlayerReducer({}, action);
      expect(next[id].loop).to.equal(true);
      const nextAction = updateParam(id, { loop: false });
      next = soundPlayerReducer(next, nextAction);
      expect(next[id].loop).to.equal(false);
   });
   it('handles REMOVE_PLAYER action', () => {
      const id = 'test';
      const action = removePlayer(id);
      const next = soundPlayerReducer({ [id]: 'something' }, action);
      expect(next[id]).to.be.undefined;
   });
});
