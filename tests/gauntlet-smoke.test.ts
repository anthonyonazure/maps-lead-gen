import { test, expect } from "bun:test";

/**
 * Scaffolded by the gauntlet because this repo had no tests at all.
 * It proves only that the entrypoint loads without throwing — import-time
 * crashes, bad top-level config, circular imports. That is a floor, NOT
 * coverage. Replace it with tests of real behaviour.
 */
test("entrypoint imports without throwing", async () => {
  const mod = await import("../electron/main.cjs");
  expect(mod).toBeDefined();
});
