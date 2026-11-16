import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

import { schemaTypes } from './schemaTypes';
import { structure } from './structure';

// projectId comes from the SANITY_STUDIO_PROJECT_ID env var (see .env.example).
// Run `npx sanity init` once to create/link a project and populate it.
export default defineConfig({
  name: 'charicha',
  title: 'Charicha Institute CMS',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'replace-with-project-id',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [structureTool({ structure }), visionTool()],

  schema: {
    types: schemaTypes,
  },
});
