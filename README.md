# Study Drawer

GRE flashcards for vocabulary and math, with spaced repetition (Leitner boxes),
tag filtering, and a streak counter. Progress is saved in your browser's
localStorage, so it persists between visits on the same device and browser.

Access at the following website: https://emma-gibbens.github.io/GRE_study/



## Run it locally

You need [Node.js](https://nodejs.org) installed (18+ is fine).

```bash
npm install
npm run dev
```

This prints a local URL (usually `http://localhost:5173`). Open it in your
browser. Changes to `src/App.jsx` hot-reload automatically.

## Put it on GitHub

From inside this folder:

```bash
git init
git add .
git commit -m "Initial commit: Study Drawer"
```

Create an empty repo on github.com (New repository, don't initialize it with
a README or .gitignore, this folder already has one), then push:

```bash
git remote add origin https://github.com/<your-username>/GRE_study.git
git branch -M main
git push -u origin main
```

If you rename the repo to something other than `GRE_study`, update the `base`
path in `vite.config.js` to match before you push, otherwise the deployed
site will load a blank page (the asset paths won't line up).

## Turn on GitHub Pages

This repo includes a GitHub Actions workflow
(`.github/workflows/deploy.yml`) that builds the app and publishes it
automatically every time you push to `main`. You only need to flip one
setting to activate it:

1. On GitHub, go to your repo's **Settings → Pages**.
2. Under "Build and deployment", set **Source** to **GitHub Actions**.
3. Push (or re-push) to `main`. Under the **Actions** tab you'll see a
   "Deploy to GitHub Pages" run start automatically.
4. Once it finishes (a green check), your site is live at:
   `https://<your-username>.github.io/GRE_study/`

Every future `git push` to `main` rebuilds and redeploys automatically, no
manual steps needed.

**Note on repo visibility:** GitHub Pages is free on the free plan, but only
for public repositories. If this repo is private, Pages hosting needs a paid
GitHub plan (Pro, Team, or Enterprise). Since this is just flashcard content,
a public repo is usually fine, but it's your call.

## Adding more cards later

Open `src/App.jsx` and look for the `CARDS_DATA` constant near the top, it's
a plain array of objects like:

```js
{ "id": "v0", "deck": "vocab", "tag": "By the Letter", "front": "Aberration",
  "pos": "n", "back": "A departure from what is normal or expected.",
  "example": "The freak snowstorm in July was an aberration." }
```

You can hand-edit that array, or just use the in-app "Add a card" form, which
saves to localStorage and doesn't require touching code or redeploying.

## Notes on the data

The vocabulary set draws its word list from Magoosh's GRE vocabulary eBook,
but the definitions and example sentences were written fresh rather than
copied from it.
