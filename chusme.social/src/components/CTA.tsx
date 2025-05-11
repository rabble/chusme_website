import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CTAProps {
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

export function CTA({
  heading = "Ready to organize your community?",
  description = "Start a space, invite your people, and unlock tools together. Chusme is free, open, and built for you.",
  buttonText = "Get Started",
  buttonHref = "https://chusme.app"
}: CTAProps) {
  return (
    <section className="section-padding">
      <div className="container-narrow">
        <Card className="border-border/15 bg-background-secondary">
          <CardContent className="flex flex-col items-center text-center py-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">{heading}</h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl">{description}</p>
            <Button size="lg" asChild>
              <a href={buttonHref}>{buttonText}</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
} 