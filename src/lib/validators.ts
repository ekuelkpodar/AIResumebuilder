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
