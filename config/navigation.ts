export const mainNavItems = [
  { title: "Universities", href: "/universities" },
  { title: "Circulars", href: "/circulars" },
  { title: "AI Chat", href: "/chat" },
  { title: "Blog", href: "/blog" },
] as const;

export const dashboardNavItems = [
  { title: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  { title: "AI Chat", href: "/chat", icon: "MessageSquare" },
  { title: "Saved", href: "/saved", icon: "Heart" },
  { title: "Bookmarks", href: "/bookmarks", icon: "Bookmark" },
  { title: "Applications", href: "/applications", icon: "ClipboardList" },
  { title: "Notifications", href: "/notifications", icon: "Bell" },
  { title: "Settings", href: "/settings", icon: "Settings" },
] as const;

export const adminNavItems = [
  { title: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { title: "Universities", href: "/admin/universities", icon: "GraduationCap" },
  { title: "Circulars", href: "/admin/circulars", icon: "Megaphone" },
  { title: "Blog Posts", href: "/admin/blog", icon: "FileText" },
  { title: "Users", href: "/admin/users", icon: "Users" },
  { title: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
] as const;

export const footerLinks = {
  product: [
    { title: "Universities", href: "/universities" },
    { title: "Admission Circulars", href: "/circulars" },
    { title: "AI Assistant", href: "/chat" },
    { title: "Blog", href: "/blog" },
  ],
  resources: [
    { title: "Admission Guide", href: "/blog/admission-guide" },
    { title: "Scholarship Finder", href: "/scholarships" },
    { title: "GPA Calculator", href: "/tools/gpa-calculator" },
    { title: "FAQ", href: "/#faq" },
  ],
  company: [
    { title: "About Us", href: "/about" },
    { title: "Contact", href: "/contact" },
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms of Service", href: "/terms" },
  ],
} as const;
