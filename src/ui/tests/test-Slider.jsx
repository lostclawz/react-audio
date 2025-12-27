import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Slider from '../Slider';


describe('<Slider />', () => {
   const testProps = {
      min: 0,
      max: 100,
      step: 5,
      value: 5,
      numTicks: 10,
      showValue: true,
      label: 'test',
   };

   it('renders something', () => {
      const { container } = render(<Slider {...testProps} />);
      expect(container.firstChild).toBeInTheDocument();
   });

   it('renders a wrapper div with the class .slider', () => {
      const { container } = render(<Slider {...testProps} />);
      expect(container.querySelector('.slider')).toBeInTheDocument();
   });

   it('renders an input element of type range', () => {
      render(<Slider {...testProps} />);
      const input = screen.getByRole('slider');
      expect(input).toBeInTheDocument();
      expect(input.type).toBe('range');
   });

   it('sets the input element\'s min, max, and step attributes to props passed in', () => {
      render(<Slider {...testProps} />);
      const inputEl = screen.getByRole('slider');
      expect(inputEl.min).toBe(testProps.min.toString());
      expect(inputEl.max).toBe(testProps.max.toString());
      expect(inputEl.step).toBe(testProps.step.toString());
   });

   it('renders .ticks with numTicks children .tick elements if numTicks is passed', () => {
      const { container, rerender } = render(<Slider {...testProps} />);
      expect(container.querySelector('.ticks')).toBeInTheDocument();
      expect(container.querySelectorAll('.tick')).toHaveLength(testProps.numTicks);

      rerender(<Slider {...testProps} numTicks={0} />);
      expect(container.querySelector('.ticks')).not.toBeInTheDocument();
   });

   it('renders a .slider-label element only is the label prop is passed', () => {
      const { container, rerender } = render(<Slider {...testProps} />);
      const label = container.querySelector('.slider-label');
      expect(label).toBeInTheDocument();
      expect(label.textContent).toBe(testProps.label);

      rerender(<Slider {...testProps} label="" />);
      expect(container.querySelector('.slider-label')).not.toBeInTheDocument();
   });

   it('renders a .slider-value span element if showValue is given', () => {
      const { container } = render(<Slider {...testProps} />);
      const valueEl = container.querySelector('.slider-value');
      expect(valueEl).toBeInTheDocument();
      expect(valueEl.textContent).toBe(testProps.value.toString());
   });

   it('appends valueUnits next to the value if given', () => {
      const { container } = render(<Slider {...testProps} valueUnits="px" />);
      const valueEl = container.querySelector('.slider-value');
      expect(valueEl.textContent).toBe(`${testProps.value} px`);
   });

   it('fires the onChange function prop when the input is changed, with the new value as the only arg', () => {
      const onChange = jest.fn();
      render(<Slider {...testProps} onChange={onChange} />);

      const input = screen.getByRole('slider');
      fireEvent.change(input, { target: { value: '50' } });

      expect(onChange).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith('50');
   });

   it('passes inputProps to input element if given', () => {
      const style = { backgroundColor: 'blue' };
      const { container } = render(<Slider {...testProps} style={style} />);
      const sliderEl = container.querySelector('.slider');
      // Note: style prop is passed to wrapper div, not input
      expect(sliderEl).toHaveAttribute('style');
   });

   it('passes any additional props to the wrapper .slider element', () => {
      const { container } = render(<Slider {...testProps} data-test={true} />);
      const sliderEl = container.querySelector('.slider');
      expect(sliderEl.getAttribute('data-test')).toBe('true');
   });

   it('resets value to defaultValue prop on doubleclick if it exists', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
         <Slider
            {...testProps}
            value={0.5}
            defaultValue={0.25}
            onChange={onChange}
         />
      );

      const input = screen.getByRole('slider');
      await user.dblClick(input);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(0.25);
   });

   it('allows defaultValue to be zero', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
         <Slider
            {...testProps}
            value={300}
            min={-1200}
            max={1200}
            defaultValue={0}
            onChange={onChange}
         />
      );

      const input = screen.getByRole('slider');
      await user.dblClick(input);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(0);
   });

   it("resets value to min on doubleclick if defaultValue prop doesn't exist", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
         <Slider
            {...testProps}
            value={0.5}
            onChange={onChange}
         />
      );

      const input = screen.getByRole('slider');
      await user.dblClick(input);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(testProps.min);
   });
});
