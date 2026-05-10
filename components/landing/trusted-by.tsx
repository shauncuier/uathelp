"use client";

import { motion } from "framer-motion";

const logos = [
  "Dhaka University",
  "BUET",
  "BRAC University",
  "NSU",
  "IUT",
  "KUET",
  "RUET",
  "CUET",
];

export function TrustedBy() {
  return (
    <section className="border-y border-border bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-muted-foreground">
          Trusted by students from top universities
        </p>
        <div className="mt-8 overflow-hidden">
          <motion.div
            className="flex gap-12"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...logos, ...logos].map((name, i) => (
              <div
                key={`${name}-${i}`}
                className="flex shrink-0 items-center gap-2 text-muted-foreground/60 transition-colors hover:text-muted-foreground"
              >
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-xs font-bold">
                  {name.charAt(0)}
                </div>
                <span className="whitespace-nowrap text-sm font-medium">
                  {name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
