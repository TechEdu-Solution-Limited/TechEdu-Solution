// /lib/constants/currencies.ts

export interface CurrencyOption {
  value: string;
  label: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { value: "usd", label: "$ USD" },
  { value: "eur", label: "€ EUR" },
  { value: "gbp", label: "£ GBP" },
  { value: "cad", label: "C$ CAD" },
  { value: "aud", label: "A$ AUD" },
  { value: "jpy", label: "¥ JPY" },
  { value: "inr", label: "₹ INR" },
  { value: "ngn", label: "₦ NGN" },
  { value: "cny", label: "¥ CNY" },
  { value: "chf", label: "CHF" },
  { value: "sek", label: "kr SEK" },
  { value: "nok", label: "kr NOK" },
  { value: "dkk", label: "kr DKK" },
  { value: "pln", label: "zł PLN" },
  { value: "czk", label: "Kč CZK" },
  { value: "huf", label: "Ft HUF" },
  { value: "rub", label: "₽ RUB" },
  { value: "brl", label: "R$ BRL" },
  { value: "mxn", label: "$ MXN" },
  { value: "ars", label: "$ ARS" },
  { value: "clp", label: "$ CLP" },
  { value: "cop", label: "$ COP" },
  { value: "pen", label: "S/ PEN" },
  { value: "uah", label: "₴ UAH" },
  { value: "try", label: "₺ TRY" },
  { value: "ils", label: "₪ ILS" },
  { value: "aed", label: "د.إ AED" },
  { value: "sar", label: "﷼ SAR" },
  { value: "qar", label: "﷼ QAR" },
  { value: "kwd", label: "د.ك KWD" },
  { value: "bhd", label: "د.ب BHD" },
  { value: "omr", label: "﷼ OMR" },
  { value: "jod", label: "د.ا JOD" },
  { value: "egp", label: "£ EGP" },
  { value: "mad", label: "د.م MAD" },
  { value: "tnd", label: "د.ت TND" },
  { value: "dzd", label: "د.ج DZD" },
  { value: "lyd", label: "ل.د LYD" },
  { value: "sdg", label: "ج.س SDG" },
  { value: "etb", label: "Br ETB" },
  { value: "kes", label: "KSh KES" },
  { value: "ugx", label: "USh UGX" },
  { value: "tzs", label: "TSh TZS" },
  { value: "zmw", label: "ZK ZMW" },
  { value: "bwp", label: "P BWP" },
  { value: "zar", label: "R ZAR" },
  { value: "nad", label: "N$ NAD" },
  { value: "szl", label: "L SZL" },
  { value: "lsl", label: "L LSL" },
  { value: "mwk", label: "MK MWK" },
  { value: "mzn", label: "MT MZN" },
  { value: "aoa", label: "Kz AOA" },
  { value: "xaf", label: "FCFA XAF" },
  { value: "xof", label: "CFA XOF" },
  { value: "ghs", label: "₵ GHS" },
  { value: "xdr", label: "SDR XDR" },
];

/* ───────────────────────────── Helpers ───────────────────────────── */

// Get a pretty label like "£ GBP" or "CHF" from a code
export const getCurrencyLabel = (currencyCode: string): string => {
  const currency = CURRENCY_OPTIONS.find(
    (c) => c.value === (currencyCode || "").toLowerCase()
  );
  return currency ? currency.label : (currencyCode || "").toUpperCase();
};

// Check if a currency is supported by your list
export const isSupportedCurrency = (currencyCode: string): boolean =>
  CURRENCY_OPTIONS.some((c) => c.value === (currencyCode || "").toLowerCase());

/**
 * NEW: Return just the symbol for a currency code (e.g., "gbp" → "£", "usd" → "$").
 * Strategy:
 *   1) Look up in CURRENCY_OPTIONS and take the first token of the label.
 *   2) Fallback to Intl.NumberFormat to extract the symbol.
 *   3) Final fallback to a small map or the uppercased code.
 */
export function getCurrencySymbolFromValue(code?: string): string {
  const fallbackDefault = "£";
  if (!code) return fallbackDefault;

  const lower = code.toLowerCase();

  // 1) Try CURRENCY_OPTIONS (label’s first token is the symbol for this list)
  const opt = CURRENCY_OPTIONS.find((c) => c.value === lower);
  if (opt && opt.label) {
    const firstToken = opt.label.split(" ")[0]; // e.g., "£" from "£ GBP", "CHF" from "CHF"
    if (firstToken) return firstToken;
  }

  // 2) Try Intl extraction
  try {
    const formatted = new Intl.NumberFormat("en", {
      style: "currency",
      currency: code.toUpperCase(),
      currencyDisplay: "symbol",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(0);
    // Remove digits, punctuation, minus and whitespace to leave the symbol
    const symbol = formatted.replace(/[\d\s.,-]/g, "");
    if (symbol) return symbol;
  } catch {
    // ignore
  }

  // 3) Small fallback map for common ones, else the ISO code itself
  const common: Record<string, string> = {
    usd: "$",
    gbp: "£",
    eur: "€",
    ngn: "₦",
    jpy: "¥",
    cny: "¥",
    inr: "₹",
    zar: "R",
    brl: "R$",
    aed: "د.إ",
    sar: "﷼",
  };
  return common[lower] ?? code.toUpperCase();
}

/**
 * Backward-compatible: keep your original name but delegate to the new logic.
 * (You can delete this and replace calls if you prefer the new name.)
 */
export function getCurrencySymbol(code?: string) {
  return getCurrencySymbolFromValue(code);
}
