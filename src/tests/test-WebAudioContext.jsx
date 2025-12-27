import React, { useContext } from 'react';
import { render, screen } from '@testing-library/react';
import WebAudioContextProvider, { WebAudioContext } from '../context/WebAudioContext';
import * as audioUtils from '../utils/web-audio-utils';

describe('<WebAudioContextProvider />', () => {
   let mockAudioContext;
   let getAudioContextSpy;

   beforeEach(() => {
      mockAudioContext = {
         createBufferSource: jest.fn(),
         createGain: jest.fn(),
         destination: {},
         state: 'running',
      };
      getAudioContextSpy = jest.spyOn(audioUtils, 'getAudioContext');
      getAudioContextSpy.mockReturnValue(mockAudioContext);
   });

   afterEach(() => {
      getAudioContextSpy.mockRestore();
      jest.clearAllMocks();
   });

   it('renders children', () => {
      render(
         <WebAudioContextProvider>
            <div data-testid="child">Test Child</div>
         </WebAudioContextProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Test Child')).toBeInTheDocument();
   });

   it('creates an AudioContext on mount', () => {
      render(
         <WebAudioContextProvider>
            <div>Test</div>
         </WebAudioContextProvider>
      );

      expect(getAudioContextSpy).toHaveBeenCalledTimes(1);
   });

   it('provides AudioContext via context to children', () => {
      const TestConsumer = () => {
         const audioContext = useContext(WebAudioContext);
         return (
            <div data-testid="context-value">
               {audioContext ? 'context-provided' : 'no-context'}
            </div>
         );
      };

      render(
         <WebAudioContextProvider>
            <TestConsumer />
         </WebAudioContextProvider>
      );

      expect(screen.getByTestId('context-value')).toHaveTextContent('context-provided');
   });

   it('provides the same AudioContext instance to all children', () => {
      const contexts = [];
      const TestConsumer = ({ index }) => {
         const audioContext = useContext(WebAudioContext);
         contexts[index] = audioContext;
         return <div data-testid={`consumer-${index}`}>Consumer {index}</div>;
      };

      render(
         <WebAudioContextProvider>
            <TestConsumer index={0} />
            <TestConsumer index={1} />
            <TestConsumer index={2} />
         </WebAudioContextProvider>
      );

      expect(contexts[0]).toBe(contexts[1]);
      expect(contexts[1]).toBe(contexts[2]);
      expect(getAudioContextSpy).toHaveBeenCalledTimes(1);
   });

   it('reuses the same AudioContext on re-renders of children', () => {
      const contexts = [];
      const TestConsumer = ({ count }) => {
         const audioContext = useContext(WebAudioContext);
         if (!contexts.includes(audioContext)) {
            contexts.push(audioContext);
         }
         return <div>Count: {count}, Context: {audioContext?.state || 'no-context'}</div>;
      };

      const { rerender } = render(
         <WebAudioContextProvider>
            <TestConsumer count={1} />
         </WebAudioContextProvider>
      );

      // Re-render with different child props (but same provider instance)
      rerender(
         <WebAudioContextProvider>
            <TestConsumer count={2} />
         </WebAudioContextProvider>
      );

      // All renders should receive the same context instance
      expect(contexts.length).toBe(1);
   });

   it('has displayName set to WebAudioContextProvider', () => {
      expect(WebAudioContextProvider.displayName).toBe('WebAudioContextProvider');
   });

   it('provides the actual mock AudioContext with expected methods', () => {
      const TestConsumer = () => {
         const audioContext = useContext(WebAudioContext);
         return (
            <div>
               <span data-testid="has-create-buffer">
                  {typeof audioContext?.createBufferSource === 'function' ? 'yes' : 'no'}
               </span>
               <span data-testid="has-create-gain">
                  {typeof audioContext?.createGain === 'function' ? 'yes' : 'no'}
               </span>
               <span data-testid="has-destination">
                  {audioContext?.destination ? 'yes' : 'no'}
               </span>
            </div>
         );
      };

      render(
         <WebAudioContextProvider>
            <TestConsumer />
         </WebAudioContextProvider>
      );

      expect(screen.getByTestId('has-create-buffer')).toHaveTextContent('yes');
      expect(screen.getByTestId('has-create-gain')).toHaveTextContent('yes');
      expect(screen.getByTestId('has-destination')).toHaveTextContent('yes');
   });
});
