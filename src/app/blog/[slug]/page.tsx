import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getAllPostSlugs, getPostBySlug } from '@/lib/posts';
import NewsletterSignup from '@/components/NewsletterSignup';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
    },
    twitter: {
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-card mx-4 mt-4">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-sm font-bold text-primary rounded-lg px-3 py-2 border border-crypto-border/60 bg-crypto-background/60">
                CC
              </div>
              <div className="text-2xl font-bold text-primary">
                CrypCal
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-secondary hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/calculators" className="text-secondary hover:text-primary transition-colors">
                Calculators
              </Link>
              <Link href="/blog" className="text-secondary hover:text-primary transition-colors">
                Blog
              </Link>
              <Link href="/about" className="text-secondary hover:text-primary transition-colors">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Back Link */}
          <div className="mb-8">
            <Link
              href="/blog"
              className="text-secondary hover:text-primary transition-colors flex items-center gap-2"
            >
              ← Back to Blog
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Article */}
            <div className="lg:col-span-2">
               <article className="glass-card overflow-hidden">
                 {post.image && (
                   <div className="relative w-full aspect-video">
                     <Image
                       src={post.image}
                       alt={post.title}
                       fill
                       className="object-cover"
                       priority
                     />
                   </div>
                 )}
                 <div className="p-8">
                   <header className="mb-8">
                     <time className="text-secondary text-sm mb-4 block">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <h1 className="text-4xl font-bold text-primary mb-4">{post.title}</h1>
                  <p className="text-xl text-secondary">{post.excerpt}</p>
                </header>

                <div className="prose prose-invert prose-green max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {post.content}
                  </ReactMarkdown>
                </div>
                 </div>
               </article>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <NewsletterSignup />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}