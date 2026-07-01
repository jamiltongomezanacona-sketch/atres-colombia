import { HomeCatalog } from "@/components/catalog/home-catalog";
import { HeroSlider } from "@/components/home/hero-slider";
import { categories } from "@/data/categories";
import { heroSlides } from "@/data/hero-slides";
import { products } from "@/data/products";

export default function Home() {
  return (
    <div className="space-y-8 sm:space-y-10">
      <HeroSlider slides={heroSlides} />
      <HomeCatalog categories={categories} products={products} />
    </div>
  );
}
