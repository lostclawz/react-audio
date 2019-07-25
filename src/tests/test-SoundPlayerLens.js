
import { expect } from 'chai';
import {
   initState, defaultToInit, soundPlayerSelector, removeById
} from '../SoundPlayerLens';


describe('soundPlayerSelector', () => {
   it('returns initState if id not found', () => {
      expect(
         soundPlayerSelector('test')({})
      ).to.deep.equal(initState);
   });
   it('returns the state object for the ID if it is found', () => {
      const testState = { ...initState, loop: true };
      expect(
         soundPlayerSelector('test')({
            soundPlayer: {
               test: testState,
            },
         })
      ).to.deep.equal(testState);
   });
});

describe('defaultToInit()', () => {
   it('if argument is empty, returns initState', () => {
      expect(
         defaultToInit(null)
      ).to.deep.equal(initState);
   });
});

describe('removeById(id)(state)', () => {
   it('removes the id property from state object', () => {
      const id = 'id';
      const state = {
         id: 'something',
      };
      expect(state).to.have.property(id);
      const omitId = removeById(id);
      expect(omitId(state)).to.not.have.property(id);
   });
});
