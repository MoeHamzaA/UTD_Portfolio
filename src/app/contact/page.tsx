import Container from '@/components/common/Container';
import { Separator } from '@/components/ui/separator';
import { contactConfig } from '@/config/Contact';
import { generateMetadata as getMetadata } from '@/config/Meta';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  ...getMetadata('/contact'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function ContactPage() {
  return (
    <Container className="py-16">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            {contactConfig.title}
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            {contactConfig.description}
          </p>
        </div>
        <Separator />

        {/* Contact Links */}
        <div className="mx-auto grid max-w-2xl gap-4">
          {contactConfig.links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="hover:bg-muted/50 flex items-center gap-4 rounded-md border border-dashed border-black/20 p-4 transition-colors dark:border-white/10"
            >
              <span className="size-6 shrink-0">{link.icon}</span>
              <div className="min-w-0">
                <p className="font-semibold">{link.name}</p>
                <p className="text-muted-foreground truncate text-sm">
                  {link.value}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </Container>
  );
}
