import React from 'react';
import classNames from 'classnames';


const Toggle = ({
   value,
   onChange,
   className,
   ...props
}) => (
   <button
      type="button"
      className={classNames(
         { active: value },
         className
      )}
      onClick={() => onChange(!value)}
      {...props}
   />
);

export default Toggle;
