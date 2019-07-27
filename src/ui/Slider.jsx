/* eslint-disable react/no-array-index-key */
import React from 'react';

const Slider = ({
   min = 0,
   max = 100,
   value = 0,
   step = 1,
   numTicks = 5,
   onChange,
   showValue = false,
   valueUnits = '',
   label,
   inputProps = {},
   defaultValue,
   ...props
}) => (
   <div className="slider" {...props}>
      {(label || showValue) && (
         <div className="label-value">
            {label && (
               <div className="slider-label">
                  {label}
               </div>
            )}
            {showValue && (
               <span className="slider-value">
                  {`${value}${valueUnits && ` ${valueUnits}`}`}
               </span>
            )}
         </div>
      )}
      <input
         type="range"
         min={min}
         max={max}
         value={value}
         onChange={e => onChange(e.target.value)}
         onDoubleClick={() => onChange(
            defaultValue !== undefined ? defaultValue : min
         )}
         step={step}
         {...inputProps}
      />
      {numTicks && (
         <div className="ticks">
            {Array(numTicks).fill('1').map((t, idx) => (
               <div
                  key={idx}
                  className="tick"
                  data-value={(((max - min) / (numTicks)) * idx) || undefined}
               />
            ))}
         </div>
      )}
   </div>
);

export default Slider;
