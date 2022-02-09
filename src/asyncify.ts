import { evolve } from 'ramda'
import { Async } from 'crocks'


export const asyncify = (hyper) {
  const transformations = {
    data: {
      add: Async.fromPromise,
      get: Async.fromPromise
    }
  }
}