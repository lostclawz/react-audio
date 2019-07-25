import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import Slider from '../Slider';


describe('<Slider />', () => {
   let wrapper;
   const testProps = {
      min: 0,
      max: 100,
      step: 5,
      value: 5,
      numTicks: 10,
      showValue: true,
      label: 'test',
   };
   beforeEach(() => {
      wrapper = shallow(<Slider {...testProps} />);
   });
   it('renders something', () => {
      expect(wrapper.exists()).to.be.true;
   });
   it('renders a wrapper div with the class .slider', () => {
      expect(wrapper.find('.slider')).to.have.lengthOf(1);
   });
   it('renders an input element of type range', () => {
      expect(
         wrapper.find('input[type="range"]')
      ).to.have.lengthOf(1);
   });
   it('sets the input element\'s min, max, and step attributes to props passed in', () => {
      const inputEl = wrapper.find('input[type="range"]');
      const checkProps = ['min', 'max', 'step'];
      checkProps.forEach((p) => {
         expect(inputEl.prop(p)).to.equal(testProps[p]);
      });
   });
   it('renders .ticks with numTicks children .tick elements if numTicks is passed', () => {
      expect(
         wrapper.find('.ticks')
      ).to.have.lengthOf(1);
      expect(
         wrapper.find('.tick')
      ).to.have.lengthOf(testProps.numTicks);
      wrapper.setProps({ numTicks: 0 });
      expect(wrapper.find('.ticks')).to.have.lengthOf(0);
      expect(wrapper.find('.ticks')).to.have.lengthOf(0);
   });
   it('renders a .slider-label element only is the label prop is passed', () => {
      const label = wrapper.find('.slider-label');
      expect(label).to.have.lengthOf(1);
      expect(label.text()).to.equal(testProps.label);
      wrapper.setProps({ label: '' });
      expect(wrapper.find('.slider-label')).to.have.lengthOf(0);
   });
   it('renders a .slider-value span element if showValue is given', () => {
      expect(wrapper.find('.slider-value')).to.have.lengthOf(1);
      expect(wrapper.find('.slider-value').text()).to.equal(testProps.value.toString());
   });
   it('appends valueUnits next to the value if given', () => {
      wrapper.setProps({ valueUnits: 'px' });
      expect(wrapper.find('.slider-value').text()).to.equal(`${testProps.value} px`);
   });
   it('fires the onChange function prop when the input is changed, with the new value as the only arg', () => {
      const onChange = sinon.fake();
      wrapper = shallow(
         <Slider
            {...testProps}
            onChange={onChange}
         />
      );
      const fakeEvent = { target: { value: 200 } };
      wrapper.find('input').simulate('change', fakeEvent);
      expect(onChange.callCount).to.equal(1);
      expect(onChange.calledWith(fakeEvent.target.value));
   });
   it('passes inputProps to input element if given', () => {
      const style = { backgroundColor: 'blue' };
      wrapper.setProps({ style });
      expect(wrapper.find('.slider').prop('style')).to.deep.equal(style);
   });
   it('passes any additional props to the wrapper .slider element', () => {
      wrapper.setProps({ 'data-test': true });
      expect(wrapper.find('.slider').prop('data-test')).to.equal(true);
   });
   it('resets value to defaultValue prop on doubleclick if it exists', () => {
      const onChange = sinon.fake();
      wrapper = shallow(
         <Slider
            {...testProps}
            value={0.5}
            defaultValue={0.25}
            onChange={onChange}
         />
      );
      const inputEl = wrapper.find('input');
      inputEl.simulate('doubleclick');
      expect(onChange.calledOnce).to.equal(true);
      expect(onChange.calledWith(0.25)).to.be.true;
   });
   it('allows defaultValue to be zero', () => {
      const onChange = sinon.fake();
      wrapper = shallow(
         <Slider
            {...testProps}
            value={300}
            min={-1200}
            max={1200}
            defaultValue={0}
            onChange={onChange}
         />
      );
      const inputEl = wrapper.find('input');
      inputEl.simulate('doubleclick');
      expect(onChange.calledOnce).to.equal(true);
      expect(onChange.calledWith(0)).to.be.true;
   });
   it("resets value to min on doubleclick if defaultValue prop doesn't exist", () => {
      const onChange = sinon.fake();
      wrapper = shallow(
         <Slider
            {...testProps}
            value={0.5}
            onChange={onChange}
         />
      );
      const inputEl = wrapper.find('input');
      inputEl.simulate('doubleclick');
      expect(onChange.calledOnce).to.equal(true);
      expect(onChange.calledWith(testProps.min)).to.be.true;
   });
});
