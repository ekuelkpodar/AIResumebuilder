export type ResumeTemplate = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  layoutConfig: any;
  themeConfig: {
    accent: string;
    font: string;
    background?: string;
  };
};

export const defaultTemplates: ResumeTemplate[] = [
  {
    id: "minimal",
    name: "Minimal Focus",
    slug: "minimal-focus",
    description: "Clean, single-column layout with sharp typography.",
    category: "Minimal",
    tags: ["tech", "product", "ats"],
    layoutConfig: {
      columns: 1,
      sections: ["HEADER", "SUMMARY", "EXPERIENCE", "EDUCATION", "SKILLS"],
    },
    themeConfig: { accent: "#0ea5e9", font: "Inter" },
  },
  {
    id: "modern",
    name: "Modern Split",
    slug: "modern-split",
    description: "Two-column layout with a bold accent color and sidebar.",
    category: "Modern",
    tags: ["design", "marketing", "bold"],
    layoutConfig: {
      columns: 2,
      left: ["HEADER", "SUMMARY", "SKILLS", "PROJECTS"],
      right: ["EXPERIENCE", "EDUCATION", "CERTIFICATIONS"],
    },
    themeConfig: { accent: "#0f766e", font: "Inter" },
  },
  {
    id: "classic",
    name: "Classic Lines",
    slug: "classic-lines",
    description: "Traditional resume styling with subtle dividers.",
    category: "Classic",
    tags: ["finance", "ops"],
    layoutConfig: {
      columns: 1,
      sections: ["HEADER", "SUMMARY", "EXPERIENCE", "SKILLS", "EDUCATION"],
    },
    themeConfig: { accent: "#1d4ed8", font: "Inter" },
  },
  {
    id: "creative",
    name: "Creative Pulse",
    slug: "creative-pulse",
    description: "Color-forward style with emphasis on projects and results.",
    category: "Creative",
    tags: ["portfolio", "creative", "two-column"],
    layoutConfig: {
      columns: 2,
      left: ["HEADER", "SUMMARY", "PROJECTS", "SKILLS"],
      right: ["EXPERIENCE", "EDUCATION", "INTERESTS"],
    },
    themeConfig: { accent: "#f97316", font: "Inter" },
  },
];
