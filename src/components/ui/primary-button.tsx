import type { ButtonHTMLAttributes, ReactNode } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  tone?: "primary" | "gold" | "outline" | "ghost";
  size?: "sm" | "md";
};

const tones = {
  primary:
    "border-atres-primary bg-atres-primary text-white hover:border-atres-primary-hover hover:bg-atres-primary-hover",
  gold: "border-atres-gold bg-atres-gold text-white hover:brightness-110",
  outline:
    "border-white/80 bg-transparent text-white hover:border-white hover:bg-white/10",
  ghost:
    "border-atres-border bg-atres-surface text-atres-text hover:border-atres-primary hover:text-atres-primary",
};

const sizes = {
  sm: "min-h-9 px-4 text-xs",
  md: "min-h-11 px-5 text-sm",
};

export function PrimaryButton({
  children,
  className = "",
  tone = "primary",
  size = "md",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className={
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border font-semibold transition duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 " +
        tones[tone] +
        " " +
        sizes[size] +
        " " +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}
