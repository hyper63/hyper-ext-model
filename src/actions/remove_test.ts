import { assertEquals } from "asserts";
import { remove } from "./remove.ts";
import { always, identity } from "ramda";
import { Async } from "crocks";
import { z } from "zod";

const removeFn = () => Async.Resolved({ ok: true });

const schema = z.object({
  _id: z.string(),
  type: z.string(),
  name: z.string(),
});

const hyperAsync = {
  data: {
    get: always(
      Async.Resolved({ _id: "contact-1", type: "contact", name: "foo" }),
    ),
    remove: removeFn,
  },
  cache: {
    get: always(
      Async.Resolved({ _id: "contact-1", type: "contact", name: "foo" }),
    ),
    remove: removeFn,
  },
  search: {
    get: always(
      Async.Resolved({ id: "contact-1", type: "contact", name: "foo" }),
    ),
    remove: removeFn,
  },
};

Deno.test("remove document successfully", async () => {
  const result = await remove(hyperAsync)("1").runWith({
    search: true,
    cache: true,
    schema,
  })
    .toPromise();
  assertEquals(result.ok, true);
});

Deno.test("remove document without schema configured", async () => {
  const result = await remove(hyperAsync)("1").runWith({}).toPromise();
  assertEquals(result.ok, true);
});

Deno.test("remove document invalid schema", async () => {
  const result = await remove(hyperAsync)("1").runWith({
    schema: z.string(),
  }).toPromise().catch(identity);
  assertEquals(result.ok, false);
});

Deno.test("remove document that is not found", async () => {
  const hyper = {
    data: {
      get: always(
        Async.Rejected({ ok: false, msg: "Not Found!" }),
      ),
      remove: removeFn,
    },
    cache: {
      get: always(
        Async.Resolved({ _id: "contact-1", type: "contact", name: "foo" }),
      ),
      remove: removeFn,
    },
    search: {
      get: always(
        Async.Resolved({ id: "contact-1", type: "contact", name: "foo" }),
      ),
      remove: removeFn,
    },
  };
  const result = await remove(hyper)("1").runWith({}).toPromise().catch(
    identity,
  );
  assertEquals(result.ok, false);
});
