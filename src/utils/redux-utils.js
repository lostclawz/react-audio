/**
 * Creates a reducer function from an object mapping action types to handler functions
 * @param {Object} handlers - Object mapping action types to handler functions
 * @returns {Function} Redux reducer function
 */
export const funcReducer = (handlers) => (state = {}, action) => {
   const handler = handlers[action.type];
   return handler ? handler(action)(state) : state;
};
