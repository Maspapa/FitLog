import { z } from "zod";

export const GoalSchema = z.enum(["fat_loss", "muscle_gain", "maintenance", "performance"]);
export type Goal = z.infer<typeof GoalSchema>;

export const WorkoutSchema = z.object({
  id: z.string().max(80),
  name: z.string().trim().min(1).max(80),
  category: z.enum(["strength", "cardio", "mobility", "sport", "other"]),
  sets: z.number().min(0).max(100).nullable(),
  reps: z.number().min(0).max(1000).nullable(),
  weight: z.number().min(0).max(1000).nullable(),
  duration: z.number().min(0).max(1440).nullable(),
  intensity: z.enum(["easy", "moderate", "hard"]).nullable(),
});

export const DailyLogSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  weight: z.number().min(20).max(500).nullable(),
  waist: z.number().min(30).max(300).nullable(),
  workouts: z.array(WorkoutSchema).max(20),
  meals: z.object({
    breakfast: z.string().max(500),
    lunch: z.string().max(500),
    dinner: z.string().max(500),
    snacks: z.string().max(500),
  }),
  sleepHours: z.number().min(0).max(24).nullable(),
  fatigue: z.number().int().min(1).max(5).nullable(),
  mood: z.number().int().min(1).max(5).nullable(),
  soreness: z.number().int().min(1).max(5).nullable(),
  waterGlasses: z.number().int().min(0).max(50).nullable(),
  steps: z.number().int().min(0).max(200000).nullable(),
  alcohol: z.boolean(),
  notes: z.string().max(800),
  updatedAt: z.string(),
});

export const ProfileSchema = z.object({
  goal: GoalSchema,
  createdAt: z.string(),
});

export const FitDataSchema = z.object({
  version: z.literal(1),
  profile: ProfileSchema,
  logs: z.array(DailyLogSchema).max(5000),
});

export const AiReportSchema = z.object({
  headline: z.string().min(1).max(80),
  summary: z.string().min(1).max(300),
  wins: z.array(z.string().min(1).max(160)).min(1).max(4),
  patterns: z.array(z.object({
    title: z.string().min(1).max(60),
    evidence: z.string().min(1).max(180),
    suggestion: z.string().min(1).max(180),
  })).min(1).max(4),
  nextWeekFocus: z.string().min(1).max(220),
  caution: z.string().min(1).max(220),
});

export type Workout = z.infer<typeof WorkoutSchema>;
export type DailyLog = z.infer<typeof DailyLogSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type FitData = z.infer<typeof FitDataSchema>;
export type AiReport = z.infer<typeof AiReportSchema>;

