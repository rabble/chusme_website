# Holis Website Modularization & Migration Checklist

_Last updated: 2025-05-11_

---

## 🗂️ Migration Steps & Checklist

### 1. Directory & File Structure
- [x] Create `/pages` directory for markdown content
- [x] Create `/routes` directory for route handlers
- [x] Create `/lib` directory for shared utilities (e.g., markdown rendering, router)

### 2. Generate Markdown Content Files
- [x] Create `pages/index.md`
- [x] Create `pages/about.md`
- [x] Create `pages/contribute.md`
- [x] Create `pages/how-it-works.md`
- [x] Create `pages/use-cases/tenants.md`
- [x] Create `pages/use-cases/mutual-aid.md`
- [x] Create `pages/use-cases/artists.md`
- [x] Create `pages/use-cases/indigenous.md`

### 3. Modular Route Handlers
- [x] Create `routes/index.ts` (renders `pages/index.md`)
- [x] Create `routes/about.ts` (renders `pages/about.md`)
- [x] Create `routes/contribute.ts` (renders `pages/contribute.md`)
- [x] Create `routes/how-it-works.ts` (renders `pages/how-it-works.md`)
- [x] Create `routes/use-cases/tenants.ts` (renders `pages/use-cases/tenants.md`)
- [x] Create `routes/use-cases/mutual-aid.ts` (renders `pages/use-cases/mutual-aid.md`)
- [x] Create `routes/use-cases/artists.ts` (renders `pages/use-cases/artists.md`)
- [x] Create `routes/use-cases/indigenous.ts` (renders `pages/use-cases/indigenous.md`)

### 4. Shared Utilities
- [x] Create `lib/markdown.ts` for markdown-to-HTML rendering
- [x] Create `lib/router.ts` for routing logic (file-based or map-based)

### 5. Main Entry Point Refactor
- [ ] Refactor main server entry (e.g., `server.ts` or `main.ts`) to use new router
- [ ] Remove monolithic `index.ts` logic

### 6. Testing & Validation
- [ ] Test each route for correct rendering
- [ ] Validate markdown rendering and metadata extraction
- [ ] Check for broken links or missing pages

### 7. Documentation
- [ ] Update `docs/plan.md` to reference new structure
- [ ] Document how to add new pages/routes

---

## 📝 Notes
- Consider moving markdown content to KV/R2 storage in the future for scalability
- Plan for future features: dynamic content, authentication, etc.
- Keep code modular and well-documented for future contributors 