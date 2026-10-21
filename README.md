# Zombie Escape

A live server browser for Counter-Strike Zombie Escape. Find active servers, check player counts and current maps, and join with one click.

## Features

- **Live server status** — player counts, maps, online/offline
- **One-click join** — `steam://connect` links open Steam directly
- **Filters** — region (NA/EU), game (CS:GO/CS2), search
- **Copy console command** — paste `connect host:port` in-game

## Getting Started

```bash
npm install
npm run generate:data
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`generate:data` writes static JSON snapshots used by the browser. On GitHub Pages those files are rebuilt by Actions about every 15 minutes.

## Adding Servers

Edit `src/data/servers.ts` and add entries:

```ts
{
  id: "my-server",
  name: "My ZE Server",
  host: "ze.example.com",
  port: 27015,
  game: "csgo", // or "cs2"
  region: "NA",
  tags: ["Custom Maps"],
}
```

## Deploy (GitHub Pages)

The site is a static export. GitHub Pages cannot run Next.js API routes.

1. In the repo: **Settings → Pages → Source: GitHub Actions**
2. Add repository secrets if you have live-data URLs: `LIVE_FALLBACK_URL`, `HISTORY_GRAPH_URL`, `MAP_PROGRESS_MAPEADORES_CSV`, `MAP_PROGRESS_GFL_CSV`
3. Custom domain: `zeservers.com`
4. After DNS is green, enable **Enforce HTTPS**

DNS at the registrar:

| Name | Type | Value |
| --- | --- | --- |
| @ | A | 185.199.108.153 |
| @ | A | 185.199.109.153 |
| @ | A | 185.199.110.153 |
| @ | A | 185.199.111.153 |
| www | CNAME | space920.github.io |

Optional IPv6 AAAA records: `2606:50c0:8000::153` through `2606:50c0:8003::153`.

Optional **Plausible Analytics** — set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=zeservers.com` in the workflow env if you use it.

## Tech Stack

- Next.js 15 (static export)
- Tailwind CSS 4
- gamedig (A2S snapshots at build time)

## License

MIT
