import { assertEquals } from 'asserts'
import { asyncify } from './asyncify.ts'

Deno.test('evolve hyper successfully', async () => {
  const hyper = {
    data: {
      add: noop,
      get: noop
    }
  }
  const result = asyncify(hyper)
  
})

