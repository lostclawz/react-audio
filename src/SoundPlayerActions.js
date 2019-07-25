export const UPDATE_PARAM = 'UPDATE_PARAM';
export const updateParam = (instanceId, param, value) => ({
   type: UPDATE_PARAM, param, value, instanceId,
});

export const REMOVE_PLAYER = 'REMOVE_PLAYER';
export const removePlayer = id => ({ type: REMOVE_PLAYER, id });

export const updater = id => dispatch => param => val => (
   dispatch(updateParam(id, param, val))
);
