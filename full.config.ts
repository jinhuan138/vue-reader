//https://cn.rollupjs.org/
import { defineConfig } from 'rollup';
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser' //压缩代码
import strip from '@rollup/plugin-strip' //删除log
import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
import cleanup from 'rollup-plugin-cleanup' //删除注释
import autoprefixer from 'autoprefixer' //css 加前缀
import cssnano from 'cssnano' //压缩css
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync('package.json', { encoding: 'utf8' }))
const name = pkg.name

export default defineConfig({
  input: 'src/modules/index.ts',
  output: [
    {
      file: `./lib/${name}.es-full.js`,
      format: 'es',
    },
    {
      file: `./lib/${name}.global-full.js`,
      format: 'iife',
    },
  ],
  plugins: [
    strip({
      labels: ['unittest'],
    }),
    resolve(),
    vue({
      css: true,
      target: 'browser',
    }),
    typescript({
      tsconfig: './tsconfig.json',
      exclude: ['node_modules'],
    }),
    commonjs(),
    babel({
      exclude: '**/node_modules/**',
      babelHelpers: 'bundled',
    }),
    postcss({
      plugins: [autoprefixer(), cssnano()],
    }),
    // terser(),
    cleanup(),
  ],
  external: ['vue'],
})
