import cx from "classnames";
import React from "react";

const Button = React.forwardRef(({ children, ...props }, ref) => (
  <button
    ref={ref}
    {...props}
    className={cx(
      "inline-flex select-none items-center justify-center rounded-md text-sm font-medium",
      "bg-white text-gray-700 hover:bg-gray-5",
      "hover:bg-gray-50",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ring-offset-1 focus-visible:ring-opacity-75",
      // Register all radix states
      "group",
      "radix-state-open:bg-gray-50",
      "radix-state-on:bg-gray-50",
      "radix-state-instant-open:bg-gray-50 radix-state-delayed-open:bg-gray-50"
    )}
  >
    {children}
  </button>
));

Button.displayName = "Button";
export default Button;
