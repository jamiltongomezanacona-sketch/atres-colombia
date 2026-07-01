"use client";

import Link from "next/link";
import { ArrowLeft, Share2 } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/types/product";
import { FavoriteButton } from "@/components/products/favorite-button";
import { IconButton } from "@/components/ui/icon-button";

type ProductDetailHeaderProps = {
  product: Product;
};

export function ProductDetailHeader({ product }: ProductDetailHeaderProps) {
  const [copied, setCopied] = useState(false);
  const backHref = "/talleres/" + product.workshopSlug + "/catalogo";

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: product.description,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Usuario cancelo o share no disponible.
      }
    }

    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="flex items-center justify-between gap-3">
      <Link
        href={backHref}
        className="inline-flex min-w-0 flex-1 items-center gap-2 text-sm font-semibold text-atres-muted transition duration-200 hover:text-atres-primary"
      >
        <ArrowLeft size={18} className="shrink-0" />
        <span className="truncate">Regresar</span>
      </Link>

      <p className="hidden min-w-0 flex-1 truncate text-center text-sm font-semibold text-atres-text sm:block">
        {product.workshopName}
      </p>

      <div className="flex shrink-0 items-center gap-2">
        <FavoriteButton productId={product.id} variant="ghost" />
        <IconButton label="Compartir producto" variant="ghost" onClick={handleShare}>
          <Share2 size={18} />
        </IconButton>
      </div>

      {copied ? (
        <span className="sr-only" aria-live="polite">
          Enlace copiado
        </span>
      ) : null}
    </header>
  );
}
