import { mergeDeepRight } from "ramda";

export const model = (hyper: unknown) =>
  mergeDeepRight(
    hyper,
    {
      ext: {
        model(/* config */) {
          return Object.freeze({
            upsert: noop,
            get: noop,
            remove: noop,
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

function noop() {
  return Promise.resolve({ ok: false, msg: "Not Implemented!" });
}
