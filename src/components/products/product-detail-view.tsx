"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types/product";
import type { Workshop } from "@/types/workshop";
import { DeliveryInfo } from "@/components/products/delivery-info";
import { ProductActions } from "@/components/products/product-actions";
import { ProductAvailability } from "@/components/products/product-availability";
import { ProductColors } from "@/components/products/product-colors";
import { ProductCustomization } from "@/components/products/product-customization";
import { ProductDescription } from "@/components/products/product-description";
import { ProductDetailHeader } from "@/components/products/product-detail-header";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductInfo } from "@/components/products/product-info";
import { ProductSizes } from "@/components/products/product-sizes";
import { RelatedProducts } from "@/components/products/related-products";
import { WorkshopSummary } from "@/components/products/workshop-summary";
import { getImageForColor } from "@/lib/products/detail-helpers";
import { getProductColors, getProductSizes } from "@/lib/products/helpers";

type ProductDetailViewProps = {
  product: Product;
  workshop: Workshop;
  sameWorkshopProducts: Product[];
  suggestedProducts: Product[];
};

export function ProductDetailView({
  product,
  workshop,
  sameWorkshopProducts,
  suggestedProducts,
}: ProductDetailViewProps) {
  const colors = useMemo(() => getProductColors(product), [product]);
  const sizes = useMemo(() => getProductSizes(product), [product]);
  const [selectedColor, setSelectedColor] = useState(colors[0]?.name ?? "");
  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? "");
  const [activeImageUrl, setActiveImageUrl] = useState(
    getImageForColor(product, colors[0]?.name ?? ""),
  );

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
    setActiveImageUrl(getImageForColor(product, colorName));
  };

  return (
    <article className="animate-slide-up space-y-8 sm:space-y-10">
      <ProductDetailHeader product={product} />

      <p className="text-center text-sm font-semibold text-atres-text sm:hidden">
        {product.workshopName}
      </p>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery
          product={product}
          activeImageUrl={activeImageUrl}
          onImageChange={setActiveImageUrl}
        />

        <div className="space-y-6">
          <ProductInfo product={product} />
          <WorkshopSummary workshop={workshop} />
          <ProductColors
            colors={colors}
            selectedColor={selectedColor}
            onColorChange={handleColorChange}
          />
          <ProductSizes
            sizes={sizes}
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
          />
          <ProductAvailability product={product} />
          <ProductCustomization enabled={workshop.supportsCustomization} />
          <ProductActions
            product={product}
            workshop={workshop}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
          />
        </div>
      </div>

      <ProductDescription product={product} />
      <DeliveryInfo />

      <RelatedProducts
        sameWorkshopProducts={sameWorkshopProducts}
        suggestedProducts={suggestedProducts}
        workshopName={workshop.name}
      />
    </article>
  );
}
