import { Async, ReaderT } from "crocks";
//import type { Config } from "../types.ts";

//import { z } from "zod";
interface H {
  data: {
    query: (selector: unknown, options: unknown) => typeof Async;
  };
}

const { of, ask, lift } = ReaderT(Async);

const doQuery = (hyper: H, selector: unknown, options?: unknown) =>
  (/* env: Config */) => hyper.data.query(selector, options);

export const query = (hyper: H) =>
  (selector: unknown, options?: unknown) =>
    of().chain(
      () => ask(doQuery(hyper, selector, options)),
    ).chain(lift);
