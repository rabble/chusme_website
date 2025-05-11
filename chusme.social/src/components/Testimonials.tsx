import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Testimonial {
  quote: string;
  author: string;
}

const testimonials: Testimonial[] = [
  {
    quote: 'We had 300,000 people in our Facebook group. One day it was gone.',
    author: 'Cressida, community organizer',
  },
  {
    quote: "We needed to alert students during an ICE raid. Facebook didn't reach them. Signal didn't scale. So we built Chusme.",
    author: '@rabble',
  },
  {
    quote: 'Feels like WhatsApp — but with community ownership and care.',
    author: 'Kaye-Maree, Māori organizer',
  },
];

export function Testimonials() {
  return (
    <section className="section-padding bg-background-secondary">
      <div className="container-narrow">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 tracking-tight">What Communities Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border/15 bg-background">
              <CardContent className="p-6">
                <blockquote className="border-none pl-0 py-0 bg-transparent my-0">
                  <p className="text-lg mb-4 italic text-foreground">"{testimonial.quote}"</p>
                  <footer className="text-sm text-muted-foreground font-medium">— {testimonial.author}</footer>
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}