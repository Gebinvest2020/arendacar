"use client";

import { useState } from "react";
import Image from "next/image";

// Галерея автомобиля: крупное изображение + строгая лента миниатюр.
// Активная миниатюра — champagne-border. Стрелки навигации (min 44px).
// Фото не зеркалятся в RTL (обёртка dir="ltr"). aria-label — числовые
// (языконезависимые), чтобы не добавлять непереведённые строки.
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
  const hasMany = list.length > 1;

  const go = (dir: number) =>
    setActive((i) => (i + dir + list.length) % list.length);

  return (
    <div className="min-w-0" dir="ltr">
      <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-[4px] border border-white/10 bg-graphite-2">
        {current && (
          <Image
            src={current}
            alt={alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
        )}

        {hasMany && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={String(((active - 1 + list.length) % list.length) + 1)}
              className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-[3px] border border-white/15 bg-graphite/60 text-milk backdrop-blur transition-colors hover:border-champagne hover:text-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/60"
            >
              <span aria-hidden="true" className="text-xl leading-none">‹</span>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={String(((active + 1) % list.length) + 1)}
              className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-[3px] border border-white/15 bg-graphite/60 text-milk backdrop-blur transition-colors hover:border-champagne hover:text-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/60"
            >
              <span aria-hidden="true" className="text-xl leading-none">›</span>
            </button>
            <span className="absolute bottom-2 right-2 rounded-[2px] bg-graphite/60 px-2 py-0.5 text-xs font-medium text-milk backdrop-blur" dir="ltr">
              {active + 1} / {list.length}
            </span>
          </>
        )}
      </div>

      {hasMany && (
        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={String(i + 1)}
              aria-current={i === active}
              className={`relative aspect-[16/10] w-24 shrink-0 overflow-hidden rounded-[3px] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/60 ${
                i === active ? "border-champagne" : "border-white/10 hover:border-white/40"
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
