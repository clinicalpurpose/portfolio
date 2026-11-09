import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * WORK — one folder per project in src/content/work/<project-name>/
 * containing an index.md file and its images.
 */
const work = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/work' }),
  schema: ({ image }) => {
    const media = z.object({
      image: image(),
      alt: z.string(),
    });
    // A column is either one image, or several images stacked on top of each other.
    const column = z.union([media, z.object({ stack: z.array(media).min(1) })]);
    const block = z.union([
      media, // full-width image
      z.object({ pair: z.tuple([column, column]) }), // two half-width columns
    ]);

    return z.object({
      title: z.string(),
      client: z.string().optional(),
      year: z.union([z.string(), z.number()]).optional(),
      role: z.string().optional(),
      summary: z.string(),
      order: z.number().default(99),
      draft: z.boolean().default(false),
      color: z.string().default('#E1E1E1'),
      cover: image(),
      coverAlt: z.string(),
      blocks: z.array(block).default([]),
    });
  },
});

/**
 * INFO — your about text, experience, services and contact details,
 * all in src/content/info/info.md
 */
const info = defineCollection({
  loader: glob({ pattern: 'info.md', base: './src/content/info' }),
  schema: z.object({
    name: z.string(),
    /** Homepage intro. A line break in the text is kept as a line break. */
    intro: z.string(),
    /** Extra text revealed by the arrow on the homepage (up to two paragraphs). */
    introMore: z.array(z.string()).max(2).default([]),
    email: z.string(),
    location: z.string().optional(),
    socials: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    experience: z
      .array(
        z.object({
          role: z.string(),
          company: z.string(),
          years: z.string(),
        }),
      )
      .default([]),
    services: z.array(z.string()).default([]),
  }),
});

export const collections = { work, info };
