import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/posts';
import NewsletterSignup from '@/components/NewsletterSignup';

export const metadata: Metadata = {
  title: 'CalCrypto Blog - Crypto Calculator Insights',
  description: 'Insights, guides, and updates about crypto calculators and trading tools.',
};

export default function BlogPage() {
  const posts = getAllPosts();

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
              <Link href="/blog" className="text-primary font-medium">
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">CalCrypto Blog</h1>
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            Insights, guides, and updates about crypto calculators and trading tools.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-secondary text-lg">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {posts.map((post) => (
               <article
                 key={post.slug}
                 className="glass-card hover:border-primary/50 transition-colors overflow-hidden"
               >
                 {post.image && (
                   <div className="relative w-full aspect-video overflow-hidden">
                     <Image
                       src={post.image}
                       alt={post.title}
                       fill
                       className="object-cover transition-transform hover:scale-105"
                     />
                   </div>
                 )}
                 <div className="p-6">
                   <div className="mb-4">
                     <time className="text-sm text-secondary">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                <h2 className="text-2xl font-bold text-primary mb-3">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-primary/80 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-secondary mb-4 line-clamp-3">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Read more →
                   </Link>
                 </div>
               </article>
            ))}
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="max-w-md mx-auto mt-16">
          <NewsletterSignup />
        </div>
      </div>
    </div>
  );
}