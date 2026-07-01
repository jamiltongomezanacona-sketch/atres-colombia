import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
};

export function IconButton({
  label,
  children,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-atres-border bg-white/5 text-white transition hover:border-atres-green hover:text-atres-green " +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}
