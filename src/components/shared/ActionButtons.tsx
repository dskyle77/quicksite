import { ReactNode, MouseEventHandler } from "react";
import { X } from "lucide-react";

type AddButtonProps = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

export function AddButton({ children, onClick, className }: AddButtonProps) {
  return (
    <button
      className={
        `mt-4 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition focus:outline-none` +
        className
      }
      style={{ background: "var(--qs-primary)" }}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

type XButtonProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  color?: string;
};

export function Xbutton({ onClick, className, color }: XButtonProps) {
  return (
    <button
      type="button"
      className={`rounded p-1 cursor-pointer ${className ?? ""}`}
      style={{
        lineHeight: 1,
        background: "none",
        border: "none",
        color: "var(--qs-text-muted)",
      }}
      onClick={onClick}
    >
      <X size={16} color={color} />
    </button>
  );
}
