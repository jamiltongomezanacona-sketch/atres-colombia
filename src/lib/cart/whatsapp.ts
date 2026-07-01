import type { CartWorkshopGroup } from "@/types/cart";
import { formatPrice } from "@/lib/format";

/** Numero central de AtresColombia (configurable via env en el futuro). */
export const PLATFORM_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573001234567";

export function buildWhatsAppOrderMessage(
  groups: CartWorkshopGroup[],
  shipping: number,
  total: number,
): string {
  const lines: string[] = [
    "Hola, quiero confirmar mi pedido en AtresColombia:",
    "",
  ];

  for (const group of groups) {
    lines.push("*" + group.workshopName + "*");
    lines.push(group.workshopLocation);

    for (const item of group.items) {
      lines.push(
        "- " +
          item.name +
          " | Talla " +
          item.size +
          " | Color " +
          item.color +
          " | Cant. " +
          item.quantity +
          " | " +
          formatPrice(item.price * item.quantity),
      );
    }

    lines.push("Subtotal taller: " + formatPrice(group.subtotal));
    lines.push("");
  }

  lines.push("Subtotal general: " + formatPrice(total - shipping));
  lines.push("Envio estimado: " + formatPrice(shipping));
  lines.push("*Total: " + formatPrice(total) + "*");

  return lines.join("\n");
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const normalizedPhone = phone.replace(/\D/g, "");

  if (!normalizedPhone) {
    return "";
  }

  return (
    "https://wa.me/" +
    normalizedPhone +
    "?text=" +
    encodeURIComponent(message)
  );
}

export function getCartWhatsAppUrl(
  groups: CartWorkshopGroup[],
  shipping: number,
  total: number,
  phone = PLATFORM_WHATSAPP_NUMBER,
): string {
  const message = buildWhatsAppOrderMessage(groups, shipping, total);
  return buildWhatsAppUrl(phone, message);
}
