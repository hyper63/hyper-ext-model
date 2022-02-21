import { assertEquals } from "asserts";
import { model } from "./mod.ts";
import { z } from "zod";

const schema = z.object({
  _id: z.string(),
  username: z.string(),
});

Deno.test("ok", () => {
  assertEquals(true, true);
});

const hyper = model({
  data: {
    add: () => Promise.resolve({ ok: true }),
    get: () => Promise.resolve({ _id: "1", username: "rakis" }),
    update: () => Promise.resolve({ ok: true }),
    remove: () => Promise.resolve({ ok: true }),
    query: () => Promise.resolve({ ok: true, docs: [] }),
  },
  cache: {
    remove: () => Promise.resolve({ ok: true }),
  },
  search: {
    remove: () => Promise.resolve({ ok: true }),
  },
});
const profiles = hyper.ext.model({ name: "profile", cache: false, schema });

Deno.test("upsert document successfully", async () => {
  const result = await profiles.upsert("1", { _id: "1", username: "rakis" });
  assertEquals(result.ok, true);
  //assertEquals(result.msg, "Not Implemented!");
});

Deno.test("get document successfully", async () => {
  const result = await profiles.get("1");
  console.log(result);
  assertEquals(result._id, "1");
});

Deno.test("remove document successfully", async () => {
  const result = await profiles.remove("1");
  assertEquals(result.ok, true);
});

Deno.test("query document successfully", async () => {
  const result = await profiles.query({ group: "admin" }, { limit: 10 });
  assertEquals(result.ok, true);
  assertEquals(result.docs.length, 0);
});

Deno.test("search document successfully", async () => {
  const result = await profiles.search("rakis");
  assertEquals(result.ok, false);
  assertEquals(result.msg, "Not Implemented!");
});

Deno.test("sync document successfully", async () => {
  const result = await profiles.sync();
  assertEquals(result.ok, false);
  assertEquals(result.msg, "Not Implemented!");
});
