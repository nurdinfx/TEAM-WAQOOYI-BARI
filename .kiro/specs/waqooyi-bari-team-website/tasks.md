# Implementation Tasks
## Naadiga Akhriska iyo Qoraalka Waqooyi Bari

---

## Phase 1 — Monorepo Setup & Shared Infrastructure

- [ ] 1. Initialize pnpm monorepo workspace
  - Create root `package.json` with `workspaces: ["apps/*", "packages/*"]`
  - Add `pnpm-workspace.yaml`
  - Add root `.gitignore`, `.nvmrc` (Node 20)
  - **Acceptance**: `pnpm install` succeeds from repo root

- [ ] 2. Create shared TypeScript + Tailwind config packages
  - `packages/config/tsconfig.base.json` with strict settings
  - `packages/config/tailwind.config.base.ts` with design tokens (colors, fonts, spacing)
  - **Acceptance**: Both apps can extend these configs

- [ ] 3. Create `packages/database` — Supabase client + types
  - Install `@supabase/supabase-js`
  - `src/client.ts` — browser client factory
  - `src/server.ts` — server component client (cookies)
  - `src/types.ts` — hand-written TypeScript types for all tables
  - **Acceptance**: Types match the schema in design.md

- [ ] 4. Bootstrap `apps/web` — Next.js 15 public website
  - `npx create-next-app@latest apps/web --typescript --tailwind --app`
  - Extend shared tsconfig and tailwind config
  - Install: `framer-motion`, `gsap`, `lenis`, `@tsparticles/react`, `lucide-react`, `react-hook-form`, `zod`
  - **Acceptance**: `pnpm --filter web dev` starts without errors

- [ ] 5. Bootstrap `apps/admin` — Next.js 15 admin panel
  - `npx create-next-app@latest apps/admin --typescript --tailwind --app`
  - Install: `@supabase/auth-helpers-nextjs`, `@tiptap/react`, `@tanstack/react-table`, `recharts`, `react-hook-form`, `zod`
  - **Acceptance**: `pnpm --filter admin dev` starts without errors on a different port (3001)

- [ ] 6. Supabase project setup & migrations
  - Create Supabase project
  - Write migration files in `supabase/migrations/` for all tables defined in design.md:
    `site_settings`, `leaders`, `members`, `books`, `reading_sessions`, `writings`, `articles`, `gallery_items`, `achievements`, `sponsors`, `testimonials`, `donations`, `contact_messages`, `newsletter_subscribers`, `activity_logs`
  - Enable Row Level Security on all tables
  - Write RLS policies: public SELECT on public tables, service-role for all mutations
  - Run `supabase db push`
  - **Acceptance**: All tables exist in Supabase dashboard with correct columns and RLS enabled

- [ ] 7. Seed database with realistic sample data
  - `supabase/seed.sql` with realistic 2024–2025 dates
  - 8 leaders, 30 members, 20 books, 10 reading sessions, 5 articles, 15 gallery items, 3 achievements, 4 sponsors, 5 testimonials
  - **Acceptance**: `supabase db reset` populates all tables

---

## Phase 2 — Public Website: Layout & Global Systems

- [ ] 8. Design tokens and global CSS
  - `apps/web/src/styles/globals.css` — CSS custom properties for all color tokens from design.md
  - `apps/web/src/styles/tokens.css` — font declarations (Playfair Display, Inter, Amiri via Google Fonts / next/font)
  - Tailwind config extended with custom colors, fonts, animation keyframes
  - **Acceptance**: All CSS variables accessible in components; custom font loads

- [ ] 9. LoadingScreen component
  - Animated intro screen: gold book icon animates open, text fades in, screen slides up to reveal page
  - Uses Framer Motion, triggered once per session (sessionStorage flag)
  - `components/layout/LoadingScreen.tsx`
  - **Acceptance**: Shows on first visit, does not repeat on navigation

