import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
const testimonials = [
    {
        quote: 'We had 300,000 people in our Facebook group. One day it was gone.',
        author: 'Cressida, community organizer',
    },
    {
        quote: "We needed to alert students during an ICE raid. Facebook didn't reach them. Signal didn't scale. So we built Holis.",
        author: '@rabble',
    },
    {
        quote: 'Feels like WhatsApp — but with community ownership and care.',
        author: 'Kaye-Maree, Māori organizer',
    },
];
export function Testimonials() {
    return (React.createElement("section", { className: "section-padding bg-zinc-50 py-16" },
        React.createElement("div", { className: "container-narrow max-w-5xl mx-auto px-4" },
            React.createElement("h2", { className: "text-3xl md:text-4xl font-bold text-center mb-12 tracking-tight" }, "Built for Organizers Like You"),
            React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8" }, testimonials.map((testimonial, index) => (React.createElement(Card, { key: index, className: "border border-zinc-200 shadow-sm bg-white hover:shadow-md transition-all duration-200" },
                React.createElement(CardContent, { className: "p-8" },
                    React.createElement("blockquote", { className: "border-none pl-0 py-0 bg-transparent my-0" },
                        React.createElement("p", { className: "text-lg mb-6 italic text-zinc-800 font-medium leading-relaxed" },
                            "\"",
                            testimonial.quote,
                            "\""),
                        React.createElement("footer", { className: "text-sm text-zinc-600 font-semibold" },
                            "\u2014 ",
                            testimonial.author))))))))));
}
