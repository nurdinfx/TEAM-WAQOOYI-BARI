# Technical Design Document
## Naadiga Akhriska iyo Qoraalka Waqooyi Bari — Website & Admin Panel

---

## 1. System Overview

The system is split into **two completely separate Next.js 15 applications**:

| App | Path | Purpose |
|-----|------|---------|
| **Public Website** | `apps/web` | Visitor-facing site — all public pages |
| **Admin Panel** | `apps/admin` | Separate admin dashboard — content management only |

Both apps share a common `packages/` layer for types, Supabase client, and utilities. They are deployed independently and have no shared routing.

```
naadiga-waqooyi-bari/
├── apps/
│   ├── web/          ← Public website (Next.js 15)
│   └── admin/        ← Admin dashboard (Next.js 15, separate)
├── packages/
│   ├── database/     ← Supabase client + generated types
│   ├── ui/           ← Shared UI primitives (optional)
│   └── config/       ← Shared ESLint, TS, Tailwind configs
├── supabase/
│   ├── migrations/   ← SQL migration files
│   └── seed.sql      ← Seed data
└── package.json      ← pnpm workspace root
```

---

## 2. Tech Stack

### Public Website (`apps/web`)
| Concern | Technology |
|---------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | TailwindCSS 3 + custom design tokens |
| Animation | Framer Motion 11 + GSAP 3 |
| Smooth Scroll | Lenis |
| Particles | tsparticles / react-particles |
| Rich Text Render | Tiptap or Portable Text renderer |
| Image | next/image + Cloudinary loader |
| Data Fetching | Supabase JS client (server components) |
| Forms | React Hook Form + Zod |
| SEO | Next.js Metadata API + next-sitemap |
| PWA | next-pwa |
| Icons | Lucide React |

### Admin Panel (`apps/admin`)
| Concern | Technology |
|---------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | TailwindCSS 3 |
| Rich Text Editor | Tiptap |
| File Upload | Cloudinary Upload Widget |
| Auth | Supabase Auth (email + password) |
| Forms | React Hook Form + Zod |
| Tables | TanStack Table v8 |
| Charts | Recharts |

### Shared Backend
| Concern | Technology |
|---------|-----------|
| Database | Supabase (PostgreSQL 15) |
| Auth | Supabase Auth |
| Storage | Cloudinary (images + videos) |
| Payments | Stripe (online donations) |
| Deployment | Vercel (separate projects per app) |

---

## 3. Database Schema

### `site_settings`
```sql
CREATE TABLE site_settings (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key           text UNIQUE NOT NULL,
  value         jsonb NOT NULL,
  updated_at    timestamptz DEFAULT now()
);
```
Stores hero text, about content, contact details, fundraising goal/progress, counter overrides as key-value JSON rows.

### `leaders`
```sql
CREATE TABLE leaders (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name     text NOT NULL,
  position      text NOT NULL,
  bio           text,
  photo_url     text,
  photo_alt     text,
  social_links  jsonb,        -- { facebook, twitter, linkedin }
  display_order integer DEFAULT 0,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);
```

### `members`
```sql
CREATE TABLE members (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name        text NOT NULL,
  membership_no    text UNIQUE NOT NULL,
  position         text,
  job_role         text,
  membership_level text NOT NULL DEFAULT 'active',
  photo_url        text,
  photo_alt        text,
  join_date        date NOT NULL,
  status           text NOT NULL DEFAULT 'active', -- active | inactive
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);
```

### `books`
```sql
CREATE TABLE books (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text NOT NULL,
  author         text NOT NULL,
  publisher      text,
  category       text NOT NULL,
  description    text,
  cover_url      text,
  cover_alt      text,
  reading_status text NOT NULL DEFAULT 'read', -- read | reading | planned
  rating         integer CHECK (rating BETWEEN 1 AND 5),
  date_read      date,
  is_featured    boolean DEFAULT false,
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);
```

### `reading_sessions` (Events)
```sql
CREATE TABLE reading_sessions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  topic        text,
  description  text,
  session_date date NOT NULL,
  session_time time,
  location     text,
  photo_urls   jsonb DEFAULT '[]',
  participants integer DEFAULT 0,
  status       text NOT NULL DEFAULT 'upcoming', -- upcoming | completed | cancelled
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);
```

