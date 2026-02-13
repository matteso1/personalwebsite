# Nils Matteson – Personal Site

Portfolio site for my projects and background. Built with React and deployed on Vercel.

**Live**: [personalwebsite-git-main-nils-s-projects.vercel.app](https://personalwebsite-git-main-nils-s-projects.vercel.app)

---

## Updating the site

- **Bio, projects, contact, skills** → edit `src/content/site.json`
- **Blog posts** → edit `src/data/blogPosts.js`
- **Resume** → replace `public/resume.pdf` with your new PDF (same filename)
- **Profile photo** → replace `public/profile-photo.jpg`

Push to GitHub and Vercel redeploys automatically.

---

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

---

## Deploy

Push to `main` on GitHub. Vercel handles the rest.
