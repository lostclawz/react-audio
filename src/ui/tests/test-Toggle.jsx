import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Toggle from '../Toggle';

describe('<Toggle/>', () => {
   it('renders a button element of type button', () => {
      const el = shallow(<Toggle />);
      expect(
         el.find('button')
      ).to.have.lengthOf(1);
   });

   it('fires onChange callback with opposite of last value when clicked', () => {
      // stub to toggle back and forth
      const onChange = sinon.stub();
      onChange
         .withArgs(true).returns(false)
         .withArgs(false).returns(true);

      const el = shallow(
         <Toggle
            value={false}
            onChange={onChange}
         />
      );
      el.find('button').simulate('click');
      expect(onChange.lastCall.args[0]).to.equal(true);
      el.setProps({ value: true });
      el.find('button').simulate('click');
      expect(onChange.lastCall.args[0]).to.equal(false);
      expect(onChange.calledTwice).to.equal(true);
      onChange.reset();
   });

   it('renders a button with an active class if value is true', () => {
      const el = shallow(<Toggle value />);
      expect(
         el.find('button').hasClass('active')
      ).to.equal(true);
   });

   it('passes extra props to button element', () => {
      const el = shallow(<Toggle data-id="something" />);
      expect(
         el.find('button').prop('data-id')
      ).to.equal('something');
   });
});
