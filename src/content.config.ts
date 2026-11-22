import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Blog posts live in src/content/blog/ as two files per post:
 *   <slug>.md   — frontmatter only (validated below)
 *   <slug>.html — the article body: hand-written HTML using the article block classes
 *                 (styles in src/styles/article.css)
 */
const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/blog' }),
  schema: z.object({
    /** The H1 on the post page and the title in the blog list. */
    title: z.string(),
    /** <title> tag / og:title. Defaults to `title`. */
    seoTitle: z.string().optional(),
    /** Meta description. */
    description: z.string(),
    /** Short text shown in the blog list. Defaults to `description`. */
    excerpt: z.string().optional(),
    keywords: z.string().optional(),
    eyebrow: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('The Attachment Hippo Team'),
    /** e.g. "Part 1 of 2" */
    series: z.string().optional(),
    /** Path under /public, e.g. /blog/my-post/cover.webp — 1000 × 480 or wider. */
    cover: z.string(),
    coverAlt: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
