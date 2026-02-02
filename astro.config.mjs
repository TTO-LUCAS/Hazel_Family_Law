// @ts-check
import { defineConfig } from 'astro/config';

import compressor from 'astro-compressor';
import { gzip } from 'astro-compressor/dist/compress';

// https://astro.build/config
export default defineConfig({
  site: 'https://hazel-family-law.netlify.app/',
  integrations: [compressor( { gzip: true, brotli: false } )],
});