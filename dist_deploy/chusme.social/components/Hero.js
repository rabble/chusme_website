import React from 'react';
import { Button } from '@/components/ui/button';
export function Hero({ title = "Organize your community. On your terms.", description = "Chusme is a community-powered platform to message, plan, fund, and grow — without ads, algorithms, or fear of being shut down.", cta = { text: "Launch the App", href: "https://chusme.app" }, secondaryCta }) {
    return (React.createElement("section", { className: "w-full py-16 md:py-20 lg:py-24" },
        React.createElement("div", { className: "container-narrow" },
            React.createElement("div", { className: "flex flex-col items-center space-y-8 text-center" },
                React.createElement("div", { className: "space-y-4" },
                    React.createElement("h1", { className: "text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none" }, title),
                    React.createElement("p", { className: "mx-auto max-w-[700px] text-foreground/80 text-lg leading-relaxed md:text-xl" }, description)),
                React.createElement("div", { className: "flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4" },
                    cta && (React.createElement(Button, { asChild: true, size: "lg" },
                        React.createElement("a", { href: cta.href }, cta.text))),
                    secondaryCta && (React.createElement(Button, { asChild: true, variant: "outline", size: "lg" },
                        React.createElement("a", { href: secondaryCta.href }, secondaryCta.text))))))));
}
