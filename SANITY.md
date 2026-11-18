# Sanity CMS — Charicha Institute

This repo now has an **optional** Sanity CMS for the marketing content (courses,
services, home page, footer/site settings, contact page, navigation).

**Key design point:** the site keeps working with **zero** Sanity configuration.
Every CMS-backed page falls back to the original hardcoded data until you set the
Sanity env vars and seed a project. So you can merge this branch safely and turn
the CMS on later.

User accounts stay in **Firebase**. The blog is **hybrid**: user-written articles
stay in Firebase, while the team can also publish editorial posts (`post` type) in
Sanity — both are merged on `/blog`, newest first. See "Hybrid blog" below.

---

## Architecture

| Piece | Where | Notes |
|---|---|---|
| **Sanity Studio** (editing UI) | [`studio/`](studio/) | Separate project on Sanity 6 / React 19, needs Node >=22.12. Not embedded in the Next site (both are React 19 now, so embedding is possible, but it is deliberately kept separate). Deploy free to `*.sanity.studio`. |
| **Schemas** | [`studio/schemaTypes/`](studio/schemaTypes/) | `course` (with `courseSection` / `courseLesson`), `service`, `post` (documents) + `homePage`, `siteSettings`, `contactPage`, `navigation` (singletons). `lessonContent` belongs to the private "Course content" workspace. |
| **Workspaces** | [`studio/sanity.config.js`](studio/sanity.config.js) | **Website** (public dataset) and **Course content** (private dataset `course-content`, paid lesson bodies). See "Course content" below. |
| **Seed data** | [`seed/seed.ndjson`](seed/seed.ndjson) | The current hardcoded content, ready to import. |
| **Read client** | [`lib/sanity/`](lib/sanity/) | `@sanity/client` + GROQ. Called from the Next app's server components (App Router). |

Wired pages / components:
- [`app/services/page.tsx`](app/services/page.tsx) — `getServices()` (ISR, `revalidate = 60`)
- [`app/courses/page.tsx`](app/courses/page.tsx) — `getCourses()` (ISR, `revalidate = 60`)
- [`app/courses/[id]/page.tsx`](app/courses/[id]/page.tsx) — `getCourseById()` (SSG via `generateStaticParams`, `revalidate = 60`)
- [`app/page.tsx`](app/page.tsx) — `getHomePage()` → hero / stories / app promo / feature video
- [`app/contact/page.tsx`](app/contact/page.tsx) — `getContactPage()` → title / description / contact / map
- [`components/footer/Footer.tsx`](components/footer/Footer.tsx) — global, driven by
  [`useSiteSettings()`](lib/sanity/useSiteSettings.ts). It is rendered on every
  page as a client component, so it renders the static fallback on the
  server / first client render (no hydration mismatch) and swaps in CMS data
  after mount.
- [`components/Navbar.tsx`](components/Navbar.tsx) — global header nav, driven by
  [`useNavigation()`](lib/sanity/useNavigation.ts) (`navigation.headerLinks`).
  Same render strategy as the footer: static fallback first, CMS data after mount.
- [`app/blog/page.tsx`](app/blog/page.tsx) — **hybrid** (see below).

---

## Hybrid blog

`/blog` merges two sources, newest first:

- **Firebase** — user-written articles (`ArticleService.listPublishedArticles()`),
  authored in-app with the Tiptap editor (older articles may still be stored as EditorJS blocks; both render). Author resolved from the Firebase user record.
- **Sanity** — editorial `post` documents authored by the team in the Studio.
  Inline author (`authorName` / `authorImage`), Portable Text body.

How it fits together:
- [`getBlogPosts()`](lib/sanity/fetchers.ts) returns `[]` when Sanity is
  unconfigured, so with no CMS the blog simply shows the Firebase articles —
  nothing breaks (consistent with the rest of the integration).
- [`app/blog/page.tsx`](app/blog/page.tsx) (rendered per request) normalises
  both sources with a `source` discriminator + `sortTime`, then sorts by date.
- [`components/blog/BlogCard.tsx`](components/blog/BlogCard.tsx) branches on
  `blog.source` (Firebase keeps its client-side author fetch; Sanity uses the
  inline author).
