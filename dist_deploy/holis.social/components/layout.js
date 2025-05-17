import React from 'react';
export const Layout = ({ title, children }) => (React.createElement(React.Fragment, null,
    React.createElement("title", null, `${title} - Holis Social`),
    React.createElement("meta", { property: "og:site_name", content: "Holis Social" }),
    children));
