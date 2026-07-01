import Link from "next/link";

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-atres-border bg-atres-surface p-6 shadow-card md:p-10">
      <p className="text-xs font-semibold uppercase tracking-wider text-atres-gold">
        Nuestro origen
      </p>
      <h1 className="mt-2 text-2xl font-bold text-atres-text sm:text-3xl md:text-4xl">
        AtresColombia vende directo desde el taller.
      </h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-atres-muted md:text-base">
        <p>
          Nacemos para conectar a clientes con moda colombiana hecha por manos
          locales, reduciendo intermediarios y manteniendo una experiencia de
          compra simple, cercana y pensada primero para celular.
        </p>
        <p>
          En esta primera version AtresColombia funciona como una sola tienda.
          La arquitectura queda preparada para integrar multiples talleres y
          fabricantes mas adelante, conservando catalogos claros, pedidos
          directos y productos con identidad propia.
        </p>
      </div>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-atres-primary bg-atres-primary px-5 text-sm font-semibold text-white transition duration-200 hover:scale-[1.02] hover:border-atres-primary-hover hover:bg-atres-primary-hover"
      >
        Volver al catalogo
      </Link>
    </section>
  );
}
