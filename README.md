# Damir Perić — Portfolio

A small, fast static website built with [Astro](https://astro.build).
No database, no CMS: everything lives in this folder.

## Where things are

| You want to change… | Edit this file |
|---|---|
| Your intro, about text, experience, services, email, socials | `src/content/info/info.md` |
| A case study (text + list of images) | `src/content/work/<project>/index.md` |
| Colours, font sizes, spacing, motion | `src/styles/global.css` (top of the file) |
| The font | Put the `.woff2` in `public/fonts/`, then change the file name at the top of `src/styles/global.css` |

## Adding a new project

1. Duplicate the folder `src/content/work/insights` and rename it, e.g. `src/content/work/my-project`.
   The folder name becomes the web address: `/work/my-project`.
2. Delete the old images and put your new ones in the folder.
   Export at **2×** (e.g. 2704 px wide for full-width images, 1328 px for half-width).
   JPG for photos, PNG for UI. The site resizes and compresses them automatically.
3. Open `index.md` and update the title, summary, cover and the `blocks:` list
   (instructions are written inside the file).
4. Set `order:` to choose its position on the homepage.
   While a project isn't ready, add `draft: true` and it stays hidden.

Commit the changes on GitHub, and Vercel publishes the site again within about a minute.

## Running it on your own computer (optional)

You need [Node.js](https://nodejs.org) (the LTS version) installed. Then, in this folder:

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:4321 in your browser. Changes appear as you save.
