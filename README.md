# Zombie Escape

A live server browser for Counter-Strike Zombie Escape. Find active servers, check player counts and current maps, and join with one click.

## Features

- **Live server status** — player counts, maps, online/offline
- **One-click join** — `steam://connect` links open Steam directly
- **Filters** — region (NA/EU), game (CS:GO/CS2), search
- **Auto-refresh** — updates every 60 seconds
- **Copy console command** — paste `connect host:port` in-game

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

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

## Deploy

Works on [Vercel](https://vercel.com), Netlify, Railway, or any Node.js host:

```bash
npm run build
npm start
```

### Railway (stats persistence)

Weekly visitor and ZE player stats are stored in a JSON file. On Railway, attach a **Volume** mounted at `/data` and set:

```
STATS_DATA_DIR=/data
STATS_SALT=<random-secret>
```

Without a volume, stats reset on redeploy but still work between restarts.

Optional **Plausible Analytics** — add your site at [plausible.io](https://plausible.io) and set:

```
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=zeservers.com
```

The homepage shows a compact weekly summary (visitors, peak/average concurrent ZE players). Full Plausible dashboards are available when configured.

## Tech Stack

- Next.js 15 (App Router)
- Tailwind CSS 4
- gamedig (A2S server queries)

## License

MIT
