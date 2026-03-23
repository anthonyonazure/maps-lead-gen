# Maps Lead Gen

Find, score, and manage business leads from Google Maps. Search by type and location, filter by website presence, review count, and rating, enrich with email addresses and website quality analysis, score leads with AI, generate outreach messages, and export to CSV.

## What It Does

- **Search** Google Maps by business type and location (city/state or zip code)
- **Set a target** result count (200, 500, 1000+) — auto-calculates grid coverage to hit your number
- **3 data sources**: Google Places API, SerpAPI, or free Docker-based scraper
- **Filter** by: website (has/doesn't have), phone, review count, rating, category, exclude names
- **Score leads** with customizable rule-based scoring + optional AI enhancement (OpenAI, Claude, Gemini)
- **Check websites** for SSL, mobile-friendliness, load speed, platform (WordPress/Wix/etc.), booking page
- **Find emails** via Hunter.io integration
- **Manage leads** with a built-in pipeline: New → Contacted → Replied → Meeting → Won/Lost + notes
- **Generate outreach** from customizable templates that auto-fill business name, gaps, and details
- **Choose export columns** — pick exactly which fields go into your CSV
- **Cache results** — re-running a search costs nothing (cached in your browser)
- **Track costs** — real-time session spend tracker in the header

---

## Setup (Mac)

No technical experience needed.

### Step 1: Install Node.js

1. Go to **https://nodejs.org** and click the green **LTS** button
2. Open the downloaded `.pkg` file and follow the installer
3. Verify: open **Terminal** (`Cmd + Space` → type `Terminal`) and run `node --version`

### Step 2: Download & Install

```
cd ~/Desktop && git clone https://github.com/anthonyonazure/maps-lead-gen.git
cd ~/Desktop/maps-lead-gen && npm install
```

> If you see "git: command not found", click **Install** when the popup appears, then try again.

### Step 3: Get a Google API Key (Free)

Google gives you **$200/month in free credits** — enough for ~6,000 searches.

1. Go to **https://console.cloud.google.com/** and sign in
2. Create a new project (name it anything)
3. Go to **APIs & Services → Credentials → + Create Credentials → API key**
4. Copy the key (starts with "AIza...")
5. Enable these two APIs:
   - **https://console.cloud.google.com/apis/library/places-backend.googleapis.com**
   - **https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com**

### Step 4: Start & Configure

```
cd ~/Desktop/maps-lead-gen && npm run dev
```

Open **http://localhost:5173**, click the **gear icon**, paste your API key, click **Save**.

---

## Setup (Windows)

### Step 1: Install Node.js

1. Go to **https://nodejs.org** and click the green **LTS** button
2. Run the `.msi` installer (click Next through everything)
3. Verify: open **Command Prompt** (Windows key → type `cmd`) and run `node --version`

### Step 2: Install Git

1. Go to **https://git-scm.com/download/win** and run the installer (defaults are fine)

### Step 3: Download & Install

```
cd %USERPROFILE%\Desktop
git clone https://github.com/anthonyonazure/maps-lead-gen.git
cd maps-lead-gen
npm install
```

### Step 4: Get a Google API Key

Same as Mac Step 3 above.

### Step 5: Start & Configure

```
cd %USERPROFILE%\Desktop\maps-lead-gen
npm run dev
```

Open **http://localhost:5173**, click the **gear icon**, paste your API key, click **Save**.

---

## Everyday Use

**Mac:** `cd ~/Desktop/maps-lead-gen && npm run dev` → open http://localhost:5173
**Windows:** Open Command Prompt, run `cd %USERPROFILE%\Desktop\maps-lead-gen` then `npm run dev` → open http://localhost:5173

Press `Ctrl + C` in the terminal to stop. Previous searches are cached — click history to reload for free.

---

## Features

### Search & Filter
| Feature | Description |
|---------|-------------|
| **Target Results** | Enter how many you want (200, 500, 1000) — auto-calculates grid size |
| **3 Data Sources** | Google Places API, SerpAPI, or free Docker scraper |
| **Filters** | Website, phone, reviews (min/max), rating (min/max), category, exclude names |
| **Search History** | Click any past search to reload instantly (no API cost) |
| **Cost Tracker** | Session spend, per-search cost, remaining monthly credit |

### Lead Scoring
| Feature | Description |
|---------|-------------|
| **Rule-Based Scoring** | Customizable weight sliders: no website (+30), low reviews (+20), low rating (+15), etc. |
| **AI Enhancement** | Optional — OpenAI, Claude, or Gemini adds a 1-line assessment per lead |
| **Score Badges** | Hot (70+), Warm (40-69), Low (0-39) — sortable column |
| **Score Breakdown** | Expand any row to see exactly why it scored the way it did |

### Lead Enrichment
| Feature | Description |
|---------|-------------|
| **Website Check** | SSL, mobile-friendly, load speed, platform detection, booking page, contact form |
| **Email Finder** | Hunter.io integration — find contact emails for businesses with websites |
| **Tech Score** | 0-100 rating of website quality (low = better lead for selling web services) |

### Lead Management
| Feature | Description |
|---------|-------------|
| **Pipeline** | Click "Manage" on any lead → set status: New → Contacted → Replied → Meeting → Won/Lost |
| **Notes** | Add notes per lead — persists across sessions |
| **Outreach Templates** | 4 default GHL-focused templates + create your own. Auto-fills business name, gaps, reviews |
| **Template Variables** | `{business_name}`, `{gaps}`, `{reviews}`, `{rating}`, `{platform}`, `{email}`, `{your_name}` |

### Export
| Feature | Description |
|---------|-------------|
| **Column Picker** | Choose exactly which columns to include in your CSV |
| **Export Selected** | Checkboxes to pick specific leads |
| **Export All** | Download entire filtered result set |
| **18 Available Columns** | Name, address, phone, email, website, rating, reviews, score, AI summary, platform, mobile, SSL, booking, load time, status, notes, categories, Google Maps URL |

---

## API Keys & Costs

| Service | What It Does | Cost | Get Key |
|---------|-------------|------|---------|
| **Google Places** | Primary search data source | $200/mo free credit (~6,000 searches) | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| **SerpAPI** | Alternative search (no result cap) | $50/mo for 5,000 searches | [serpapi.com](https://serpapi.com/manage-api-key) |
| **Hunter.io** | Find contact emails | 25 free/mo, $49/mo for 1,000 | [hunter.io](https://hunter.io/api-keys) |
| **OpenAI** | AI lead scoring (GPT-4o-mini) | ~$0.15 per 1,000 leads | [platform.openai.com](https://platform.openai.com/api-keys) |
| **Anthropic** | AI lead scoring (Claude Haiku) | ~$0.25 per 1,000 leads | [console.anthropic.com](https://console.anthropic.com/settings/keys) |
| **Google Gemini** | AI lead scoring (Gemini Flash) | ~$0.10 per 1,000 leads | [aistudio.google.com](https://aistudio.google.com/apikey) |
| **Docker Scraper** | Free alternative (no API key) | Free | [gosom/google-maps-scraper](https://github.com/gosom/google-maps-scraper) |

Only the Google Places API key is required. Everything else is optional.

### Search Cost Breakdown

| Target Results | Grid | API Calls | Cost |
|---------------|------|-----------|------|
| Up to 60 | None | ~3 | ~$0.10 |
| ~200 | 2x2 | ~12 | ~$0.38 |
| ~500 | 3x3 | ~27 | ~$0.86 |
| ~1,000 | 4x4 | ~48 | ~$1.54 |
| ~2,000 | 6x6 | ~108 | ~$3.46 |

Cached searches cost $0.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `command not found` when typing `npm` | Node.js didn't install — go back to Step 1 |
| "API key is invalid" | Enable both APIs (Places + Geocoding). Wait a minute and retry |
| "connection refused" in browser | Terminal with `npm run dev` must be open and running |
| "0 of 20 results" showing | Filters are too narrow — clear review/rating limits |
| Find Emails button doesn't work | Set your Hunter.io key in Settings first |

---

## Tech Stack

- **Backend**: Express + TypeScript
- **Frontend**: React + Vite + Tailwind CSS
- **Data**: Google Places API, SerpAPI, gosom scraper
- **AI**: OpenAI, Anthropic, Google Gemini
- **Storage**: Browser localStorage (no database, no accounts)

---

## License

MIT
