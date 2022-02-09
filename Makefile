test:
	@deno test --import-map import_map.json

bundle:
	@deno bundle --import-map import_map.json src/mod.ts dist/bundle.js