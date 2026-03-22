# Maps Lead Gen

Search Google Maps for businesses by type, location, and filters. Export leads to CSV.

## What It Does

- Search by business type (chiropractor, dentist, etc.) and location (city/state or zip)
- Set a target result count (e.g., 500 or 1000) — the app automatically runs enough searches to hit it
- Filter results by: website (has/doesn't have), review count, rating, phone, category
- Exclude businesses by name (comma-separated)
- Sort by any column, expand rows for full details
- Select specific rows or export all to CSV
- Results are cached locally — re-running a search is free (no duplicate API charges)
- Cost tracker shows how much you've spent per session

---

## Setup (Mac — Step by Step)

No technical experience needed. Follow these steps in order.

### Step 1: Install Node.js

Node.js is the engine that runs this app. You only need to do this once.

1. Open your web browser and go to **https://nodejs.org**
2. Click the big green button that says **"LTS"** (the recommended version)
3. A `.pkg` file will download — double-click it to open the installer
4. Click **Continue** through each screen, then click **Install**
5. Enter your Mac password when asked
6. Click **Close** when it finishes

**Verify it worked:** Open the **Terminal** app (press `Cmd + Space`, type `Terminal`, press Enter) and type:
```
node --version
```
You should see something like `v22.x.x`. If you see "command not found", close Terminal, reopen it, and try again.

### Step 2: Download the App

1. Open **Terminal** (if it's not already open: `Cmd + Space` → type `Terminal` → press Enter)
2. Copy this entire line, paste it into Terminal, and press Enter:

```
cd ~/Desktop && git clone https://github.com/anthonyonazure/maps-lead-gen.git
```

This creates a folder called `maps-lead-gen` on your Desktop.

> **If you see "git: command not found":** A popup will appear asking to install Command Line Tools. Click **Install**, wait for it to finish, then paste the command above again.

### Step 3: Install Dependencies

In the same Terminal window, paste this line and press Enter:

```
cd ~/Desktop/maps-lead-gen && npm install
```

Wait about 30-60 seconds. You'll see text scrolling — that's normal. When it stops and shows a new prompt line, it's done.

### Step 4: Get a Google API Key (Free)

This is how the app searches Google Maps. Google gives you **$200/month in free credits** — enough for about 6,000 searches. You will not be charged.

**Create a Google Cloud project:**

1. Go to **https://console.cloud.google.com/**
2. Sign in with your Google account
3. If asked to agree to terms, check the box and click **Agree and Continue**
4. Click **Select a project** at the top of the page, then click **New Project**
5. Name it anything you want (e.g., "Lead Gen") and click **Create**
6. Wait a few seconds, then click **Select Project** when the notification appears

**Create your API key:**

7. In the left sidebar, click **APIs & Services**, then click **Credentials**
8. At the top, click **+ Create Credentials**, then click **API key**
9. A key will appear (it starts with "AIza...") — **copy it** and save it somewhere, you'll need it in Step 6
10. Click **Close**

**Turn on the required APIs (two links to click):**

11. Open this link in a new tab: **https://console.cloud.google.com/apis/library/places-backend.googleapis.com**
    - Click the blue **Enable** button
12. Open this link in a new tab: **https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com**
    - Click the blue **Enable** button

Done! The APIs may take a minute to activate.

### Step 5: Start the App

In Terminal, paste this line and press Enter:

```
cd ~/Desktop/maps-lead-gen && npm run dev
```

You should see something like:
```
[server] Server running on http://127.0.0.1:3001
[client] Local: http://localhost:5173/
```

**Leave this Terminal window open** — closing it stops the app.

### Step 6: Open the App and Enter Your API Key

1. Open your web browser (Chrome, Safari, Firefox — any works)
2. Go to **http://localhost:5173**
3. Click the **gear icon** in the top-right corner
4. Paste your Google API key (the "AIza..." key from Step 4) into the text field
5. Click **Save** — it should say "API key valid" in green
6. Close the settings panel by clicking the X

Your key is saved in your browser — you won't need to enter it again.

### Step 7: Search!

1. **Business Type**: Type what you're looking for (e.g., `chiropractor`, `dentist`, `behavioral health`)
2. **Location**: Type a city and state (e.g., `Austin, TX`) or a zip code (e.g., `78701`)
3. **Target Results**: Enter how many results you want (e.g., `200` or `500`). Leave blank for a quick search (up to 60 results)
4. Set any filters:
   - **Website**: Choose "No website" to find businesses that don't have one
   - **Reviews**: Set min/max to find businesses with few reviews (newer/smaller businesses)
   - **Exclude**: Type business names to skip, separated by commas (e.g., `The Joint, HealthSource`)
5. Click **Search**
6. Click any row to expand it and see full details
7. Use the checkboxes to select specific leads, then click **Export Selected**
8. Or click **Export All** to download everything as a CSV file you can open in Excel

---

## Everyday Use

Every time you want to use the app:

1. Open **Terminal**
2. Paste this and press Enter: `cd ~/Desktop/maps-lead-gen && npm run dev`
3. Open **http://localhost:5173** in your browser
4. When you're done, go back to Terminal and press `Ctrl + C` to stop it

Your previous searches are saved — click any search in the history bar to reload those results instantly (no API cost).

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `command not found` when typing `npm` | Node.js didn't install. Go back to Step 1 |
| "API key is invalid" | Make sure you clicked Enable on both APIs in Step 4. Wait a minute and try again |
| Browser says "connection refused" | Make sure the Terminal window with `npm run dev` is still open and running |
| 0 results showing but it says "0 of 20" | Your filters are too narrow — try removing the review or rating limits |
| App feels slow on first search | Normal — first search takes 1-3 seconds. Cached searches load instantly |

---

## API Costs

Google gives you **$200/month in free credits**. Here's what searches cost:

| Target Results | Grid | API Calls | Cost | Actual Results (after dedup) |
|---------------|------|-----------|------|------------------------------|
| Up to 60 | None | ~3 | ~$0.10 | up to 60 |
| ~200 | 2x2 | ~12 | ~$0.38 | ~170 |
| ~500 | 3x3 | ~27 | ~$0.86 | ~380 |
| ~1,000 | 4x4 | ~48 | ~$1.54 | ~670 |
| ~2,000 | 6x6 | ~108 | ~$3.46 | ~1,500 |

Re-running a previous search from history costs **$0** (results are cached in your browser).

The cost tracker in the top-right corner of the app shows exactly how much you've spent.

---

## Features

| Feature | Description |
|---------|-------------|
| **Target Results** | Enter how many results you want — the app figures out the grid automatically |
| **Filters** | Website (yes/no), phone, review count (min/max), rating (min/max), category, exclude names |
| **Result Caching** | Previous searches cached in your browser — replay for free |
| **Cost Tracker** | Session spend, last search cost, remaining monthly credit |
| **Row Selection** | Checkboxes to pick specific leads, export only those |
| **Expandable Rows** | Click any row for full details (all categories, coordinates, hours, place ID) |
| **Pagination** | 25 results per page |
| **Search History** | Click any past search to reload results instantly |
| **CSV Export** | Name, address, phone, website, rating, reviews, categories, Google Maps URL |

---

## Optional: Scraper Mode (Advanced)

If you don't want to use the Google API, you can use a free open-source scraper instead. This requires Docker.

```bash
docker run -d -p 8080:8080 gosom/google-maps-scraper
```

Then select "Scraper (Docker)" as the data source in the app. No API key needed, no result limit, but slower.

---

## License

MIT
