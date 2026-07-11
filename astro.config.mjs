// @ts-check
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  adapter: vercel()
});