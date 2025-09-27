import React from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Instagram, MapPin, Download, ExternalLink } from "lucide-react";
import site from "../content/site.json";

const ContactPage = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      value: "nilsmatteson@wisc.edu",
      href: site.links.email,
      description: "Best way to reach me for opportunities and collaborations",
      primary: true
    },
    {
      icon: Linkedin,
      title: "LinkedIn",
      value: "Connect professionally",
      href: site.links.linkedin,
      description: "Professional network and career updates"
    },
    {
      icon: Github,
      title: "GitHub",
      value: "@matteso1",
      href: site.links.github,
      description: "Explore my code and contributions"
    },
    {
      icon: Instagram,
      title: "Instagram",
      value: "@yoitsnils",
      href: site.links.instagram,
      description: "Personal updates and behind-the-scenes"
    }
  ];

  const ContactCard = ({ method, index }) => (
    <motion.a
      href={method.href}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={`block p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 group ${
        method.primary 
          ? 'bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border-purple-400/50 hover:border-purple-400/80' 
          : 'bg-white/5 border-white/10 hover:border-purple-400/50'
      }`}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${
            method.primary 
              ? 'bg-purple-500/30 text-purple-200' 
              : 'bg-white/10 text-white/80 group-hover:text-purple-300'
          } transition-colors`}>
            <method.icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
              {method.title}
            </h3>
            <p className={`${method.primary ? 'text-purple-200' : 'text-white/60'} transition-colors`}>
              {method.value}
            </p>
          </div>
        </div>
        <p className="text-white/70 text-sm">
          {method.description}
        </p>
        <div className="flex items-center gap-2 text-purple-400 text-sm font-medium">
          <span>Connect</span>
          <ExternalLink className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </div>
      </div>
    </motion.a>
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
            <span className="text-sm font-medium text-white/80">CONNECT</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {site.contact.title}
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
            {site.contact.description}
          </p>
          <p className="text-lg text-purple-400 italic">
            {site.contact.cta}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Methods */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              {contactMethods.map((method, index) => (
                <ContactCard key={method.title} method={method} index={index} />
              ))}
            </div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-amber-500/10 border border-white/10 backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Looking for opportunities in:</h2>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {[
                  'Machine Learning Engineering',
                  'Data Science Roles',
                  'Software Engineering',
                  'ML Research Positions',
                  'Data Engineering',
                  'Technical Internships'
                ].map((opportunity) => (
                  <div key={opportunity} className="flex items-center gap-3 p-3 rounded-xl bg-white/10">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-white/80 text-sm">{opportunity}</span>
                  </div>
                ))}
              </div>
              <p className="text-white/70">
                I'm particularly interested in roles that combine technical depth with real-world impact, 
                especially in ML systems, data infrastructure, or research-oriented positions.
              </p>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Info */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Quick Info</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white/70">
                  <MapPin className="h-4 w-4" />
                  <span>Madison, WI</span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <div className="w-4 h-4 flex items-center justify-center">
                    🇺🇸
                  </div>
                  <span>US Citizen</span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <div className="w-4 h-4 flex items-center justify-center">
                    🇸🇪
                  </div>
                  <span>Swedish Citizen</span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <div className="w-4 h-4 flex items-center justify-center">
                    🎓
                  </div>
                  <span>Graduating May 2026</span>
                </div>
              </div>
            </motion.div>

            {/* Resume Download */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Resume</h3>
              <p className="text-white/70 text-sm mb-4">
                Download my latest resume for detailed information about my experience and skills.
              </p>
              <motion.a
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 w-full px-4 py-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-xl transition-colors font-medium justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="h-4 w-4" />
                Download Resume
              </motion.a>
            </motion.div>

            {/* Response Time */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Response Time</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white/80">Email: Usually within 24 hours</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-white/80">LinkedIn: Within 2-3 days</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-white/80">Other platforms: As available</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
