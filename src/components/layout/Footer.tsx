import Link from "next/link";
import { GraduationCap, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-24 glass-navbar border-t border-white/15 shadow-2xl shadow-black/40">
      {/* Decorative gradient blur - Dark premium */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-bl from-primary/30 to-transparent dark:from-primary/15 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-secondary/30 to-transparent dark:from-secondary/15 rounded-full blur-3xl opacity-40"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground mb-3 hover:opacity-80 transition-opacity">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/25">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">UAT Help</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Bangladesh&apos;s one-stop platform for university admission notices, circulars,
              results, admit cards, seat plans, and preparation tips.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary hover:bg-white/15 p-2 rounded-lg transition-all duration-200 backdrop-blur shadow-lg shadow-primary/20 hover:shadow-primary/40"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="mailto:contact@uathelp.com"
                className="text-muted-foreground hover:text-primary hover:bg-white/15 p-2 rounded-lg transition-all duration-200 backdrop-blur shadow-lg shadow-primary/20 hover:shadow-primary/40"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/notices", label: "Admission Notices" },
                { href: "/universities", label: "Universities" },
                { href: "/tips", label: "Preparation Tips" },
                { href: "/guides", label: "Guides" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block relative group"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-200"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Information
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block relative group"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-200"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/15 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-muted-foreground">© {new Date().getFullYear()} UAT Help. All rights reserved.</p>
          <p className="text-xs text-muted-foreground/70">
            Always verify information from official university websites.
          </p>
        </div>
      </div>
    </footer>
  );
}
