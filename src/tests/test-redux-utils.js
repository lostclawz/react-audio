import { funcReducer } from '../utils/redux-utils';

describe('redux-utils', () => {
   describe('funcReducer()', () => {
      it('returns a reducer function', () => {
         const handlers = {};
         const reducer = funcReducer(handlers);
         expect(typeof reducer).toBe('function');
      });

      it('calls the appropriate handler for a given action type', () => {
         const mockHandler = jest.fn(() => (state) => ({ ...state, called: true }));
         const handlers = {
            TEST_ACTION: mockHandler,
         };
         const reducer = funcReducer(handlers);
         const action = { type: 'TEST_ACTION', value: 'test' };
         const state = { initial: true };

         const newState = reducer(state, action);

         expect(mockHandler).toHaveBeenCalledWith(action);
         expect(newState.called).toBe(true);
      });

      it('returns the current state if no handler exists for the action type', () => {
         const handlers = {
            TEST_ACTION: jest.fn(() => (state) => ({ ...state, called: true })),
         };
         const reducer = funcReducer(handlers);
         const action = { type: 'UNKNOWN_ACTION' };
         const state = { initial: true };

         const newState = reducer(state, action);

         expect(newState).toBe(state);
         expect(newState.initial).toBe(true);
         expect(newState.called).toBeUndefined();
      });

      it('initializes state to empty object if undefined', () => {
         const handlers = {
            TEST_ACTION: jest.fn(() => (state) => ({ ...state, value: 'test' })),
         };
         const reducer = funcReducer(handlers);
         const action = { type: 'TEST_ACTION' };

         const newState = reducer(undefined, action);

         expect(newState.value).toBe('test');
      });

      it('passes the state through the handler function correctly', () => {
         const handlers = {
            INCREMENT: (action) => (state) => ({
               ...state,
               count: (state.count || 0) + action.amount,
            }),
            DECREMENT: (action) => (state) => ({
               ...state,
               count: (state.count || 0) - action.amount,
            }),
         };
         const reducer = funcReducer(handlers);

         let state = {};
         state = reducer(state, { type: 'INCREMENT', amount: 5 });
         expect(state.count).toBe(5);

         state = reducer(state, { type: 'INCREMENT', amount: 3 });
         expect(state.count).toBe(8);

         state = reducer(state, { type: 'DECREMENT', amount: 2 });
         expect(state.count).toBe(6);
      });

      it('handles multiple different action types', () => {
         const handlers = {
            SET_NAME: (action) => (state) => ({ ...state, name: action.value }),
            SET_AGE: (action) => (state) => ({ ...state, age: action.value }),
            SET_EMAIL: (action) => (state) => ({ ...state, email: action.value }),
         };
         const reducer = funcReducer(handlers);

         let state = {};
         state = reducer(state, { type: 'SET_NAME', value: 'John' });
         state = reducer(state, { type: 'SET_AGE', value: 30 });
         state = reducer(state, { type: 'SET_EMAIL', value: 'john@example.com' });

         expect(state).toEqual({
            name: 'John',
            age: 30,
            email: 'john@example.com',
         });
      });
   });
});
