import { defineConfig } from 'vite';
import { resolve } from 'path';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  base: './',

  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    assetsInlineLimit: 4096,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/index.html'),
        euphoria: resolve(__dirname, 'src/projets/euphoria.html'),
        stunning: resolve(__dirname, 'src/projets/stunning.html'),
        funiro: resolve(__dirname, 'src/projets/funiro.html'),
        mdw: resolve(__dirname, 'src/projets/my-digital-week.html'),
        joHiver2030: resolve(__dirname, 'src/projets/jo-hiver-2030.html'),
        morpionPhp: resolve(__dirname, 'src/projets/morpion-php.html'),
        veilParfumerie: resolve(__dirname, 'src/projets/veil-parfumerie.html'),
        myhrOncall: resolve(__dirname, 'src/projets/myhr-oncall.html'),
        novaTech: resolve(__dirname, 'src/projets/nova-tech.html'),
        cvgenius: resolve(__dirname, 'src/projets/cvgenius.html'),
        covercraftAi: resolve(__dirname, 'src/projets/covercraft-ai.html'),
        digistylzeSaas: resolve(__dirname, 'src/projets/digistylze-saas.html'),
      },
      output: {
        manualChunks: {
          gsap: ['gsap', 'gsap/ScrollTrigger'],
          lenis: ['lenis'],
        },
      },
    },
  },

  server: {
    port: 5173,
    open: true,
  },

  plugins: [
    ViteImageOptimizer({
      png: { quality: 85 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { quality: 82 },
      svg: {
        multipass: true,
        plugins: [
          { name: 'preset-default', params: { overrides: { removeViewBox: false } } },
        ],
      },
    }),
  ],
});
