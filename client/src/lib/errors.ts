/**
 * A caught value is `unknown`, not an Error: a rejected fetch, a thrown string,
 * or a non-Error object all land in the same catch. Reading `.message` off it
 * directly is how an error handler becomes the crash.
 */
export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
