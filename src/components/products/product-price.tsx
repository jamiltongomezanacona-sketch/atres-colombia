import { formatPrice } from "@/lib/format";

type ProductPriceProps = {
  price: number;
  previousPrice?: number;
  discount?: string;
  size?: "sm" | "md" | "lg";
};

export function ProductPrice({
  price,
  previousPrice,
  discount,
  size = "md",
}: ProductPriceProps) {
  const priceSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <span className={"font-bold text-atres-primary " + priceSizes[size]}>
        {formatPrice(price)}
      </span>
      {previousPrice ? (
        <span className="text-sm text-atres-muted line-through">
          {formatPrice(previousPrice)}
        </span>
      ) : null}
      {discount ? (
        <span className="rounded-md bg-atres-gold/15 px-2 py-0.5 text-xs font-semibold text-atres-gold">
          -{discount}
        </span>
      ) : null}
    </div>
  );
}
