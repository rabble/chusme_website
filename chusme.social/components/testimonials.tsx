import React from "react";
import { Card, CardContent } from "./ui/card";

export interface Testimonial {
  content: string;
  author: string;
  role?: string;
}

interface TestimonialsProps {
  title?: string;
  description?: string;
  testimonials: Testimonial[];
}

export function Testimonials({ title, description, testimonials }: TestimonialsProps) {
  return (
    <section className="w-full py-12">
      <div className="container px-4 md:px-6">
        {(title || description) && (
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            {title && <h2 className="text-3xl font-bold tracking-tighter">{title}</h2>}
            {description && (
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <blockquote className="space-y-2">
                  <p className="text-lg">"{testimonial.content}"</p>
                  <footer className="text-sm text-muted-foreground">
                    <span className="font-semibold">— {testimonial.author}</span>
                    {testimonial.role && <>, {testimonial.role}</>}
                  </footer>
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}