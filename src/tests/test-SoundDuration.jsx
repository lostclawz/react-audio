import React from 'react';
import { render, screen } from '@testing-library/react';
import { SoundDuration } from '../SoundDuration';

describe('SoundDuration', () => {
   const testValue = 1.2345678;

   it('renders a div wrapper element', () => {
      const { container } = render(<SoundDuration value={testValue} />);
      expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
   });

   it('renders a span with the text "Duration:"', () => {
      render(<SoundDuration value={testValue} />);
      expect(screen.getByText('Duration:', { exact: false })).toBeInTheDocument();
   });

   it('renders a second span with the value prop (seconds) in ms with two decimal places', () => {
      render(<SoundDuration value={testValue} />);
      expect(screen.getByText('1234.57ms')).toBeInTheDocument();
   });

   it('updates output when props change', () => {
      const { rerender } = render(<SoundDuration value={testValue} />);
      expect(screen.getByText('1234.57ms')).toBeInTheDocument();
      rerender(<SoundDuration value={7.654321} />);
      expect(screen.getByText('7654.32ms')).toBeInTheDocument();
   });
});
