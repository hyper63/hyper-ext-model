import { assertEquals } from "asserts";
import { query } from "./query.ts";
import { Async } from "crocks";

const hyperAsync = {
  data: {
    query: () =>
      Async.Resolved({
        ok: true,
        docs: [
          { _id: "1", username: "rakis", type: "profile" },
          { _id: "2", username: "twilson63", type: "profile" },
        ],
      }),
  },
};

Deno.test("query profiles", async () => {
  const result = await query(hyperAsync)({ type: "profile" }).runWith({
    name: "profile",
  }).toPromise();
  assertEquals(result.docs.length, 2);
});
