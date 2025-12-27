import {
   initState, defaultToInit, soundPlayerSelector, removeById
} from '../SoundPlayerLens';


describe('soundPlayerSelector', () => {
   it('returns initState if id not found', () => {
      expect(
         soundPlayerSelector('test')({})
      ).toEqual(initState);
   });
   it('returns the state object for the ID if it is found', () => {
      const testState = { ...initState, loop: true };
      expect(
         soundPlayerSelector('test')({
            soundPlayer: {
               test: testState,
            },
         })
      ).toEqual(testState);
   });
});

describe('defaultToInit()', () => {
   it('if argument is empty, returns initState', () => {
      expect(
         defaultToInit(null)
      ).toEqual(initState);
   });
});

describe('removeById(id)(state)', () => {
   it('removes the id property from state object', () => {
      const id = 'id';
      const state = {
         id: 'something',
      };
      expect(state).toHaveProperty(id);
      const omitId = removeById(id);
      expect(omitId(state)).not.toHaveProperty(id);
   });
});
