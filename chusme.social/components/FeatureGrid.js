import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
const features = [
    {
        icon: '🌱',
        title: 'Community-owned',
        desc: 'Built for groups, not growth hacks. You own your space and data.'
    },
    {
        icon: '🛡️',
        title: 'Private & Encrypted',
        desc: 'End-to-end encrypted, metadata-light. Your conversations are yours.'
    },
    {
        icon: '🔓',
        title: 'Feature Unlocking',
        desc: 'Fund the tools you need together. Unlock new features as a group.'
    },
    {
        icon: '📣',
        title: 'No Ads or Algorithms',
        desc: 'Chronological, unfiltered, and yours. No engagement traps.'
    },
];
export function FeatureGrid() {
    return (React.createElement("section", { className: "section-padding" },
        React.createElement("div", { className: "container-narrow" },
            React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6" }, features.map((feature) => (React.createElement(Card, { key: feature.title, className: "flex flex-col items-center text-center border border-border/15 bg-background hover:bg-background-secondary transition-colors" },
                React.createElement(CardContent, { className: "py-6" },
                    React.createElement("span", { className: "text-4xl mb-4 block" }, feature.icon),
                    React.createElement("h3", { className: "text-xl font-semibold mb-2 tracking-tight" }, feature.title),
                    React.createElement("p", { className: "text-muted-foreground text-base mb-0" }, feature.desc)))))))));
}
