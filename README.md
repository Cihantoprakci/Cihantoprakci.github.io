# Portfolio — Cihan Toprakci

Portfolio professionnel de Cihan Toprakci, étudiant développeur web (B1 MyDigitalSchool, Annecy) en recherche d'alternance pour septembre 2026.

> **Live :** _à déployer (Netlify recommandé)_  
> **Stack :** Vite · Vanilla JS · GSAP · Lenis · CSS modulaire

---

## 🎯 Objectif

Convaincre un recruteur en quelques secondes :
- qui je suis
- ce que je sais faire
- mes projets
- comment me contacter

Le tout en démontrant une vraie maîtrise des fondamentaux web (HTML/CSS/JS) couplée à un outillage moderne (Vite, GSAP, Lenis).

---

## 🚀 Lancer le projet

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm run dev
# → http://localhost:5173

# 3. Build de production
npm run build
# → output dans /dist

# 4. Preview du build
npm run preview
```

### Scripts disponibles

| Script | Action |
|---|---|
| `npm run dev` | Serveur Vite avec HMR |
| `npm run build` | Build optimisé dans `/dist` |
| `npm run preview` | Preview du build de production |
| `npm run lint` | ESLint sur `src/` |
| `npm run format` | Prettier sur tous les fichiers |
| `npm run format:check` | Vérification Prettier (CI-friendly) |

---

## 🏗️ Architecture

```
portfolio-refonte/
├── public/                      # Assets non hashés (CV, favicon, robots)
│   ├── favicon.svg
│   ├── robots.txt
│   └── cv/CV_Cihan_Toprakci.pdf
│
├── src/
│   ├── index.html               # Single-page accueil (5 sections)
│   ├── projets/                 # 6 pages détail projet
│   │   ├── melinda-primeur.html
│   │   ├── my-digital-week.html
│   │   ├── euphoria.html
│   │   ├── funiro.html
│   │   ├── js-logic-lab.html
│   │   └── stunning.html
│   │
│   ├── assets/                  # Hashés par Vite (cache long)
│   │   ├── images/projects/
│   │   ├── images/profile/
│   │   ├── icons/tech/
│   │   ├── icons/social/
│   │   └── fonts/
│   │
│   ├── styles/
│   │   ├── main.css             # Entry — @layer order + imports
│   │   ├── base/                # reset, tokens, typography, utilities
│   │   ├── components/          # button, nav, preloader, marquee, badge,
│   │   │                        # project-card, skill-pill, form, scroll-progress
│   │   ├── sections/            # hero, about, projects, skills, contact, footer
│   │   └── pages/project-detail.css
│   │
│   └── scripts/
│       ├── main.js              # Entry SPA — orchestre boot + matchMedia
│       ├── project-detail.js    # Entry pages détail (anims plus légères)
│       ├── core/                # gsap-config, lenis, reduced-motion, viewport
│       ├── ui/                  # preloader, scroll-progress, nav, magnetic, tilt
│       ├── animations/          # hero, about, projects, skills, contact + utils
│       └── features/            # contact-form (Formspree)
│
├── package.json
├── vite.config.js               # Multi-page input, image optim, manualChunks
├── .eslintrc.cjs
├── .prettierrc
└── README.md
```

**Principes** :
- 1 fichier CSS par section/composant (≤200 lignes max — fini le monolithe)
- 1 fichier JS d'animation par section, isolé via `gsap.context()`
- Source unique pour les projets — les 6 cartes accueil pointent vers `/projets/<slug>.html`
- Vite multi-page input : 1 bundle par page, chunks GSAP/Lenis partagés

---

## 🎬 Comment fonctionnent les animations

### Architecture GSAP

Le boot dans [src/scripts/main.js](src/scripts/main.js) suit une séquence stricte :

1. `gsap.registerPlugin(ScrollTrigger)` + defaults globaux (ease, duration)
2. **Lenis** (smooth scroll) intercepte le scroll natif et le lisse via interpolation. Chaque frame appelle `ScrollTrigger.update()` pour synchroniser GSAP.
3. **UI utilitaires** init synchrone : préloader, scroll-progress, nav, magnétique, tilt.
4. **Préloader** : `Promise.race` entre chargement images et timeout 2.5s. Sortie progressive avec overlay qui fade out.
5. **`gsap.matchMedia()`** orchestre toutes les sections selon trois variantes : `isDesktop`, `isMobile`, `reduced` (motion). Une seule règle, pas de `window.innerWidth` dispersé.

### Pattern par section

Chaque section a son fichier `*.anim.js` qui :
- exporte une fonction `animate*({ isDesktop, reduced })`
- gère son cas `reduced` en premier (set opacity 1, return)
- crée ses tweens dans un `gsap.context()` scopé à la section
- retourne sa fonction de cleanup pour `matchMedia` teardown

Exemple — la section projets :
- 1 `ScrollTrigger` pin sur le heading (desktop only)
- Per-card : timeline `clipPath` reveal + scale image + SplitText titre + stagger meta
- Compteur `01/06` synchronisé via `ScrollTrigger.create({ onEnter, onEnterBack })`

### Effets retenus (curated, pas overload)

| Effet | UX purpose |
|---|---|
| Préloader avec progress | Cache le FOUC, donne le temps aux assets |
| Marquee statut alternance | Rend la demande visible et undeniable |
| SplitText hero reveal | Contrôle l'ordre de lecture du recruteur |
| Multi-layer parallax (hero) | Profondeur, signal motion design |
| Stagger reveals (toutes sections) | Récompense le scroll, paces l'info |
| Pinned heading projets | Maintient le contexte pendant les 6 cartes |
| Magnetic CTAs + nav | Tactilité subtile, max 12px translate |
| Tilt 3D project cards | Dimension sans templater (max ±6°) |
| Counter sync 01/06 | Wayfinding sur la section centerpiece |
| Compteurs about | Met en valeur les chiffres clés (74, 6) |
| Scroll progress bar | Wayfinding global |

### Effets explicitement écartés

- ❌ Curseur custom (template-y, mort sur mobile)
- ❌ Section snap (fight contre le scroll natif = recruteur frustré)
- ❌ Particles JS (kitsch 2018)
- ❌ Horizontal scroll (casse l'intuition browser back)
- ❌ Sound effects, glitch matrix, WebGL shaders, etc.

---

## ✏️ Comment modifier le contenu

| Quoi | Où |
|---|---|
| **Projets** (titre, description, tech) | [src/index.html](src/index.html) section `#projets` + [src/projets/<slug>.html](src/projets/) |
| **Skills** (catégories, niveaux) | [src/index.html](src/index.html) section `#competences` — chaque pill a un `data-level="X"` |
| **Bio / About** | [src/index.html](src/index.html) section `#about` |
| **Statut alternance** (marquee + badge) | [src/index.html](src/index.html) — élément `[data-marquee]` + `.badge--status` |
| **Contact** (email, tél, liens) | [src/index.html](src/index.html) section `#contact` |
| **Endpoint Formspree** | [src/index.html](src/index.html) attribut `action` du formulaire |
| **Couleurs / typo / spacing** | [src/styles/base/tokens.css](src/styles/base/tokens.css) — custom properties cascadent partout |
| **CV PDF** | [public/cv/CV_Cihan_Toprakci.pdf](public/cv/) |
| **Favicon** | [public/favicon.svg](public/) |

