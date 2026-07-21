import { z } from 'zod';

const QualityScoreSchema = z
  .number()
  .min(1)
  .max(5)
  .refine((value) => Number.isInteger(value * 2), {
    message: 'Quality scores must use 0.5 increments',
  });

export const FeedFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  date: z.string(),
  category: z.enum(['Tech', 'Life']),
  contentType: z.enum(['essay', 'retrospective', 'review']),
  visibility: z.enum(['public', 'private']).default('private'),
  tags: z.array(z.string()).optional(),
  image: z.string().optional(),
  readingTime: z.number().optional(),
  featured: z.boolean().optional(),
  updated: z.string().optional(),
  transliteratedTitle: z.string().optional(),
  qualityReview: z
    .object({
      philosophy: QualityScoreSchema.nullable().optional(),
      design: QualityScoreSchema.nullable().optional(),
      implementation: QualityScoreSchema.nullable().optional(),
      brandFit: QualityScoreSchema.nullable().optional(),
      clarity: QualityScoreSchema.nullable().optional(),
      structure: QualityScoreSchema.nullable().optional(),
      evidence: QualityScoreSchema.nullable().optional(),
      usefulness: QualityScoreSchema.nullable().optional(),
      originality: QualityScoreSchema.nullable().optional(),
      polish: QualityScoreSchema.nullable().optional(),
      reviewedAt: z.string().optional(),
      notes: z.string().optional(),
    })
    .optional(),
});
