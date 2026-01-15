import { defineCollection, z } from 'astro:content';

const sites = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    address: z.string(),
    description: z.string(),
    images: z.array(z.string()),
    plantedDate: z.date().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { sites };
