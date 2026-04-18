# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static one-page fan site for the friend group "Les Marginaux" (Seb, Nico, Damien, PA, Laurent, Thibault). No build step, no package manager — open `index.html` directly in a browser.

## Running the site

```bash
open index.html          # macOS
open gallery-pa.html     # fausse page galerie de PA (loading infini)
```

A local HTTP server is only needed if you hit CORS issues with `fetch()` (none currently used):

```bash
python3 -m http.server 8080
```

## File structure

| File | Role |
|---|---|
| `index.html` | One-page site, all sections in order |
| `style.css` | All styles + keyframe animations |
| `script.js` | All JavaScript — no external dependencies |
| `gallery-pa.html` | Standalone 90s-style fake loading page |
| `*.jpg` | Photos used directly by filename (same directory) |

## Architecture

**CSS** uses custom properties (`--orange`, `--cyan`, `--yellow`, `--pink`, `--neon-green`) defined in `:root`. All `@keyframes` are declared at the top of `style.css`. Google Fonts loaded via `@import`: Bangers (comic titles), Patrick Hand (handwritten captions), Share Tech Mono (terminal/Matrix), Permanent Marker (chaotic labels).

**JavaScript** (`script.js`) is vanilla ES6, no framework. Organized as:
- Utility functions: `typewrite()`, `openModal()`, `closeModal()`, `closePopup()`, `launchConfetti()`, `wrongAnswer(msg, evt)`
- Feature inits called from a single `DOMContentLoaded` listener at the bottom
- Scroll triggers use `IntersectionObserver` (Tricount bar, speech bubble, Matrix bar chart, canyoning fullscreen) — observers are attached to the *target element itself*, not the parent section
- Countdowns use `requestAnimationFrame` loops (Damien widget, Nico planning section)
- Inactivity popup (Nico légumes) uses a `setTimeout` reset on `mousemove/keydown/scroll/click`

## Sections (index.html, top to bottom)

1. **Header** — logo + hover SVG échangeur animation + emoji caricatures
2. **Tourmalet Hiver** — 5-photo chairlift animation, typewriter speech bubble ("Ça c'est les Pyrénées."), sausage menu card with photo, Matrix canvas rain + fake Excel planning, Tricount loading bar → approval modal, Nathalie des Thermes card (thermes background + manga portrait)
3. **Les Experts** — informational cards (Damien, Nico)
4. **Biarritz & Collioure** — kayak with "Glou Glou" drown overlay loop, Ti-Punch button + glass fill animation
5. **Exploits** — canyoning fullscreen takeover (2.5s), rafting photo, VTT before/after toggle, Galette vs Crêpe fighting-game duel
6. **Où est Thibault ?** — Gemini-generated ski resort illustration as background, 85 HTML decoy emojis + 1 hidden 👻 target with confetti + repositioning; `wrongAnswer(msg, evt)` pops message at click coordinates
7. **Galerie PA** — link to `gallery-pa.html`

## Global overlays (always in DOM)

- `#tricount-modal` — green neon "APPROUVÉ" modal
- `#damien-popup` — Damien's fake scientific equinox explanation (content generated dynamically by `startDamienCountdown()` based on next season)
- `#nico-vegetal-popup` — 1950s ad popup after 10s inactivity
- `#damien-countdown` — fixed bottom-right widget, visible throughout the whole page; counts down to next season change
- `#confetti-container` — confetti pieces appended/removed dynamically

## Photo → section mapping

Images are resized with `sips` on macOS (`sips -Z N` for max long side, `--resampleWidth N` for width, `-s formatOptions N` for JPEG quality 72–88).

| File | Dimensions | Size | Where used |
|---|---|---|---|
| `logo.jpg` | 1400×680 | 91K | Header logo |
| `hiver-selfie.jpg` | 900×675 | 144K | Chairlift (chair 1) |
| `hiver-piste.jpg` | 900×507 | 117K | Chairlift (chair 2) |
| `hiver-sommet.jpg` | 450×800 | 89K | Chairlift (chair 3) |
| `hiver-biere.jpg` | 800×600 | 187K | Chairlift (chair 4) |
| `hiver-selfie-2.jpg` | 450×800 | 83K | Chairlift (chair 5) |
| `hiver-berger.jpg` | 506×900 | 126K | Menu card photo |
| `hiver-chalet.jpg` | 1200×903 | 279K | Après-ski chalet photo |
| `hiver-thermes.jpg` | 900×600 | 177K | Nathalie section background |
| `nathalie-manga.jpg` | 700×382 | 129K | Nathalie portrait (manga style) |
| `thibault-scene.jpg` | 1600×872 | 861K | "Où est Thibault?" scene background |
| `galette.jpg` | 677×900 | 170K | Laurent's galette duel (fighter portrait) |
| `ete-kayak.jpg` | 1200×560 | 141K | Kayak scene (été section) |
| `ete-rafting.jpg` | 1200×900 | 386K | Rafting exploit |
| `ete-canyoning.jpg` | 900×1200 | 395K | Canyoning fullscreen takeover |
| `ete-balcon.jpg` | 677×900 | 138K | Balcony/sea photo thumbnail |
| `ete-plage.jpg` | 675×900 | 308K | Beach background (`opacity:0.15`) + thumbnail |
| `ete-tipunch.jpg` | 675×900 | 151K | Ti-punch cocktail thumbnail |
