# Website Maintenance Guide
*Complete guide for updating your professional portfolio website*

## 🏗️ **Website Structure Overview**

Your website is a multi-page React application with the following structure:

```
src/
├── App.jsx                    # Main routing configuration
├── main.jsx                   # Application entry point
├── components/
│   ├── Layout.jsx            # Navigation, header, footer
│   ├── AuroraCanvas.jsx      # Background animation
│   ├── Spotlight.jsx         # Background effects
│   └── ...
├── pages/
│   ├── HomePage.jsx          # Landing page with bio
│   ├── ProjectsPage.jsx      # Project showcase
│   ├── BlogPage.jsx          # Blog listing
│   ├── BlogPostPage.jsx      # Individual blog posts
│   ├── AboutPage.jsx         # Detailed background
│   └── ContactPage.jsx       # Contact information
├── content/
│   └── site.json            # Main website content
├── data/
│   └── blogPosts.js         # Blog post data
└── styles/
    ├── index.css            # Global styles
    └── tokens.css           # Color/typography tokens
```

---

## 📝 **How to Update Content**

### **1. Personal Information (site.json)**
**File**: `src/content/site.json`

```json
{
  "name": "Your Name",
  "tagline": "Your Professional Tagline",
  "hero": {
    "title": "Your main headline",
    "subtitle": "Your subtitle",
    "description": "Your bio summary"
  },
  "education": {
    "institution": "University Name",
    "degree": "Your Degree",
    "status": "Expected Graduation Date",
    "coursework": ["Course 1", "Course 2", ...]
  }
}
```

**What you can change:**
- ✅ Name, tagline, bio text
- ✅ Education details and graduation date
- ✅ Contact information and social links
- ✅ Professional summary

### **2. Adding/Updating Projects**
**File**: `src/content/site.json` → `projects.featured` array

```json
{
  "title": "Project Name",
  "subtitle": "Brief descriptor",
  "description": "Detailed project description",
  "tech": ["Technology 1", "Technology 2"],
  "status": "Development Status",
  "year": "2024-2025",
  "highlights": ["Key Feature 1", "Key Feature 2"]
}
```

**Status options**: `"In Development"`, `"Complete"`, `"Active Research"`, `"Competition Active"`

### **3. Updating Skills & Technologies**
**File**: `src/content/site.json` → `about.skills` array

```json
"skills": [
  "Python", "Machine Learning", "React", 
  "Docker", "AWS", "PostgreSQL"
]
```

### **4. Adding Coursework**
**File**: `src/content/site.json` → `education.coursework` array

```json
"coursework": [
  "Data Structures (CS 400)",
  "Machine Learning (CS 540)",
  "Database Systems (CS 564)"
]
```

---

## 📰 **Blog Management**

### **Adding a New Blog Post**
**File**: `src/data/blogPosts.js`

1. **Add to the blogPosts array:**
```javascript
{
  id: "unique-post-id",
  title: "Your Post Title",
  slug: "url-friendly-slug",
  excerpt: "Brief description for the blog listing",
  date: "2024-12-15",
  readTime: "8 min read",
  tags: ["Tag1", "Tag2", "Tag3"],
  featured: false, // Set to true for featured posts
  content: `# Your Post Title
  
  Your full blog post content in Markdown format...
  
  ## Subheading
  
  - Bullet points
  - More content
  
  **Bold text** and *italic text*
  
  \`\`\`javascript
  // Code blocks
  const example = "code";
  \`\`\`
  `
}
```

2. **Content formatting tips:**
   - Use Markdown syntax for formatting
   - Code blocks: Use triple backticks with language
   - Links: `[text](url)`
   - Images: `![alt text](image-url)`
   - Lists: Use `-` or `1.` for numbered lists

### **Blog Post Features**
- ✅ **Clickable links**: Blog posts now navigate to individual pages
- ✅ **Markdown rendering**: Full support for rich content
- ✅ **Syntax highlighting**: Code blocks with proper formatting
- ✅ **SEO-friendly URLs**: Clean `/blog/post-slug` structure
- ✅ **Tags and metadata**: Organized with categories and read time

---

## 🎨 **Styling & Appearance**

### **Color Scheme**
**File**: `src/styles/tokens.css`

```css
:root {
  --color-bg: #0a0a0a;
  --color-purple: #8b5cf6;
  --color-cyan: #06b6d4;
  --color-amber: #f59e0b;
}
```

### **Typography**
**File**: `src/styles/index.css`

```css
:root {
  --fs-hero: clamp(3rem, 8vw, 6rem);
  --fs-h2: clamp(2rem, 5vw, 4rem);
  --fs-hero-sub: clamp(1rem, 3vw, 1.5rem);
}
```

---

## 🔧 **Development Commands**

### **Local Development**
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### **Adding Dependencies**
```bash
# Add a new package
npm install package-name

