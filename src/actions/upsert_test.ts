import { assertEquals } from "asserts";
import { upsert } from "./upsert.ts";
import { Async } from "crocks";
import { z } from "zod";

const hyperAsync = {
  data: {
    add: () => Async.Resolved({ ok: false }),
    update: () => Async.Resolved({ ok: true }),
    get: () =>
      Async.Resolved({ _id: "1", name: "Tom Wilson", type: "contact" }),
  },
};

const doc = { _id: "contact-1", type: "contact", name: "Tom Wilson" };
const schema = z.object({
  _id: z.string(),
  type: z.literal("contact"),
  name: z.string(),
});

Deno.test("add document with schema", async () => {
  const result = await upsert(hyperAsync)(doc._id, doc).runWith({
    name: "contact",
    schema,
  }).toPromise();
  assertEquals(result.ok, true);
});

Deno.test("add document without schema", async () => {
  const result = await upsert(hyperAsync)(doc._id, doc).runWith({
    name: "contact",
  })
    .toPromise();
  assertEquals(result.ok, true);
});

Deno.test("add document if does not exist", async () => {
  const hyper = {
    data: {
      add: () => Async.Resolved({ ok: true }),
      update: () => Async.Resolved({ ok: false }),
      get: () => Async.Rejected({ ok: false }),
    },
  };
  const result = await upsert(hyper)(doc._id, doc).runWith({
    name: "content",
    schema,
  })
    .toPromise();
  assertEquals(result.ok, true);
});
