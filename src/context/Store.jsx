import { createContext } from 'react';

// State context for global Redux-style state
export const StateContext = createContext({});

// Dispatch context for updating state
export const DispatchContext = createContext(() => {});
