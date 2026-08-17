import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getAllPostSlugs, getPostBySlug, DEFAULT_AUTHOR } from '@/lib/posts';
import NewsletterSignup from '@/components/NewsletterSignup';
import { MdxImage } from '@/components/blog/MdxImage';
import { MarkdownBlock } from '@/components/blog/MarkdownBlock';
import { MarkdownTable, MarkdownTd, MarkdownTh } from '@/components/blog/MarkdownTable';
import { JsonLd } from '@/components/seo/JsonLd';

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
    alternates: {
      canonical: `https://www.calccrypto.com/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://www.calccrypto.com/blog/${slug}`,
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.date,
    "author": {
      "@type": "Organization",
      "name": post.author || DEFAULT_AUTHOR
    },
    "publisher": {
      "@type": "Organization",
      "name": "CalcCrypto",
      "url": "https://www.calccrypto.com"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.calccrypto.com/blog/${post.slug}`
    },
    "url": `https://www.calccrypto.com/blog/${post.slug}`,
    ...(post.category ? { "articleSection": post.category } : {}),
    ...(post.tags?.length ? { "keywords": post.tags.join(', ') } : {}),
    ...(post.image ? { "image": `https://www.calccrypto.com${post.image}` } : {})
  };

  // Emitted only for posts that declare `faq` in frontmatter. Every Q&A pair
  // must also be answerable from the visible article body — Google requires
  // the content to be present on the page, not schema-only.
  const faqSchema = post.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": post.faq.map((item) => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer,
          },
        })),
      }
    : null;

  return (
    <>
      <JsonLd schema={blogPostingSchema} />
      {faqSchema && <JsonLd schema={faqSchema} />}
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
                CalcCrypto
              </div>
            </div>
            <nav aria-label="Main navigation" className="hidden md:flex items-center space-x-6">
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
                {/* Featured Image */}
                {post.image && (
                   <div className="relative w-full h-64 md:h-96 overflow-hidden">
                     <Image
                       src={post.image}
                       alt={`Featured image for article: ${post.title}`}
                       fill
                       priority
                       className="object-cover rounded-t-lg"
                       sizes="(max-width: 768px) 100vw, 1200px"
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

                  <div className="prose prose-invert prose-lg max-w-none prose-headings:text-primary prose-headings:font-bold prose-p:text-secondary prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-hr:border-crypto-border/40 prose-hr:my-8 prose-strong:text-primary prose-code:text-crypto-accent prose-code:bg-crypto-muted/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
                   <ReactMarkdown 
                     remarkPlugins={[remarkGfm]}
                     components={{
                       // @ts-expect-error ReactMarkdown image props differ slightly from Next.js Image props
                       img: MdxImage,
                       // Renders `cc-*` fenced blocks as typed components; all
                       // other code blocks pass through unchanged.
                       pre: MarkdownBlock,
                       // Wide tables must scroll rather than be clipped on mobile.
                       table: MarkdownTable,
                       th: MarkdownTh,
                       td: MarkdownTd
                     }}
                   >
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
    </>
  );
}
