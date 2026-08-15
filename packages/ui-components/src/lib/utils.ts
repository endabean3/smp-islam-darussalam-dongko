import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Gabungkan className dengan resolusi konflik utility Tailwind. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
