import React from 'react';
export function SiteFooter() {
    return (React.createElement("footer", { className: "site-footer" },
        React.createElement("p", null,
            "\u00A9 ",
            new Date().getFullYear(),
            " Holis Social. All rights reserved."),
        React.createElement("p", null,
            React.createElement("a", { href: "https://github.com/verse/holis", target: "_blank", rel: "noopener noreferrer" }, "GitHub"))));
}
