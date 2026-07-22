"use client";

import { useState } from "react";
import Image from "next/image";

// Галерея автомобиля: крупное изображение + миниатюры (если фото несколько).
// Лента миниатюр прокручивается по горизонтали и не расширяет страницу на мобильном.
export function CarGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : [];
  const current = list[active] ?? list[0];

  return (
    <div className="min-w-0">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-line bg-muted">
        {current && (
          <Image
            src={current}
            alt={alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
        )}
      </div>

      {list.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Показать фото ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-[16/10] w-24 shrink-0 overflow-hidden rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                i === active ? "border-accent" : "border-line hover:border-ink"
              }`}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