### `writings`
```sql
CREATE TABLE writings (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  type         text NOT NULL, -- article | essay | poem | research | story
  author_name  text NOT NULL,
  content      jsonb NOT NULL,  -- Tiptap JSON
  excerpt      text,
  cover_url    text,
  cover_alt    text,
  status       text NOT NULL DEFAULT 'draft', -- draft | published
  published_at timestamptz,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);
```

### `articles` (News & Blog)
```sql
CREATE TABLE articles (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  slug         text UNIQUE NOT NULL,
  author_name  text NOT NULL,
  category     text,
  content      jsonb NOT NULL,  -- Tiptap JSON
  excerpt      text,
  cover_url    text,
  cover_alt    text,
  status       text NOT NULL DEFAULT 'draft', -- draft | published
  published_at timestamptz,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);
```

### `gallery_items`
```sql
CREATE TABLE gallery_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type        text NOT NULL, -- photo | video
  url         text NOT NULL,
  thumbnail   text,
  caption     text,
  alt_text    text,
  album       text,
  taken_at    date,
  created_at  timestamptz DEFAULT now()
);
```

### `achievements`
```sql
CREATE TABLE achievements (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  description  text,
  category     text, -- award | certificate | competition | story
  image_url    text,
  achieved_at  date NOT NULL,
  created_at   timestamptz DEFAULT now()
);
```

### `sponsors`
```sql
CREATE TABLE sponsors (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  logo_url     text,
  website_url  text,
  type         text NOT NULL DEFAULT 'sponsor', -- sponsor | partner
  display_order integer DEFAULT 0,
  active       boolean DEFAULT true,
  created_at   timestamptz DEFAULT now()
);
```

### `testimonials`
```sql
CREATE TABLE testimonials (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  role         text,          -- member | parent | teacher | community
  quote        text NOT NULL,
  photo_url    text,
  active       boolean DEFAULT true,
  created_at   timestamptz DEFAULT now()
);
```

### `donations`
```sql
CREATE TABLE donations (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name     text,
  amount         numeric(10,2) NOT NULL,
  currency       text NOT NULL DEFAULT 'USD',
  channel        text NOT NULL, -- stripe | evc | zaad | sahal | premier | bank
  stripe_id      text,
  status         text NOT NULL DEFAULT 'pending', -- pending | completed | failed
  created_at     timestamptz DEFAULT now()
);
```

### `contact_messages`
```sql
CREATE TABLE contact_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  email      text,
  phone      text,
  message    text NOT NULL,
  read       boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
```

### `newsletter_subscribers`
```sql
CREATE TABLE newsletter_subscribers (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text UNIQUE NOT NULL,
  active     boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
```

### `activity_logs`
```sql
CREATE TABLE activity_logs (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id     uuid REFERENCES auth.users(id),
  action       text NOT NULL,
  entity_type  text NOT NULL,
  entity_id    uuid,
  metadata     jsonb,
  created_at   timestamptz DEFAULT now()
);
```

---

## 4. Public Website Architecture (`apps/web`)

### 4.1 App Router Structure

```
apps/web/src/
├── app/
│   ├── layout.tsx              ← Root layout (Lenis, Framer Motion, loading screen)
│   ├── page.tsx                ← Home page
│   ├── about/page.tsx
│   ├── leadership/page.tsx
│   ├── members/page.tsx
│   ├── library/
│   │   ├── page.tsx            ← Books grid
│   │   └── [id]/page.tsx       ← Book detail
│   ├── sessions/page.tsx       ← Reading sessions / events
│   ├── writings/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── news/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── gallery/page.tsx
│   ├── achievements/page.tsx
│   ├── support/page.tsx
│   ├── partners/page.tsx
│   ├── contact/page.tsx
│   └── api/
│       ├── contact/route.ts        ← Contact form submission
│       ├── newsletter/route.ts     ← Newsletter subscribe
│       ├── donate/stripe/route.ts  ← Stripe payment intent
│       └── donate/webhook/route.ts ← Stripe webhook
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── LoadingScreen.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── StatsSection.tsx
│   │   ├── FeaturedBooks.tsx
│   │   └── UpcomingEvents.tsx
│   ├── ui/
│   │   ├── GlassCard.tsx
│   │   ├── AnimatedCounter.tsx
│   │   ├── StarRating.tsx
│   │   ├── TypewriterText.tsx
│   │   ├── ParticlesBackground.tsx
│   │   ├── ScrollReveal.tsx
│   │   ├── SectionHeading.tsx
│   │   └── Button.tsx
│   └── providers/
│       ├── LenisProvider.tsx
│       └── MotionProvider.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts       ← Browser client
│   │   └── server.ts       ← Server component client
│   ├── cloudinary.ts
│   └── stripe.ts
└── styles/
    ├── globals.css
    └── tokens.css          ← CSS custom properties for colors, fonts
```

