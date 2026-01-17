import React from "react";
import { motion } from "framer-motion";

const skillCategories = {
  languages: {
    label: "Languages",
    color: "violet",
    skills: ["Python", "SQL", "R", "Java", "C/C++", "JavaScript/TypeScript", "Go", "Rust"]
  },
  mldata: {
    label: "ML & Data",
    color: "cyan",
    skills: ["PyTorch", "scikit-learn", "XGBoost", "pandas", "NumPy"]
  },
  systems: {
    label: "Systems",
    color: "amber",
    skills: ["gRPC", "Docker", "PostgreSQL", "Redis", "WebAssembly", "AWS", "Linux"]
  },
  web: {
    label: "Web & Tools",
    color: "emerald",
    skills: ["React", "FastAPI/Flask", "Git/GitHub", "CI/CD"]
  }
};

const colorClasses = {
  violet: "hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-violet-300",
  cyan: "hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-300",
  amber: "hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-300",
  emerald: "hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-300",
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.02,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

export const SkillPill = ({ skill, color = "violet" }) => {
  return (
    <motion.span
      variants={itemVariants}
      whileHover={{ y: -3, scale: 1.05 }}
      className={`
        px-4 py-2 rounded-full
        border border-zinc-800
        text-zinc-400 text-sm font-medium
        transition-all duration-300 cursor-default
        ${colorClasses[color]}
      `}
    >
      {skill}
    </motion.span>
  );
};

export const SkillsSection = ({ skills }) => {
  const categorizeSkill = (skill) => {
    for (const [key, category] of Object.entries(skillCategories)) {
      if (category.skills.some(s => s.toLowerCase() === skill.toLowerCase())) {
        return category.color;
      }
    }
    return "violet";
  };

  return (
    <motion.div
      className="flex flex-wrap gap-3"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {skills.map((skill, index) => (
        <SkillPill key={index} skill={skill} color={categorizeSkill(skill)} />
      ))}
    </motion.div>
  );
};

export default SkillPill;
