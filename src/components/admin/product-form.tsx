"use client";

import { useEffect, useMemo, useState } from "react";
import type { AdminProduct, AdminProductInput } from "@/types/admin-product";
import { categories } from "@/data/categories";
import { getAllWorkshops } from "@/lib/repositories";
import { PrimaryButton } from "@/components/ui/primary-button";

type ProductFormProps = {
  initialProduct?: AdminProduct;
  submitLabel: string;
  onSubmit: (values: AdminProductInput) => void;
};

const defaultColor = { name: "Negro", value: "#111111" };

function buildInitialState(product?: AdminProduct): AdminProductInput {
  if (product) {
    return {
      workshopId: product.workshopId,
      workshopSlug: product.workshopSlug,
      workshopName: product.workshopName,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      name: product.name,
      description: product.description,
      longDescription: product.longDescription,
      price: product.price,
      previousPrice: product.previousPrice,
      discount: product.discount,
      colors: product.colors,
      sizes: product.sizes,
      imageUrls: product.imageUrls,
      stock: product.stock,
      available: product.available,
      madeToOrder: product.madeToOrder,
      allowsCustomization: product.allowsCustomization,
      allowsHomeTrial: product.allowsHomeTrial,
      material: product.material,
      fabricationTime: product.fabricationTime,
    };
  }

  const workshop = getAllWorkshops()[0];
  const category = categories[0];

  return {
    workshopId: workshop?.id ?? "",
    workshopSlug: workshop?.slug ?? "",
    workshopName: workshop?.name ?? "",
    categoryId: category?.id ?? "",
    categoryName: category?.name ?? "",
    name: "",
    description: "",
    longDescription: "",
    price: 0,
    previousPrice: undefined,
    discount: "",
    colors: [defaultColor],
    sizes: ["S", "M", "L"],
    imageUrls: ["/placeholders/textura-taller.svg"],
    stock: 10,
    available: true,
    madeToOrder: false,
    allowsCustomization: workshop?.supportsCustomization ?? false,
    allowsHomeTrial: workshop?.supportsHomeTrial ?? false,
    material: "",
    fabricationTime: "",
  };
}

