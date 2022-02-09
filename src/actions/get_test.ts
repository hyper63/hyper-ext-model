import { assertEquals } from "asserts";
import { get } from "./get.ts";
import { Async } from "crocks";

const getFn = () => Async.Resolved({ _id: "1", title: "doc" });

const hyperAsync = {
  data: {
    get: getFn,
  },
  cache: {
    get: getFn,
  },
};

Deno.test("get document by id from cache", async () => {
  const result = await get(hyperAsync)("1").runWith({ cache: true })
    .toPromise();
  assertEquals(result._id, "1");
});

Deno.test("get document by id no cache", async () => {
  const result = await get(hyperAsync)("1").runWith({ cache: false })
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

  const result = await get(hyperAsync2)("1").runWith({ cache: true })
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

  const result = await get(hyperAsync2)("1").runWith({ cache: true })
    .toPromise().catch((e: unknown) => e);
  assertEquals(result.ok, false);
});
