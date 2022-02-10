import { mergeDeepRight } from "ramda";
import { asyncify } from "./asyncify.ts";
import { get } from "./actions/get.ts";
import { remove } from "./actions/remove.ts";

export const model = (hyper: unknown) => {
  const hyperAsync = asyncify(hyper);
  return mergeDeepRight(
    hyper,
    {
      ext: {
        model(config: unknown) {
          return Object.freeze({
            upsert: noop,
            get: (id: string) =>
              get(hyperAsync)(id).runWith(config).toPromise(),
            remove: (id: string) =>
              remove(hyperAsync)(id).runWith(config).toPromise(),
            query: noop,
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
