import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from '@nabla/vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), eslintPlugin()],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
      '@binance-chain/bsc-connector': '@binance-chain/bsc-connector/dist/bsc-connector.esm.js',
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    allowNodeBuiltins: ['@web3-react/abstract-connector', '@walletconnect/jsonrpc-provider']
  },
  define: {
    global: 'window'
  },
  chokidarWatchOptions: {
    usePolling: true
  }
})
