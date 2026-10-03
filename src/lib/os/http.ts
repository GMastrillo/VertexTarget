import { OsError } from './errors.ts';

function checkContentLength(headers: Headers, maxBytes: number): void {
  const contentLength = headers.get('content-length');
  if (!contentLength) return;
  const declaredBytes = Number.parseInt(contentLength, 10);
  if (!Number.isNaN(declaredBytes) && declaredBytes > maxBytes) {
    throw new OsError('too-large', `Corpo da requisição excede o limite de ${maxBytes} bytes`);
  }
}

async function readStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  maxBytes: number
): Promise<string> {
  let totalBytes = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        throw new OsError('too-large', `Corpo da requisição excede o limite de ${maxBytes} bytes`);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const merged = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder('utf-8').decode(merged);
}

async function readTextFallback(request: Request, maxBytes: number): Promise<string> {
  const rawText = await request.text();
  const byteLength = new TextEncoder().encode(rawText).byteLength;
  if (byteLength > maxBytes) {
    throw new OsError('too-large', `Corpo da requisição excede o limite de ${maxBytes} bytes`);
  }
  return rawText;
}

export async function readLimitedJson(request: Request, maxBytes: number): Promise<unknown> {
  checkContentLength(request.headers, maxBytes);

  let text: string;
  if (request.body && typeof request.body.getReader === 'function') {
    text = await readStream(request.body.getReader(), maxBytes);
  } else {
    text = await readTextFallback(request, maxBytes);
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new OsError('invalid', 'JSON inválido no corpo da requisição');
  }
}

function parseOriginUrl(urlStr: string, fieldName: string): string {
  try {
    return new URL(urlStr).origin;
  } catch {
    const code = fieldName === 'appUrl' ? 'unavailable' : 'forbidden';
    const msg = fieldName === 'appUrl'
      ? 'Configuração de URL canônica da aplicação inválida'
      : 'Origem da requisição malformada';
    throw new OsError(code, msg);
  }
}

export function requireCanonicalOrigin(request: Request, appUrl: string): void {
  const origin = request.headers.get('origin') || request.headers.get('referer');
  if (!origin) {
    throw new OsError('forbidden', 'Origem da requisição não fornecida');
  }

  const expectedOrigin = parseOriginUrl(appUrl, 'appUrl');
  const requestOrigin = parseOriginUrl(origin, 'origin');

  if (requestOrigin !== expectedOrigin) {
    throw new OsError('forbidden', 'Origem da requisição não coincide com a URL canônica');
  }
}
