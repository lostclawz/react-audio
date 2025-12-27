import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toggle from '../Toggle';

describe('<Toggle/>', () => {
   it('renders a button element of type button', () => {
      render(<Toggle />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button.type).toBe('button');
   });

   it('fires onChange callback with opposite of last value when clicked', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();

      const { rerender } = render(
         <Toggle
            value={false}
            onChange={onChange}
         />
      );

      const button = screen.getByRole('button');
      await user.click(button);
      expect(onChange).toHaveBeenCalledWith(true);

      rerender(
         <Toggle
            value={true}
            onChange={onChange}
         />
      );

      await user.click(button);
      expect(onChange).toHaveBeenCalledWith(false);
      expect(onChange).toHaveBeenCalledTimes(2);
   });

   it('renders a button with an active class if value is true', () => {
      render(<Toggle value />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('active');
   });

   it('passes extra props to button element', () => {
      render(<Toggle data-id="something" />);
      const button = screen.getByRole('button');
      expect(button.getAttribute('data-id')).toBe('something');
   });
});
