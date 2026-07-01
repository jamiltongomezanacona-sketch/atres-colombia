import type { Workshop } from "@/types/workshop";

export function getVerifiedLabel(workshop: Workshop): string {
  return workshop.kind === "store" ? "Tienda verificada" : "Taller verificado";
}

export function getVerifiedLabelFromKind(kind: Workshop["kind"]): string {
  return kind === "store" ? "Tienda verificada" : "Taller verificado";
}

export function getShortDescription(description: string, maxLength = 140): string {
  if (description.length <= maxLength) {
    return description;
  }

  return description.slice(0, maxLength).trimEnd() + "...";
}
