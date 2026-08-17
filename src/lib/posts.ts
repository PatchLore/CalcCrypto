import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Post {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  content: string;
  image?: string;
  category?: string;
  tags?: string[];
  author?: string;
  faq?: FaqItem[];
}

export const DEFAULT_AUTHOR = 'CalcCrypto Team';

export function getAllPosts(): Post[] {
  const postsDirectory = path.join(process.cwd(), 'src', 'content', 'blog');

  // Create directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        title: data.title || 'Untitled',
        date: data.date || new Date().toISOString().split('T')[0],
        excerpt: data.excerpt || '',
        image: data.image,
        category: data.category,
        tags: Array.isArray(data.tags) ? data.tags : undefined,
        author: data.author || DEFAULT_AUTHOR,
        faq: Array.isArray(data.faq) ? data.faq : undefined,
        slug,
        content,
      } as Post;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  const posts = getAllPosts();
  return posts.find((post) => post.slug === slug) || null;
}

export function getAllPostSlugs(): string[] {
  const posts = getAllPosts();
  return posts.map((post) => post.slug);
}