- [`app/blog/[id]/page.tsx`](app/blog/[id]/page.tsx) resolves a slug by trying Firebase
  (`ArticleService.getArticle`) first, then Sanity (`getBlogPostBySlug`); 404 if neither matches.
  Sanity bodies render via [`PortableBody`](components/blog/PortableBody.tsx)
  (`@portabletext/react`), Firebase bodies via [`ArticleRenderer`](components/ArticleRenderer/index.tsx).

Posts are ordered by `publishedAt` — set it when publishing. The body uses
Portable Text (`block` + inline `image`); embedded images resolve through
[`urlFor()`](lib/sanity/image.ts).

All copy fallbacks live in [`lib/sanity/fallbacks.ts`](lib/sanity/fallbacks.ts).

---

## One-time setup

### 1. Create the Sanity project + Studio

```bash
cd studio
npm install
npx sanity login                 # opens browser; sign in / create a Sanity account
npx sanity init --reconfigure    # creates a project + dataset, writes the project id
```

Note the **project ID** it prints. Put it in `studio/.env` (copy `.env.example`):

```bash
SANITY_STUDIO_PROJECT_ID=<your-project-id>
SANITY_STUDIO_DATASET=production
```

### 2. Seed the current content

```bash
# from studio/
npm run import-seed
# (equivalent to: npx sanity dataset import ../seed/seed.ndjson production)
```

This loads the 9 courses (sample sections, lessons and prices), 6 services, the
4 singleton documents, and one sample blog post. Cover images aren't in the seed:
re-upload them per course in the Studio (the site falls back to `/george.jpg`
until you do).

**Already have courses from before the switch to digital courses?** Convert
them (flat lesson list -> sections with stable lesson ids; `durationDays`
removed) instead of re-importing:

```bash
npm run migrate:digital-courses                 # dry run
npm run migrate:digital-courses -- --no-dry-run
```

### 3. Run the Studio

```bash
npm run dev          # http://localhost:3333
# when ready to give the team a hosted URL:
npm run deploy       # publishes to https://<name>.sanity.studio
```

### 4. Point the website at Sanity

Add to the Next app's `.env.local` (project root):

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_SANITY_DATASET=production
# optional: NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

Then in the project root: `nvm use && npm run dev` (Node >=24.12, pinned in `.nvmrc`). The wired pages now read
from Sanity. Edit a course in the Studio → it shows on `/courses` (ISR
revalidates every 60s).

If `NEXT_PUBLIC_SANITY_PROJECT_ID` is **unset**, the site uses the hardcoded
fallback data and nothing breaks.

---

## How the fallback works

[`lib/sanity/client.ts`](lib/sanity/client.ts) exports `isSanityConfigured`
(true only when `NEXT_PUBLIC_SANITY_PROJECT_ID` is set). Each fetcher in
[`lib/sanity/fetchers.ts`](lib/sanity/fetchers.ts) returns the bundled static
array when Sanity is unconfigured, empty, or errors — so a misconfigured or
down CMS can never blank out the site.

**Courses are the exception.** They are sold, so the bundled sample catalog
([`components/course/coursesList.ts`](components/course/coursesList.ts)) is used
only when Sanity is **not configured**. Once it is, an empty or failing Sanity
shows no courses rather than sample courses with sample prices.

Course GROQ projections in [`lib/sanity/queries.ts`](lib/sanity/queries.ts)
return the shape in `lib/courses/catalog.ts` (`RawCourse`); every result goes
through `normalizeCourse`, so a half-filled course in the Studio cannot break a
page.

---

## Course content (private dataset)

Course outlines (titles, prices, free previews) are public, but what students
pay for is not. Lesson bodies (article text and video notes) live in a
**private** dataset that only the website's server reads, after checking the
student's access.

One-time setup:

```bash
# from studio/
npx sanity dataset create course-content --visibility private
npm run import-content-seed        # optional: sample bodies for course 1
```

Then create an API token with **Viewer** access (sanity.io/manage -> API ->
Tokens) and set it on the website as `SANITY_READ_TOKEN` (server only; see
`.env.example`). Without it, lessons still open and play their video, minus the
written content.

In the Studio, open the **Course content** workspace and create one "Lesson
content" document per lesson, with the course's **Course ID** and the lesson's
**Lesson ID** copied from the Website workspace.

## Courses, purchases and progress

Course **content** lives in Sanity; purchases, access and progress live in
Firestore (`orders`, `enrollments`, `certificates`). See
[COURSES.md](COURSES.md). Each course's **Course ID** and each lesson's
**Lesson ID** key those records: **don't change them** once a course has been
sold.
