"use client";

import { useEffect, useState } from "react";

const announcements = [
  "Envios nacionales a todo Colombia",
  "Compra directo del taller colombiano",
  "Personalizacion disponible en prendas seleccionadas",
  "Atencion por WhatsApp de lunes a sabado",
];

export function AnnouncementBar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setActiveIndex((current) => (current + 1) % announcements.length);
        setVisible(true);
      }, 200);
    }, 4000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="bg-atres-primary text-center text-xs font-medium text-white">
      <div className="mx-auto flex h-8 max-w-7xl items-center justify-center px-4">
        <p
          className={
            "truncate transition-opacity duration-300 " +
            (visible ? "opacity-100" : "opacity-0")
          }
        >
          {announcements[activeIndex]}
        </p>
      </div>
    </div>
  );
}