- [ ] 10. LenisProvider and MotionProvider
  - `components/providers/LenisProvider.tsx` — wraps app with Lenis smooth scroll, RAF loop
  - `components/providers/MotionProvider.tsx` — Framer Motion `LazyMotion` with domAnimation
  - Root `layout.tsx` uses both providers
  - **Acceptance**: Smooth scroll works on all pages; no hydration errors

- [ ] 11. Navbar component
  - Fixed top, glassmorphism background on scroll
  - Logo: "NAADIGA" in Playfair Display gold + subtitle
  - Desktop nav links: Home, About, Leadership, Members, Library, Sessions, Writings, News, Gallery, Support, Contact
  - Active link underline with Framer Motion layout animation
  - Mobile: hamburger → full-screen slide-in drawer with staggered link animations
  - `components/layout/Navbar.tsx`
  - **Acceptance**: Responsive at 320px–1440px; all links navigate correctly; drawer closes on link click

- [ ] 12. Footer component
  - Navy background with gold accents
  - Columns: About snippet, Quick Links, Library, Support, Contact info
  - Newsletter subscription form (email input → POST `/api/newsletter`)
  - Social icons (WhatsApp, Facebook, Instagram, YouTube)
  - Copyright line with current year
  - `components/layout/Footer.tsx`
  - **Acceptance**: Newsletter form submits and shows success/error message

- [ ] 13. Page transition wrapper
  - `components/layout/PageTransition.tsx` — Framer Motion `motion.div` with fade+slide variants
  - Each page wraps its root in `<PageTransition>`
  - `AnimatePresence mode="wait"` in root layout
  - **Acceptance**: Smooth 400ms transition when navigating between any two pages

- [ ] 14. Reusable UI primitives
  - `GlassCard.tsx` — glassmorphism card with optional gold glow on hover
  - `Button.tsx` — Primary (gold gradient), Secondary (glass), Ghost variants
  - `SectionHeading.tsx` — section title + subtitle with animated underline
  - `ScrollReveal.tsx` — Framer Motion `useInView` fade+slide wrapper
  - `AnimatedCounter.tsx` — GSAP tween from 0 to value on IntersectionObserver entry
  - `StarRating.tsx` — display-only 5-star rating using Lucide Star icons
  - `TypewriterText.tsx` — character-by-character typing animation hook
  - `ParticlesBackground.tsx` — tsparticles canvas with floating gold dots
  - `Badge.tsx` — colored category/status pill
  - **Acceptance**: Each component renders correctly in isolation; 3D hover only on pointer:fine

---

## Phase 3 — Public Website: Home Page

- [ ] 15. HeroSection component
  - Full-viewport height
  - `<ParticlesBackground />` layer (z-0)
  - Auto-changing background images from `site_settings` with Framer Motion `AnimatePresence` crossfade every 6 seconds
  - Centered content: `<TypewriterText>` for heading "NAADIGA AKHRISKA IYO QORAALKA WAQOOYI BARI", subtitle, description
  - Three `<Button>` CTAs: Join Our Club, Explore Our Library, Support Our Mission
  - Gradient overlay (navy → transparent) over background
  - **Acceptance**: Typing animation starts within 500ms; images cycle smoothly; particles visible

- [ ] 16. StatsSection component
  - 6 `<AnimatedCounter>` cards in responsive grid
  - Values fetched from Supabase `COUNT` queries (members, books, sessions, articles, gallery_items, sponsors)
  - Overridable via `site_settings`
  - Gold number, white label, glassmorphism card
  - **Acceptance**: Counters animate once on scroll into view; values match DB counts

- [ ] 17. Home page featured sections
  - `FeaturedBooks.tsx` — 4 most recent/featured books, 3D hover cards, "View Library" link
  - `UpcomingEvents.tsx` — next 3 reading sessions, card with date badge
  - `RecentArticles.tsx` — 3 latest published articles
  - `SponsorsStrip.tsx` — horizontal scrolling sponsor logos
  - Home `page.tsx` composes all sections with `<ScrollReveal>` wrappers
  - Data fetched server-side via `packages/database` Supabase client
  - **Acceptance**: All sections render with live data; graceful empty states

