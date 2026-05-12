"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Zap, Shield, Users } from "lucide-react";

const faqs = [
  {
    category: "Getting Started",
    icon: Users,
    questions: [
      { q: "What is UAT Help?", a: "UAT Help is an AI-powered platform designed to help Bangladeshi students navigate the university admission process. We provide personalized guidance, university databases, admission circular tracking, and an intelligent chatbot trained on verified data from 270+ institutions." },
      { q: "How do I get started?", a: "Simply create a free account, complete your academic profile, and start chatting with our AI assistant. You can also browse universities and set up deadline alerts right away. Everything is intuitive and takes less than 5 minutes." },
    ]
  },
  {
    category: "Features & Coverage",
    icon: Zap,
    questions: [
      { q: "Does UAT Help cover all universities in Bangladesh?", a: "Yes! We cover all 46 public universities, 108+ private universities, national universities, medical colleges, and engineering institutions across Bangladesh. That's 270+ institutions with detailed profiles, admission requirements, and contact information." },
      { q: "Can I track multiple university applications?", a: "Absolutely! Our dashboard lets you track applications across multiple universities, set deadline reminders, manage admission documents, and monitor application status all in one place." },
    ]
  },
  {
    category: "AI & Accuracy",
    icon: Shield,
    questions: [
      { q: "How accurate is the AI assistant?", a: "Our AI is trained on verified data from 270+ Bangladeshi universities and is regularly updated with the latest admission information. While we strive for accuracy, always verify critical information directly with the university." },
      { q: "Is UAT Help free to use?", a: "Yes! Our core features including AI chat, university search, and admission circulars are completely free. Premium features like advanced analytics, priority support, and personalized coaching are available with optional paid subscriptions." },
    ]
  },
];

export function PremiumFAQ() {
  return (
    <section className="relative py-24 lg:py-32" id="faq">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/3 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-6">
            <HelpCircle className="size-4 text-purple-400" />
            <span className="text-sm font-medium text-foreground">Common Questions</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">Frequently Asked Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about UAT Help and how we can support your university journey
          </p>
        </motion.div>

        {/* FAQ Categories */}
        <div className="mt-16 space-y-8">
          {faqs.map((category, categoryIdx) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={categoryIdx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIdx * 0.15, duration: 0.5 }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                    <Icon className="size-5 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{category.category}</h3>
                </div>

                {/* Questions */}
                <Accordion className="space-y-3">
                  {category.questions.map((faq, qIdx) => (
                    <motion.div
                      key={qIdx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (categoryIdx * 0.15) + (qIdx * 0.1), duration: 0.4 }}
                    >
                      <AccordionItem
                        value={`item-${categoryIdx}-${qIdx}`}
                        className="group rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm px-6 transition-all duration-300 data-[state=open]:border-white/20 data-[state=open]:bg-card/80 data-[state=open]:shadow-lg data-[state=open]:shadow-purple-500/5"
                      >
                        <AccordionTrigger className="text-left text-base font-semibold hover:no-underline py-4 group-data-[state=open]:text-blue-400 transition-colors duration-300">
                          <span className="flex items-center gap-2">
                            <span className="text-lg">Q</span>
                            {faq.q}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-base leading-relaxed text-muted-foreground pb-4 pt-0 pl-6">
                          <span className="inline-block mb-3 text-lg">A</span>
                          <span className="ml-2">{faq.a}</span>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              </motion.div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 pt-12 border-t border-border/50 text-center"
        >
          <p className="text-muted-foreground mb-4">Didn't find your answer?</p>
          <a
            href="mailto:support@uathelp.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 font-medium text-purple-400 hover:from-purple-500/30 hover:to-pink-500/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
          >
            Contact our support team
          </a>
        </motion.div>
      </div>
    </section>
  );
}
