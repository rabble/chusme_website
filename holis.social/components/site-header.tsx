import React from "react"
import { Button } from "./ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-narrow flex h-16 items-center">
        <div className="mr-6 flex">
          <a href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🗣️</span>
            <span className="hidden font-bold tracking-tight sm:inline-block">
              Chusme
            </span>
          </a>
        </div>
        <nav className="flex flex-1 items-center justify-between space-x-6 md:justify-end">
          <div className="flex-1 md:flex-initial">
            <div className="hidden space-x-6 md:flex">
              <a
                href="/about"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground no-underline"
              >
                About
              </a>
              <a
                href="/how-it-works"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground no-underline"
              >
                How It Works
              </a>
              <a
                href="/design-principles"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground no-underline"
              >
                Design Principles
              </a>
              <a
                href="/contribute"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground no-underline"
              >
                Contribute
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button asChild>
              <a href="https://app.holis.social" target="_blank" rel="noopener noreferrer">
                Open App
              </a>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}