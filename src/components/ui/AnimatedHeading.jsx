import React from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.2,
    },
  },
};

const charVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    rotateX: -60,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 150,
    },
  },
};

export const AnimatedHeading = ({
  text,
  highlightWord,
  className = "",
  highlightClassName = "text-gradient-static"
}) => {
  const words = text.split(" ");

  return (
    <motion.h1
      className={`perspective-1000 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, wordIndex) => {
        const isHighlight = word.toLowerCase() === highlightWord?.toLowerCase();
        const wordClass = isHighlight ? highlightClassName : "";

        return (
          <span key={wordIndex} className="inline-block mr-[0.25em]">
            {word.split("").map((char, charIndex) => (
              <motion.span
                key={charIndex}
                className={`inline-block origin-bottom ${wordClass}`}
                variants={charVariants}
                style={{ display: "inline-block" }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        );
      })}
    </motion.h1>
  );
};

export default AnimatedHeading;
