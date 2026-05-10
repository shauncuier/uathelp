"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Rafiq Ahmed", uni: "BUET CSE '25", text: "UAT Help's AI guided me through the entire BUET admission process. The deadline reminders were a lifesaver!", rating: 5 },
  { name: "Fatima Akter", uni: "DU BBA '26", text: "I found the perfect program match using the AI recommendation engine. Got admitted on my first try!", rating: 5 },
  { name: "Sakib Hasan", uni: "BRAC University '25", text: "The scholarship finder helped me discover financial aid I didn't even know existed. Saved me lakhs!", rating: 5 },
  { name: "Nusrat Jahan", uni: "NSU CS '26", text: "The university comparison feature made my decision so much easier. Highly recommend to all HSC students.", rating: 5 },
  { name: "Tanvir Rahman", uni: "KUET EEE '25", text: "Real-time circular updates meant I never missed a deadline. This platform is essential for students.", rating: 5 },
  { name: "Aisha Siddiqua", uni: "IUT CSE '26", text: "The exam preparation tips from the AI were incredibly accurate and helpful for my admission test.", rating: 5 },
];

export function Testimonials() {
  return (
    <section className="overflow-hidden py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by <span className="gradient-text">students</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Thousands of Bangladeshi students trust UAT Help for their admission journey.
          </p>
        </motion.div>

        {/* Marquee */}
        <div className="mt-12 relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          <div className="from-muted/30 absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex gap-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            {[...testimonials, ...testimonials].map((t, i) => (
              <div
                key={i}
                className="w-80 shrink-0 rounded-2xl border border-border bg-card p-6 transition-all hover:border-brand/30 hover:shadow-lg"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.uni}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
