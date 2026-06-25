# ScrapeTable Interactive Map Search

Search Google Maps businesses by panning a map and querying the [ScrapeTable Maps API](https://www.scrapetable.com/dashboard/api/docs). Results show on the map and in a sidebar with contact details. Searches are saved locally to `./data/`.

## Quick start

```bash
git clone <repo-url>
cd interactive-map-ui
npm install
cp .env.example .env.local
```

Add your API key to `.env.local`:

```env
SCRAPETABLE_API_KEY=scr_your_key_here
```

Or paste it in **Settings** in the app (stored in browser localStorage).

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

1. Pan/zoom the map to your search area.
2. Enter a query (e.g. `coffee`) and click **Search**.
3. Browse results in the sidebar or on the map.
4. Reload past searches from the **History** tab (no extra API credits).

## Settings

| Parameter | Default | Notes |
|-----------|---------|-------|
| Limit | 20 | 1–500. 1 credit per business returned. |
| Zoom | current map zoom | Affects search radius |
| Language | English | Result language |
| Country | United States | Country bias |

## Local data

Search results are saved to `./data/` (git-ignored):

```
data/
  history.json
  searches/<id>__<query>.json
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Requirements

- Node.js 18+
- [ScrapeTable API key](https://www.scrapetable.com/dashboard/api/docs)
