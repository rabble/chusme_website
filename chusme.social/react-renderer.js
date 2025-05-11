import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Layout } from '../components/layout';
/**
 * This helper function renders React components to HTML strings
 * for use in our Cloudflare Workers handler
 */
export function renderToHtml(component) {
    return ReactDOMServer.renderToString(component);
}
/**
 * Render a page with the default layout
 */
export function renderPage(props) {
    return renderToHtml(React.createElement(Layout, { title: props.title, description: props.description }, props.children));
}
