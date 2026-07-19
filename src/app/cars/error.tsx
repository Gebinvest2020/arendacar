"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

// Понятная ошибка для раздела /cars и /cars/[slug], если данные не загрузились
// (например, БД временно недоступна). Не показываем stack trace и секреты.
export default function CarsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Короткое сообщение в консоль браузера, без секретов и стека.
    console.error("Не удалось загрузить каталог. Повторите попытку.");
  }, [error]);

  return (
    <Container className="py-20 text-center">
      <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Не удалось загрузить каталог
      </h1>
      <p className="mx-auto mt-3 max-w-md text-base leading-7 text-ink/60">
        Похоже, сервис временно недоступен. Пожалуйста, попробуйте обновить
        страницу через несколько секунд.
      </p>
      <div className="mt-6 flex justify-center">
        <Button variant="primary" size="lg" onClick={() => reset()}>
          Попробовать снова
        </Button>
      </div>
    </Container>
  );
}
