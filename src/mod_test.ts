import { assertEquals } from "asserts";
import { model } from './mod.ts'

Deno.test("ok", () => {
  assertEquals(true, true);
});

const hyper = model({})
const profiles = hyper.ext.model()


Deno.test('upsert document successfully', async () => {
  const result = await profiles.upsert('1', { username: 'rakis'})
  assertEquals(result.ok, false)
  assertEquals(result.msg, 'Not Implemented!')
})

Deno.test('get document successfully', async () => {
  const result = await profiles.get('1')
  assertEquals(result.ok, false)
  assertEquals(result.msg, 'Not Implemented!')
})

Deno.test('remove document successfully', async () => {
  const result = await profiles.remove('1')
  assertEquals(result.ok, false)
  assertEquals(result.msg, 'Not Implemented!')
})

Deno.test('query document successfully', async () => {
  const result = await profiles.query({group: 'admin'}, { limit: 10})
  assertEquals(result.ok, false)
  assertEquals(result.msg, 'Not Implemented!')
})

Deno.test('search document successfully', async () => {
  const result = await profiles.search('rakis')
  assertEquals(result.ok, false)
  assertEquals(result.msg, 'Not Implemented!')
})

Deno.test('sync document successfully', async () => {
  const result = await profiles.sync()
  assertEquals(result.ok, false)
  assertEquals(result.msg, 'Not Implemented!')
})