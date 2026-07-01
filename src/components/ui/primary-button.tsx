import type { ButtonHTMLAttributes, ReactNode } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  tone?: "green" | "gold" | "dark";
};

const tones = {
  green: "border-atres-green bg-atres-green text-atres-black hover:bg-emerald-300",
  gold: "border-atres-gold bg-atres-gold text-atres-black hover:bg-amber-200",
  dark: "border-atres-border bg-white/5 text-white hover:border-atres-green",
};

export function PrimaryButton({
  children,
  className = "",
  tone = "green",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className={
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold transition " +
        tones[tone] +
        " " +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}
