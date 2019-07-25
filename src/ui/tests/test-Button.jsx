import React from 'react';
import { expect } from 'chai';
import {
   render, getByTestId, fireEvent, cleanup
} from '@testing-library/react';
import sinon from 'sinon';
import Button from '../Button';

describe('<Button/>', () => {
   const renderButton = (props) => {
      const { container } = render(
         <Button
            data-testid="button"
            {...props}
         />
      );
      return getByTestId(container, 'button');
   };

   afterEach(cleanup);

   it('renders a button element of type button', () => {
      const b = renderButton();
      expect(b.constructor.name).to.equal('HTMLButtonElement');
   });

   it('contains a class .selected if props.selected = true', () => {
      const b = renderButton({ selected: true });
      expect(b.classList.contains('selected')).to.equal(true);
   });

   it('passes className prop to button class', () => {
      const b = renderButton({ className: 'btn-test' });
      expect(b.classList.contains('btn-test')).to.equal(true);
   });

   it('renders children to button children', () => {
      const b = renderButton({ children: 'test' });
      expect(b.textContent).to.equal('test');
   });

   it('passes any extra props to element', () => {
      const b = renderButton({ 'data-whatever': 'yes' });
      expect(b.getAttribute('data-whatever')).to.equal('yes');
   });

   it('fires onClick callback with props.passback (if present) when button is clicked', () => {
      const onClick = sinon.fake();
      const b = renderButton({ onClick, passback: 'works' });
      fireEvent.click(b);
      expect(onClick.calledWith('works')).to.equal(true);
   });
});
