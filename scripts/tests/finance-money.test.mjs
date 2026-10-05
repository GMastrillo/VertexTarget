import test from "node:test";
import assert from "node:assert/strict";
import { formatMoney, parseBaseAmount, getCurrencyExponent } from "../../src/lib/finance/money.ts";

test("getCurrencyExponent returns correct scale for currencies", () => {
  assert.equal(getCurrencyExponent("brl"), 2);
  assert.equal(getCurrencyExponent("USD"), 2);
  assert.equal(getCurrencyExponent("eur"), 2);
  assert.equal(getCurrencyExponent("JPY"), 0);
  assert.equal(getCurrencyExponent("clp"), 0);
  assert.equal(getCurrencyExponent("kwd"), 3);
});

test("formatMoney: money_units and zero-decimal currencies", () => {
  // USD 12345 in 'en' -> $123.45
  const usdFormatted = formatMoney({ amountMinor: 12345, currency: "usd" }, "en");
  assert.match(usdFormatted, /123\.45/);
  assert.match(usdFormatted, /\$|USD/);

  // JPY 12345 does NOT divide by 100
  const jpyFormatted = formatMoney({ amountMinor: 12345, currency: "jpy" }, "en");
  assert.match(jpyFormatted, /12,345/);
  assert.doesNotMatch(jpyFormatted, /123\.45/);

  // BRL format in pt-BR
  const brlFormatted = formatMoney({ amountMinor: 123456, currency: "brl" }, "pt-BR");
  assert.match(brlFormatted, /1\.234,56/);
  assert.match(brlFormatted, /R\$/);

  // EUR in de
  const eurFormatted = formatMoney({ amountMinor: 123456, currency: "eur" }, "de");
  assert.match(eurFormatted, /1\.234,56/);

  // Invalid currency or unsafe integer throws or is rejected
  assert.throws(() => formatMoney({ amountMinor: NaN, currency: "usd" }, "en"));
  assert.throws(() => formatMoney({ amountMinor: 1.5, currency: "usd" }, "en"));
  assert.throws(() => formatMoney({ amountMinor: Infinity, currency: "usd" }, "en"));
  assert.throws(() => formatMoney({ amountMinor: 100, currency: "INVALID_CURRENCY_XYZ" }, "en"));
});

test("parseBaseAmount: amount_locale and strict validation", () => {
  // pt-BR with brl
  assert.deepEqual(parseBaseAmount("1.234,56", "pt-BR", "brl"), { ok: true, amountMinor: 123456 });
  assert.deepEqual(parseBaseAmount("1234,56", "pt-BR", "brl"), { ok: true, amountMinor: 123456 });
  assert.deepEqual(parseBaseAmount("50", "pt-BR", "brl"), { ok: true, amountMinor: 5000 });
  assert.deepEqual(parseBaseAmount("50,00", "pt-BR", "brl"), { ok: true, amountMinor: 5000 });

  // en with usd
  assert.deepEqual(parseBaseAmount("1,234.56", "en", "usd"), { ok: true, amountMinor: 123456 });
  assert.deepEqual(parseBaseAmount("1234.56", "en", "usd"), { ok: true, amountMinor: 123456 });
  assert.deepEqual(parseBaseAmount("50", "en", "usd"), { ok: true, amountMinor: 5000 });

  // de with eur
  assert.deepEqual(parseBaseAmount("1.234,56", "de", "eur"), { ok: true, amountMinor: 123456 });

  // Negative, zero and boundaries
  assert.equal(parseBaseAmount("-1", "en", "usd").ok, false);
  assert.equal(parseBaseAmount("-1", "en", "usd").code, "range");
  assert.equal(parseBaseAmount("0", "en", "usd").ok, false);
  assert.equal(parseBaseAmount("0", "en", "usd").code, "range");
  assert.equal(parseBaseAmount("0.00", "en", "usd").ok, false);

  // Incompatible locale separators: '1.234,56' in en locale must be rejected with format error
  assert.equal(parseBaseAmount("1.234,56", "en", "usd").ok, false);
  assert.equal(parseBaseAmount("1.234,56", "en", "usd").code, "format");

  // Incompatible locale separators: '1,234.56' in pt-BR locale must be rejected with format error
  assert.equal(parseBaseAmount("1,234.56", "pt-BR", "brl").ok, false);
  assert.equal(parseBaseAmount("1,234.56", "pt-BR", "brl").code, "format");

  // Excess (> 100_000_000_00 = 100,000,000.00)
  assert.equal(parseBaseAmount("100000000.01", "en", "usd").ok, false);
  assert.equal(parseBaseAmount("100000000.01", "en", "usd").code, "range");

  // Exact maximum is allowed (100_000_000.00)
  assert.deepEqual(parseBaseAmount("100000000.00", "en", "usd"), { ok: true, amountMinor: 10000000000 });

  // More than 2 decimal digits is rejected
  assert.equal(parseBaseAmount("12.345", "en", "usd").ok, false);
  assert.equal(parseBaseAmount("12.345", "en", "usd").code, "format");

  // Garbage input
  assert.equal(parseBaseAmount("abc", "en", "usd").ok, false);
  assert.equal(parseBaseAmount("", "en", "usd").ok, false);
  assert.equal(parseBaseAmount("  ", "en", "usd").ok, false);
});