---

## Phase 4 — Public Website: Core Pages

- [ ] 18. About page (`/about`)
  - Mission, Vision, Objectives sections
  - History with animated vertical timeline (Framer Motion + GSAP)
  - "Why Reading Matters" and "Why Writing Matters" sections with icon cards
  - Content editable via `site_settings` key `about_content`
  - **Acceptance**: Timeline animates on scroll; content renders from DB

- [ ] 19. Leadership page (`/leadership`)
  - Fetch all leaders ordered by `display_order`
  - Leader cards with photo, name, position, bio excerpt, social links
  - Carousel slider (Embla Carousel) for mobile, grid for desktop
  - Placeholder avatar if `photo_url` is null
  - **Acceptance**: Carousel works on mobile; cards show all fields; placeholder shows on missing photo

- [ ] 20. Members page (`/members`)
  - Fetch all active members
  - Member card: photo, name, membership_no, position, join_date, membership_level badge
  - Client-side search by name
  - Filter by membership_level
  - Pagination (20 per page)
  - **Acceptance**: Search filters in real time; pagination controls work; 30+ members load without layout break

- [ ] 21. Books Library page (`/library`)
  - Full digital library grid
  - Book card: cover image (3D hover), title, author, category badge, star rating, date read
  - Client-side search by title/author (debounced 300ms)
  - Filter tabs: All | By Category | By Year
  - Sections: Recently Read, Most Popular (highest rated), Favourites (is_featured)
  - "No books found" empty state
  - **Acceptance**: Filtering works; 3D hover on desktop; empty state shows when no results

- [ ] 22. Book detail page (`/library/[id]`)
  - Full book info: cover, title, author, publisher, category, description, rating, date read, reading status
  - Related books section (same category)
  - **Acceptance**: Page pre-renders with `generateStaticParams`; 404 on invalid id

- [ ] 23. Reading Sessions page (`/sessions`)
  - Timeline list of all sessions
  - Session card: photo, topic, date+time, location, participants count, status badge (upcoming/completed)
  - Calendar view toggle (using react-big-calendar or custom grid)
  - Visual distinction: upcoming = gold border, completed = gray
  - **Acceptance**: Both list and calendar views render; correct status badges

- [ ] 24. Writings page (`/writings`) and detail (`/writings/[id]`)
  - List all published writings, filterable by type (article/essay/poem/research/story)
  - Writing card: cover, title, author, type badge, excerpt
  - Detail page: full Tiptap JSON rendered as HTML
  - **Acceptance**: Type filter works; rich text renders headings, lists, bold, images

- [ ] 25. News & Blog page (`/news`) and article (`/news/[slug]`)
  - List all published articles in reverse chronological order
  - Article card: cover, title, author, date, category, excerpt
  - Detail page: full rich text content, social share buttons (copy link, Facebook, WhatsApp)
  - **Acceptance**: Only published articles show; share buttons work; slug-based routing

- [ ] 26. Gallery page (`/gallery`)
  - Masonry grid layout (CSS columns or Masonry.js)
  - Filter: All | Photos | Videos
  - Photo: hover overlay with caption, click → lightbox (yet-another-react-lightbox)
  - Video: thumbnail + play button → modal with `<video>` player
  - Albums grouping
  - **Acceptance**: Lightbox opens and closes; video modal plays; filter controls work

- [ ] 27. Achievements page (`/achievements`)
  - Animated timeline of awards, certificates, competitions, success stories
  - Category filter
  - Achievement card: image, title, description, date, category badge
  - **Acceptance**: Timeline scroll animation works; cards render with real data

