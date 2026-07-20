import Link from "next/link";

// Пагинация ссылками (сохраняет текущие фильтры в query). Серверный компонент.
export function Pagination({
  page,
  totalPages,
  makeHref,
}: {
  page: number;
  totalPages: number;
  makeHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);
  const btn =
    "inline-flex h-11 min-w-11 items-center justify-center rounded-lg border border-line px-4 text-sm font-semibold text-ink transition-colors hover:border-ink";
  const disabled = "pointer-events-none opacity-40";

  return (
    <nav className="flex items-center justify-between gap-3" aria-label="Пагинация">
      <Link href={makeHref(prev)} className={`${btn} ${page <= 1 ? disabled : ""}`} aria-disabled={page <= 1}>
        Назад
      </Link>
      <span className="text-sm text-ink/60">
        Страница {page} из {totalPages}
      </span>
      <Link href={makeHref(next)} className={`${btn} ${page >= totalPages ? disabled : ""}`} aria-disabled={page >= totalPages}>
        Вперёд
      </Link>
    </nav>
  );
}
