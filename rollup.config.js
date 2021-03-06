import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

export default [
  {
    input: 'src/mod.ts',
    output: [{
      file: 'dist/index.cjs',
      format: 'cjs'
    },
    {
      file: 'dist/index.js',
      format: 'es'
    }],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json'
      })
    ]
  }
]