- [ ] 28. Support Us page (`/support`)
  - Fundraising progress bar: animated width, shows `Fundraising_Progress` / `Fundraising_Goal`, text "Waxaan ururinay $X oo ka mid ah $Y"
  - Sponsors "Become a Sponsor" section with sponsor cards
  - Donation methods: EVC Plus, Zaad, Sahal, Premier Bank cards with account details from `site_settings`
  - Stripe online donation form: amount input → Stripe PaymentElement → success/failure states
  - Large gold CTA button
  - **Acceptance**: Progress bar width matches percentage; Stripe form processes test payment; manual payment info displays

- [ ] 29. Partners page (`/partners`)
  - Partner and sponsor logos in auto-scrolling infinite carousel
  - Clicking logo opens `website_url` in new tab
  - **Acceptance**: Carousel loops infinitely; external links open in new tab

- [ ] 30. Testimonials section (embedded on home and about pages)
  - Auto-playing slider (Embla or Swiper)
  - Quote, name, role, photo
  - **Acceptance**: Slider auto-advances every 5 seconds; pauses on hover

- [ ] 31. FAQ page (or section on about page)
  - Animated accordion (Framer Motion `AnimatePresence` + `motion.div` height animation)
  - Questions/answers editable via `site_settings`
  - **Acceptance**: Accordion opens/closes smoothly; multiple items do not stack open simultaneously

- [ ] 32. Contact page (`/contact`)
  - Contact form: name, email/phone, message → POST `/api/contact` → save to `contact_messages`
  - WhatsApp, Facebook, Instagram, YouTube, Email links from `site_settings`
  - Embedded Google Maps iframe
  - Success toast on submission
  - **Acceptance**: Form validates required fields; submission saves to DB; duplicate guard (rate limit by IP)

---

## Phase 5 — Public Website: API Routes

- [ ] 33. `POST /api/contact` route
  - Zod validation: name (required), message (required), email or phone (at least one)
  - Insert into `contact_messages`
  - Return `{ success: true }` or `{ error: string }`
  - **Acceptance**: Invalid requests return 400; valid requests save to DB

- [ ] 34. `POST /api/newsletter` route
  - Zod validation: valid email
  - Upsert into `newsletter_subscribers` (ignore duplicate)
  - Return `{ success: true }`
  - **Acceptance**: Duplicate emails do not cause errors; invalid emails return 400

- [ ] 35. `POST /api/donate/stripe` route
  - Zod validation: amount (min $1, max $10,000), currency `"USD"`
  - Create Stripe `PaymentIntent`
  - Insert pending `donation` record
  - Return `{ clientSecret }`
  - **Acceptance**: Returns valid client secret; amount < $1 returns 400

- [ ] 36. `POST /api/donate/webhook` route
  - Verify Stripe webhook signature
  - On `payment_intent.succeeded`: update donation status to `completed`, update `Fundraising_Progress` in `site_settings`
  - On `payment_intent.payment_failed`: update status to `failed`
  - **Acceptance**: Stripe CLI webhook test triggers correct DB updates

- [ ] 37. `POST /api/cloudinary/sign` route
  - Generate Cloudinary signed upload parameters (timestamp, signature, api_key)
  - Used by both web and admin Cloudinary Upload Widget
  - **Acceptance**: Returns valid signature that Cloudinary accepts

---

## Phase 6 — Admin Panel: Auth & Shell

- [ ] 38. Admin middleware auth guard
  - `apps/admin/src/middleware.ts`
  - Check Supabase session cookie on all routes except `/login`
  - Redirect to `/login` if no valid session
  - **Acceptance**: Accessing `/dashboard` without login redirects to `/login`; login redirects to `/dashboard`

- [ ] 39. Admin login page (`/login`)
  - Clean centered form: email + password inputs + "Sign In" button
  - Server action: `supabase.auth.signInWithPassword()`
  - Error state: "Invalid email or password"
  - Loading spinner during submission
  - **Acceptance**: Correct credentials → dashboard; wrong credentials → error shown; no session leak

