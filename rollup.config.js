//https://cn.rollupjs.org/
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser' //压缩代码
import strip from '@rollup/plugin-strip' //删除log
import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
import RollupClear from 'rollup-plugin-clear' //打包前删除
import cleanup from 'rollup-plugin-cleanup' //删除注释
import externals from 'rollup-plugin-node-externals' //声明第三方依赖是否打包
import autoprefixer from 'autoprefixer' //css 加前缀
import cssnano from 'cssnano' //压缩css
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync('package.json', { encoding: 'utf8' }))
const name = pkg.name

export default {
  input: 'src/modules/index.ts',
  output: [
    {
      file: `./lib/${name}.esm.js`,
      format: 'es',
    },
    {
      file: `./lib/${name}.cjs.js`,
      format: 'cjs',
    },
    {
      file: `./lib/${name}.global.js`,
      format: 'iife',
    },
  ],
  plugins: [
    RollupClear({
      targets: ['lib'],
      watch: true,
    }),
    externals({ devDeps: false }),
    strip({
      labels: ['unittest'],
    }),
    resolve(),
    vue({
      css: true,
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
    terser(),
    cleanup(),
  ],
  // external:['vue', 'vue-demi','epubjs']
}
