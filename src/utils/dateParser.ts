import { parse, isValid } from "date-fns";

const FORMATS = [
  "yyyy-MM-dd",
  "MM/dd/yyyy",
  "dd/MM/yyyy",
  "MM-dd-yyyy",
  "dd-MM-yyyy",
  "yyyy/MM/dd",
];

export function parseDate(value: string): Date | null {
  if (!value || value.toUpperCase() === "NULL") return new Date();

  for (const fmt of FORMATS) {
    const d = parse(value, fmt, new Date());
    if (isValid(d)) return d;
  }

  const fallback = new Date(value);
  if (isValid(fallback)) return fallback;

  return null;
}
