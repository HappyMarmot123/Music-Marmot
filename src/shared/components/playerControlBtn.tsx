import React from "react";

export const PlayerControlButton: React.FC<
  React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>
> = ({ children, ...props }) => {
  // eslint-disable-next-line react/button-has-type
  return <button {...props}>{children}</button>;
};
