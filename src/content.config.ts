import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const essays = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/essays' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    kind: z.enum(['essay', 'note', 'observation', 'experiment', 'hypothesis']).default('essay'),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false)
  })
});

export const collections = { essays };
