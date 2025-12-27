import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SoundLoader from '../SoundLoader';

describe('<SoundLoader />', () => {
   let mockCreateObjectURL;
   let mockRevokeObjectURL;

   beforeEach(() => {
      mockCreateObjectURL = jest.fn((file) => `blob:${file.name}`);
      mockRevokeObjectURL = jest.fn();
      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;
   });

   afterEach(() => {
      jest.clearAllMocks();
   });

   it('renders a file input element', () => {
      const { container } = render(<SoundLoader />);
      const input = container.querySelector('input[type="file"]');
      expect(input).toBeInTheDocument();
      expect(input.type).toBe('file');
   });

   it('sets accept attribute to audio/*', () => {
      const { container } = render(<SoundLoader />);
      const input = container.querySelector('input[type="file"]');
      expect(input.accept).toBe('audio/*');
   });

   it('does not render audio element initially', () => {
      const { container } = render(<SoundLoader />);
      const audio = container.querySelector('audio');
      expect(audio).not.toBeInTheDocument();
   });

   it('creates object URL when file is selected', async () => {
      const user = userEvent.setup();
      const { container } = render(<SoundLoader />);
      const input = container.querySelector('input[type="file"]');

      const file = new File(['audio content'], 'test.mp3', { type: 'audio/mp3' });

      await user.upload(input, file);

      expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
   });

   it('renders audio element with src after file is selected', async () => {
      const user = userEvent.setup();
      const { container } = render(<SoundLoader />);
      const input = container.querySelector('input[type="file"]');

      const file = new File(['audio content'], 'test.mp3', { type: 'audio/mp3' });

      await user.upload(input, file);

      const audio = container.querySelector('audio');
      expect(audio).toBeInTheDocument();
      expect(audio.src).toContain('blob:test.mp3');
   });

   it('renders audio element with controls attribute', async () => {
      const user = userEvent.setup();
      const { container } = render(<SoundLoader />);
      const input = container.querySelector('input[type="file"]');

      const file = new File(['audio content'], 'test.mp3', { type: 'audio/mp3' });

      await user.upload(input, file);

      const audio = container.querySelector('audio');
      expect(audio).toHaveAttribute('controls');
   });

   it('updates audio src when different file is selected', async () => {
      const user = userEvent.setup();
      const { container } = render(<SoundLoader />);
      const input = container.querySelector('input[type="file"]');

      const file1 = new File(['audio content 1'], 'test1.mp3', { type: 'audio/mp3' });
      await user.upload(input, file1);

      let audio = container.querySelector('audio');
      expect(audio.src).toContain('blob:test1.mp3');

      const file2 = new File(['audio content 2'], 'test2.wav', { type: 'audio/wav' });
      await user.upload(input, file2);

      audio = container.querySelector('audio');
      expect(audio.src).toContain('blob:test2.wav');
      expect(mockCreateObjectURL).toHaveBeenCalledTimes(2);
   });
});
