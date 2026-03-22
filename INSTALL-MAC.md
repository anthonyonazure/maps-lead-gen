# Maps Lead Gen — Mac Setup Guide

Step-by-step instructions to get this running on a Mac. No technical experience needed.

---

## Step 1: Install Node.js

Node.js is the engine that runs this app. You only need to do this once.

1. Open your web browser and go to: **https://nodejs.org**
2. Click the big green button that says **"LTS"** (the recommended version)
3. A `.pkg` file will download. Double-click it to open the installer
4. Click **Continue** through the prompts, then **Install**
5. Enter your Mac password when asked
6. Click **Close** when it's done

**To verify it worked:** Open the **Terminal** app (press Cmd+Space, type "Terminal", hit Enter) and type:
```
node --version
```
You should see a version number like `v22.x.x`. If you see "command not found", restart Terminal and try again.

---

## Step 2: Download the App

1. Open **Terminal** (Cmd+Space → type "Terminal" → hit Enter)
2. Copy and paste this entire line, then hit Enter:

```
cd ~/Desktop && git clone https://github.com/anthonyonazure/maps-lead-gen.git
```

This creates a folder called `maps-lead-gen` on your Desktop.

> **If you see "git: command not found"**: A popup will ask you to install Command Line Tools. Click **Install**, wait for it to finish, then run the command above again.

---

## Step 3: Install Dependencies

In the same Terminal window, copy and paste this line and hit Enter:

```
cd ~/Desktop/maps-lead-gen && npm install
```

Wait for it to finish (may take 30-60 seconds). You'll see some output scrolling — that's normal.

---

## Step 4: Get a Google API Key (Free)

This is how the app searches Google Maps. Google gives you **$200/month in free credits** — that's thousands of searches.

1. Go to: **https://console.cloud.google.com/**
2. Sign in with your Google account
3. If asked to agree to terms, check the box and click **Agree and Continue**
4. Click **Select a project** at the top of the page, then **New Project**
5. Name it anything (e.g., "Lead Gen") and click **Create**
6. Wait a few seconds, then click **Select Project** when it appears

**Create your API key:**

7. In the left sidebar, click **APIs & Services** → **Credentials**
8. Click **+ Create Credentials** at the top → **API key**
9. A key will appear (starts with "AIza..."). **Copy it** — you'll need it in Step 6
10. Click **Close**

**Turn on the required APIs:**

11. Open this link in a new tab: **https://console.cloud.google.com/apis/library/places-backend.googleapis.com**
    - Click **Enable**
12. Open this link in a new tab: **https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com**
    - Click **Enable**

That's it for Google setup. You won't be charged anything — the free $200/month credit covers about 6,000 searches.

---

## Step 5: Start the App

In Terminal, copy and paste this line and hit Enter:

```
cd ~/Desktop/maps-lead-gen && npm run dev
```

You should see output like:
```
[server] Server running on http://127.0.0.1:3001
[client] Local: http://localhost:5173/
```

**Leave this Terminal window open** — closing it stops the app.

---

## Step 6: Open the App and Add Your API Key

1. Open your web browser and go to: **http://localhost:5173**
2. Click the **gear icon** (top-right corner)
3. Paste your Google API key into the field
4. Click **Save** — it should say "API key valid"
5. Close the settings panel (click the X)

---

## Step 7: Search!

1. Type a business type (e.g., "chiropractor")
2. Type a location (e.g., "Austin, TX" or a zip code like "78701")
3. Set any filters you want:
   - **Website**: "No website" finds businesses without one (great for selling web services)
   - **Reviews**: Set a max to find smaller businesses
   - **Exclude**: Type names to skip (e.g., "The Joint, HealthSource")
4. Click **Search**
5. Click any row to expand and see full details
6. Check the boxes next to leads you want, then click **Export Selected**
7. Or click **Export All** to download everything as a CSV file

---

## Everyday Use

Every time you want to use the app:

1. Open **Terminal**
2. Paste: `cd ~/Desktop/maps-lead-gen && npm run dev`
3. Open **http://localhost:5173** in your browser
4. When done, go back to Terminal and press **Ctrl+C** to stop it

Your previous searches are saved — click any search in the history bar to reload those results for free (no API cost).

---

## Troubleshooting

**"command not found" when running npm:**
→ Node.js didn't install correctly. Go back to Step 1.

**"API key is invalid":**
→ Make sure you enabled both APIs in Step 4 (Places API and Geocoding API). It can take a minute for them to activate.

**Browser shows "connection refused":**
→ Make sure the Terminal window with `npm run dev` is still running.

**0 results but it says "Showing 0 of 20":**
→ Your filters are too narrow. Try clearing the review/rating filters.

**App seems slow:**
→ The first search in a new area takes 1-3 seconds. Cached searches are instant.
