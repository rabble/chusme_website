import React from 'react';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>&copy; {new Date().getFullYear()} Holis Social. All rights reserved.</p>
      <p>
        <a href="https://github.com/verse/holis" target="_blank" rel="noopener noreferrer">GitHub</a>
      </p>
    </footer>
  );
} 