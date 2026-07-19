// Компактные линейные иконки характеристик автомобиля (собственные SVG).
import type { SVGProps } from "react";

const base: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export function GearIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M4.2 7l2.6 1.5M17.2 15.5 19.8 17M4.2 17l2.6-1.5M17.2 8.5 19.8 7" />
    </svg>
  );
}

export function FuelIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15M3 20h12" />
      <path d="M14 9h2.5a1.5 1.5 0 0 1 1.5 1.5V16a1.5 1.5 0 0 0 3 0V8l-3-3" />
      <path d="M6 9h6" />
    </svg>
  );
}

export function SeatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M6 19v-2a3 3 0 0 1 3-3h6M6 5v6a3 3 0 0 0 3 3M18 5v14" />
    </svg>
  );
}

export function DoorIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20h16M6 20V5a1 1 0 0 1 .8-1l9-2A1 1 0 0 1 17 3v17" />
      <path d="M13.5 12h.01" />
    </svg>
  );
}

export function LuggageIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="7" width="14" height="13" rx="2" />
      <path d="M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7M9.5 11v5M14.5 11v5" />
    </svg>
  );
}

export function EngineIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M6 9h6l2 2h4v5h-2v2H8v-3H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1V9Z" />
      <path d="M9 9V6h4M18 11l2-1v6l-2-1" />
    </svg>
  );
}

export function DrivetrainIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="6" cy="7" r="2" />
      <circle cx="18" cy="7" r="2" />
      <circle cx="6" cy="17" r="2" />
      <circle cx="18" cy="17" r="2" />
      <path d="M8 7h8M8 17h8M6 9v6M18 9v6" />
    </svg>
  );
}

export function AirConIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v18M3 12h18M6 5l12 14M18 5 6 19" />
    </svg>
  );
}

export function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M3.5 9h17M8 3v4M16 3v4" />
    </svg>
  );
}
