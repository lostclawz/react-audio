import React from 'react';
import classNames from 'classnames';


const Button = ({
   selected,
   className,
   onClick,
   passback,
   ...props
}) => (
   <button
      type="button"
      onClick={() => {
         onClick(passback);
      }}
      onKeyDown={(e) => {
         if (e.key === 13 || e.key === 10) {
            onClick(passback);
            e.preventDefault();
            e.stopPropagation();
         }
      }}
      className={
         classNames(
            className,
            { selected },
         )
      }
      {...props}
   />
);

export default Button;
