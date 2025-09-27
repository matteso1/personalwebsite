import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, MapPin, Globe, Award } from "lucide-react";
import site from "../content/site.json";

const AboutPage = () => {
  const SkillTag = ({ children }) => (
    <motion.span 
      className="px-3 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/80 backdrop-blur-sm"
      whileHover={{ scale: 1.05, backgroundColor: "rgba(139, 92, 246, 0.1)" }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.span>
  );

  const CourseItem = ({ course }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
      <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
      <span className="text-white/80 text-sm">{course}</span>
    </div>
  );

  const experienceTimeline = [
    {
      year: "2025",
      title: "UW Madison ML Marathon Team",
      description: "Active participant in competitive machine learning, working on Brain2Text Kaggle competition",
      type: "competition"
    },
    {
      year: "2024-2025",
      title: "Independent ML Projects",
      description: "Building production-ready systems including Madison Bus ETA prediction and satellite visualization",
      type: "project"
    },
    {
      year: "2022-2026",
      title: "University of Wisconsin-Madison",
      description: "Pursuing B.S. in Data Science with Computer Science minor, focusing on ML and software engineering",
      type: "education"
    }
  ];

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
            <span className="text-sm font-medium text-white/80">ABOUT</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Who I Am
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Profile Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid md:grid-cols-3 gap-8 items-center"
            >
              <div className="md:col-span-1">
                <div className="w-48 h-48 mx-auto rounded-3xl overflow-hidden border-2 border-white/20">
                  <img 
                    src="/profile-photo.jpg" 
                    alt="Nils Matteson" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-4">
                <h2 className="text-3xl font-bold text-white">Nils Matteson</h2>
                <p className="text-purple-400 text-lg font-medium">{site.tagline}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-white/70">
                    <MapPin className="h-4 w-4" />
                    <span>Madison, WI</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/70">
                    <Globe className="h-4 w-4" />
                    <span>Swedish-American Dual Citizen</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/70">
                    <GraduationCap className="h-4 w-4" />
                    <span>{site.education.degree}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Story Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white">My Story</h2>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>{site.about.story}</p>
                <p>{site.about.approach}</p>
                <p>
                  English (native), Swedish (fluent). Outside of tech, I'm passionate about music production, 
                  VST development, and rock climbing. I enjoy exploring the creative and technical sides of 
                  software development, whether building ML models or crafting audio plugins.
                </p>
              </div>
            </motion.div>

            {/* Skills Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white">Technical Skills</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Languages & Frameworks</h3>
                  <div className="flex flex-wrap gap-3">
                    {site.about.skills.slice(0, 8).map((skill) => (
                      <SkillTag key={skill}>{skill}</SkillTag>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Tools & Technologies</h3>
                  <div className="flex flex-wrap gap-3">
                    {site.about.skills.slice(8).map((skill) => (
                      <SkillTag key={skill}>{skill}</SkillTag>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Experience Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white">Experience Timeline</h2>
              <div className="space-y-6">
                {experienceTimeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, duration: 0.6 }}
                    className="relative pl-8 border-l-2 border-purple-500/30 last:border-l-0"
                  >
                    <div className="absolute left-0 top-0 transform -translate-x-1/2 w-4 h-4 rounded-full bg-purple-500"></div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-purple-400 font-semibold">{item.year}</span>
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          item.type === 'education' ? 'bg-blue-500/20 text-blue-300' :
                          item.type === 'project' ? 'bg-purple-500/20 text-purple-300' :
                          'bg-cyan-500/20 text-cyan-300'
                        }`}>
                          {item.type}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                      <p className="text-white/70">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Education Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="h-6 w-6 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Education</h3>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-white">{site.education.institution}</h4>
                <p className="text-white/80">{site.education.degree}</p>
                <p className="text-purple-400 font-medium">{site.education.status}</p>
                <p className="text-white/60 text-sm">{site.education.location}</p>
              </div>
            </motion.div>

            {/* Coursework */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Relevant Coursework</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {site.education.coursework.map((course) => (
                  <CourseItem key={course} course={course} />
                ))}
              </div>
            </motion.div>

            {/* Fun Facts */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-amber-500/10 border border-white/10 backdrop-blur-sm"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Beyond Code</h3>
              <div className="space-y-3 text-white/80 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Music production & VST development</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span>Rock climbing enthusiast</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span>Fluent in English & Swedish</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Work authorized in US & EU</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
