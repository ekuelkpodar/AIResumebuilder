# ResumeCraft – AI Resume + Cover Letter Builder

ResumeCraft is a modern, ATS-friendly resume and cover-letter platform with inline AI assistance, template switching, an ATS checker, a lightweight job tracker, and advanced career intelligence.

## Tech stack
- Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui components
- NextAuth (email/password + Google OAuth)
- Prisma + PostgreSQL
- AI abstraction for OpenAI-compatible chat completions
- React Query for client data fetching/caching
- Recharts for insights, docx export helper, in-app feature flags & rate limiting

## Getting started
1. Install dependencies  
   ```bash
   npm install
   ```
2. Create a `.env` file with:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/resumecraft
   NEXTAUTH_SECRET=your-super-secret
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   AI_API_KEY=your-ai-key              # OpenAI/OpenRouter compatible
   AI_BASE_URL=https://api.openai.com/v1
   AI_MODEL=gpt-4o-mini
   ```
   If you do not set `AI_API_KEY`, endpoints return stubbed AI responses for local development.
3. Set up the database  
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed   # optional, add your own seed script later
   ```
4. Run the app  
   ```bash
   npm run dev
   ```

## Scripts
- `npm run dev` – start Next.js in dev
- `npm run build` / `npm run start` – production build + run
- `npm run lint` – lint with ESLint/Next
- `npm run test` – run unit tests (Vitest)
- `npm run prisma:migrate` – run Prisma migrations
- `npm run prisma:studio` – open Prisma Studio

## Project structure
```
src/app
  (marketing)/            # Landing, templates, pricing, resources
    templates/[slug]      # SEO-friendly template detail
    resources/[slug]      # Blog/resource posts
  (app)/                  # Authenticated product experience (dashboard, resumes, ATS, job tracker)
    personas, insights    # Personas management + analytics
  api/                    # REST-style endpoints (AI, resumes, templates, job tracker, PDF)
components/               # Shared UI and layout pieces (shadcn/ui style)
lib/                      # Prisma client, auth config, AI client, ATS helper, validators, templates
prisma/schema.prisma      # Database models and enums
```

## Adding a new resume template
Templates are defined in `src/lib/templates.ts`. Add an entry with:
- `id`, `name`, `slug`, `description`
- `category` and `tags`
- `layoutConfig` (one or two column section placement)
- `themeConfig` (accent color, font)
The `/api/templates` endpoint and `/templates` gallery will pick it up automatically.

## Extending AI endpoints
- Core AI routes live under `src/app/api/ai/*`.
- All calls flow through `callAI` in `src/lib/ai-client.ts` (OpenAI-compatible chat completions).
- Each endpoint validates payloads with Zod and returns JSON.
- Add new behaviors by creating a route, crafting a concise system prompt, and parsing the response.
- Advanced endpoints included: career assistant, skill extraction, translation, role optimization.

## Testing
- Unit tests: `npm run test` (Vitest) – includes an ATS scoring helper test.
- Integration placeholders are added for API routes; wire them to a test database when ready.

## Notes
- `/app` routes are protected by NextAuth middleware; use the registration flow or seed users.
- Stripe/payments are stubbed but the UI is ready for a future integration.
- PDF export is available at `/api/resumes/[id]/pdf` using @react-pdf/renderer; DOCX at `/api/resumes/[id]/docx`; LinkedIn-style JSON at `/api/resumes/[id]/export-linkedin-style`.
