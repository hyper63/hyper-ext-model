import { Async, ReaderT } from "crocks";
import { __, assoc, compose, ifElse, isNil, path } from "ramda";
import type { Config } from "../types.ts";

interface H {
  data: {
    get: (id: string) => typeof Async;
    remove: (id: string) => typeof Async;
  };
  cache: {
    remove: (id: string) => typeof Async;
  };
  search: {
    remove: (id: string) => typeof Async;
  };
}

interface Context {
  hyper: H;
  id: string;
  env?: Config;
  doc?: unknown;
}

const { of, ask, lift } = ReaderT(Async);

// first pass does not address any modes atomic vers non-atomic
// it simply tries to delete everything if they exist or not
/*
const removeFromSearch = ({ hyper, id }: Context) =>
  ask(() =>
    hyper.search.remove(id)
      .coalesce(() => ({ hyper, id }), () => ({ hyper, id }))
  ).chain(lift);

const removeFromCache = ({ hyper, id }: Context) =>
  ask(() =>
    hyper.cache.remove(id)
      .coalesce(() => ({ hyper, id }), () => ({ hyper, id }))
  ).chain(lift);
*/
const getFromData = (ctx: Context) =>
  ctx.hyper.data.get(ctx.id).map(assoc("doc", __, ctx));
const removeFromData = ({ hyper, id }: Context) => hyper.data.remove(id);
const validateDocument = ifElse(
  compose(isNil, path(["env", "schema"])),
  Async.Resolved,
  (ctx: Context) => {
    // @ts-ignore safeParse invoke
    const validate = Async.fromPromise(ctx.env.schema.spa.bind(ctx.env.schema));
    return validate(ctx.doc)
      .bichain(
        // @ts-ignore zod error
        (e) => {
          console.log(e);
          return Async.Rejected({
            msg: "ERROR: could not parse",
            issues: e.issues,
          });
        },
        // @ts-ignore zod success
        ({ success, error }) =>
          success ? Async.Resolved(ctx) : Async.Rejected({
            msg: "ERROR: could not remove, document invalid",
            issues: error.issues,
          }),
      );
  },
);

// TODO: need to handle modes, atomic and non-atomic
export const remove = (hyper: H) =>
  (id: string) =>
    of({ hyper, id })
      .chain((ctx: Context) =>
        ask((env: Config) =>
          Async.of({ env, ...ctx })
            .chain(getFromData)
            .chain(validateDocument)
            .chain(removeFromData)
        ).chain(lift)
      );

// first based on env via ask, we need to get all resources and put them in a context object
// this context object will contain the context that is required to work through the pipeline
/*
ask(env => of(env)
  .map(buildContext)
  .chain(get)
  .chain(remove)
  .chain(dec)
  .bichain(
    ifElse(isAtomic, rollback, compose(of, prop('result'))),
    ctx => of(ctx).chain(notify).map(prop('result'))
  )
).chain(lift)
*/
