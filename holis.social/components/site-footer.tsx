import React from "react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/10 bg-background py-8 md:py-12">
      <div className="container-narrow flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <p className="text-center text-sm leading-relaxed text-foreground/70 md:text-left">
            &copy; {new Date().getFullYear()} Holis Social. All rights reserved.
          </p>
        </div>
        <div className="flex gap-6">
          <a
            href="/terms"
            className="text-sm font-medium text-foreground/70 no-underline transition-colors hover:text-foreground"
          >
            Terms
          </a>
          <a
            href="/privacy"
            className="text-sm font-medium text-foreground/70 no-underline transition-colors hover:text-foreground"
          >
            Privacy
          </a>
          <a
            href="/contact"
            className="text-sm font-medium text-foreground/70 no-underline transition-colors hover:text-foreground"
          >
            Contact
          </a>
          <a
            href="https://github.com/verse/holis"
            className="text-sm font-medium text-foreground/70 no-underline transition-colors hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}