// lib/currency.ts

/**
 * Currency exponent helpers:
 * - 0-decimal (e.g., JPY, KRW, XOF)
 * - 3-decimal (e.g., BHD, KWD, OMR, TND, JOD)
 * Default: 2-decimal
 */
const EXPONENTS: Record<string, number> = {
  // 0-decimal
  bif: 0,
  clp: 0,
  djf: 0,
  gnf: 0,
  jpy: 0,
  kmf: 0,
  krw: 0,
  mga: 0,
  pyg: 0,
  rwf: 0,
  ugx: 0,
  vnd: 0,
  vuv: 0,
  xaf: 0,
  xof: 0,
  xpf: 0,
  // 3-decimal
  bhd: 3,
  jod: 3,
  kwd: 3,
  omr: 3,
  tnd: 3,
};

export function currencyExponent(code = "usd"): number {
  return EXPONENTS[code.toLowerCase()] ?? 2;
}

export function toMinor(amountMajor: number, code = "usd"): number {
  const exp = currencyExponent(code);
  // const factor = Math.pow(10, exp);
  return Math.round(amountMajor);
}

export function fromMinor(amountMinor: number, code = "usd"): number {
  const exp = currencyExponent(code);
  const factor = Math.pow(10, exp);
  return amountMinor / factor;
}
