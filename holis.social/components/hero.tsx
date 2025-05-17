import React from "react";
import { Button } from "./ui/button";

interface HeroProps {
  title: string;
  description: string;
  cta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
}

export function Hero({ title, description, cta, secondaryCta }: HeroProps) {
  return (
    <section className="w-full py-16 md:py-20 lg:py-24">
      <div className="container-narrow">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              {title}
            </h1>
            <p className="mx-auto max-w-[700px] text-foreground/80 text-lg leading-relaxed md:text-xl">
              {description}
            </p>
          </div>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            {cta && (
              <Button asChild size="lg">
                <a href={cta.href}>{cta.text}</a>
              </Button>
            )}
            {secondaryCta && (
              <Button asChild variant="outline" size="lg">
                <a href={secondaryCta.href}>{secondaryCta.text}</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}