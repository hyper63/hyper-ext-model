import { Async, ReaderT } from "crocks";
import { compose, ifElse, isNil, mergeRight, prop } from "ramda";
import type { Config } from "../types.ts";

//import { z } from "zod";
interface H {
  data: {
    add: (doc: unknown) => typeof Async;
    get: (id: string) => typeof Async;
    update: (id: string, doc: unknown) => typeof Async;
  };
}

const { of, ask, lift } = ReaderT(Async);

// @ts-ignore allow any type
const validate = (schema) =>
  (doc: unknown) => {
    const { success, data, errors } = schema.safeParse(doc);
    return success
      ? Async.Resolved(data)
      : Async.Rejected({ ok: false, msg: "ERROR: Invalid document", errors });
  };

const doUpsert = (hyper: H, doc: unknown) =>
  (env: Config) =>
    Async.of(doc)
      .chain(ifElse(
        () => isNil(env.schema),
        Async.Resolved,
        validate(prop("schema", env)),
      ))
      .chain((doc: unknown) =>
        compose(hyper.data.get, prop("_id"))(doc)
          .bichain(
            () => hyper.data.add(doc),
            (old: unknown) => hyper.data.update(prop("_id", old), doc),
          )
      );

export const upsert = (hyper: H) =>
  (id: string, doc: unknown) =>
    of(mergeRight(doc, { _id: id }))
      .chain((doc: unknown) => ask(doUpsert(hyper, doc)).chain(lift));
