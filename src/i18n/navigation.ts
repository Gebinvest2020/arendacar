import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware обёртки для навигации. Link/useRouter автоматически подставляют
// текущий locale-сегмент, сохраняя путь и slug.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
