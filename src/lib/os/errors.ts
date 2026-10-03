export type OsErrorCode =
  | 'invalid'
  | 'unauthenticated'
  | 'forbidden'
  | 'not-found'
  | 'conflict'
  | 'too-large'
  | 'media-type'
  | 'limited'
  | 'unavailable';

const STATUS_BY_CODE: Record<OsErrorCode, number> = {
  invalid: 400,
  unauthenticated: 401,
  forbidden: 403,
  'not-found': 404,
  conflict: 409,
  'too-large': 413,
  'media-type': 415,
  limited: 429,
  unavailable: 503,
};

export class OsError extends Error {
  readonly code: OsErrorCode;
  readonly status: number;

  constructor(code: OsErrorCode, message: string) {
    super(message);
    this.name = 'OsError';
    this.code = code;
    this.status = STATUS_BY_CODE[code] ?? 500;
  }
}

export function toOsError(error: unknown, fallbackMessage = 'Ocorreu um erro na operação'): OsError {
  if (error instanceof OsError) {
    return error;
  }
  return new OsError('invalid', fallbackMessage);
}
