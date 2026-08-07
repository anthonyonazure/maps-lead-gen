/**
 * Helpers for values TypeScript cannot vouch for: caught errors and parsed JSON.
 *
 * `catch (err)` gives `unknown` and `res.json()` gives `any`; reading `.message`
 * or `.results` straight off either is how an unvalidated remote payload turns
 * into a runtime TypeError. These narrow first and give a defined fallback.
 */

/** Message of a caught value, whatever it actually turned out to be. */
export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

/** Read a string field off an unvalidated request body, or null if absent. */
export function readStringField(body: unknown, field: string): string | null {
  if (typeof body !== 'object' || body === null) return null;
  const value = (body as Record<string, unknown>)[field];
  return typeof value === 'string' && value.length > 0 ? value : null;
}

/** Narrow an unvalidated value to a string, or fall back. */
export function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}