### 4.2 Key Component Designs

**HeroSection**
- Full-viewport height with `position: relative`
- `<ParticlesBackground />` canvas layer behind content (tsparticles)
- Auto-changing background images with CSS `crossfade` via Framer Motion `AnimatePresence`
- `<TypewriterText />` for both heading and subtitle using a custom hook with `useEffect` intervals
- Three CTA buttons with gold gradient and glass hover states

**AnimatedCounter**
- Uses `IntersectionObserver` to trigger on viewport entry
- GSAP `gsap.to()` tween on a ref value from 0 → target
- Formatted with `Intl.NumberFormat`

**GlassCard**
- `backdrop-filter: blur(16px)` + `bg-white/5` + `border border-white/10`
- Gold glow `box-shadow` on hover with Framer Motion `whileHover`

**Book3DCard**
- CSS `perspective` + Framer Motion `rotateX` / `rotateY` tracking mouse position
- Only active on `pointer: fine` media query (non-touch)

**ScrollReveal**
- Framer Motion `useInView` wrapper that fades + slides children up on entry

### 4.3 Page Transitions
- Root layout wraps `{children}` in Framer Motion `<AnimatePresence mode="wait">`
- Each page exports a `motion.div` wrapper with standard fade+slide variants
- Total transition time: 400ms (200ms exit, 200ms enter)

### 4.4 SEO Strategy
- `generateMetadata()` on every page using data from Supabase
- `apps/web/public/sitemap.xml` generated by `next-sitemap` at build time
- `robots.txt` allowing all crawlers
- JSON-LD `Organization` schema in root layout
- Open Graph images via `opengraph-image.tsx` per route segment

---

## 5. Admin Panel Architecture (`apps/admin`)

### 5.1 App Router Structure

```
apps/admin/src/
├── app/
│   ├── layout.tsx               ← Admin shell (sidebar + topbar)
│   ├── login/page.tsx           ← Login page (standalone, no sidebar)
│   ├── dashboard/page.tsx
│   ├── leaders/
│   │   ├── page.tsx             ← List
│   │   ├── new/page.tsx         ← Create form
│   │   └── [id]/edit/page.tsx   ← Edit form
│   ├── members/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/edit/page.tsx
│   ├── books/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/edit/page.tsx
│   ├── sessions/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/edit/page.tsx
│   ├── writings/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/edit/page.tsx
│   ├── articles/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/edit/page.tsx
│   ├── gallery/
│   │   ├── page.tsx
│   │   └── upload/page.tsx
│   ├── achievements/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/edit/page.tsx
│   ├── sponsors/page.tsx
│   ├── testimonials/page.tsx
│   ├── donations/page.tsx
│   ├── messages/page.tsx
│   ├── newsletter/page.tsx
│   ├── settings/page.tsx
│   ├── users/page.tsx
│   └── logs/page.tsx
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── AdminShell.tsx
│   ├── forms/
│   │   ├── ImageUpload.tsx      ← Cloudinary upload widget
│   │   ├── RichTextEditor.tsx   ← Tiptap editor
│   │   ├── StarPicker.tsx
│   │   └── DatePicker.tsx
│   └── ui/
│       ├── DataTable.tsx        ← TanStack Table wrapper
│       ├── ConfirmDialog.tsx
│       ├── StatsCard.tsx
│       └── Badge.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── cloudinary.ts
│   ├── auth.ts                  ← Session helpers
│   └── activity.ts             ← Log helper
└── middleware.ts                ← Auth guard — redirects to /login if no session
```

### 5.2 Authentication Flow

