import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { SERVERS } from "../src/data/servers";
import { buildMapProgress } from "../src/lib/build-map-progress";
import { buildServerDetail } from "../src/lib/build-server-detail";
import { queryAllServers } from "../src/lib/server-query";
import type { ServersResponse } from "../src/types/server";

const outDir = join(process.cwd(), "public", "data");

function writeJson(path: string, value: unknown) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value)}\n`, "utf8");
}

async function generateServers(): Promise<ServersResponse> {
  try {
    const servers = await queryAllServers(SERVERS);
    const online = servers.filter((server) => server.online).length;
    const players = servers.reduce((sum, server) => sum + server.players, 0);
    return {
      servers,
      updatedAt: new Date().toISOString(),
      totals: { online, players, tracked: servers.length },
    };
  } catch {
    return {
      servers: [],
      updatedAt: new Date().toISOString(),
      totals: { online: 0, players: 0, tracked: SERVERS.length },
    };
  }
}

async function main() {
  const list = await generateServers();
  writeJson(join(outDir, "servers.json"), list);

  await Promise.all(
    SERVERS.map(async (entry) => {
      try {
        const detail = await buildServerDetail(entry);
        writeJson(join(outDir, "servers", `${entry.id}.json`), detail);
      } catch {
        writeJson(join(outDir, "servers", `${entry.id}.json`), {
          error: "unavailable",
          fetchedAt: new Date().toISOString(),
        });
      }
    }),
  );

  for (const community of ["mapeadores", "gfl"] as const) {
    const progress = await buildMapProgress(community).catch(() => null);
    if (progress) {
      writeJson(join(outDir, "maps", `${community}.json`), progress);
    }
  }

  writeJson(join(outDir, "stats.json"), {
    week: {
      visitors: 0,
      pageViews: 0,
      peakPlayers: list.totals.players,
      avgPlayers: list.totals.players,
      playerSamples: 0,
    },
  });

  console.log(
    `Wrote live data for ${list.totals.tracked} servers (${list.totals.players} players).`,
  );
}

void main();
