import Link from "next/link";

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl rounded-lg border border-atres-border bg-atres-panel/80 p-5 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-atres-gold">
        Nuestro origen
      </p>
      <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
        AtresColombia vende directo desde el taller.
      </h1>
      <div className="mt-5 space-y-4 text-sm leading-7 text-atres-muted md:text-base">
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
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-atres-green bg-atres-green px-5 text-sm font-semibold text-atres-black"
      >
        Volver al catalogo
      </Link>
    </section>
  );
}
