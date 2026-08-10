# Site Audit App

A mobile-first, offline web app for running field site audits and generating a PDF record. It runs entirely in the browser — no server, no login, no install required — and is hosted as static files (e.g. GitHub Pages).

Each auditor's data is stored **on their own device**. The shareable output is the **PDF** they export at the end.

---

## Audit types

The dashboard offers three audit types, each opening its own form:

| Type | Format | What it captures |
|------|--------|------------------|
| **MDU Site Audit** | Step-by-step wizard (13 items) | Multi-dwelling fibre readiness — pits, pathways, comms room, riser, apartments, WAPs, etc. |
| **Lead-in Pit Audit** | Step-by-step wizard (18 items) | Single lead-in pit inspection — pit condition, conduits, draw ropes, direction to BEP, etc. |
| **SDU Site Audit (PCTSI)** | Multi-pit table | A pit inspection covering many pits in one visit, each with Pass/Fail condition checks. |

---

## How it works

### Dashboard
The home screen shows the audit-type tiles (to start a new audit) and a **Saved audits** list. Every audit you start is saved automatically as a card showing its type, site name, progress, and last-updated date. From a card you can **Open**, export a **PDF**, or **delete** it.

### Wizard audits (MDU, Lead-in Pit)
- One question per screen, with a **Yes / No** answer, optional either/or chips (e.g. Fire Rate / Fire Proof), measurement fields, a comment box, and photo capture.
- A progress bar tracks completion; **Back / Next** move between items.
- The final **Review** screen summarises every answer; **Save PDF** produces the record.

### SDU / PCTSI audits (pit table)
- A **project details** section (Date, Site Name, Project Manager, Field Tech), then a list of **pits**.
- **Add pit** (or import — see below) creates a pit card. Each pit opens an editor with its fields: Pit ID, Pit Type, Units, eight **Pass / Fail** condition checks, comments, and photos.
- The editor footer has **‹ Prev**, **Pits** (back to list), and **Next ›** ( **＋ New** on the last pit) so you can move through the list.
- **Save PDF** renders all pits as a table.

---

## Key rules & features

- **Offline.** Once loaded, the app works with no connection. Add it to your home screen (Share → Add to Home Screen on iPhone) for an app-like icon.
- **Yes/No and Pass/Fail only** — there is no N/A.
- **A "No" or "Fail" requires a comment.** You can't move to the next item/pit, add a new pit, or save the PDF until a comment is added (FTT to provide more info).
- **PDF colour coding.** In the exported PDF, **YES / Pass are green** and **NO / Fail are red** for quick scanning. *(Keep "Background graphics" enabled in the print options so colours print.)*
- **Photos.** Multiple photos per item/pit, taken with the camera or picked from the library. They're auto-compressed and embedded in the PDF. Photos are also meant to be uploaded to Towers under the project folder.
- **Auto-save.** Progress is saved to the device continuously; leaving to the menu keeps it.

---

## Import workflow (SDU / PCTSI)

Designed so the **PM owns the pit list** and the **Field Tech fills the results**:

1. **PM** fills the template (`pit-list-template.xlsx` or `.csv`) with **Site Name**, **Project Manager**, and a table of **Pit ID / Pit Type / Units Associated**, and sends it to the Field Tech.
2. **Field Tech** opens an SDU audit → **Import pit list** → picks the file.
3. The app reads it and **pre-fills** Site Name, Project Manager, and generates one pit per row (Pit ID / Type pre-filled, still editable).
4. The Field Tech just works down the pits doing Pass/Fail, comments, and photos.

Notes:
- Accepts both **.xlsx** and **.csv**.
- Importing **replaces** the current pit list (with a confirmation).
- Use the **Template** button in the app to download a correctly-formatted CSV.

---

## File structure

```
site-audit/
├── index.html                 # page shell (links CSS + JS, favicon)
├── styles.css                 # all styling
├── app.js                     # all logic (audit types, storage, PDF, import)
├── vendor/
│   └── xlsx.full.min.js        # SheetJS — required for reading .xlsx offline
├── assets/
│   ├── logo.png                # optional in-app header logo
│   └── favicon.png             # optional browser-tab / home-screen icon
├── pit-list-template.xlsx      # PM template (not used by the app itself)
└── pit-list-template.csv       # PM template
```

Keep all files in the same folder and paths relative — that's what lets it run on GitHub Pages *and* when opened locally.

---

## Deploying (GitHub Pages)

1. Upload `index.html`, `styles.css`, `app.js`, and the `vendor/` folder to the repo.
2. In the repo: **Settings → Pages → Source: Deploy from a branch → main → / (root) → Save**.
3. After a minute the site is live at `https://<username>.github.io/<repo>/`.

To **update**, edit/replace the changed file(s) and commit. Users who added it to their home screen should fully close and reopen it to pick up changes (favicons/assets can cache — a hard refresh helps).

---

## Customising

Open **`app.js`** — the branding block is at the very top:

```js
const LOGO_SRC  = "";             // e.g. "assets/logo.png" — header logo (dashboard)
const APP_TITLE = "Site Audits";  // header title on the dashboard
```

- **Header logo:** set `LOGO_SRC` to your image path.
- **App title:** change `APP_TITLE`.
- **Browser-tab / home-screen icon (favicon):** put a square `favicon.png` in `assets/` — it's referenced in `index.html`.
- **Theme colours:** the `:root` block at the top of `styles.css`.
- **Audit questions:** the `MDU_ITEMS` / `PIT_ITEMS` arrays and `TYPES` object near the top of `app.js`; the SDU pit columns are in `PIT_FIELDS`.

---

## Data & privacy

- All answers and photos live **only on the device** (browser `localStorage` + `IndexedDB`). Nothing is uploaded anywhere by the app.
- There is **no central sync** — each phone holds its own audits. The PDF is the shareable record.
- Because data is device-local, promptly export the PDF (and upload photos to Towers). If the browser's site data is cleared or the device runs low on storage, local audits can be lost.

---

## Tech notes

- Plain HTML/CSS/JavaScript (no framework, no build step).
- [SheetJS](https://sheetjs.com/) is vendored locally (`vendor/xlsx.full.min.js`) for offline `.xlsx` reading.
- PDF export uses the browser's built-in **Print → Save as PDF**.
