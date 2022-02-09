test:
	@deno fmt src --check && deno lint src && deno test --import-map import_map.json src

bundle:
	@deno bundle --import-map import_map.json src/mod.ts dist/bundle.js