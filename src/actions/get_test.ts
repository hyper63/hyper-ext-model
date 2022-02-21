import { assertEquals } from "asserts";
import { get } from "./get.ts";
import { Async } from "crocks";
import { z } from "zod";

const getFn = () => Async.Resolved({ _id: "1", title: "doc" });

const schema = z.object({
  _id: z.string(),
});

const hyperAsync = {
  data: {
    get: getFn,
  },
  cache: {
    get: getFn,
  },
};

Deno.test("get document by id from cache", async () => {
  const result = await get(hyperAsync)("1").runWith({ schema })
    .toPromise();
  assertEquals(result._id, "1");
});

Deno.test("get document by id no schema", async () => {
  const result = await get(hyperAsync)("1").runWith({})
    .toPromise();
  assertEquals(result._id, "1");
});

Deno.test("get document by id with cache but not found", async () => {
  const hyperAsync2 = {
    data: {
      get: getFn,
    },
    cache: {
      get: () => Async.Rejected({ ok: false }),
    },
  };

  const result = await get(hyperAsync2)("1").runWith({ cache: true, schema })
    .toPromise();
  assertEquals(result._id, "1");
});

Deno.test("get document by id not found", async () => {
  const hyperAsync2 = {
    data: {
      get: () => Async.Rejected({ ok: false }),
    },
    cache: {
      get: () => Async.Rejected({ ok: false }),
    },
  };

  const result = await get(hyperAsync2)("1").runWith({ cache: true, schema })
    .toPromise().catch((e: unknown) => e);
  assertEquals(result.ok, false);
});
