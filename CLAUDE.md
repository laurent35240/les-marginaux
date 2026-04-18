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
| `*.jpg / *.jpeg` | Photos used directly by filename (same directory) |

## Architecture

**CSS** uses custom properties (`--orange`, `--cyan`, `--yellow`, `--pink`, `--neon-green`) defined in `:root`. All `@keyframes` are declared at the top of `style.css`. Google Fonts loaded via `@import`: Bangers (comic titles), Patrick Hand (handwritten captions), Share Tech Mono (terminal/Matrix), Permanent Marker (chaotic labels).

**JavaScript** (`script.js`) is vanilla ES6, no framework. Organized as:
- Utility functions: `typewrite()`, `openModal()`, `closeModal()`, `closePopup()`, `launchConfetti()`, `wrongAnswer()`
- Feature inits called from a single `DOMContentLoaded` listener at the bottom
- Scroll triggers use `IntersectionObserver` (Tricount bar, speech bubble, Matrix bar chart, canyoning fullscreen)
- Countdowns use `requestAnimationFrame` loops (Damien widget, Nico planning section)
- Inactivity popup (Nico légumes) uses a `setTimeout` reset on `mousemove/keydown/scroll/click`

**Image filenames with spaces**: `WhatsApp Image 2026-04-16 at 21.17.57.jpeg` is referenced only via HTML `src` attribute — never in CSS `url()` to avoid encoding issues.

## Sections (index.html, top to bottom)

1. **Header** — logo + hover SVG échangeur animation + emoji caricatures
2. **Tourmalet Hiver** — animated chairlift photos, typewriter speech bubble, sausage menu card, Matrix canvas rain + fake Excel planning, Tricount loading bar → approval modal
3. **Les Experts** — informational cards (Damien, Nico)
4. **Biarritz & Collioure** — kayak with "Glou Glou" drown overlay loop, Ti-Punch button + glass fill animation, Nathalie SVG illustration
5. **Exploits** — canyoning fullscreen takeover (2.5s), rafting photo, VTT before/after toggle, Galette vs Crêpe fighting-game duel
6. **Où est Thibault ?** — JS-generated chaotic background, hidden 👻 target with confetti + repositioning game
7. **Galerie PA** — link to `gallery-pa.html`

## Global overlays (always in DOM)

- `#tricount-modal` — green neon "APPROUVÉ" modal
- `#damien-popup` — Damien's fake scientific equinox explanation
- `#nico-vegetal-popup` — 1950s ad popup after 10s inactivity
- `#damien-countdown` — fixed right-side widget, visible throughout the whole page
- `#confetti-container` — confetti pieces appended/removed dynamically

## Photo → section mapping

All images are web-optimized JPEGs (total ~2.3MB). Originals were renamed and resized from the raw device photos.

| File | Dimensions | Where used |
|---|---|---|
| `logo.jpg` | 1400×680 | Header logo |
| `hiver-selfie.jpg` | 900×675 | Chairlift chair 1 (ski selfie) |
| `hiver-piste.jpg` | 900×507 | Chairlift chair 2 (slope pose) |
| `hiver-chalet.jpg` | 1200×903 | Après-ski chalet photo |
| `galette.jpg` | 677×900 | Laurent's galette duel (fighter portrait) |
| `ete-kayak.jpg` | 1200×560 | Kayak scene (été section) |
| `ete-rafting.jpg` | 1200×900 | Rafting exploit |
| `ete-canyoning.jpg` | 900×1200 | Canyoning fullscreen takeover |
| `ete-balcon.jpg` | 677×900 | Balcony/sea photo thumbnail |
| `ete-plage.jpg` | 900×1200 | Beach background (`opacity:0.15`) + thumbnail |
| `ete-tipunch.jpg` | 675×900 | Ti-punch cocktail thumbnail |
