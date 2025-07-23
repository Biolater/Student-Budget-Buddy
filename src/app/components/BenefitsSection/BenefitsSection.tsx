"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const benefits = [
  {
    title: "Spend Smarter",
    description: "Instant insights cut impulse buys.",
  },
  {
    title: "Stress Less",
    description: "Clear overview of bills & deadlines.",
  },
  {
    title: "Save Faster",
    description: "Goal-oriented budgeting tools.",
  },
  {
    title: "Works Everywhere",
    description: "Syncs across currencies & devices.",
  },
];

export default function BenefitsSection() {
  return (
    <section id="benefits" className="py-16 md:py-24 w-full bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold">Why Students Love It</h2>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex-shrink-0 mt-1">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 flex-grow shadow-sm">
                <h3 className="font-semibold text-lg">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}