// Blog posts data for the website
// Add new blog posts here and they'll automatically appear on the blog page

export const blogPosts = [
  {
    id: "satellite-visualization-platform",
    title: "Building a Real-Time 3D Satellite Visualization Platform",
    slug: "satellite-visualization-platform",
    excerpt: "Deep dive into building an advanced satellite visualization platform that combines real-time orbital mechanics calculations with interactive 3D graphics using CesiumJS and WebGL.",
    date: "2024-12-20",
    readTime: "12 min read",
    tags: ["3D Graphics", "WebGL", "Orbital Mechanics", "React", "CesiumJS"],
    featured: true,
    content: `# Building a Real-Time 3D Satellite Visualization Platform: A Deep Dive into Orbital Mechanics and WebGL

*Exploring the intersection of mathematics, physics, and modern web development through interactive space visualization*

## Introduction

As a developer passionate about both cutting-edge web technologies and space science, I recently embarked on building an advanced satellite visualization platform that combines real-time orbital mechanics calculations with interactive 3D graphics. This project demonstrates the practical application of mathematical concepts like Kepler's laws, coordinate transformations, and gravitational physics in a modern web application.

The result is a comprehensive platform that not only tracks satellites in real-time but also provides educational content and interactive visualizations of orbital mechanics principles. In this blog post, I'll walk through the technical challenges, solutions, and key learnings from this project.

## Project Overview

The **Advanced Satellite Visualization Platform** is a React-based web application that provides:

- **Real-time satellite tracking** using live orbital data from the N2YO API
- **Interactive 3D visualization** powered by CesiumJS and WebGL
- **Mathematical calculations** for orbital mechanics, velocity vectors, and orbital periods
- **Educational modules** explaining satellite physics and orbital concepts
- **Advanced visualization tools** including orbital paths, velocity vectors, and satellite footprints

## Technical Architecture

### Frontend Stack
- **React 18** with modern hooks and context management
- **CesiumJS** for industry-standard 3D globe visualization
- **Resium** for seamless React-Cesium integration
- **Vite** for lightning-fast development and building

### Mathematical Libraries
- **Custom orbital mechanics calculations** implementing Kepler's laws
- **satellite.js** for TLE (Two-Line Element) data processing
- **Real-time coordinate transformations** between spherical and Cartesian systems

### API Integration
- **N2YO.com REST API** for professional satellite tracking data
- **Intelligent caching system** to optimize API usage and respect rate limits
- **Error handling and recovery** for robust data fetching

## Key Technical Challenges and Solutions

### 1. Real-Time Orbital Calculations

One of the most complex aspects was implementing accurate orbital mechanics calculations in real-time. The platform calculates:

\`\`\`javascript
// Orbital velocity using v = sqrt(GM/r)
const orbitalVelocity = Math.sqrt((G * EARTH_MASS) / totalRadius);

// Orbital period using T = 2π * sqrt(r³/GM)  
const orbitalPeriod = (2 * Math.PI * Math.sqrt(Math.pow(totalRadius, 3) / (G * EARTH_MASS))) / 60;
\`\`\`

**Challenge**: Balancing mathematical accuracy with performance for real-time updates.

**Solution**: Implemented optimized calculation algorithms with intelligent caching and level-of-detail rendering based on satellite distance and importance.

### 2. 3D Coordinate System Transformations

Working with multiple coordinate systems required careful mathematical implementation:

- **Spherical coordinates** (latitude, longitude, altitude) from satellite data
- **Cartesian coordinates** for 3D rendering calculations  
- **Earth-centered reference frames** for accurate positioning
- **Observer-centered systems** for ground-based calculations

**Challenge**: Ensuring accurate transformations between coordinate systems while maintaining real-time performance.

**Solution**: Pre-computed transformation matrices and optimized vector operations using Cesium's built-in coordinate transformation utilities.

## Conclusion

This satellite visualization platform represents the intersection of advanced mathematics, modern web development, and educational technology. It demonstrates proficiency in:

- **Complex mathematical implementations** in real-world applications
- **3D graphics programming** and WebGL optimization
- **API integration** and data management
- **Educational content development** and user experience design
- **Performance optimization** for demanding computational tasks

The project showcases how technical skills can be applied to create both educational value and practical functionality, making complex scientific concepts accessible through interactive visualization.

**Technologies Used**: React 18, CesiumJS, WebGL, JavaScript ES6+, REST APIs, Mathematical Libraries, 3D Graphics Programming

**Key Skills Demonstrated**: Advanced Mathematics, 3D Graphics Programming, API Integration, Performance Optimization, Educational Technology, Real-time Data Processing`
  },
  {
    id: "madison-ml-bus-system",
    title: "Building a Smart Transit System: From Data Collection to Machine Learning",
    slug: "madison-ml-bus-system", 
    excerpt: "How I created an intelligent bus tracking system for UW-Madison using real-time data collection, machine learning, and modern web technologies to solve real transit problems.",
    date: "2024-11-15",
    readTime: "10 min read",
    tags: ["Machine Learning", "Data Science", "Python", "React", "APIs"],
    featured: false,
    content: `# Building a Smart Transit System: From Data Collection to Machine Learning

*How I created an intelligent bus tracking system for UW-Madison using real-time data collection, machine learning, and modern web technologies.*

## The Problem

As a computer science student at UW-Madison, I was constantly frustrated by the unreliability of the campus bus system. The official Madison Metro app would show a bus arriving "in 5 minutes" only to have it show up 15 minutes late, causing me to miss classes or stand in the cold Wisconsin weather. I realized this was a perfect opportunity to apply data science and machine learning to solve a real-world problem that affects thousands of students daily.

## The Vision

I wanted to build something that went beyond just showing bus locations - I envisioned a smart transit companion that could:
- Predict actual arrival times using historical patterns
- Provide real-time delay notifications  
- Visualize transit patterns across the city
- Learn from user behavior to improve accuracy over time

## Technical Architecture

### Data Collection Pipeline
The foundation of any good ML system is quality data. I built a sophisticated data collection system that runs 24/7:

**Backend Data Collector** (\`optimal_collector.py\`)
- Continuously polls the Madison Metro API every 30 seconds
- Smart scheduling that adapts to bus frequency patterns
- Collects vehicle positions, passenger loads, delays, and predictions
- Has gathered over **129,000 records** across multiple data types

**Data Quality**: 89.19% - ensuring reliable training data for ML models

### Machine Learning Pipeline
The ML system is designed for production scalability with multiple model types:

**Model Architecture**:
- **XGBoost & LightGBM**: For fast, accurate delay predictions
- **Neural Networks**: For complex pattern recognition in temporal data
- **Ensemble Methods**: Combining multiple models for better accuracy

**Current Performance**: 87.5% prediction accuracy on delay forecasting

## Key Technical Achievements

### 1. Robust Data Infrastructure
- **129,086 total records** collected across vehicle tracking and predictions
- **41,908 GPS coordinates** for geospatial analysis
- **87,178 prediction records** for model validation
- **1,630 data files** with automated collection and processing

### 2. Production-Ready Architecture
- **Containerized deployment** with Docker
- **Scalable API design** handling concurrent requests
- **Real-time data processing** with efficient caching
- **Modern React frontend** with responsive design

## Impact & Future Plans

This project demonstrates several key software engineering and data science principles:

**Real-World Application**: Solving an actual problem faced by thousands of students
**Scalable Architecture**: Built to handle growth from hundreds to thousands of users
**Data-Driven Decisions**: Every feature backed by analysis of real usage patterns
**User-Centric Design**: Focus on practical utility over flashy features

## Key Metrics for Portfolio

- **Data Volume**: 129,000+ records collected automatically
- **Prediction Accuracy**: 87.5% for delay forecasting
- **System Performance**: <200ms API response times
- **Code Quality**: 95%+ test coverage with CI/CD pipeline
- **User Impact**: Potential to serve 45,000+ UW-Madison students

---

*This project represents the intersection of data science, software engineering, and real-world problem solving - demonstrating both technical skills and product thinking essential for modern tech roles.*`
  },
  {
    id: "brain2text-neural-decoding",
    title: "Brain2Text 2025: Real AI, Real Brains, Real Team",
    slug: "brain2text-neural-decoding",
    excerpt: "Part of a research team tackling the Brain2Text Kaggle competition—building models that turn raw brain signals from ALS patients into readable text using neural decoding.",
    date: "2024-10-30",
    readTime: "8 min read", 
    tags: ["Neural Networks", "Brain-Computer Interface", "PyTorch", "Research"],
    featured: false,
    content: `# Brain2Text 2025: Real AI, Real Brains, Real Team

*Building models that decode raw brain signals from ALS patients into readable text*

## What This Project Is All About

I'm part of a research team tackling the Brain2Text Kaggle competition—the closest thing to actual mind-reading you can do in machine learning today. Our goal? Build models that turn raw brain signals, recorded from a near-silent ALS patient, into readable text. This is neural decoding, at its hardest and most meaningful.

## What I Actually Did

From day one, I sunk deep into the technical setup. I handled:

**Data wrangling**: Downloaded 256-channel neural recordings, unpacked huge 11GB files.

**Environment engineering**: Hunt down Conda dependency bugs, set up training on my Lenovo Legion Pro with a 4090 laptop GPU (not desktop, but crazy fast).

**Baseline reproduction**: Got the full pipeline running—from loading session and trial splits, to validating preprocessing, to hammering the bi-GRU/CTC baseline for 2+ hours per run.

I made sure the math matched: trained the same multi-layer RNN (bidirectional GRUs, with a CTC loss head), got error rates matching the published paper, and confirmed everything worked end-to-end.

## What's In the Data?

Here's what I see when I open up the brain recordings:

Each file = session (participant speaks/read sentences).
Each session = trials (one sentence per trial).

For every trial:
- A [timesteps x 512] matrix (every 20 milliseconds):
  - 256 channels: counts of fast neural "spikes" at each brain electrode
  - 256 more: "spike band" power (overall neural energy)
- Labels: The sentence intended ("Hello world")

I literally have a movie of the patient's brain as he imagines speaking—a symphony of electrical patterns that I'm tasked to decode.

## How Does Modeling Actually Work Here?

In our pipeline:

**Step 1: Sequence Modeling**
- Input: The neural movie ([T x 512])
- Model: Stacked bidirectional GRUs (3+ layers, 256+ units)—chosen for sequence memory and proven performance
- Output: Probability distribution over phonemes for every timepoint
- Loss: Connectionist Temporal Classification (CTC)—lets us match predicted sound sequences to labels without knowing exactly when each sound happened

**Step 2: Decoding**
- Use a beam search on the phoneme probabilities
- Plug outputs into a 5-gram language model trained on conversational English to get candidate sentences
- Rescore candidate outputs with bigger LLMs (Llama2, OPT): these models catch grammar errors, homophones ("bare" vs "bear"), and fix unlikely sentence structures

## Why Does It Matter?

If we do this right, we build real tech for real people. This can help give back lost communication to those affected by ALS, locked-in syndrome, or other speech-loss disorders. Plus, it's mind-blowing science—building models that turn real brain activity into readable text.

## Tech Stack

- Python (PyTorch, pandas, h5py, scikit-learn)
- Bidirectional GRU/LSTM RNNs, CTC loss, 5-gram and transformer LMs
- Lenovo Legion Pro 7i + RTX 4090 laptop GPU for training, rapid iteration, and ensemble testing

## What I've Learned

Brain decoding isn't magic. It's:
- Smart engineering
- Obsessive data cleaning/visualization
- Relentless testing of modeling tricks
- Collaboration—sharing compute, findings, and scripts

It's the hardest and coolest thing I've ever worked on.`
  },
  {
    id: "uw-madison-cs-journey",
    title: "Data Science at UW Madison: Key Learnings from CS/DS Coursework",
    slug: "uw-madison-cs-journey",
    excerpt: "Reflections on the most impactful courses and concepts from my Data Science and Computer Science studies at University of Wisconsin-Madison.",
    date: "2024-10-15",
    readTime: "6 min read",
    tags: ["Education", "Computer Science", "Data Science", "UW Madison"],
    featured: false,
    content: `# Data Science at UW Madison: Key Learnings from CS/DS Coursework

*Reflections on the most impactful courses and concepts from my Data Science and Computer Science studies.*

## Introduction

As I near the completion of my B.S. in Data Science with a Computer Science minor at UW-Madison, I wanted to reflect on the courses and experiences that have been most transformative in shaping my technical skills and career direction.

## Core Data Science Foundations

### STAT 340: Data Science Modeling II
This course fundamentally changed how I approach data problems. Moving beyond basic statistics to modern machine learning techniques:
- **Regression techniques**: From linear models to regularized approaches
- **Classification methods**: Decision trees, random forests, and ensemble methods  
- **Model validation**: Cross-validation, bias-variance tradeoffs, and performance metrics
- **Real-world applications**: Working with messy, incomplete datasets

### CS 320: Data Science Programming II
Where theory met implementation. This course taught me:
- **Pandas mastery**: Complex data manipulation and cleaning
- **API integration**: Working with real-world data sources
- **Visualization**: Creating compelling stories with data
- **Version control**: Professional development workflows with Git

## Computer Science Core

### CS 540: Introduction to Artificial Intelligence
My introduction to the broader AI landscape:
- **Search algorithms**: BFS, DFS, A* for problem-solving
- **Machine learning fundamentals**: Neural networks, backpropagation
- **Logic and reasoning**: Knowledge representation and inference
- **Game theory**: Minimax, alpha-beta pruning

### CS 354: Machine Organization and Programming
Understanding how software interacts with hardware:
- **Memory management**: Pointers, heap, stack organization
- **Systems programming**: C programming and debugging
- **Performance optimization**: Cache efficiency and memory hierarchies
- **Assembly language**: Low-level programming concepts

## Mathematical Foundations

### MATH 340: Linear Algebra
Perhaps the most important math course for data science:
- **Vector spaces**: Fundamental to understanding ML algorithms
- **Eigenvalues/eigenvectors**: Critical for PCA and dimensionality reduction
- **Matrix operations**: The backbone of neural network computations
- **Applications**: Seeing how abstract math powers real ML systems

### Calculus Sequence (MATH 221/222/234)
Building the mathematical foundation for optimization and analysis:
- **Multivariable calculus**: Gradient descent and optimization
- **Differential equations**: Understanding dynamic systems
- **Vector calculus**: Essential for 3D graphics and physics simulations

## Ethics and Society

### LIS 461: Data and Algorithm Ethics
Critical thinking about technology's impact:
- **Algorithmic bias**: How models can perpetuate unfairness
- **Privacy concerns**: Data collection and user rights
- **Societal impact**: Technology's role in democracy and justice
- **Professional responsibility**: Ethical decision-making in tech careers

## Key Takeaways

### 1. Theory and Practice Must Connect
The most valuable learning happened when mathematical concepts directly applied to real projects. Understanding why gradient descent works mathematically made implementing neural networks much more intuitive.

### 2. Data Quality Trumps Algorithm Sophistication
Spending time on data cleaning and understanding often yields better results than trying the latest model architecture. This lesson from CS 320 has proven invaluable in my personal projects.

### 3. Interdisciplinary Thinking
The best solutions often come from combining insights across fields. My satellite visualization project needed orbital mechanics (physics), coordinate transformations (math), and web development (CS).

### 4. Collaboration is Essential
Group projects in data science courses taught me how to work effectively in technical teams—a skill that's proven crucial in my research work.

## Looking Forward

As I approach graduation in May 2026, these foundational courses have prepared me for:
- **ML Engineering roles**: Understanding both the theory and implementation
- **Research positions**: Mathematical rigor combined with practical skills
- **Product development**: User-focused thinking with technical depth

The combination of rigorous mathematical training, practical programming skills, and ethical awareness has given me a well-rounded foundation for tackling complex technical challenges.

## Advice for Current Students

1. **Take the math seriously**: Linear algebra and calculus aren't just requirements—they're tools you'll use daily
2. **Work on real projects**: Apply course concepts to problems you care about
3. **Learn beyond the curriculum**: The field moves fast; stay curious
4. **Build a portfolio**: Document your learning through projects and blog posts
5. **Connect theory to practice**: Always ask "how would I implement this?"

---

*The UW-Madison Data Science and Computer Science programs have provided an excellent foundation for tackling real-world technical challenges. The combination of theoretical rigor and practical application has prepared me well for a career at the intersection of technology and impact.*`
  }
];

// Helper function to get a blog post by slug
export const getBlogPostBySlug = (slug) => {
  return blogPosts.find(post => post.slug === slug);
};

// Helper function to get all blog posts sorted by date (newest first)
export const getAllBlogPosts = () => {
  return blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Helper function to get featured blog posts
export const getFeaturedBlogPosts = () => {
  return blogPosts.filter(post => post.featured);
};
