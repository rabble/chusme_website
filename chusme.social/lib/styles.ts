// This file contains the pre-built CSS styles for the site
// When building for production, run npm run build and copy the contents
// of static/styles.css here as a string

export const TAILWIND_CSS = `
/* Tailwind CSS Base Styles */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Imported Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

/* Custom Styles */
body {
  @apply bg-base text-text font-sans antialiased min-h-screen;
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  line-height: 1.7;
}

.dark body {
  @apply bg-base-dark text-base text-base;
}

main {
  @apply max-w-prose mx-auto px-4 py-8;
}

h1, h2, h3, h4, h5, h6 {
  @apply font-bold text-text mb-4;
}

h1 {
  @apply text-4xl md:text-5xl leading-tight mb-6;
}
h2 {
  @apply text-2xl md:text-3xl leading-snug mb-5;
}
h3 {
  @apply text-xl md:text-2xl mb-4;
}

p, ul, ol, blockquote {
  @apply mb-5;
}

ul, ol {
  @apply pl-6;
}

blockquote {
  @apply border-l-4 border-accent-soft pl-4 italic text-text-light bg-base/50 rounded-lg;
}

a {
  @apply text-accent underline underline-offset-2 hover:text-accent-soft transition;
}

hr {
  @apply my-8 border-base-dark/20;
}

.card {
  @apply bg-white rounded-lg shadow-soft p-6 mb-6;
}

@layer components {
  .btn {
    @apply inline-block px-5 py-2 rounded-lg bg-accent text-white font-semibold shadow-soft hover:bg-accent-soft transition;
  }
}
`;