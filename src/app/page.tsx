import { HomeFavorites } from "@/components/home/home-favorites";
import { HeroSlider } from "@/components/home/hero-slider";
import { WorkshopList } from "@/components/workshops/workshop-list";
import { heroSlides } from "@/data/hero-slides";
import {
  getAllProductsAsync,
  getAllWorkshopsAsync,
} from "@/lib/repositories";

export default async function Home() {
  const [workshops, products] = await Promise.all([
    getAllWorkshopsAsync(),
    getAllProductsAsync(),
  ]);

  return (
    <div className="space-y-8 sm:space-y-10">
      <HeroSlider slides={heroSlides} />
      <WorkshopList workshops={workshops} />
      <HomeFavorites products={products} />
    </div>
  );
}
