import { mergeDeepRight } from "ramda";
import { asyncify } from "./asyncify.ts";
import { get } from "./actions/get.ts";
import { remove } from "./actions/remove.ts";
import { upsert } from "./actions/upsert.ts";
import { query } from "./actions/query.ts";
import type { Config } from "./types.ts";

export const model = (hyper: unknown) => {
  const hyperAsync = asyncify(hyper);
  return mergeDeepRight(
    hyper,
    {
      ext: {
        model(config: Config) {
          return Object.freeze({
            upsert: (id: string, doc: unknown) =>
              upsert(hyperAsync)(id, doc).runWith(config).toPromise(),
            get: (id: string) =>
              get(hyperAsync)(id).runWith(config).toPromise(),
            remove: (id: string) =>
              remove(hyperAsync)(id).runWith(config).toPromise(),
            query: (selector: unknown, options?: unknown) =>
              query(hyperAsync)(selector, options).runWith(config).toPromise(),
            search: noop,
            count: noop,
            sync: noop,
            addAttachment: noop,
            getAttachment: noop,
          });
        },
      },
    },
  );
};

function noop() {
  return Promise.resolve({ ok: false, msg: "Not Implemented!" });
}
