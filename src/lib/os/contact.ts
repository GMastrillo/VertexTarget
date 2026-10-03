export function normalizeBrazilianPhone(input: string): string | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  const digits = input.replace(/\D/g, '');

  // Case with 55 prefix already: 55 + 10 digits or 55 + 11 digits
  if (digits.startsWith('55')) {
    const local = digits.slice(2);
    if (local.length === 10 || local.length === 11) {
      return digits;
    }
  }

  // Standard national: 10 (landline) or 11 (mobile) digits
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  return null;
}

export function isSafeHttpUrl(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false;
  }

  // Reject control characters and null bytes
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001F\u007F]/.test(input)) {
    return false;
  }

  try {
    const url = new URL(input);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export function contactHref(input: { email?: string; whatsapp?: string }): string | null {
  if (input.whatsapp) {
    const normalized = normalizeBrazilianPhone(input.whatsapp);
    if (normalized) {
      return `https://wa.me/${normalized}`;
    }
  }
  if (input.email && EMAIL_REGEX.test(input.email.trim())) {
    return `mailto:${input.email.trim()}`;
  }
  return null;
}