- [ ] 40. Admin shell layout
  - `components/layout/Sidebar.tsx` — navy sidebar with gold active indicator
  - Navigation groups:
    - Overview: Dashboard
    - Content: Leaders, Members, Books, Sessions, Writings, Articles, Gallery, Achievements
    - Community: Sponsors, Testimonials, Partners
    - Engagement: Donations, Messages, Newsletter
    - System: Settings, Users, Activity Logs
  - `components/layout/Topbar.tsx` — breadcrumb + admin name + logout button
  - Sidebar collapses to icons on mobile
  - **Acceptance**: All nav links route correctly; logout clears session

- [ ] 41. Admin Dashboard page
  - Summary stat cards: total counts for Leaders, Members, Books, Sessions, Articles, Gallery Items, Donations (sum), Messages (unread)
  - Recharts bar chart: donations per month (last 6 months)
  - Recent activity feed from `activity_logs` (last 10 entries)
  - **Acceptance**: All counts match DB; chart renders; activity feed shows real entries

---

## Phase 7 — Admin Panel: Content Management Pages

- [ ] 42. Shared admin components
  - `DataTable.tsx` — TanStack Table v8 with sorting, pagination (20/page), column visibility
  - `ConfirmDialog.tsx` — modal with "Are you sure?" + Cancel/Delete buttons
  - `ImageUpload.tsx` — Cloudinary Upload Widget integration; shows preview after upload; stores `secure_url`
  - `RichTextEditor.tsx` — Tiptap with toolbar: bold, italic, headings, bullet list, image embed
  - `StarPicker.tsx` — clickable 5-star rating input
  - `DatePicker.tsx` — native `<input type="date">` wrapper with consistent styling
  - **Acceptance**: Each component works in isolation; ImageUpload returns a URL string on success

- [ ] 43. Leaders management (`/leaders`)
  - Table: photo thumbnail, name, position, display_order, actions (Edit, Delete)
  - Create/Edit form: ImageUpload, name, position, bio (textarea), social links (3 text inputs), display_order
  - Delete with ConfirmDialog; deletes from DB (Cloudinary cleanup best-effort)
  - Activity logged on every mutation
  - **Acceptance**: CRUD operations reflect immediately in table; activity log updated

- [ ] 44. Members management (`/members`)
  - Table: photo, name, membership_no, position, join_date, status badge, actions
  - Create/Edit form: all member fields + status toggle (active/inactive)
  - Search by name in table
  - Bulk status update (select multiple → mark active/inactive)
  - **Acceptance**: Search filters table client-side; bulk update changes all selected records

- [ ] 45. Books management (`/books`)
  - Table: cover thumbnail, title, author, category, rating stars, date_read, reading_status, actions
  - Create/Edit form: ImageUpload for cover, all book fields, StarPicker, DatePicker, category (text or select), reading_status select, is_featured toggle
  - **Acceptance**: All fields save correctly; star rating displays in table; cover preview shows

- [ ] 46. Reading Sessions management (`/sessions`)
  - Table: title, topic, date, location, participants, status badge, actions
  - Create/Edit form: title, topic, description (RichTextEditor), date+time, location, participants, status select, multiple photo uploads
  - **Acceptance**: Multi-image upload works; status badge reflects value

- [ ] 47. Writings management (`/writings`)
  - Table: title, type badge, author, status badge, published_at, actions
  - Create/Edit form: title, type select, author_name, content (RichTextEditor), excerpt, ImageUpload, status toggle (draft/published), publish date
  - **Acceptance**: Draft status hides from public; rich text content saves and loads correctly

- [ ] 48. Articles management (`/articles`)
  - Table: cover, title, slug, author, category, status badge, published_at, actions
  - Create/Edit form: title (auto-generates slug), author_name, category, content (RichTextEditor), excerpt, ImageUpload, status toggle, publish date
  - Slug auto-generated from title; editable; unique constraint enforced
  - **Acceptance**: Slug uniqueness validated server-side; published articles appear on public /news

