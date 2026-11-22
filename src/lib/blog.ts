import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Article bodies: src/content/blog/<slug>.html, imported as raw strings at build time. */
const bodies = import.meta.glob<string>('../content/blog/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export function getBody(slug: string): string {
  const body = bodies[`../content/blog/${slug}.html`];
  if (body === undefined) {
    throw new Error(`Missing article body: src/content/blog/${slug}.html`);
  }
  return body;
}

/** Published posts, newest first. Drafts show in `npm run dev` only. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Words ÷ 220, rounded up — the house rule for reading time. */
export function readingTime(html: string): number {
  const text = html
    .replace(/<(pre|script|style)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
