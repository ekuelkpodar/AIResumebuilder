import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const onboardingSchema = z.object({
  careerStage: z.enum(["STUDENT", "JUNIOR", "MID", "SENIOR", "EXECUTIVE"]),
  industry: z.string().min(2),
  goal: z.string().min(2),
  location: z.string().optional(),
  headline: z.string().optional(),
});

export const resumeSectionSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  title: z.string().min(2),
  position: z.number(),
  content: z.any(),
});

export const resumeCreateSchema = z.object({
  title: z.string().min(2),
  templateId: z.string().optional(),
  layout: z.any().optional(),
  data: z.record(z.any()).optional(),
  sections: z.array(resumeSectionSchema).optional(),
});

export const resumeUpdateSchema = resumeCreateSchema.extend({
  atsScore: z.number().optional(),
});

export const jobApplicationSchema = z.object({
  title: z.string().min(2),
  company: z.string().min(2),
  location: z.string().optional(),
  link: z.string().url().optional(),
  status: z.enum(["TO_APPLY", "APPLIED", "INTERVIEWING", "OFFER", "REJECTED"]),
  appliedAt: z.string().optional(),
  salary: z.string().optional(),
  notes: z.string().optional(),
  resumeId: z.string().optional(),
  coverLetterId: z.string().optional(),
  reminderDate: z.string().optional(),
});

export const coverLetterSchema = z.object({
  resumeId: z.string().optional(),
  title: z.string().min(2),
  content: z.string().min(20),
});

export const aiGenerateBulletsSchema = z.object({
  roleTitle: z.string().min(2),
  company: z.string().optional(),
  responsibilities: z.string().optional(),
  achievements: z.string().optional(),
  tone: z
    .enum(["Professional", "Confident", "Friendly", "Direct"])
    .default("Professional"),
});

export const aiImproveBulletsSchema = z.object({
  existingBullets: z.array(z.string()).min(1),
  tone: z.enum(["Professional", "Confident", "Friendly", "Direct"]),
  styleOptions: z
    .object({
      starFormat: z.boolean().optional(),
      moreConcise: z.boolean().optional(),
      moreImpactful: z.boolean().optional(),
    })
    .optional(),
});

export const aiSummarySchema = z.object({
  userProfile: z.any(),
  resumeSnapshot: z.string().min(10),
  tone: z.enum(["Professional", "Confident", "Friendly", "Direct"]).default("Professional"),
});

export const aiCoverLetterSchema = z.object({
  resumeSnapshot: z.string().min(10),
  jobDescription: z.string().min(10),
  extraNotes: z.string().optional(),
  tone: z.enum(["Professional", "Confident", "Friendly", "Direct"]).default("Professional"),
});

export const aiAtsSchema = z.object({
  resumeText: z.string().min(10),
  jobDescription: z.string().min(10),
});

export const aiCareerAssistantSchema = z.object({
  question: z.string().min(5),
});

export const aiExtractSkillsSchema = z.object({
  resumeText: z.string().min(10),
  jobDescription: z.string().optional(),
});

export const aiTranslateSchema = z.object({
  resumeText: z.string().min(10),
  targetLanguage: z.string().min(2),
  tone: z.enum(["Professional", "Confident", "Friendly", "Direct"]).default("Professional"),
});

export const aiOptimizeRoleSchema = z.object({
  resumeText: z.string().min(10),
  targetRoleTitle: z.string().min(2),
  country: z.string().min(2),
});

export const jobSourceSchema = z.object({
  name: z.string().min(2),
  platform: z.string(),
  searchUrl: z.string().url(),
  filters: z.record(z.any()).default({}),
});

export const jobLeadSchema = z.object({
  title: z.string().min(2),
  company: z.string().min(1),
  location: z.string().optional(),
  link: z.string().url().optional(),
  rawData: z.record(z.any()).optional(),
  status: z.enum(["NEW", "REVIEWED", "ADDED_TO_TRACKER", "IGNORED"]).optional(),
  jobSourceId: z.string().optional(),
});

export const aiMatchJobsSchema = z.object({
  careerPersonas: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      summary: z.string().optional(),
      skillsFocus: z.array(z.string()).optional(),
    }),
  ),
  jobLeads: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      company: z.string(),
      description: z.string().optional(),
    }),
  ),
});

export const interviewQuestionGenSchema = z.object({
  role: z.string(),
  category: z.string(),
  count: z.number().min(1).max(10),
});

export const interviewAnswerSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(10),
  role: z.string().optional(),
});

export const storySchema = z.object({
  title: z.string().min(2),
  context: z.string().optional(),
  task: z.string().optional(),
  action: z.string().optional(),
  result: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export const portfolioSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  headline: z.string().optional(),
  bio: z.string().optional(),
  sections: z.record(z.any()).default({}),
  themeConfig: z.record(z.any()).default({}),
});

export const portfolioProjectSchema = z.object({
  portfolioId: z.string(),
  resumeId: z.string().optional(),
  title: z.string().min(2),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  role: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  links: z.record(z.any()).optional(),
  impactMetrics: z.record(z.any()).optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  roleTitle: z.string().optional(),
  company: z.string().optional(),
  email: z.string().email().optional(),
  linkedinUrl: z.string().url().optional(),
  notes: z.string().optional(),
});

export const outreachSchema = z.object({
  contactId: z.string().optional(),
  channel: z.enum(["EMAIL", "LINKEDIN", "OTHER"]),
  body: z.string().min(5),
  subject: z.string().optional(),
  status: z.enum(["DRAFT", "SENT", "NEEDS_REPLY", "CLOSED"]).optional(),
  followUpDate: z.string().optional(),
});

export const organizationSchema = z.object({
  name: z.string().min(2),
  domain: z.string().optional(),
});

export const jobOpeningSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(4),
  location: z.string().optional(),
  status: z.enum(["OPEN", "PAUSED", "CLOSED"]).optional(),
});

export const candidateSubmissionSchema = z.object({
  candidateName: z.string().min(2),
  candidateEmail: z.string().email(),
  resumeLink: z.string().url(),
  notes: z.string().optional(),
});

export const pluginSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  enabledByDefault: z.boolean().optional(),
  configSchema: z.record(z.any()).optional(),
});

export const webhookSchema = z.object({
  url: z.string().url(),
  eventTypes: z.array(z.string()).min(1),
});

export const personaSchema = z.object({
  name: z.string().min(2),
  targetIndustry: z.string().optional(),
  targetRoles: z.array(z.string()).default([]),
  summary: z.string().optional(),
  skillsFocus: z.array(z.string()).default([]),
});

export const commentSchema = z.object({
  resumeId: z.string(),
  sectionId: z.string().optional(),
  body: z.string().min(1),
});
