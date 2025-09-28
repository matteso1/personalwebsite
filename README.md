# Nils Matteson - Personal Portfolio Website

Professional portfolio website showcasing my Computer Science and Data Science work at UW-Madison. Built with React, featuring a multi-page layout, interactive blog system, and project showcases.

🌐 **Live Site**: [personalwebsite-git-main-nils-s-projects.vercel.app](https://personalwebsite-git-main-nils-s-projects.vercel.app)

---

## 🏗️ Project Structure

```
src/
├── App.jsx                    # Main routing configuration
├── main.jsx                   # Application entry point
├── components/
│   ├── Layout.jsx            # Navigation, header, footer (shared across all pages)
│   ├── AuroraCanvas.jsx      # Background animation effects
│   ├── Spotlight.jsx         # Background spotlight effect
│   └── ...other components
├── pages/
│   ├── HomePage.jsx          # Landing page (/) with bio and overview
│   ├── ProjectsPage.jsx      # Projects showcase (/projects)
│   ├── BlogPage.jsx          # Blog listing (/blog)
│   ├── BlogPostPage.jsx      # Individual blog posts (/blog/post-slug)
│   ├── AboutPage.jsx         # Detailed background (/about)
│   └── ContactPage.jsx       # Contact information (/contact)
├── content/
│   └── site.json            # 🔥 MAIN CONTENT FILE - Edit this for most changes
├── data/
│   └── blogPosts.js         # 🔥 BLOG POSTS - Add new posts here
└── styles/
    ├── index.css            # Global styles
    └── tokens.css           # Colors, fonts, spacing variables
```

---

## 🎯 Quick Edit Guide

### **Want to change your bio, name, or contact info?**
📁 **Edit**: `src/content/site.json`
```json
{
  "name": "Your Name",
  "tagline": "Your Professional Title",
  "hero": {
    "description": "Your bio summary"
  }
}
```

### **Want to add/update projects?**
📁 **Edit**: `src/content/site.json` → find `"projects"` → `"featured"` array
```json
{
  "title": "Project Name",
  "description": "What the project does",
  "tech": ["Python", "React", "ML"],
  "status": "In Development",
  "highlights": ["Key feature 1", "Key feature 2"]
}
```

### **Want to add a new blog post?**
📁 **Edit**: `src/data/blogPosts.js` → add to `blogPosts` array
```javascript
{
  id: "unique-id",
  title: "Your Post Title",
  slug: "url-friendly-name",
  excerpt: "Brief description",
  date: "2024-12-15",
  tags: ["Tech", "ML"],
  featured: true, // Show on homepage
  content: `# Your Markdown Content Here...`
}
```

### **Want to update your skills?**
📁 **Edit**: `src/content/site.json` → find `"about"` → `"skills"` array
```json
"skills": ["Python", "Machine Learning", "React", "Docker"]
```

### **Want to add coursework?**
📁 **Edit**: `src/content/site.json` → find `"education"` → `"coursework"` array
```json
"coursework": [
  "Data Structures (CS 400)",
  "Machine Learning (CS 540)"
]
```

### **Want to update social links?**
📁 **Edit**: `src/content/site.json` → find `"links"`
```json
"links": {
  "github": "https://github.com/yourusername",
  "linkedin": "https://linkedin.com/in/yourprofile",
  "email": "mailto:your.email@wisc.edu"
}
```

---

## 📄 Page Breakdown

### **Home Page** (`src/pages/HomePage.jsx`)
- **Hero section** with your name and bio
- **Profile photo** (stored in `public/profile-photo.jpg`)
- **Quick access cards** to other sections
- **Featured project** highlight

### **Projects Page** (`src/pages/ProjectsPage.jsx`)
- **Project cards** with descriptions and tech stacks
- **Links** to demos and source code
- Gets data from `site.json` → `projects.featured`

### **Blog Page** (`src/pages/BlogPage.jsx`)
- **Blog post listings** with excerpts and tags
- **Recent updates** timeline
- Gets data from `src/data/blogPosts.js`

### **About Page** (`src/pages/AboutPage.jsx`)
- **Detailed background** and education
- **Skills showcase** with technology tags
- **Experience timeline**
- **Coursework listing**

### **Contact Page** (`src/pages/ContactPage.jsx`)
- **Contact methods** with working links
- **Opportunity interests**
- **Quick info** (location, citizenship, graduation)

---

## 🔧 Development Commands

```bash
# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Check for code issues
npm run lint
```

---

## 📝 Content Management

### **Personal Information**
**File**: `src/content/site.json`

All your personal info is centralized here:
- Name, tagline, bio
- Education details and graduation date
- Contact information and social links
- Project descriptions and tech stacks
- Skills and coursework lists

### **Blog Posts**
**File**: `src/data/blogPosts.js`

Currently includes 4 posts:
1. **Satellite Visualization Platform** (featured)
2. **Madison ML Bus System**
3. **Brain2Text Neural Decoding**
4. **UW Madison CS Journey**

**To add a new post:**
1. Copy the structure of an existing post
2. Change the `id`, `title`, `slug`, and `content`
3. Set `featured: true` to show on homepage
4. Use Markdown in the `content` field for formatting

### **Profile Photo**
**File**: `public/profile-photo.jpg`

Replace this file with your photo. Keep the same name and it will automatically update everywhere.

---

## 🎨 Styling

### **Colors & Themes**
**File**: `src/styles/tokens.css`
```css
:root {
  --color-bg: #0a0a0a;        /* Background color */
  --color-purple: #8b5cf6;    /* Primary accent */
  --color-cyan: #06b6d4;      /* Secondary accent */
}
```

### **Typography**
**File**: `src/styles/index.css`
```css
:root {
  --fs-hero: clamp(3rem, 8vw, 6rem);    /* Hero text size */
  --fs-h2: clamp(2rem, 5vw, 4rem);      /* Section headers */
}
```

---

## 🚀 Deployment

### **Vercel (Current)**
- **Auto-deploys** when you push to GitHub
- **Build command**: `npm run build`
- **Output directory**: `dist`

### **Making Updates**
1. Edit files locally
2. Test with `npm run dev`
3. Commit and push to GitHub
4. Vercel automatically builds and deploys

---

## 📊 Current Features

✅ **Multi-page navigation** (no more scroll-heavy single page!)  
✅ **Working blog system** with individual post pages  
✅ **Project showcases** with detailed descriptions  
✅ **Contact forms** with proper links  
✅ **Mobile responsive** design  
✅ **Professional styling** perfect for job applications  
✅ **SEO-optimized** URLs and meta tags  

---

## 🔧 Common Tasks

### **Update graduation date**
```json
// src/content/site.json
"education": {
  "status": "Expected May 2026"
}
```

### **Add a new skill**
```json
// src/content/site.json → about.skills
"skills": ["Python", "NEW SKILL HERE", "React"]
```

### **Change project status**
```json
// src/content/site.json → projects.featured[0]
"status": "Complete" // or "In Development", "Active Research"
```

### **Update contact email**
```json
// src/content/site.json → links
"email": "mailto:new.email@wisc.edu"
```

---

## 🐛 Troubleshooting

**Blog posts not showing?**
- Check `src/data/blogPosts.js` syntax
- Make sure `slug` is unique and URL-friendly

**Build failing?**
- Run `npm run lint` to check for errors
- Make sure all imports are correct
- Check JSON syntax in `site.json`

**Styling issues?**
- Run `npm run dev` to see changes live
- Check browser console for errors
- Verify CSS class names match

---

## 📚 Technologies Used

- **React 19** + React Router for navigation
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Markdown** for blog post rendering
- **Vite** for build system
- **Vercel** for deployment

---

*Keep this README handy for quick reference when updating your portfolio!*