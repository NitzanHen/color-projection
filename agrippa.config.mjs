// @ts-check
import { defineConfig, PostCommandPlugin, Styling } from 'agrippa';

export default defineConfig({
  options: {
    baseDir: 'src/components',
    styling: Styling.CSS,
  },
  plugins: [
    new PostCommandPlugin('code -r <componentPath>')
  ]
});