import React from 'react';

export const SoundDuration = ({ value }) => value && (
   <div>
      <span>Duration: </span>
      <span>{`${(value * 1000).toFixed(2)}ms`}</span>
   </div>
);
