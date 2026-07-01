import { formatPrice } from "@/lib/format";

type ProductPriceProps = {
  price: number;
  previousPrice?: number;
  discount?: string;
};

export function ProductPrice({
  price,
  previousPrice,
  discount,
}: ProductPriceProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <span className="text-lg font-bold text-atres-green">{formatPrice(price)}</span>
      {previousPrice ? (
        <span className="text-sm text-atres-muted line-through">
          {formatPrice(previousPrice)}
        </span>
      ) : null}
      {discount ? (
        <span className="rounded-full border border-atres-gold/40 bg-atres-gold/10 px-2 py-0.5 text-xs font-semibold text-atres-gold">
          -{discount}
        </span>
      ) : null}
    </div>
  );
}
