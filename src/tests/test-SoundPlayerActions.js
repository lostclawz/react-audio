import {
   UPDATE_PARAM, updater, removePlayer, REMOVE_PLAYER, updateParam
} from '../SoundPlayerActions';
import { testActionCreator } from '../utils/testing-utils';

describe('SoundPlayerActions', () => {
   describe('updater', () => {
      it('returns a curried function which is first passed id, then dispatch, then a param string, then a value, which finally calls updateParam with the param and valud as an arg to dispatch function', () => {
         const actionType = UPDATE_PARAM;
         const id = 'id';
         const param = 'title';
         const value = 'whatever';

         const dispatch = jest.fn();
         const u = updater(id);
         expect(typeof u).toBe('function');
         const dispatchUpdate = u(dispatch);
         const titleUpdate = dispatchUpdate(param);
         expect(typeof titleUpdate).toBe('function');
         expect(dispatch).not.toHaveBeenCalled();
         titleUpdate(value);
         expect(dispatch).toHaveBeenCalledTimes(1);
         expect(dispatch).toHaveBeenCalledWith({
            type: actionType,
            instanceId: id,
            param,
            value,
         });
      });
   });

   describe('removePlayer()', () => {
      it('returns a REMOVE_PLAYER action object', () => {
         testActionCreator(removePlayer, REMOVE_PLAYER, 'id', 123);
      });
   });
   describe('updateParam(instanceId, param, value)', () => {
      it('returns an UPDATE_PARAM action object', () => {
         testActionCreator(
            updateParam,
            UPDATE_PARAM,
            ['instanceId', 'param', 'value'],
            ['123', 'test', 'testValue'],
         );
      });
   });
});
