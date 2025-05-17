export function renderLayout({ title, description, content }) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <style>
    /* Basic styles */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', system-ui, sans-serif;
      color: #334155;
      line-height: 1.6;
      background-color: #F8FAFC;
      min-height: 100vh;
    }

    header {
      padding: 1rem 0;
      border-bottom: 1px solid #ddd;
      margin-bottom: 2rem;
    }

    nav {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-weight: 700;
      font-size: 1.25rem;
      color: #000;
      text-decoration: none;
      display: flex;
      align-items: center;
    }
    
    .logo img {
      height: 30px;
      margin-right: 0.5rem;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .nav-links a {
      color: #334155;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
    }

    .nav-links a:hover {
      color: #6366F1;
    }

    .btn-small {
      padding: 0.35rem 0.75rem;
      font-size: 0.9rem;
      margin: 0;
    }

    main {
      max-width: 65ch;
      margin: 0 auto;
      padding: 0 1rem 2rem;
    }

    h1, h2, h3 {
      margin-bottom: 1rem;
      color: #000;
      font-weight: 700;
    }

    h1 {
      font-size: 2rem;
      margin-bottom: 1.5rem;
    }

    h2 {
      font-size: 1.5rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }

    p, ul, ol {
      margin-bottom: 1rem;
    }

    ul, ol {
      padding-left: 1.5rem;
    }

    a {
      color: #6366F1;
    }

    blockquote {
      margin: 1.5rem 0;
      padding: 1rem 1.5rem;
      border-left: 4px solid #6366F1;
      background-color: #f9fafb;
      font-style: italic;
      font-size: 1.1rem;
    }

    footer {
      margin-top: 3rem;
      padding: 1.5rem 0;
      border-top: 1px solid #ddd;
      text-align: center;
      font-size: 0.875rem;
      color: #64748B;
    }

    footer p {
      margin-bottom: 0.75rem;
    }

    footer p:last-child {
      margin-bottom: 0;
    }

    footer a {
      color: #6366F1;
      text-decoration: none;
      padding: 0 0.25rem;
    }

    footer a:hover {
      text-decoration: underline;
    }

    /* Grid for features */
    .grid-features {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      margin: 2rem 0;
    }

    @media (min-width: 640px) {
      .grid-features {
        grid-template-columns: 1fr 1fr;
      }
    }

    /* Button styles */
    .btn {
      display: inline-block;
      padding: 0.5rem 1rem;
      background-color: #2563eb;
      color: white !important;
      text-decoration: none;
      border-radius: 0.25rem;
      font-weight: 600;
      margin-right: 1rem;
      margin-bottom: 1rem;
    }

    .btn:hover {
      background-color: #1d4ed8;
    }

    /* Table styles */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
    }

    th, td {
      border: 1px solid #ddd;
      padding: 0.5rem;
      text-align: left;
    }

    th {
      background-color: #f5f5f5;
      font-weight: 600;
    }

    tr:nth-child(even) {
      background-color: #f9f9f9;
    }

    /* Screenshots and Images */
    .screenshot-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin: 2rem 0;
    }

    .screenshot {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .mobile-screenshot {
      width: 100%;
      max-width: 220px;
      border-radius: 1rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      border: 1px solid #e2e8f0;
      transition: transform 0.2s ease;
    }

    .mobile-screenshot:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }

    .screenshot p {
      margin-top: 0.75rem;
      font-weight: 600;
      font-size: 0.9rem;
      text-align: center;
    }

    .feature-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: center;
      margin: 3rem 0;
      padding: 1.5rem;
      border-radius: 0.75rem;
      background-color: #f8fafc;
      transition: background-color 0.3s ease;
    }

    .feature-section:hover {
      background-color: #f1f5f9;
    }

    .feature-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .feature-section:nth-child(odd) {
      flex-direction: row-reverse;
    }

    .feature-section .mobile-screenshot {
      margin: 0 auto;
      display: block;
      max-width: 240px;
    }

    .feature-image {
      width: 100%;
      border-radius: 0.75rem;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    /* Pricing Table Styles */
    .pricing-table {
      width: 100%;
      border-collapse: collapse;
      margin: 2rem 0;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border-radius: 0.5rem;
      overflow: hidden;
    }

    .pricing-table th {
      background-color: #f0f4ff;
      font-weight: 700;
      text-align: left;
      padding: 1rem;
      border: 1px solid #dde6ff;
    }

    .pricing-table td {
      padding: 1rem;
      border: 1px solid #e5e7eb;
      vertical-align: middle;
    }

    .pricing-table tr:nth-child(even) {
      background-color: #f9fafb;
    }

    .pricing-table tr:hover {
      background-color: #f5f7ff;
    }

    /* Code formatting */
    code {
      font-family: monospace;
      background-color: #f5f5f5;
      padding: 0.1rem 0.3rem;
      border-radius: 0.25rem;
      font-size: 0.9em;
    }

    /* Use Case Grid Layout */
    .use-case-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      margin: 2rem 0;
    }

    @media (min-width: 768px) {
      .use-case-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .use-case-card {
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      padding: 1.5rem;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .use-case-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .use-case-emoji {
      font-size: 2rem;
      margin-bottom: 0.75rem;
    }

    .use-case-card h3 {
      margin-top: 0;
      margin-bottom: 0.75rem;
      font-size: 1.25rem;
    }

    .use-case-card p {
      font-size: 0.95rem;
      margin-bottom: 1rem;
    }

    .use-case-list ul {
      padding-left: 1.25rem;
      margin-bottom: 1rem;
    }

    .use-case-list li {
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .use-case-link {
      margin-top: auto;
      padding-top: 0.5rem;
    }

    .use-case-link a {
      font-size: 0.9rem;
      font-weight: 600;
    }

    /* CTA Box */
    .cta-box {
      background-color: #f5f8ff;
      border: 1px solid #dde6ff;
      border-radius: 0.5rem;
      padding: 1.5rem;
      margin: 2rem 0;
      text-align: center;
    }

    .cta-box h3 {
      margin-top: 0;
      margin-bottom: 0.75rem;
    }

    .cta-box p {
      margin-bottom: 1.25rem;
    }

    .cta-box .btn {
      margin: 0 0.5rem 0.5rem 0;
    }

    /* Next Steps */
    .next-steps {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      margin: 1.5rem 0;
    }

    @media (min-width: 640px) {
      .next-steps {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .next-step-item {
      display: flex;
      align-items: center;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      text-decoration: none;
      color: inherit;
      transition: background-color 0.2s;
    }

    .next-step-item:hover {
      background-color: #f9f9f9;
      color: inherit;
    }

    .next-step-icon {
      font-size: 1.5rem;
      margin-right: 0.75rem;
    }

    .next-step-text {
      font-size: 0.9rem;
      font-weight: 500;
    }

    /* Sidebar */
    .with-sidebar {
      position: relative;
    }

    @media (min-width: 768px) {
      .with-sidebar {
        display: flex;
        gap: 2rem;
      }

      .main-content {
        flex: 1;
      }

      .sidebar {
        width: 33%;
        max-width: 350px;
      }
    }

    .sidebar-box {
      padding: 1.5rem;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      background-color: #f9f9f9;
      margin-bottom: 1.5rem;
    }

    .sidebar-box h3 {
      font-size: 1.25rem;
      margin-top: 0;
      margin-bottom: 1rem;
      border-bottom: 2px solid #e5e5e5;
      padding-bottom: 0.5rem;
    }

    .sidebar-box p {
      font-size: 0.95rem;
      margin-bottom: 1rem;
    }

    .sidebar-box ul {
      padding-left: 1.25rem;
      margin-bottom: 1rem;
    }

    .sidebar-box li {
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .sidebar-box blockquote {
      padding: 0.75rem;
      margin: 1rem 0;
      border-left: 3px solid #ddd;
      background-color: #f5f5f5;
      font-style: italic;
    }

    .sidebar-divider {
      display: block;
      width: 80%;
      margin: 1.5rem auto;
      height: 1px;
      background-color: #ddd;
    }

    /* Step Cards */
    .steps-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin: 2rem 0;
    }

    .step-card {
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      background-color: #fff;
      padding: 1.5rem;
      position: relative;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .step-number {
      position: absolute;
      top: 1rem;
      right: 1rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: #6366F1;
      background-color: #EEF2FF;
      padding: 0.25rem 0.5rem;
      border-radius: 1rem;
    }

    .step-emoji {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .step-card h2 {
      margin-top: 0;
      font-size: 1.35rem;
      margin-bottom: 0.75rem;
      color: #1F2937;
    }

    .step-card p, .step-card ul {
      font-size: 0.95rem;
      margin-bottom: 0.75rem;
    }

    .step-card li {
      margin-bottom: 0.4rem;
    }

    .step-card blockquote {
      background-color: #f5f8ff;
      border-left: 3px solid #6366F1;
      padding: 0.75rem;
      margin: 1rem 0;
      font-size: 0.9rem;
    }

    .step-actions {
      margin-top: 1rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
    }

    .step-actions a {
      display: inline-block;
      font-size: 0.9rem;
    }

    /* Help Section */
    .help-section {
      margin: 3rem 0;
      text-align: center;
    }

    .help-links {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .help-link {
      display: flex;
      align-items: center;
      text-decoration: none;
      padding: 0.75rem 1.25rem;
      background-color: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      transition: background-color 0.2s;
    }

    .help-link:hover {
      background-color: #f0f0f0;
    }

    .help-link-icon {
      font-size: 1.25rem;
      margin-right: 0.75rem;
    }

    .help-link-text {
      font-weight: 500;
      font-size: 0.9rem;
      color: #333;
    }

    /* Responsive styles */
    @media (max-width: 768px) {
      nav {
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
      }

      .nav-links {
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.75rem;
      }

      .nav-links a {
        font-size: 0.9rem;
      }

      main {
        padding: 0 0.75rem 1.5rem;
      }

      .screenshot-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }

      .feature-section {
        grid-template-columns: 1fr;
        gap: 1.5rem;
        padding: 1.25rem;
      }

      .feature-section .mobile-screenshot {
        max-width: 200px;
        margin-bottom: 1rem;
      }

      .help-links {
        flex-direction: column;
        align-items: center;
      }

      .help-link {
        width: 100%;
        justify-content: center;
      }

      .mobile-screenshot {
        max-width: 180px;
      }
    }

    @media (max-width: 600px) {
      .screenshot-grid {
        grid-template-columns: 1fr;
      }

      .mobile-screenshot {
        max-width: 220px;
      }

      .feature-section {
        padding: 1rem;
        margin: 2rem 0;
      }

      .feature-section .mobile-screenshot {
        max-width: 180px;
      }
    }

    @media (max-width: 480px) {
      .nav-links {
        gap: 0.5rem;
      }

      .nav-links a:not(.btn) {
        font-size: 0.85rem;
      }
    }
  </style>
</head>
<body>
  <header>
    <nav>
      <a href="/" class="logo"><img src="https://files.holis.social/assets/holis_logo.png" alt="Holis logo" />Holis</a>
      <div class="nav-links">
        <a href="/about">About</a>
        <a href="/how-it-works">How It Works</a>
        <a href="/use-cases">Use Cases</a>
        <a href="/pricing">Pricing</a>
        <a href="/contribute">Contribute</a>
        <a href="/use-holis">App</a>
        <a href="/get-started" class="btn-small">Get Started</a>
      </div>
    </nav>
  </header>
  <main>
    ${content}
  </main>
  <footer>
    <p>&copy; 2025 Holis.social</p>
    <p>
      <a href="/about">About</a> ·
      <a href="/how-it-works">How It Works</a> ·
      <a href="/pricing">Pricing</a> ·
      <a href="/contribute">Contribute</a> ·
      <a href="https://app.holis.social">App</a> ·
      <a href="/get-started">Get Started</a> ·
      <a href="/use-cases">Use Cases</a> ·
      <a href="https://github.com/verse-pbc/plur">GitHub</a> ·
      <a href="/privacy">Privacy</a>
    </p>
  </footer>
</body>
</html>`;
}
