import { Async, ReaderT } from "crocks";

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
}

const doGet = (hyper: H, id: string) =>
  ({ cache }: config) =>
    cache
      ? hyper.cache.get(id)
        .bichain(hyper.data.get, Async.Resolved)
      : hyper.data.get(id);

export const get = (hyper: H) =>
  (id: string) =>
    of(id)
      .chain((id: string) => ask(doGet(hyper, id)).chain(lift));
