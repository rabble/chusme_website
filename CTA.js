import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
export function CTA({ heading = "Ready to organize your community?", description = "Start a space, invite your people, and unlock tools together. Holis is free, open, and built for you.", buttonText = "Get Started", buttonHref = "https://chusme.app" }) {
    return (React.createElement("section", { className: "section-padding" },
        React.createElement("div", { className: "container-narrow" },
            React.createElement(Card, { className: "border-border/15 bg-background-secondary" },
                React.createElement(CardContent, { className: "flex flex-col items-center text-center py-10" },
                    React.createElement("h2", { className: "text-2xl md:text-3xl font-bold mb-3 tracking-tight" }, heading),
                    React.createElement("p", { className: "text-lg text-muted-foreground mb-6 max-w-2xl" }, description),
                    React.createElement(Button, { size: "lg", asChild: true },
                        React.createElement("a", { href: buttonHref }, buttonText)))))));
}
