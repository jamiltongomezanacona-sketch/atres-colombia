import { HomeFavorites } from "@/components/home/home-favorites";
import { HeroSlider } from "@/components/home/hero-slider";
import { WorkshopList } from "@/components/workshops/workshop-list";
import { heroSlides } from "@/data/hero-slides";
import { products } from "@/data/products";
import { workshops } from "@/data/workshops";

export default function Home() {
  return (
    <div className="space-y-8 sm:space-y-10">
      <HeroSlider slides={heroSlides} />
      <WorkshopList workshops={workshops} />
      <HomeFavorites products={products} />
    </div>
  );
}
