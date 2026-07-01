type DeliveryCard = {
  emoji: string;
  title: string;
  description: string;
};

const deliveryCards: DeliveryCard[] = [
  {
    emoji: "🚚",
    title: "Envio nacional",
    description: "Despacho a principales ciudades con seguimiento del taller.",
  },
  {
    emoji: "🏭",
    title: "Compra directa del taller",
    description: "Sin intermediarios: compras directo a quien confecciona la prenda.",
  },
  {
    emoji: "↩",
    title: "Cambios y devoluciones",
    description: "Politica flexible segun disponibilidad y tipo de confeccion.",
  },
  {
    emoji: "🧵",
    title: "Hecho en Colombia",
    description: "Apoyas produccion local y economia de talleres colombianos.",
  },
];

export function DeliveryInfo() {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-atres-gold">
          Entrega
        </p>
        <h2 className="mt-1 text-xl font-bold text-atres-text">
          Compra con confianza
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {deliveryCards.map((card) => (
          <article
            key={card.title}
            className="rounded-2xl border border-atres-border bg-atres-bg p-4"
          >
            <p className="text-2xl" aria-hidden="true">
              {card.emoji}
            </p>
            <h3 className="mt-2 text-sm font-semibold text-atres-text">
              {card.title}
            </h3>
            <p className="mt-1 text-sm leading-6 text-atres-muted">
              {card.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
