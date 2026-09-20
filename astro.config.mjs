import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://grar00t.github.io',
  base: '/Grar00t',
  integrations: [react()],
  markdown: {
    shikiConfig: { theme: 'github-dark-default' }
  }
});
