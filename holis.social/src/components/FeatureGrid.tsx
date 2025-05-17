import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Feature {
  icon: string;
  title: string;
  desc: string;
}

const features: Feature[] = [
  {
    icon: '🌱',
    title: 'Community-owned',
    desc: 'Built for groups, not growth hacks. You own your space and data.'
  },
  {
    icon: '🛡️',
    title: 'Private & Encrypted',
    desc: 'End-to-end encrypted, metadata-light. Your conversations are yours.'
  },
  {
    icon: '🔓',
    title: 'Feature Unlocking',
    desc: 'Fund the tools you need together. Unlock new features as a group.'
  },
  {
    icon: '📣',
    title: 'No Ads or Algorithms',
    desc: 'Chronological, unfiltered, and yours. No engagement traps.'
  },
];

export function FeatureGrid() {
  return (
    <section className="section-padding">
      <div className="container-narrow">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="flex flex-col items-center text-center border border-border/15 bg-background hover:bg-background-secondary transition-colors">
              <CardContent className="py-6">
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-semibold mb-2 tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground text-base mb-0">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 