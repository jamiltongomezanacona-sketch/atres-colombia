"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { IconButton } from "@/components/ui/icon-button";

type FavoriteButtonProps = {
  productId: string;
  className?: string;
};

export function FavoriteButton({ productId, className = "" }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(productId);

  return (
    <IconButton
      label={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      onClick={() => toggleFavorite(productId)}
      className={
        (favorite ? "border-atres-gold text-atres-gold " : "") + className
      }
    >
      <Heart size={18} fill={favorite ? "currentColor" : "none"} />
    </IconButton>
  );
}
