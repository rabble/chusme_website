import { markdownToHtml } from '../../lib/markdown';
import fs from 'fs/promises';
import path from 'path';

export default async function handler(): Promise<Response> {
  const mdPath = path.join(process.cwd(), 'pages', 'use-cases', 'indigenous.md');
  const md = await fs.readFile(mdPath, 'utf-8');
  const { content, metadata } = markdownToHtml(md);
  return new Response(content, {
    headers: { 'Content-Type': 'text/html' },
  });
} 