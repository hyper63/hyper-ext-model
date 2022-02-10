import { Async, ReaderT } from "crocks";

interface H {
  data: {
    remove: (id: string) => typeof Async;
  };
  cache: {
    remove: (id: string) => typeof Async;
  };
  search: {
    remove: (id: string) => typeof Async;
  };
}

interface config {
  cache: boolean;
  schema: unknown;
}

interface Context {
  hyper: H;
  id: string;
}

const { of, ask, lift } = ReaderT(Async);

// first pass does not address any modes atomic vers non-atomic
// it simply tries to delete everything if they exist or not

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

const removeFromData = ({ hyper, id }: Context) =>
  ask(() => hyper.data.remove(id)).chain(lift);

// TODO: need to handle modes, atomic and non-atomic
export const remove = (hyper: H) =>
  (id: string) =>
    of({ hyper, id })
      .chain(removeFromSearch)
      .chain(removeFromCache)
      .chain(removeFromData);
