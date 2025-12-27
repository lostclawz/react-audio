import React from 'react';
import {
   render, screen
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('<Button/>', () => {
   const renderButton = (props) => {
      render(
         <Button
            data-testid="button"
            {...props}
         />
      );
      return screen.getByTestId('button');
   };

   it('renders a button element of type button', () => {
      const b = renderButton();
      expect(b).toBeInstanceOf(HTMLButtonElement);
   });

   it('contains a class .selected if props.selected = true', () => {
      const b = renderButton({ selected: true });
      expect(b).toHaveClass('selected');
   });

   it('passes className prop to button class', () => {
      const b = renderButton({ className: 'btn-test' });
      expect(b).toHaveClass('btn-test');
   });

   it('renders children to button children', () => {
      const b = renderButton({ children: 'test' });
      expect(b.textContent).toBe('test');
   });

   it('passes any extra props to element', () => {
      const b = renderButton({ 'data-whatever': 'yes' });
      expect(b.getAttribute('data-whatever')).toBe('yes');
   });

   it('fires onClick callback with props.passback (if present) when button is clicked', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      const b = renderButton({ onClick, passback: 'works' });
      await user.click(b);
      expect(onClick).toHaveBeenCalledWith('works');
   });
});
