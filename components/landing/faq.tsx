"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "What is UAT Help?", a: "UAT Help is an AI-powered platform designed to help Bangladeshi students navigate the university admission process. We provide personalized guidance, university databases, admission circular tracking, and an intelligent chatbot." },
  { q: "Is UAT Help free to use?", a: "Yes! Our core features including AI chat, university search, and admission circulars are completely free. Premium features like advanced analytics and priority support are available with a subscription." },
  { q: "How accurate is the AI assistant?", a: "Our AI is trained on verified data from 150+ Bangladeshi universities and is regularly updated. While we strive for accuracy, always verify critical information directly with the university." },
  { q: "Can I track multiple university applications?", a: "Absolutely! Our dashboard lets you track applications across multiple universities, set deadline reminders, and manage all your admission documents in one place." },
  { q: "Does UAT Help cover all universities in Bangladesh?", a: "We cover all 46 public universities, 108+ private universities, national universities, medical colleges, and engineering institutions across Bangladesh." },
  { q: "How do I get started?", a: "Simply create a free account, complete your academic profile, and start chatting with our AI assistant. You can also browse universities and set up deadline alerts right away." },
];

export function FAQ() {
  return (
    <section className="py-24" id="faq">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to know about UAT Help.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-12"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-xl border border-border bg-card px-6 transition-colors data-[state=open]:border-brand/30"
              >
                <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
