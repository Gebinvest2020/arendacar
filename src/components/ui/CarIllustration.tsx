// Простой собственный SVG-силуэт автомобиля (не фото, без сторонних лицензий).
// Цвет задаётся через className (currentColor).
export function CarIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 260"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Иллюстрация автомобиля"
    >
      {/* корпус */}
      <path
        d="M78 190 L120 152 C144 120 174 104 214 102 L360 102 C404 104 438 124 460 156 L540 166 C566 170 582 182 582 200 L78 200 Z"
        fill="currentColor"
        fillOpacity="0.92"
      />
      {/* окна */}
      <path
        d="M198 128 C204 118 210 112 218 112 L338 112 C368 114 392 126 410 148 L214 148 C208 140 202 134 198 128 Z"
        fill="#ffffff"
        fillOpacity="0.45"
      />
      {/* колёса */}
      <circle cx="196" cy="200" r="40" fill="currentColor" />
      <circle cx="196" cy="200" r="17" fill="#ffffff" fillOpacity="0.85" />
      <circle cx="456" cy="200" r="40" fill="currentColor" />
      <circle cx="456" cy="200" r="17" fill="#ffffff" fillOpacity="0.85" />
    </svg>
  );
}