- [ ] 49. Gallery management (`/gallery`)
  - Grid view of all gallery items with type badge (photo/video)
  - Upload form: type select, file upload (ImageUpload supports both image and video), caption, alt_text, album, date
  - Delete removes from DB and triggers Cloudinary destroy via server action
  - **Acceptance**: Video thumbnails show; delete removes from both Cloudinary and DB

- [ ] 50. Achievements management (`/achievements`)
  - Table: title, category, achieved_at, actions
  - Create/Edit form: title, description, category select, ImageUpload, date
  - **Acceptance**: CRUD works; dates save as real calendar dates

- [ ] 51. Sponsors & Partners management (`/sponsors`)
  - Unified table with `type` column (sponsor | partner)
  - Create/Edit form: name, logo (ImageUpload), website_url, type select, display_order, active toggle
  - **Acceptance**: Active flag controls visibility on public site; display_order changes carousel position

- [ ] 52. Testimonials management (`/testimonials`)
  - Table: photo, name, role, quote excerpt, active toggle, actions
  - Create/Edit form: name, role select, quote (textarea), ImageUpload, active toggle
  - **Acceptance**: Inactive testimonials don't appear on public site

- [ ] 53. Donations management (`/donations`)
  - Read-only table: donor_name, amount, currency, channel, status badge, created_at
  - Summary: total raised, count by channel (Recharts pie chart)
  - No create/edit — donations are created by the system
  - Manual adjustment option: admin can add offline donation record
  - **Acceptance**: Stripe and manual donations both appear; total matches progress bar on public site

- [ ] 54. Contact Messages (`/messages`)
  - Table: name, email/phone, message excerpt, read status, created_at
  - Click row → expand full message; mark as read
  - Unread count badge in sidebar nav
  - Delete message with ConfirmDialog
  - **Acceptance**: Unread count decrements when message marked read

- [ ] 55. Newsletter Subscribers (`/newsletter`)
  - Table: email, active status, created_at
  - Deactivate/reactivate subscriber
  - Export CSV (client-side download from table data)
  - **Acceptance**: CSV export downloads valid file; deactivate removes from active list

- [ ] 56. Settings page (`/settings`)
  - Organized tabs: Hero, About, Contact, Fundraising, Counters, SEO, Payments
  - Hero tab: heading text, subtitle text, description, upload background images (multiple), upload background video
  - About tab: rich text editor for about content, mission, vision, objectives
  - Contact tab: WhatsApp number, Facebook URL, email, Instagram, YouTube, Google Maps embed URL
  - Fundraising tab: goal amount, current progress amount, EVC/Zaad/Sahal/Premier account numbers
  - Counters tab: override toggle per counter + manual value input
  - SEO tab: site title, meta description, OG image upload
  - Payments tab: Stripe publishable key display (read-only), webhook status indicator
  - Save button per tab; changes stored as rows in `site_settings`
  - **Acceptance**: Saved settings reflect on public site on next page load; all tabs save independently

- [ ] 57. Users & Roles management (`/users`)
  - List admin users from `auth.users`
  - Invite new admin: enter email → Supabase `inviteUserByEmail()`
  - Assign role: super_admin | editor | viewer
  - Deactivate user
  - Only super_admin can access this page (role check server-side)
  - **Acceptance**: Role changes take effect on next login; non-super_admin redirected away

- [ ] 58. Activity Logs page (`/logs`)
  - Paginated table: admin name, action, entity_type, entity_id, timestamp, metadata details
  - Filter by admin, action type, date range
  - Read-only; no delete
  - **Acceptance**: Every CRUD action from tasks 43–56 creates a log entry

---

## Phase 8 — SEO, PWA & Performance

- [ ] 59. SEO metadata for all public pages
  - `generateMetadata()` in each page file using Supabase data
  - Dynamic OG images for books (`/library/[id]`) and articles (`/news/[slug]`)
  - JSON-LD `Organization` schema in root layout
  - `next-sitemap` config generating `sitemap.xml` at build
  - `robots.txt` in `/public`
  - **Acceptance**: Each page has unique title and description; sitemap includes all public routes

