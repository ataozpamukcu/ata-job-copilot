import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import type { CandidateProfile, Job } from "./types";

export async function draftAnswer(question: string, profile: CandidateProfile, job: Job) {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");
  if (!process.env.OPENAI_MODEL) throw new Error("OPENAI_MODEL is not configured");
  const schema=z.object({ answer:z.string(), evidence:z.array(z.string()), insufficientEvidence:z.boolean(), warning:z.string().optional() });
  const result=await generateObject({ model:openai(process.env.OPENAI_MODEL), schema, system:"You draft truthful job application answers for the one person named in candidateProfile.identityGuardrails.allowedPerson. Obey the identity guardrail and never blend in facts about a forbidden or different person. Use only supplied candidate facts. Distinguish hands-on work from observation, awareness, coursework, and theory; never upgrade the level of experience. Personal interests may support motivation and communication narratives but are not technical credentials. Never invent dates, achievements, eligibility, authorization, salary, identity, or experience. For legal/eligibility questions, do not infer: mark insufficientEvidence unless explicitly confirmed. Keep claims traceable. Return an empty answer when evidence is insufficient.", prompt:JSON.stringify({ question, job, candidateProfile:profile }) });
  return result.object;
}
