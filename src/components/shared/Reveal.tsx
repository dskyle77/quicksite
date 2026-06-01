"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

type RevealVariant =
  | "bottom"
  | "top"
  | "left"
  | "right"
  | "scale"
  | "scale-up"
  | "rotate";

const variants = {
  bottom: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },

  top: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },

  left: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },

  right: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },

  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },

  "scale-up": {
    hidden: { opacity: 0, scale: 0.7 },
    visible: { opacity: 1, scale: 1 },
  },

  rotate: {
    hidden: {
      opacity: 0,
      rotate: -8,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      rotate: 0,
      scale: 1,
    },
  },
};

interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
}

export default function Reveal({
  children,
  variant = "bottom",
  delay = 0,
  duration = 0.6,
}: RevealProps) {
  return (
    <motion.div
      variants={variants[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
