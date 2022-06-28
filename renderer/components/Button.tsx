import clsx from "clsx";
import React, { MouseEventHandler } from "react";

type Colors = "primary" | "secondary" | "red";

interface Props {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  className?: string;
  color?: "primary" | "secondary" | "red";
}

const primaryClassNames = "bg-blue-400 hover:bg-blue-300";
const secondaryClassNames = "bg-green-500 hover:bg-green-400";
const redClassNames = "bg-red-500 hover:bg-red-400";

const getColorClassNamesByColorKind = (colorKind?: Colors) => {
  switch (colorKind) {
    case "primary":
      return primaryClassNames;
    case "secondary":
      return secondaryClassNames;
    case "red":
      return redClassNames;
    default:
      return primaryClassNames;
  }
};

const Button = (props: Props) => {
  return (
    <button
      onClick={props.onClick}
      className={clsx(
        "rounded shadow-lg p-1.5",
        getColorClassNamesByColorKind(props.color),
        props.className
      )}
    >
      {props.children}
    </button>
  );
};

export default Button;
