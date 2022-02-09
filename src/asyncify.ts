import { evolve } from "ramda";
import { Async } from "crocks";

export const asyncify = (hyper: unknown) => {
  const transformations = {
    data: {
      add: Async.fromPromise,
      get: Async.fromPromise,
      update: Async.fromPromise,
      remove: Async.fromPromise,
      query: Async.fromPromise,
      bulk: Async.fromPromise,
      index: Async.fromPromise,
    },
    cache: {
      add: Async.fromPromise,
      get: Async.fromPromise,
      update: Async.fromPromise,
      remove: Async.fromPromise,
      query: Async.fromPromise,
    },
    search: {
      add: Async.fromPromise,
      remove: Async.fromPromise,
      get: Async.fromPromise,
      update: Async.fromPromise,
      query: Async.fromPromise,
      load: Async.fromPromise,
    },
    storage: {
      upload: Async.fromPromise,
      download: Async.fromPromise,
      remove: Async.fromPromise,
    },
    queue: {
      enqueue: Async.fromPromise,
      errors: Async.fromPromise,
      queued: Async.fromPromise,
    },
  };
  return evolve(transformations, hyper);
};
