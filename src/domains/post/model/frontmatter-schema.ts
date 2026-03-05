import { z } from 'zod';

export const FeedFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  date: z.string(),
  category: z.enum(['Tech', 'Life']),
  tags: z.array(z.string()).optional(),
  image: z.string().optional(),
  readingTime: z.number().optional(),
  featured: z.boolean().optional(),
  updated: z.string().optional(),
  transliteratedTitle: z.string().optional(),
  series: z
    .object({
      id: z.string(),
      title: z.string(),
      order: z.number(),
    })
    .optional(),
});
