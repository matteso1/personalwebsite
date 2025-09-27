import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { getAllBlogPosts } from "../data/blogPosts";

const BlogPage = () => {
  const blogPosts = getAllBlogPosts();

  const updates = [
    {
      date: "Dec 2024",
      title: "Satellite Visualization System",
      description: "Added real-time tracking capabilities and enhanced 3D rendering performance",
      type: "project"
    },
    {
      date: "Nov 2024", 
      title: "Madison ML Bus System",
      description: "Completed initial data collection and started model training pipeline",
      type: "project"
    },
    {
      date: "Oct 2024",
      title: "Brain2Text Competition",
      description: "Joined UW Madison ML Marathon team for Kaggle competition",
      type: "competition"
    },
    {
      date: "Sep 2024",
      title: "Fall Semester Started",
      description: "Beginning coursework in Advanced AI and Machine Organization",
      type: "education"
    }
  ];

  const BlogCard = ({ post, featured = false }) => (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={`group ${featured ? 'lg:col-span-2' : ''}`}
    >
      <Link to={`/blog/${post.slug}`} className="block h-full">
        <div className={`h-full p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-purple-400/50 transition-all duration-300 ${featured ? 'lg:p-8' : ''}`}>
          <div className="space-y-4">
            {featured && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium">
                Featured Post
              </div>
            )}
            
            <h2 className={`font-bold text-white group-hover:text-purple-300 transition-colors ${featured ? 'text-2xl' : 'text-xl'}`}>
              {post.title}
            </h2>
            
            <p className="text-white/70 leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-white/10 text-white/60 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-4 text-white/60 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );

  const UpdateItem = ({ update, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-400/30 transition-colors"
    >
      <div className="flex-shrink-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          update.type === 'project' ? 'bg-purple-500/20 text-purple-300' :
          update.type === 'competition' ? 'bg-cyan-500/20 text-cyan-300' :
          'bg-amber-500/20 text-amber-300'
        }`}>
          <Tag className="h-4 w-4" />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-white">{update.title}</h3>
          <span className="text-white/40 text-sm">{update.date}</span>
        </div>
        <p className="text-white/70 text-sm">{update.description}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/20 mb-6">
            <span className="text-sm font-medium text-white/80">JOURNAL</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Blog & Updates
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Follow my journey in tech, project updates, and insights from my CS/DS studies at UW Madison.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Blog Posts */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold text-white mb-6">Latest Posts</h2>
            <div className="grid gap-6">
              {blogPosts.map((post) => (
                <BlogCard key={post.id} post={post} featured={post.featured} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Updates */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-6">Recent Updates</h3>
              <div className="space-y-4">
                {updates.map((update, index) => (
                  <UpdateItem key={index} update={update} index={index} />
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-amber-500/10 border border-white/10 backdrop-blur-sm"
            >
              <h3 className="text-xl font-bold text-white mb-4">Stay Updated</h3>
              <p className="text-white/70 mb-4 text-sm">
                Get notified when I publish new posts about my projects and tech journey.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
                >
                  Subscribe
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
