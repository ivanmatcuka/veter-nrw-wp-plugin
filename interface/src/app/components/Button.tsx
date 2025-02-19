import { FC, PropsWithChildren } from "react";

export type ButtonProps = {
  variant?: "filled" | "outlined" | "text";
  disabled?: boolean;
};
const classMap = {
  filled: "bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700",
  outlined:
    "bg-white text-black hover:bg-gray-100 active:bg-gray-200 border border-gray-900",
  text: "text-black hover:bg-gray-100 active:bg-gray-200",
};
export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  children,
  disabled = false,
  variant = "filled",
}) => {
  return (
    <button
      role="tab"
      className={[
        classMap[variant],
        disabled && "opacity-50",
        "px-4 py-2 rounded",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
};
