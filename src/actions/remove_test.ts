import { assertEquals } from "asserts";
import { remove } from "./remove.ts";
import { Async } from "crocks";
import { z } from "zod";

const removeFn = () => Async.Resolved({ ok: true });

const schema = z.object({
  _id: z.string(),
});

const hyperAsync = {
  data: {
    remove: removeFn,
  },
  cache: {
    remove: removeFn,
  },
  search: {
    remove: removeFn,
  },
};

Deno.test("remove document", async () => {
  const result = await remove(hyperAsync)("1").runWith({
    search: true,
    cache: true,
    schema,
  })
    .toPromise();
  assertEquals(result.ok, true);
});
