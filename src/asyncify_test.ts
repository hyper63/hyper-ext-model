import { assertEquals } from "asserts";
import { asyncify } from "./asyncify.ts";

Deno.test("evolve hyper successfully", async () => {
  const hyper = {
    data: {
      add: noop,
      get: noop,
    },
    cache: {
      add: noop,
    },
  };
  const result = asyncify(hyper);
  let r = await result.data.add().toPromise();
  assertEquals(r.ok, true);
  r = await result.data.get().toPromise();
  assertEquals(r.ok, true);
  r = await result.cache.add().toPromise();
  assertEquals(r.ok, true);
});

function noop() {
  return Promise.resolve({ ok: true });
}