```
Browser → GET /admin/dashboard
    ↓
middleware.ts
    → supabase.auth.getSession()
    → no session? → redirect /admin/login
    → session valid? → continue

POST /admin/login (server action)
    → supabase.auth.signInWithPassword({ email, password })
    → success → redirect /admin/dashboard
    → fail → return { error: "Invalid credentials" }
```

Row-Level Security (RLS) is enabled on all tables. Admins use a Supabase service-role key only in server actions / API routes — never exposed to the browser.

### 5.3 Role System

| Role | Supabase Custom Claim | Permissions |
|------|-----------------------|-------------|
| `super_admin` | `role: "super_admin"` | All CRUD + user management + settings |
| `editor` | `role: "editor"` | CRUD on content (books, articles, gallery, etc.) |
| `viewer` | `role: "viewer"` | Read-only dashboard |

Roles stored in `auth.users.raw_user_meta_data.role`. Checked server-side in every server action.

### 5.4 Image/Video Upload Flow

```
Admin selects file in ImageUpload.tsx
    ↓
Client-side: Cloudinary Upload Widget opens
    → Signs upload with server-generated signature (POST /api/cloudinary/sign)
    → Uploads directly to Cloudinary CDN
    → Returns { secure_url, public_id }
    ↓
Admin form stores secure_url in Supabase via server action
```

No binary file data ever passes through Supabase storage.

### 5.5 Activity Logging

Every server action that mutates data calls:
```typescript
await logActivity({
  adminId: session.user.id,
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  entityType: 'book' | 'member' | ...,
  entityId: record.id,
  metadata: { before?, after? }
})
```

---

## 6. Design System

### 6.1 Color Tokens
```css
:root {
  --color-navy:      #07152E;
  --color-navy-mid:  #0B1F3A;
  --color-navy-light:#112244;
  --color-gold:      #D4AF37;
  --color-gold-light:#F5C542;
  --color-white:     #FFFFFF;
  --color-gray-soft: #F4F4F6;
  --color-gray-mid:  #9CA3AF;
}
```

### 6.2 Typography
- **Display**: `Playfair Display` (serif) — headings, hero
- **Body**: `Inter` — UI text, paragraphs
- **Accent**: `Amiri` — Arabic/Somali script sections

### 6.3 Component Variants
- **Primary Button**: Gold gradient bg + navy text + scale hover
- **Secondary Button**: Glass border + white text + glow hover
- **Card**: `bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl`
- **Section**: `py-24 px-6 md:px-12 lg:px-24`

---

## 7. API Surface

All data fetching in the public website uses **Next.js Server Components** calling Supabase directly — no REST API layer needed. Mutations go through **Next.js Server Actions**.

### Public API Routes (web app)
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/contact` | POST | Save contact message to DB |
| `/api/newsletter` | POST | Subscribe email |
| `/api/donate/stripe` | POST | Create Stripe PaymentIntent |
| `/api/donate/webhook` | POST | Stripe webhook → update donation status |
| `/api/cloudinary/sign` | POST | Generate Cloudinary upload signature |

### Admin Server Actions
Server actions in `apps/admin` handle all CRUD, protected by session check at the top of each action.

---

## 8. Deployment Architecture

```
GitHub Monorepo
    ├── Vercel Project: naadiga-web   → apps/web
    └── Vercel Project: naadiga-admin → apps/admin

Supabase Project (shared)
    ← both apps connect with their own env keys

Cloudinary Account (shared)
    ← upload presets per app (web-public, admin-upload)

Stripe Account
    ← webhook registered to apps/web production URL
```

Environment variables are set per-project in Vercel. The admin app uses `SUPABASE_SERVICE_ROLE_KEY`; the web app uses only `SUPABASE_ANON_KEY`.

---

## 9. PWA Configuration (web app)

- `next-pwa` with Workbox
- Cache strategy: `StaleWhileRevalidate` for pages, `CacheFirst` for images
- `manifest.json`: name, icons, theme color `#07152E`, background `#07152E`
- Offline fallback page at `/offline`

---

## 10. Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance (desktop) | ≥ 95 |
| Lighthouse Accessibility | ≥ 90 |
| Lighthouse SEO | ≥ 95 |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |

Achieved via: `next/image` with Cloudinary CDN, font subsetting, route-based code splitting, React Suspense boundaries, and `loading="lazy"` on below-fold images.
