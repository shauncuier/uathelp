// src/app/(public)/about/page.tsx
import { Metadata } from "next";
import { GraduationCap, Target, Users, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about UAT Help — Bangladesh's university admission help platform.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="text-center mb-12">
        <GraduationCap className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-foreground">About UAT Help</h1>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          Bangladesh&apos;s dedicated platform helping students navigate university admissions with ease.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: Target, title: "Our Mission", desc: "Make university admission information accessible to every student in Bangladesh, regardless of location." },
          { icon: Users, title: "Who We Serve", desc: "Students, parents, teachers, and admission guide creators across all of Bangladesh." },
          { icon: BookOpen, title: "What We Offer", desc: "Admission notices, circulars, results, admit cards, seat plans, deadlines, and expert tips." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white rounded-xl border p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border p-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Our Story</h2>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
          <p>UAT Help was created to solve a real problem: Bangladeshi university admission information is scattered across dozens of websites, making it difficult for students to stay updated.</p>
          <p>We built UAT Help as a centralized platform where students can find everything they need — admission circulars, results, admit cards, seat plans, and preparation resources — all in one place.</p>
          <p>Our team is committed to providing accurate, timely information and expert guidance to help every student achieve their academic goals.</p>
        </div>
      </div>

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5">
        <p className="text-sm text-amber-800 text-center">
          <strong>Important:</strong> Always verify admission information from official university websites. UAT Help provides information for reference purposes only.
        </p>
      </div>
    </div>
  );
}
