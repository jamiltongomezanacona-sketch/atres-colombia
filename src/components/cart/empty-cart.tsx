import Link from "next/link";

export function EmptyCart() {
  return (
    <section className="rounded-2xl border border-atres-border bg-atres-surface p-8 text-center shadow-card sm:p-10">
      <h1 className="text-2xl font-bold text-atres-text">Tu carrito está vacío</h1>
      <p className="mt-2 text-sm leading-6 text-atres-muted">
        Explora los talleres y agrega prendas para armar tu pedido directo con
        quien las confecciona.
      </p>
      <Link
        href="/talleres"
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl border border-atres-primary bg-atres-primary px-5 text-sm font-semibold text-white transition duration-200 hover:border-atres-primary-hover hover:bg-atres-primary-hover"
      >
        Explorar talleres
      </Link>
    </section>
  );
}
