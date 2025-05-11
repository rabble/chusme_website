import MarkdownIt from 'markdown-it';

const mdParser = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
});

interface Metadata {
  title?: string;
  description?: string;
  image?: string;
  [key: string]: string | undefined;
}

export function markdownToHtml(md: string): { content: string; metadata: Metadata } {
  const metadata: Metadata = {};
  let content = md;

  // Extract front matter if present
  if (content.startsWith('---')) {
    const endOfFrontMatter = content.indexOf('---', 3);
    if (endOfFrontMatter !== -1) {
      const frontMatter = content.substring(3, endOfFrontMatter).trim();
      content = content.substring(endOfFrontMatter + 3).trim();

      // Parse front matter lines
      const frontMatterLines = frontMatter.split('\n');
      for (const line of frontMatterLines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
          const key = line.substring(0, colonIndex).trim();
          let value = line.substring(colonIndex + 1).trim();

          // Remove quotes if present
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.substring(1, value.length - 1);
          }

          metadata[key] = value;
        }
      }
    }
  }

  // If no title was found in the front matter, look for the first heading
  if (!metadata.title) {
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      metadata.title = titleMatch[1].trim();
    }
  }

  // Process Markdown using markdown-it
  content = mdParser.render(content);

  return { content, metadata };
} 