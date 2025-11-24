# Campaign Dashboard (Next.js + TypeScript + Tailwind)

This scaffold is a minimal, well-structured example of a campaign monitoring dashboard.

Key features:
- Next.js App Router (TypeScript)
- Tailwind CSS for styling
- Simple API route stubs returning the sample data you provided
- SSE (Server-Sent Events) example at `/api/events` to simulate a real-time feed
- Use of `swr` for client-side data fetching with revalidation

How to run:
1. Install dependencies: `npm install`
2. Run dev server: `npm run dev`
3. Open `http://localhost:3000`

Notes:
- API routes return static sample data matching the payloads you provided.
- SSE sends one event then closes (for predictable local testing). You can adapt it to keep streaming.
