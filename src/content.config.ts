import { defineCollection, z } from "astro:content";

const sites = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      address: z.string(),
      description: z.string(),
      thumbnail: image(),
      gallery: z.array(image()),
      plantedDate: z.date().optional(),
      featured: z.boolean().default(false),
    }),
});

export const collections = { sites };
