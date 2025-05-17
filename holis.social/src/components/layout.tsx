import React from 'react';

interface LayoutProps {
  title: string;
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ title, children }) => (
  <>
    <title>{`${title} - Holis Social`}</title>
    <meta property="og:site_name" content="Holis Social" />
    {children}
  </>
); 