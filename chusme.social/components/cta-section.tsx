import React from "react";
import { Button } from "./ui/button";

interface CTASectionProps {
  title: string;
  description: string;
  primaryCta: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  bgColor?: "default" | "muted" | "accent";
}

export function CTASection({
  title,
  description,
  primaryCta,
  secondaryCta,
  bgColor = "default",
}: CTASectionProps) {
  const bgClasses = {
    default: "bg-background",
    muted: "bg-muted",
    accent: "bg-accent text-accent-foreground",
  };

  return (
    <section className={`w-full py-12 md:py-24 ${bgClasses[bgColor]}`}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              {title}
            </h2>
            <p className="mx-auto max-w-[700px] md:text-xl">
              {description}
            </p>
          </div>
          <div className="space-x-4">
            <Button asChild size="lg" variant={bgColor === "accent" ? "default" : "accent"}>
              <a href={primaryCta.href}>{primaryCta.text}</a>
            </Button>
            {secondaryCta && (
              <Button asChild size="lg" variant={bgColor === "accent" ? "secondary" : "outline"}>
                <a href={secondaryCta.href}>{secondaryCta.text}</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}