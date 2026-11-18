import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

import { schemaTypes, contentSchemaTypes } from './schemaTypes';
import { structure } from './structure';

// projectId comes from the SANITY_STUDIO_PROJECT_ID env var (see .env.example).
// Run `npx sanity init` once to create/link a project and populate it.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'replace-with-project-id';

// Two workspaces, one per dataset:
//
//   Website         public dataset: marketing pages, blog, and the course
//                   catalog (outlines, prices). Anyone can read it.
//   Course content  PRIVATE dataset: paid lesson bodies. Only the website's
//                   server reads it, with SANITY_READ_TOKEN. Create it once
//                   with `npx sanity dataset create course-content --visibility private`.
export default defineConfig([
  {
    name: 'charicha',
    title: 'Website',
    basePath: '/website',
    projectId,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
    plugins: [structureTool({ structure }), visionTool()],
    schema: { types: schemaTypes },
  },
  {
    name: 'course-content',
    title: 'Course content (private)',
    basePath: '/course-content',
    projectId,
    dataset: process.env.SANITY_STUDIO_CONTENT_DATASET || 'course-content',
    plugins: [structureTool(), visionTool()],
    schema: { types: contentSchemaTypes },
  },
]);
