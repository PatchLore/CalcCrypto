import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';

export async function GET() {
  const posts = getAllPosts();

  const rssItems = posts.map((post) => {
    const pubDate = new Date(post.date).toUTCString();
    return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>https://www.calccrypto.com/blog/${post.slug}</link>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid>https://www.calccrypto.com/blog/${post.slug}</guid>
    </item>`;
  }).join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CalCrypto Blog - Crypto Calculator Insights</title>
    <description>Insights, guides, and updates about crypto calculators and trading tools.</description>
    <link>https://www.calccrypto.com/blog</link>
    <atom:link href="https://www.calccrypto.com/blog/feed.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>CalCrypto Blog</generator>
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}