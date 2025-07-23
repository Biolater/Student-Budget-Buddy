"use client";

import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 w-full bg-background">
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Left column - Illustration */}
          <div className="flex justify-center md:justify-start">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative w-full max-w-md aspect-square"
            >
              {/* Placeholder for illustration - replace with actual SVG or Lottie */}
              <div className="w-full h-full rounded-lg bg-gradient-to-br from-primary/20 to-purple-400/20 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="200"
                  height="200"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
                  <path d="M3.5 12h6l.5-1 2 4 .5-1h5" />
                </svg>
              </div>
            </motion.div>
          </div>
          
          {/* Right column - Text content */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About Student Budget Buddy</h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg font-medium text-foreground">Empowering students to master their money.</p>
              <p>
                Student Budget Buddy is a comprehensive financial management platform designed specifically for students. 
                We provide powerful tools for expense tracking, budgeting across categories, multi-currency support, 
                and AI-powered insights to help you make smarter financial decisions.
              </p>
              <p>
                Built with Next.js 15, Node/Express, Prisma, PostgreSQL, and Clerk for secure authentication.
              </p>
            </div>
            <div className="mt-8">
              <Button 
                as="a"
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/Biolater/Student-Budget-Buddy" 
                variant="bordered" 
                color="primary"
                size="lg"
              >
                Read the docs
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}