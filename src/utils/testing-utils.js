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
   expect(action).toHaveProperty('type', actionType);

   // check other properties
   if (Array.isArray(actionKey)) {
      actionKey.forEach((k, idx) => {
         expect(action).toHaveProperty(k, actionVal[idx]);
      });
   }
   else if (actionKey) {
      expect(action).toHaveProperty(actionKey, actionVal);
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
      expect(typeof actionType).toBe('string');
      expect(actionType).not.toBe('');
   });
}
