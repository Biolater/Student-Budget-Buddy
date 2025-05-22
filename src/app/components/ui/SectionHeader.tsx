"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  description: string;
}

const SectionHeader = ({ title, description }: SectionHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="font-semibold tracking-tight text-2xl sm:text-3xl">
        {title}
      </h1>
      <p className="text-muted-foreground text-sm sm:text-base">
        {description}
      </p>
    </motion.div>
  );
};

export default SectionHeader;
