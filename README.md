# Maps Lead Gen

Search Google Maps for businesses by type, location, and filters. Export leads to CSV.

## What It Does

- Search by business type (chiropractor, dentist, etc.) and location (city/state or zip)
- Filter results by: website (has/doesn't have), review count, rating, phone, category
- Exclude businesses by name (comma-separated)
- Sort by any column, expand rows for full details
- Select specific rows or export all to CSV
- Results are cached locally — re-running a search is free (no duplicate API charges)
- Cost tracker shows how much you've spent per session

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A Google Cloud API key (free $200/mo credit)

### 1. Get a Google API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or use an existing one)
3. Go to **APIs & Services > Credentials** and create an API key
4. Enable these two APIs:
   - [Places API (New)](https://console.cloud.google.com/apis/library/places-backend.googleapis.com)
   - [Geocoding API](https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com)
5. (Optional) Restrict the key to these two APIs and your IP address

> Google gives every Cloud account $200/month in free API credits. That's enough for ~6,250 searches.

### 2. Install & Run

```bash
git clone https://github.com/anthonyonazure/maps-lead-gen.git
cd maps-lead-gen
npm install
npm run dev
```

Open **http://127.0.0.1:5173** in your browser.

### 3. Configure

Click the **gear icon** in the top-right corner and paste your Google API key. The app validates it and saves it to your browser's localStorage.

### 4. Search

1. Enter a business type (e.g., "chiropractor") and location (e.g., "Dallas, TX")
2. Set filters: website presence, review range, etc.
3. Click **Search**
4. Filter, sort, and select results in the table
5. Click **Export CSV** to download

## Features

| Feature | Description |
|---------|-------------|
| **Filters** | Website (yes/no), phone, review count (min/max), rating (min/max), category, exclude names |
| **Deep Search** | Splits the area into a grid for more than 60 results (costs more API credits) |
| **Result Caching** | Previous searches are cached in your browser — clicking history re-uses cached results for free |
| **Cost Tracker** | Shows session spend, last search cost, and estimated remaining monthly credit |
| **Row Selection** | Checkboxes to select specific leads, then export only those |
| **Expandable Rows** | Click any row to see full details (address, coordinates, all categories, hours, place ID) |
| **Pagination** | 25 results per page |
| **CSV Export** | Export filtered/selected results with: name, address, phone, website, rating, reviews, categories, Google Maps URL |

## API Costs

| Search Type | API Calls | Cost | Results |
|-------------|-----------|------|---------|
| Standard | up to 3 | ~$0.10 | up to 60 |
| Deep 2x2 | up to 12 | ~$0.38 | up to 240 |
| Deep 3x3 | up to 27 | ~$0.86 | up to 540 |

Re-running a cached search costs $0.

## Tech Stack

- **Backend**: Express + TypeScript (port 3001)
- **Frontend**: React + Vite + Tailwind CSS (port 5173)
- **Data**: Google Places API (New) + Geocoding API
- **Storage**: Browser localStorage (no database, no accounts)

## Optional: Scraper Mode

If you don't want to use the Google API, you can run the [gosom/google-maps-scraper](https://github.com/gosom/google-maps-scraper) via Docker as an alternative data source:

```bash
docker run -d -p 8080:8080 gosom/google-maps-scraper
```

Then select "Scraper (Docker)" as the source in the search form. No API key needed, no result cap, but slower.

## Project Structure

```
maps-lead-gen/
  server/src/
    index.ts              # Express server
    routes/search.ts      # Search endpoint
    routes/export.ts      # CSV export
    routes/settings.ts    # API key validation, scraper status
    providers/
      google-places.ts    # Google Places API integration
      gosom-scraper.ts    # Docker scraper integration
    services/
      geocoding.ts        # Location → coordinates
      grid-splitter.ts    # Deep search grid math
      cost-estimator.ts   # API cost calculation
  client/src/
    App.tsx               # Main app with search, filter, export
    components/           # SearchForm, ResultsTable, FilterBar, etc.
```

## License

MIT
