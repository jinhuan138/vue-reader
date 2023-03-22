import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import vue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'
// import autoprefixer from 'autoprefixer'

export default {
  input: 'src/modules/index.js',
  output: {
    file: './lib/index.js',
    format: 'es',
    name: 'vue-reader',
    global:{
      vue:"Vue"
    }
  },
  plugins: [
    resolve(),
    commonjs(),
    vue({
      css: true,
    }),
    babel({
      exclude: '**/node_modules/**',
      babelHelpers: 'bundled' 
    }),
    postcss(),
    // autoprefixer()
  ],
  external: ['vue','Epub']
};