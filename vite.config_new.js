import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src/',
  publicDir: '../static/',
  base: './',
  
  // Server configuration
  server: {
    host: true, // Open to local network
    port: 3000,
    open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env),
    cors: true,
    hmr: {
      overlay: true
    }
  },
  
  // Build configuration
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: 'terser',
    target: 'es2020',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index_new.html')
      },
      output: {
        manualChunks: {
          three: ['three'],
          vendor: ['dat.gui']
        }
      }
    },
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000
  },
  
  // Preview configuration
  preview: {
    host: true,
    port: 4173,
    cors: true
  },
  
  // Optimization
  optimizeDeps: {
    include: [
      'three',
      'three/examples/jsm/controls/OrbitControls.js',
      'three/examples/jsm/loaders/GLTFLoader.js',
      'three/addons/postprocessing/EffectComposer.js',
      'three/addons/postprocessing/RenderPass.js',
      'three/addons/postprocessing/UnrealBloomPass.js',
      'three/addons/postprocessing/OutlinePass.js',
      'dat.gui'
    ]
  },
  
  // CSS configuration
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      css: {
        charset: false
      }
    }
  },
  
  // Asset handling
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr'],
  
  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '2.0.0'),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
  },
  
  // Plugin configuration
  plugins: [
    // Add any additional plugins here
  ],
  
  // Worker configuration for potential future use
  worker: {
    format: 'es'
  }
});
