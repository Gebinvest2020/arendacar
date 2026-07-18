// Простые линейные иконки по классам автомобилей (собственные SVG).
const common = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function Hatchback() {
  return (
    <svg {...common}>
      <path d="M3 14l1.5-4A2 2 0 0 1 6.4 8.7h8.2a2 2 0 0 1 1.5.7l3 3.6H21a1 1 0 0 1 1 1V16h-3" />
      <path d="M3 14v2h3M9 16h6" />
      <circle cx="7.5" cy="16.5" r="1.8" />
      <circle cx="16.5" cy="16.5" r="1.8" />
    </svg>
  );
}
function Sedan() {
  return (
    <svg {...common}>
      <path d="M2 14l2-3.4A2 2 0 0 1 5.8 9.6h10a2 2 0 0 1 1.6.8l2.2 3.1 1.4.5a1 1 0 0 1 .7 1V16h-3" />
      <path d="M2 14v2h3M9 16h6" />
      <path d="M6.5 9.8l1-2h6.5l1.5 2.2" />
      <circle cx="7.5" cy="16.5" r="1.8" />
      <circle cx="16.5" cy="16.5" r="1.8" />
    </svg>
  );
}
function Briefcase() {
  return (
    <svg {...common}>
      <rect x="3" y="7.5" width="18" height="12" rx="2" />
      <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5M3 12.5h18" />
    </svg>
  );
}
function Suv() {
  return (
    <svg {...common}>
      <path d="M2 13.5l1-4A2 2 0 0 1 5 8h11.5a2 2 0 0 1 1.5.7l2.4 2.8 1 .4a1 1 0 0 1 .6.9V16h-3" />
      <path d="M2 13.5V16h3M9.5 16h6" />
      <path d="M6 8V5.5h8V8" />
      <circle cx="7.5" cy="16.5" r="1.9" />
      <circle cx="16.5" cy="16.5" r="1.9" />
    </svg>
  );
}
function Van() {
  return (
    <svg {...common}>
      <path d="M2 7.5A1.5 1.5 0 0 1 3.5 6h9.5a3 3 0 0 1 2.4 1.2l3 4 1.6.5A1.5 1.5 0 0 1 21 13v3h-3M2 7.5V16h3M9.5 16h6" />
      <path d="M9 6v6H2M13 8.5h4" />
      <circle cx="7.5" cy="16.5" r="1.9" />
      <circle cx="16.5" cy="16.5" r="1.9" />
    </svg>
  );
}
function Crown() {
  return (
    <svg {...common}>
      <path d="M3 8l3.5 3L12 5l5.5 6L21 8l-1.5 9h-15L3 8Z" />
      <path d="M4.5 20h15" />
    </svg>
  );
}

const map: Record<string, () => React.ReactNode> = {
  econom: Hatchback,
  comfort: Sedan,
  business: Briefcase,
  suv: Suv,
  minivan: Van,
  premium: Crown,
};

export function CategoryIcon({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const Icon = map[slug] ?? Sedan;
  return (
    <span className={className}>
      <Icon />
    </span>
  );
}
