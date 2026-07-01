import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
  variant?: "default" | "ghost" | "overlay";
};

const variants = {
  default:
    "border-atres-border bg-atres-surface text-atres-text hover:border-atres-primary hover:text-atres-primary hover:bg-atres-bg",
  ghost:
    "border-transparent bg-transparent text-atres-text hover:bg-atres-bg hover:text-atres-primary",
  overlay:
    "border-white/20 bg-white/90 text-atres-text shadow-card hover:scale-105 hover:bg-white",
};

export function IconButton({
  label,
  children,
  className = "",
  variant = "default",
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={
        "inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border transition duration-200 active:scale-95 " +
        variants[variant] +
        " " +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}
