import { HomeCatalog } from "@/components/catalog/home-catalog";
import { categories } from "@/data/categories";
import { products } from "@/data/products";

export default function Home() {
  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-atres-border bg-atres-panel/75 px-4 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-atres-gold">
          Tienda oficial
        </p>
        <h1 className="mt-1 text-2xl font-bold leading-tight text-white">
          AtresColombia
        </h1>
        <p className="mt-2 text-sm leading-6 text-atres-muted">
          Moda colombiana directa del taller. Catalogo simple, rapido y pensado
          para comprar desde el celular.
        </p>
      </section>
      <HomeCatalog categories={categories} products={products} />
    </div>
  );
}
