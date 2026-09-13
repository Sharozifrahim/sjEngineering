# SJ Engineering — 3D Website (Parcel edition)

Same site as before, now bundled with [Parcel](https://parceljs.org) so
Three.js is installed locally via npm instead of fetched from a CDN. This
fixes the two problems that broke the chatbot in the plain-HTML version:
no `file://` module restrictions, and no dependency on an external CDN
being reachable.

## Run it

```bash
npm install
npm start
```

Then open the URL Parcel prints (usually `http://localhost:1234`). Parcel
serves both pages with hot reload — edit any file and the browser updates
automatically. Visit `/product.html` for the products page.

## Build for deployment

```bash
npm run build
```

This outputs a static, production-ready site into `dist/` — upload that
folder's contents to any static host (Netlify, Vercel, GitHub Pages, cPanel,
etc.). No Node.js needed on the server; `dist/` is plain HTML/CSS/JS.

## Project structure

```
index.html          home page
product.html         products page with 3D viewers
css/style.css        design system
js/hero-scene.js      homepage 3D background (Three.js)
js/product-viewer.js  per-product 3D models (Three.js)
js/chatbot.js         AI assistant (works with zero setup)
package.json          scripts + dependencies (three, parcel)
```

`node_modules/`, `dist/`, and `.parcel-cache/` are intentionally left out of
this bundle — `npm install` recreates `node_modules/`, and `npm run build`
recreates `dist/`.

## The chatbot

Unchanged from before — it answers from a local knowledge base in
`js/chatbot.js` (the `KB` object) built from your company profile, so it
works immediately with no setup or API key. Edit `KB` any time your
services, tools, or contact details change.

For richer conversational answers, click **"Enable full AI mode"** in the
chat panel and paste a free API key from
[console.groq.com](https://console.groq.com). The key is stored only in
that visitor's browser (`localStorage`) and sent directly from their
browser to Groq — nothing passes through a server of yours. If you'd rather
power the chat with one shared key for every visitor, that needs a small
backend (e.g. a Vercel/Cloudflare function) to hold the key server-side —
ask if you'd like that built.

## Using your own 3D product models

The product viewers build simple procedural shapes so the site works with
no assets. To use real 3D scans of your products instead:

1. Export as `.glb` and put it in a new `models/` folder.
2. In `js/product-viewer.js`, import the loader:
   ```js
   import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
   ```
3. Replace the relevant `build...()` function, e.g.:
   ```js
   function buildTank(){
     const group = new THREE.Group();
     new GLTFLoader().load(new URL("../models/tank.glb", import.meta.url).href,
       gltf => group.add(gltf.scene));
     return group;
   }
   ```
   (Parcel needs the `new URL(..., import.meta.url)` form so it bundles the
   `.glb` file correctly — a plain string path will 404 in the production
   build.)

## Editing company info

- Contact numbers, email, and address: search-and-replace in `index.html`,
  `product.html`, and `KB.company` in `js/chatbot.js`.
- WhatsApp number: `923009239576` appears in every `wa.me` link — update
  every occurrence if the number changes.
