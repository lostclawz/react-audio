import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { SoundDuration } from '../SoundDuration';

export const firstChildIsOfType = (wrapper, elementType = 'div') => {
   expect(
      wrapper.first().type()
   ).to.equal(elementType);
};

describe('SoundDuration', () => {
   let wrapper;
   const testValue = 1.2345678;
   beforeEach(() => {
      wrapper = shallow(
         <SoundDuration value={testValue} />
      );
   });
   it('renders a div wrapper element', () => {
      firstChildIsOfType(wrapper, 'div');
   });
   it('renders a span with the text "Duration:"', () => {
      expect(wrapper.find('span').first().text()).to.equal('Duration: ');
   });
   it('renders a second span with the value prop (seconds) in ms with two decimal places', () => {
      expect(wrapper.find('span').last().text()).to.equal('1234.57ms');
   });
   it('updates output when props change', () => {
      expect(wrapper.find('span').last().text()).to.equal('1234.57ms');
      wrapper.setProps({ value: 7.654321 });
      expect(wrapper.find('span').last().text()).to.equal('7654.32ms');
   });
});
