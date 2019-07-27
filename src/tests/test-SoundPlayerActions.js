import { expect } from 'chai';
import sinon from 'sinon';
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

         const dispatch = sinon.fake();
         const u = updater(id);
         expect(u).to.be.a('function');
         const dispatchUpdate = u(dispatch);
         const titleUpdate = dispatchUpdate(param);
         expect(titleUpdate).to.be.a('function');
         expect(dispatch.notCalled).to.be.true;
         titleUpdate(value);
         expect(dispatch.calledOnce).to.be.true;
         expect(dispatch.calledWith({
            type: actionType,
            instanceId: id,
            param,
            value,
         })).to.be.true;
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
