import type { Product } from "@/types/product";

type ProductDescriptionProps = {
  product: Product;
};

export function ProductDescription({ product }: ProductDescriptionProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-atres-border bg-atres-surface p-4 sm:p-5">
      <div>
        <h2 className="text-sm font-semibold text-atres-text">Descripcion</h2>
        <p className="mt-2 text-sm leading-7 text-atres-muted">
          {product.longDescription}
        </p>
      </div>

      {product.material ? (
        <div>
          <h3 className="text-sm font-semibold text-atres-text">Materiales</h3>
          <p className="mt-2 text-sm leading-7 text-atres-muted">{product.material}</p>
        </div>
      ) : null}

      <div>
        <h3 className="text-sm font-semibold text-atres-text">Cuidados</h3>
        <p className="mt-2 text-sm leading-7 text-atres-muted">
          {product.careInstructions}
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-atres-text">Origen</h3>
        <p className="mt-2 text-sm leading-7 text-atres-muted">{product.origin}</p>
      </div>

      {product.fabricationTime ? (
        <div>
          <h3 className="text-sm font-semibold text-atres-text">
            Tiempo de fabricacion
          </h3>
          <p className="mt-2 text-sm leading-7 text-atres-muted">
            {product.fabricationTime}
          </p>
        </div>
      ) : null}
    </section>
  );
}
