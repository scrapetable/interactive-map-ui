import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type {
  HistoryEntry,
  HistoryFile,
  SearchParams,
  SearchRecord,
} from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const SEARCHES_DIR = path.join(DATA_DIR, "searches");
const HISTORY_PATH = path.join(DATA_DIR, "history.json");

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function generateSearchId(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const time = now.toTimeString().slice(0, 8).replace(/:/g, "");
  const rand = randomBytes(3).toString("hex");
  return `${date}-${time}-${rand}`;
}

export function getSearchFileName(id: string, query: string): string {
  const slug = slugify(query) || "search";
  return `${id}__${slug}.json`;
}

async function ensureDataDir(): Promise<void> {
  await fs.mkdir(SEARCHES_DIR, { recursive: true });
}

async function readHistoryFile(): Promise<HistoryFile> {
  try {
    const raw = await fs.readFile(HISTORY_PATH, "utf8");
    const parsed = JSON.parse(raw) as HistoryFile;
    if (parsed.version === 1 && Array.isArray(parsed.entries)) {
      return parsed;
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn("Could not read history.json:", error);
    }
  }

  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    entries: [],
  };
}

async function writeHistoryFile(history: HistoryFile): Promise<void> {
  await fs.writeFile(HISTORY_PATH, JSON.stringify(history, null, 2), "utf8");
}

export async function saveSearch(
  params: SearchParams,
  response: SearchRecord["response"],
): Promise<SearchRecord> {
  await ensureDataDir();

  const id = generateSearchId();
  const createdAt = new Date().toISOString();
  const record: SearchRecord = {
    version: 1,
    id,
    createdAt,
    params,
    response,
  };

  const fileName = getSearchFileName(id, params.query);
  await fs.writeFile(
    path.join(SEARCHES_DIR, fileName),
    JSON.stringify(record, null, 2),
    "utf8",
  );

  const history = await readHistoryFile();
  const entry: HistoryEntry = {
    id,
    query: params.query,
    businessCount: response.data?.length ?? response.businessCount ?? 0,
    lat: params.lat,
    lng: params.lng,
    zoom: params.zoom,
    limit: params.limit,
    lang: params.lang,
    country: params.country,
    createdAt,
  };

  history.entries.unshift(entry);
  history.updatedAt = createdAt;
  await writeHistoryFile(history);

  return record;
}

async function findSearchFile(id: string): Promise<string | null> {
  await ensureDataDir();
  const files = await fs.readdir(SEARCHES_DIR);
  const match = files.find(
    (file) => file === `${id}.json` || file.startsWith(`${id}__`),
  );
  return match ? path.join(SEARCHES_DIR, match) : null;
}

export async function loadSearch(id: string): Promise<SearchRecord | null> {
  const filePath = await findSearchFile(id);
  if (!filePath) return null;

  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as SearchRecord;
}

export async function listHistory(): Promise<HistoryEntry[]> {
  const history = await readHistoryFile();
  const visible = history.entries.filter((entry) => !entry.deletedAt);

  const entries = await Promise.all(
    visible.map(async (entry) => {
      const filePath = await findSearchFile(entry.id);
      return {
        ...entry,
        fileMissing: !filePath,
      };
    }),
  );

  return entries;
}