---

## ♿ Accessibilité

- ✅ HTML sémantique : `<header>`, `<main>`, `<nav>`, `<section aria-labelledby>`, `<footer>`
- ✅ Hiérarchie de titres : 1 `<h1>` (hero), `<h2>` par section, `<h3>` projets et skill groups
- ✅ `prefers-reduced-motion: reduce` — désactive Lenis, parallax, tilt, marquee, splitText
- ✅ Skip-to-content (premier focusable)
- ✅ Focus visible : outline doré 2px + offset 3px
- ✅ Alt text descriptif sur toutes les images
- ✅ `aria-live="polite"` sur le compteur projets et le statut formulaire
- ✅ `aria-current` géré dynamiquement sur la nav active
- ✅ Honeypot anti-spam (`_gotcha`) sur le form
- ✅ JSON-LD `Person` schema dans `<head>`
- ✅ `lang="fr"` correct
- ✅ Contraste AAA (or `#f4b400` sur fond `#0b1120` = 9:1)

---

## ⚡ Performance

- WebP/AVIF via `vite-plugin-image-optimizer`
- `loading="lazy"` + `decoding="async"` sur images below-the-fold
- Self-host fonts (à activer — fallback Google Fonts en place)
- Vite manual chunks : `gsap`, `lenis` séparés pour cache long
- CSS code-split par section
- Cible Lighthouse : Perf > 95, A11y > 95, Best Practices = 100, SEO = 100

**Budget JS gzip** : GSAP ~25 KB + ScrollTrigger ~15 KB + Lenis ~5 KB + app ~10 KB = **~55 KB**

---

## 📱 Responsive

Mobile-first. Breakpoints clés (alignés sur `tokens.css`) :
- `--bp-md: 600px`
- `--bp-lg: 900px`
- `--bp-xl: 1200px`

**Désactivés ≤ 899 px** :
- Tilt 3D
- Magnétisme
- Parallax multi-couches
- Pinning du heading projets

**Conservés sur mobile** : Lenis (lerp 0.1), reveals, préloader, marquee (2× plus lent).

---

## 🚢 Déploiement (Netlify)

```bash
# 1. git init + commit
git init
git add .
git commit -m "Initial commit"

# 2. Push sur GitHub
git remote add origin git@github.com:Cihantoprakci/portfolio.git
git push -u origin main

# 3. Connect repo sur Netlify
#    - Build command  : npm run build
#    - Publish dir    : dist
#    - Node version   : 18+
```

Optionnel : domaine custom `cihantoprakci.fr` ou `.dev`.

Pour le cache long sur les assets, ajouter un fichier `public/_headers` :
```
/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

---

## 🎨 Stack

| Catégorie | Outil |
|---|---|
| Build | [Vite 5](https://vitejs.dev) |
| Animation | [GSAP 3](https://greensock.com/gsap/) + ScrollTrigger |
| Smooth scroll | [Lenis](https://lenis.darkroom.engineering/) |
| Image optim | [vite-plugin-image-optimizer](https://github.com/FatehAK/vite-plugin-image-optimizer) (sharp) |
| Lint | ESLint + Prettier |
| Form backend | [Formspree](https://formspree.io) |

**Pas de framework JS** (React, Vue, etc.) — vanilla pur, pour démontrer la maîtrise des fondamentaux + outillage moderne.

---

## 📜 License

MIT — © 2026 Cihan Toprakci

---

## 📬 Contact

- 📧 [ctoprakci74@gmail.com](mailto:ctoprakci74@gmail.com)
- ☎ 06 65 95 07 77
- 💼 [LinkedIn](https://www.linkedin.com/in/cihan-toprakci/)
- 💻 [GitHub](https://github.com/Cihantoprakci)
