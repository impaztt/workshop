"use client";

import { motion } from "framer-motion";

export function DescriptionEnter({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
