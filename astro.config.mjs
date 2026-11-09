// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // When your own domain is connected, put it here, e.g. 'https://damirperic.com'
  // site: 'https://example.com',
  redirects: {
    '/work': '/',
  },
});
