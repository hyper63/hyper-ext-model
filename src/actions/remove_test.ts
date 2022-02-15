import { assertEquals } from "asserts";
import { remove } from "./remove.ts";
import { always } from 'ramda';
import { Async } from "crocks";
import { z } from "zod";

const removeFn = () => Async.Resolved({ ok: true });

const schema = z.object({
  _id: z.string(),
  type: z.string(),
  name: z.string()
});

const hyperAsync = {
  data: {
    get: always({_id: 'contact-1', type: 'contact', name: 'foo'}),
    remove: removeFn,
  },
  cache: {
    get: always({_id: 'contact-1', type: 'contact', name: 'foo'}),
    remove: removeFn,
  },
  search: {
    get: always({id: 'contact-1', type: 'contact', name: 'foo'}),
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