export function ProductForm({
  initialProduct,
  submitLabel,
  onSubmit,
}: ProductFormProps) {
  const workshops = useMemo(() => getAllWorkshops(), []);
  const [values, setValues] = useState<AdminProductInput>(() =>
    buildInitialState(initialProduct),
  );
  const [colorsText, setColorsText] = useState(
    () =>
      (initialProduct?.colors ?? [defaultColor])
        .map((color) => color.name + "|" + color.value)
        .join("\n"),
  );
  const [sizesText, setSizesText] = useState(
    () => (initialProduct?.sizes ?? ["S", "M", "L"]).join(", "),
  );
  const [imagesText, setImagesText] = useState(
    () =>
      (initialProduct?.imageUrls ?? ["/placeholders/textura-taller.svg"]).join(
        "\n",
      ),
  );

  useEffect(() => {
    if (initialProduct) {
      setValues(buildInitialState(initialProduct));
      setColorsText(
        initialProduct.colors.map((color) => color.name + "|" + color.value).join("\n"),
      );
      setSizesText(initialProduct.sizes.join(", "));
      setImagesText(initialProduct.imageUrls.join("\n"));
    }
  }, [initialProduct]);

  const parseColors = (text: string) =>
    text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, value = "#111111"] = line.split("|").map((part) => part.trim());
        return { name, value };
      });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onSubmit({
      ...values,
      colors: parseColors(colorsText),
      sizes: sizesText
        .split(",")
        .map((size) => size.trim())
        .filter(Boolean),
      imageUrls: imagesText
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-2xl border border-atres-border bg-atres-surface p-4 sm:p-5">
        <h2 className="text-lg font-bold text-atres-text">Informacion principal</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-semibold text-atres-text">Nombre</span>
            <input
              required
              value={values.name}
              onChange={(event) =>
                setValues((current) => ({ ...current, name: event.target.value }))
              }
              className="w-full rounded-xl border border-atres-border bg-atres-bg px-3 py-2.5 text-sm"
            />
          </label>

          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-semibold text-atres-text">
              Descripcion corta
            </span>
            <textarea
              required
              rows={2}
              value={values.description}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-atres-border bg-atres-bg px-3 py-2.5 text-sm"
            />
          </label>

          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-semibold text-atres-text">
              Descripcion larga
            </span>
            <textarea
              required
              rows={4}
              value={values.longDescription}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  longDescription: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-atres-border bg-atres-bg px-3 py-2.5 text-sm"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-atres-text">Taller</span>
            <select
              required
              value={values.workshopId}
              onChange={(event) => {
                const workshop = workshops.find((item) => item.id === event.target.value);
                if (!workshop) return;
                setValues((current) => ({
                  ...current,
                  workshopId: workshop.id,
                  workshopSlug: workshop.slug,
                  workshopName: workshop.name,
                  allowsCustomization: workshop.supportsCustomization,
                  allowsHomeTrial: workshop.supportsHomeTrial,
                }));
              }}
              className="w-full rounded-xl border border-atres-border bg-atres-bg px-3 py-2.5 text-sm"
            >
              {workshops.map((workshop) => (
                <option key={workshop.id} value={workshop.id}>
                  {workshop.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-atres-text">Categoria</span>
            <select
              required
              value={values.categoryId}
              onChange={(event) => {
                const category = categories.find((item) => item.id === event.target.value);
                if (!category) return;
                setValues((current) => ({
                  ...current,
                  categoryId: category.id,
                  categoryName: category.name,
                }));
              }}
              className="w-full rounded-xl border border-atres-border bg-atres-bg px-3 py-2.5 text-sm"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-atres-border bg-atres-surface p-4 sm:p-5">
        <h2 className="text-lg font-bold text-atres-text">Precio e inventario</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-atres-text">Precio</span>
            <input
              required
              type="number"
              min={0}
              value={values.price || ""}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  price: Number(event.target.value),
                }))
              }
              className="w-full rounded-xl border border-atres-border bg-atres-bg px-3 py-2.5 text-sm"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-atres-text">
              Precio anterior
            </span>
            <input
              type="number"
              min={0}
              value={values.previousPrice ?? ""}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  previousPrice: event.target.value
                    ? Number(event.target.value)
                    : undefined,
                }))
              }
              className="w-full rounded-xl border border-atres-border bg-atres-bg px-3 py-2.5 text-sm"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-atres-text">Descuento</span>
            <input
              value={values.discount ?? ""}
              onChange={(event) =>
                setValues((current) => ({ ...current, discount: event.target.value }))
              }
              placeholder="17%"
              className="w-full rounded-xl border border-atres-border bg-atres-bg px-3 py-2.5 text-sm"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-atres-text">Stock</span>
            <input
              required
              type="number"
              min={0}
              value={values.stock}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  stock: Number(event.target.value),
                }))
              }
              className="w-full rounded-xl border border-atres-border bg-atres-bg px-3 py-2.5 text-sm"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-atres-border bg-atres-surface p-4 sm:p-5">
        <h2 className="text-lg font-bold text-atres-text">Variantes e imagenes</h2>
        <div className="mt-4 grid gap-4">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-atres-text">
              Colores (uno por linea: Nombre|#hex)
            </span>
            <textarea
              rows={3}
              value={colorsText}
              onChange={(event) => setColorsText(event.target.value)}
              className="w-full rounded-xl border border-atres-border bg-atres-bg px-3 py-2.5 text-sm"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-atres-text">
              Tallas (separadas por coma)
            </span>
            <input
              value={sizesText}
              onChange={(event) => setSizesText(event.target.value)}
              className="w-full rounded-xl border border-atres-border bg-atres-bg px-3 py-2.5 text-sm"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-atres-text">
              URLs de imagenes (una por linea)
            </span>
            <textarea
              rows={4}
              value={imagesText}
              onChange={(event) => setImagesText(event.target.value)}
              className="w-full rounded-xl border border-atres-border bg-atres-bg px-3 py-2.5 text-sm"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-atres-border bg-atres-surface p-4 sm:p-5">
        <h2 className="text-lg font-bold text-atres-text">Disponibilidad y servicios</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm text-atres-text">
            <input
              type="checkbox"
              checked={values.available}
              onChange={(event) =>
                setValues((current) => ({ ...current, available: event.target.checked }))
              }
              className="h-4 w-4 rounded border-atres-border"
            />
            Disponible
          </label>
          <label className="flex items-center gap-2 text-sm text-atres-text">
            <input
              type="checkbox"
              checked={values.madeToOrder}
              onChange={(event) =>
                setValues((current) => ({ ...current, madeToOrder: event.target.checked }))
              }
              className="h-4 w-4 rounded border-atres-border"
            />
            Fabricacion bajo pedido
          </label>
          <label className="flex items-center gap-2 text-sm text-atres-text">
            <input
              type="checkbox"
              checked={values.allowsCustomization}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  allowsCustomization: event.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-atres-border"
            />
            Permite personalizacion
          </label>
          <label className="flex items-center gap-2 text-sm text-atres-text">
            <input
              type="checkbox"
              checked={values.allowsHomeTrial}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  allowsHomeTrial: event.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-atres-border"
            />
            Permite prueba en casa
          </label>
        </div>
      </section>

      <PrimaryButton type="submit" className="w-full sm:w-auto">
        {submitLabel}
      </PrimaryButton>
    </form>
  );
}
