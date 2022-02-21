import { Async, ReaderT } from "crocks";
import type { Config } from "../types.ts";

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

// @ts-ignore allow any type
const validate = (schema) =>
  (doc: unknown) => {
    const { success, data, errors } = schema.safeParse(doc);
    return success ? Async.Resolved(data)
    : Async.Rejected({ ok: false, errors });
  };

const doGet = (hyper: H, id: string) =>
  ({ schema }: Config) =>
    schema
      ? hyper.data.get(id)
        .chain(validate(schema))
      : hyper.data.get(id);

export const get = (hyper: H) =>
  (id: string) =>
    of(id)
      .chain((id: string) => ask(doGet(hyper, id)).chain(lift));
