import React from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export function Layout({ children, title, description }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{`${title} - Chusme Social`}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Chusme Social" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          @tailwind base;
          @tailwind components;
          @tailwind utilities;

          @layer base {
            :root {
              --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;

              /* Neutral + Soft Primary palette */
              --background: 0 0% 100%; /* white */
              --background-secondary: 210 40% 98%; /* #f9fafb */
              --foreground: 215 25% 17%; /* #1f2937 (gray-800) */

              --card: 0 0% 100%;
              --card-foreground: 215 25% 17%;

              --popover: 0 0% 100%;
              --popover-foreground: 215 25% 17%;

              --primary: 220 92% 54%; /* #2563eb (blue-600) */
              --primary-foreground: 0 0% 100%;

              --secondary: 265 83% 58%; /* #7c3aed (violet-600) */
              --secondary-foreground: 0 0% 100%;

              --tertiary: 159 92% 30%; /* #059669 (emerald-600) */
              --tertiary-foreground: 0 0% 100%;

              --muted: 214 32% 97%;
              --muted-foreground: 215 16% 47%;

              --accent: 220 92% 54%; /* same as primary */
              --accent-foreground: 0 0% 100%;

              --destructive: 0 84% 60%;
              --destructive-foreground: 0 0% 100%;

              --border: 214 32% 91%;
              --input: 214 32% 91%;
              --ring: 215 25% 17%;

              --radius: 0.5rem;
            }

            * {
              @apply border-border;
            }
            body {
              @apply bg-background text-foreground font-sans antialiased;
              font-family: var(--font-sans);
              line-height: 1.75;
            }

            main {
              @apply min-h-[calc(100vh-144px)];
            }

            section {
              @apply py-8 md:py-16;
            }

            h1, h2, h3, h4, h5, h6 {
              @apply font-bold text-foreground mb-4 tracking-tight;
            }

            h1 {
              @apply text-4xl md:text-5xl leading-tight mb-6;
              letter-spacing: -0.025em;
            }
            h2 {
              @apply text-3xl md:text-4xl leading-snug mb-5;
              letter-spacing: -0.025em;
            }
            h3 {
              @apply text-2xl md:text-3xl mb-4;
              letter-spacing: -0.01em;
            }

            p {
              @apply mb-6 text-lg leading-relaxed;
            }

            a {
              @apply text-primary hover:text-primary/80 transition-colors;
            }
          }

          @layer components {
            .container-narrow {
              @apply max-w-3xl mx-auto px-4 md:px-8 lg:px-12;
            }

            .section-padding {
              @apply py-8 md:py-16;
            }
          }
        `}} />
      </head>
      <body>
        <div className="relative min-h-screen flex flex-col">
          <SiteHeader />
          <main className="flex-1">
            <div className="container max-w-4xl py-12 md:py-16">
              {children}
            </div>
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}