import { expect } from 'chai';


/**
 * Runs a basic test on a simple action creator, whether the action has
 * the correct action type and whether the data is sent with it.
 *
 * @param {function} actionCreator - the actual action creator function
 * @param {*} actionType - action constant
 * @param {*} actionKey - key in action object where data is
 * @param {*} actionVal - the action data
 */
export function testActionCreator(
   actionCreator,
   actionType,
   actionKey,
   actionVal,
) {
   const action = Array.isArray(actionKey)
      ? actionCreator(...actionVal)
      : actionCreator(actionVal);

   // check action type
   expect(action).to.have.property('type', actionType);

   // check other properties
   if (Array.isArray(actionKey)) {
      actionKey.forEach((k, idx) => {
         expect(action).to.have.property(k, actionVal[idx]);
      });
   }
   else if (actionKey) {
      expect(action).to.have.property(actionKey, actionVal);
   }
}

export function basicActionTest(
   actionFunc,
   actionType,
   actionObj
) {
   describe(`${actionFunc.name}(${
      actionObj ? Object.keys(actionObj).join(', ') : ''
   })`, () => {
      it(`generates an action ${actionType}${actionObj ? ` with properties ${
         Object.keys(actionObj).join(', ')}` : ''
      }`, () => {
         testActionCreator(
            actionFunc,
            actionType,
            actionObj ? Object.keys(actionObj) : null,
            actionObj ? Object.values(actionObj) : null,
         );
      });
   });
   it(`includes a ${actionType} action type constant`, () => {
      expect(actionType).to.be.a('string');
      expect(actionType).to.not.equal('');
   });
}
