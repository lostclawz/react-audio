import * as R from 'ramda';

export const initState = {
   loop: false,
   duration: null,
   playbackRate: 1,
   detune: 0,
   gain: 1,
};

export const defaultToInit = R.defaultTo(initState);

export const soundPlayerLens = R.lensProp('soundPlayer');

export const instanceLens = id => R.lensProp(id);

export const soundPlayerInstanceLens = id => (
   R.compose(soundPlayerLens, instanceLens(id))
);

export const soundPlayerSelector = id => state => (
   defaultToInit(
      R.view(
         soundPlayerInstanceLens(id), state
      )
   )
);

export const soundPlayerUpdater = (id, param, value) => state => (
   R.over(
      instanceLens(id),
      obj => (
         typeof param === 'object'
            // if an object is passed, just merge
            ? R.merge(defaultToInit(obj), param)
            // otherwise set the key
            : R.assoc(param, value, defaultToInit(obj))
      ),
      state
   )
);

export const removeById = id => R.omit([id]);