- [ ] 60. PWA setup
  - Install and configure `next-pwa`
  - `public/manifest.json` with name, icons (192px, 512px), theme_color `#07152E`
  - Offline fallback page at `/offline`
  - Service worker caches static assets and recent pages
  - **Acceptance**: Lighthouse PWA audit passes; app installable from browser; offline page shows when offline

- [ ] 61. Image optimization audit
  - Ensure all `<img>` tags replaced with `next/image`
  - Cloudinary URL loader configured in `next.config.ts`
  - `sizes` prop set on all images
  - `priority` prop on hero and above-fold images
  - **Acceptance**: No LCP image unoptimized; no layout shift from images

- [ ] 62. Bundle size and performance audit
  - Run `pnpm --filter web build` and analyze bundle with `@next/bundle-analyzer`
  - Lazy-load below-fold sections with `React.lazy` + `Suspense`
  - Move GSAP animations to dynamic imports
  - **Acceptance**: Main JS bundle < 200KB gzipped; Lighthouse Performance ≥ 90 on desktop

---

## Phase 9 — Dark Mode & Final Polish

- [ ] 63. Dark mode (default: dark, toggle to light)
  - Tailwind `darkMode: 'class'` strategy
  - Dark mode toggle button in Navbar; preference saved to `localStorage`
  - All components use `dark:` variants
  - **Acceptance**: Toggle switches theme instantly; preference persists on reload; no flash of wrong theme

- [ ] 64. Accessibility audit
  - All interactive elements have `aria-label` or visible text
  - Color contrast ratio ≥ 4.5:1 for body text, ≥ 3:1 for large text (gold on navy checked)
  - Focus ring visible on all interactive elements
  - Form fields have associated `<label>`
  - Modal dialogs trap focus and close on Escape
  - **Acceptance**: Lighthouse Accessibility ≥ 90; keyboard-only navigation works on all pages

- [ ] 65. Error boundaries and empty states
  - React `error.tsx` in each route segment for graceful error display
  - `not-found.tsx` for 404 pages (styled, links back to home)
  - `loading.tsx` skeleton screens for all data-fetching pages
  - Empty state UI for every list page (no books, no members, etc.)
  - **Acceptance**: Deleting all books shows empty state; bad URL shows 404 page; network error shows error page

- [ ] 66. End-to-end smoke test checklist
  - Verify each public page loads with real data
  - Verify admin CRUD round-trip: create → appears on public → edit → update visible → delete → removed
  - Verify Stripe test payment flow end to end
  - Verify contact form saves to DB
  - Verify newsletter subscribe/unsubscribe
  - Verify mobile nav at 375px width
  - **Acceptance**: All items pass manual verification

---

## Phase 10 — Deployment

- [ ] 67. Environment variable setup
  - `apps/web/.env.local.example` — document all required vars
  - `apps/admin/.env.local.example` — document all required vars
  - Required vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (admin only), `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_SECRET`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
  - **Acceptance**: App runs correctly with only vars from the example file

- [ ] 68. Deploy public website to Vercel
  - Create Vercel project `naadiga-web` pointing to `apps/web`
  - Set all environment variables in Vercel dashboard
  - Configure custom domain
  - **Acceptance**: Production URL loads; Lighthouse scores ≥ 90 on production

- [ ] 69. Deploy admin panel to Vercel
  - Create separate Vercel project `naadiga-admin` pointing to `apps/admin`
  - Set environment variables (including service role key)
  - Configure separate subdomain (e.g., `admin.naadiga.so`)
  - **Acceptance**: Admin login works on production; CRUD operations work with production DB

- [ ] 70. Stripe webhook registration
  - Register production webhook URL `https://naadiga.so/api/donate/webhook` in Stripe dashboard
  - Set `STRIPE_WEBHOOK_SECRET` in Vercel environment
  - **Acceptance**: Test webhook delivery succeeds in Stripe dashboard; donation status updates in production DB