# Add development dependency
npm install -D package-name
```

---

## 📂 **File Organization**

### **When to edit which files:**

| **Want to change** | **Edit this file** |
|---|---|
| Your name, bio, contact info | `src/content/site.json` |
| Add/remove/update projects | `src/content/site.json` → `projects.featured` |
| Add new blog post | `src/data/blogPosts.js` |
| Update skills/technologies | `src/content/site.json` → `about.skills` |
| Add coursework | `src/content/site.json` → `education.coursework` |
| Change colors/fonts | `src/styles/tokens.css` |
| Update social links | `src/content/site.json` → `links` |
| Modify page layouts | `src/pages/*.jsx` |

---

## 🚀 **Deployment**

### **Build Process**
1. Make your changes locally
2. Test with `npm run dev`
3. Build production version: `npm run build`
4. Deploy the `dist/` folder to your hosting platform

### **Common Hosting Platforms**
- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag & drop `dist/` folder or connect repo
- **GitHub Pages**: Use GitHub Actions for deployment

---

## 🔄 **Regular Maintenance Tasks**

### **Monthly Updates**
- [ ] Add new blog posts about current projects
- [ ] Update project statuses and progress
- [ ] Review and update skills list
- [ ] Add any new coursework completed

### **Semester Updates**
- [ ] Update graduation date if needed
- [ ] Add completed courses to coursework list
- [ ] Update bio/description with new achievements
- [ ] Add new projects or research work

### **Job Search Updates**
- [ ] Highlight relevant skills for target roles
- [ ] Update project descriptions for target audience
- [ ] Add links to deployed project demos
- [ ] Update resume PDF link

---

## 🐛 **Troubleshooting**

### **Common Issues**

**Blog posts not showing:**
- Check `src/data/blogPosts.js` syntax
- Ensure `slug` is unique and URL-friendly
- Verify date format: `"YYYY-MM-DD"`

**Styling issues:**
- Run `npm run dev` to see changes
- Check browser console for errors
- Verify CSS class names match

**Build failures:**
- Run `npm run lint` to check for errors
- Check console output for specific error messages
- Ensure all imports are correct

### **Getting Help**
1. Check browser console for error messages
2. Verify all file paths are correct
3. Make sure JSON syntax is valid
4. Test changes locally before deploying

---

## 📋 **Quick Reference**

### **File Extensions**
- `.jsx` = React components
- `.js` = JavaScript utilities/data
- `.json` = Configuration/content data
- `.css` = Styling
- `.md` = Markdown documentation

### **Key Concepts**
- **Components**: Reusable UI pieces (Header, Footer, etc.)
- **Pages**: Full page layouts (Home, Projects, etc.)
- **Data**: Content that changes frequently (blog posts, projects)
- **Styles**: Visual appearance and layout

---

*This guide covers all the essential maintenance tasks for your professional portfolio website. Keep this handy for quick updates and refer to it whenever you need to make changes!*
