import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import path from 'path'


const pathSrc = path.resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true
      }
    }),
    AutoImport({
      imports: ['vue'],
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: "Icon"
        })
      ],
      dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          enabledCollections: ['ep'],
        }),],
      dts: path.resolve(pathSrc, 'components.d.ts'),
    }),
    Icons({
      autoInstall: true,
    }),
    vueI18n({
      include: path.resolve(__dirname, "./path/to/src/locales/**")
    }),
  ],
  server: {
    https: false,
    open: false,
    port: 3000,
    hmr: true,
    host: "127.0.0.1"
  },
  resolve: {
    alias: {
      "@": pathSrc
    }
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    minify: "terser",
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
