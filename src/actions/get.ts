import { Async, ReaderT } from "crocks";
//import { z } from "zod";

const { of, ask, lift } = ReaderT(Async);

interface H {
  data: {
    get: (id: string) => typeof Async;
  };
  cache: {
    get: (id: string) => typeof Async;
  };
}

interface config {
  cache: boolean;
  schema: unknown;
}

// @ts-ignore allow any type
const validate = (schema) =>
  (doc: unknown) => {
    const { success, data, errors } = schema.safeParse(doc);
    return success ? Async.Resolved(data)
    : Async.Rejected({ ok: false, errors });
  };

const doGet = (hyper: H, id: string) =>
  ({ cache, schema }: config) =>
    cache
      ? hyper.cache.get(id)
        .bichain(hyper.data.get, Async.Resolved)
        .chain(validate(schema))
      : hyper.data.get(id)
        .chain(validate(schema));

export const get = (hyper: H) =>
  (id: string) =>
    of(id)
      .chain((id: string) => ask(doGet(hyper, id)).chain(lift));
