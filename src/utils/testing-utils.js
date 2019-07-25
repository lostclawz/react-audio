import { expect } from 'chai';


/**
 * Return a list of duplicates in an array
 * @param {array} arr - array to test
 */
export function getDuplicates(arr) {
   const x = [];
   const dupes = [];
   arr.forEach((a) => {
      if (x.includes(a) && !dupes.includes(a)) {
         dupes.push(a);
      }
      x.push(a);
   });
   return dupes;
}

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

/**
 * A simple mock DOM Image object for testing purposes.
 * Immediately calls the onload callback once src is set.
 */

const MOCK_WIDTH = 200;
const MOCK_HEIGHT = 200;

function ImageMock() {
   this.onload = undefined;
   this.imageSrc = '';
   this.complete = false;
   this.width = 0;
   this.height = 0;
   this.alt = '';
   this.isMap = false;
   this.crossOrigin = false;
   this.listeners = {};
}

Object.defineProperty(ImageMock.prototype, 'addEventListener', {
   value(type, func) {
      this.listeners[type] = func;
   }
})

Object.defineProperty(ImageMock.prototype, 'src', {
   get() {
      return this.imageSrc;
   },
   set(src) {
      this.imageSrc = src;
      this.naturalWidth = MOCK_WIDTH;
      this.naturalHeight = MOCK_HEIGHT;
      this.width = MOCK_WIDTH;
      this.height = MOCK_HEIGHT;
      this.complete = true;
      if (src.endsWith('?bad') && typeof this.listeners.error === 'function') {
         this.listeners.error.call(this);
      }
      else if (typeof this.listeners.load === 'function') {
         this.listeners.load.call(this);
      }
      else if (typeof this.onload === 'function') {
         this.onload.call(this);
      }
   },
});

export { ImageMock };
