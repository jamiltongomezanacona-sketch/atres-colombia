import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  className?: string;
};

const sizes = {
  sm: { image: 32, className: "h-8 w-8" },
  md: { image: 40, className: "h-10 w-10" },
  lg: { image: 48, className: "h-12 w-12" },
};

export function BrandLogo({
  size = "md",
  showName = false,
  className = "",
}: BrandLogoProps) {
  const config = sizes[size];

  return (
    <Link
      href="/"
      aria-label="AtresColombia inicio"
      className={
        "inline-flex min-w-0 items-center gap-2.5 transition duration-200 hover:opacity-90 " +
        className
      }
    >
      <span
        className={
          "relative shrink-0 overflow-hidden rounded-xl bg-white shadow-sm " +
          config.className
        }
      >
        <Image
          src="/logo.png"
          alt="Logo AtresColombia"
          fill
          sizes={config.image + "px"}
          className="object-cover"
          priority
        />
      </span>
      {showName ? (
        <span className="truncate text-lg font-bold tracking-tight text-atres-primary lg:text-xl">
          AtresColombia
        </span>
      ) : null}
    </Link>
  );
}
