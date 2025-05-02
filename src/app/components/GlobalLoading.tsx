"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface GlobalLoadingProps {
  isLoading: boolean;
  message?: string;
}

export const GlobalLoading: React.FC<GlobalLoadingProps> = ({
  isLoading,
  message,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isLoading) return null;

  const LoadingContent = (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
            className="flex flex-col items-center justify-center p-8 rounded-xl bg-background/90 shadow-2xl"
          >
            <div className="relative w-20 h-20">
              <motion.div
                className="absolute inset-0 rounded-full border-t-4 border-primary"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <motion.div
                className="absolute inset-2 rounded-full border-t-4 border-primary/60"
                animate={{ rotate: -360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>
            
            {message && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-lg font-medium text-foreground"
              >
                {message}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(LoadingContent, document.body);
};

// Usage example:
// <GlobalLoading isLoading={true} message="Loading data..." />
