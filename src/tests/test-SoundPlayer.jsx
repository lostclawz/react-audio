import React from 'react';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { mount } from 'enzyme';
import sinon from 'sinon';
import * as audioUtils from '../utils/web-audio-utils';
import SoundPlayer from '../SoundPlayer';

chai.use(chaiAsPromised);
const { expect } = chai;

const mockAudioContext = () => ({
   createBufferSource: sinon.fake(),
   createGain: sinon.fake(),
   destination: {},
});

const restoreContext = (ctx) => {
   Object.values(ctx)
      .forEach((v) => {
         if (typeof v.restore === 'function') {
            v.restore();
         }
      });
   return ctx;
};

describe('<SoundPlayer/>', () => {
   // stubbed functions
   let loadSoundIntoBuffer;
   let updateCallback;
   let mockContext;

   const goodUrl = '/localhost:8080/whatever.mp3';
   const badUrl = '/localhost:8080/whatever2.mp3';

   let wrapper;
   const testBuffer = {
      duration: 1000,
   };

   beforeEach(() => {
      mockContext = mockAudioContext();
      loadSoundIntoBuffer = sinon.stub(audioUtils, 'loadSoundIntoBuffer');
      loadSoundIntoBuffer.withArgs(goodUrl, mockContext).resolves(testBuffer);
      loadSoundIntoBuffer.withArgs(badUrl, mockContext).rejects(new Error('Bad URL'));

      // const objKey = 'playlist';
      updateCallback = () => sinon.fake();

      wrapper = mount(
         <SoundPlayer
            url={goodUrl}
            update={updateCallback}
            audioContext={mockContext}
         />
      );
   });
   afterEach(() => {
      loadSoundIntoBuffer.restore();
      restoreContext(mockContext);
   });
   it('renders', () => {
      expect(wrapper.exists()).to.be.true;
   });
   it('calls loadSoundIntoBuffer with the URL and audioContext on mount', () => {
      expect(loadSoundIntoBuffer.calledOnce).to.be.true;
   });
   it('adds a disabled class to div wrapper if url won\'t load');
   // , (done) => {
   //    wrapper.setProps({ url: badUrl });
   //    const promise = loadSoundIntoBuffer.lastCall.returnValue;
   //    expect(promise instanceof Promise).to.be.true;
   //    promise.should.be.rejected.and.notify(done);
   // });
});
