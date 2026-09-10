import path from "node:path";
import { chromium, type Page } from "playwright";
import type { CandidateProfile, Job } from "./types";

const profileDir = () => path.resolve(process.cwd(), ".chatgpt-profile");

function applicationPrompt(question: string, profile: CandidateProfile, job: Job) {
  const groundedProfile = {
    name: profile.fullName,
    education: profile.education,
    skills: profile.skills,
    experience: profile.experience,
    projects: profile.projects,
    languages: profile.languages,
    interests: profile.interests,
    narrativeStrengths: profile.narrativeStrengths,
    workAuthorization: profile.workAuthorization,
    sponsorshipRequired: profile.sponsorshipRequired,
    evidence: profile.evidence,
  };
  return [
    "Draft one truthful job-application answer for Ata.",
    "Use only the supplied profile. Never invent or import facts about Naz or any other person.",
    "Do not upgrade observation, coursework, awareness, or theory into hands-on professional experience.",
    "If evidence is insufficient—especially for legal, visa, eligibility, salary, identity, or security questions—reply exactly: HUMAN INPUT REQUIRED.",
    "Return only the answer text, with no heading, analysis, quotation marks, or markdown.",
    `QUESTION:\n${question}`,
    `JOB:\n${JSON.stringify(job)}`,
    `ATA PROFILE:\n${JSON.stringify(groundedProfile)}`,
  ].join("\n\n");
}

async function findComposer(page: Page) {
  const composer = page.locator("#prompt-textarea, textarea[placeholder*='Message'], [contenteditable='true'][data-virtualkeyboard]").first();
  await composer.waitFor({ state: "visible", timeout: 300_000 });
  return composer;
}

async function waitForAnswer(page: Page, previousCount: number) {
  const messages = page.locator("[data-message-author-role='assistant']");
  await page.waitForFunction(
    (count) => document.querySelectorAll("[data-message-author-role='assistant']").length > count,
    previousCount,
    { timeout: 300_000 },
  );
  const answer = messages.last();
  let last = "";
  let stable = 0;
  for (let i = 0; i < 180; i++) {
    const current = (await answer.innerText()).trim();
    const stopping = await page.locator("[data-testid='stop-button'], button[aria-label*='Stop']").count();
    stable = current && current === last && stopping === 0 ? stable + 1 : 0;
    if (stable >= 2) return current;
    last = current;
    await page.waitForTimeout(1_000);
  }
  throw new Error("ChatGPT response timed out");
}

let active = false;
export async function draftViaChatGPT(question: string, profile: CandidateProfile, job: Job) {
  if (active) throw new Error("Another ChatGPT draft is already running");
  active = true;
  const context = await chromium.launchPersistentContext(profileDir(), {
    headless: false,
    viewport: { width: 1200, height: 900 },
  });
  try {
    const pages = context.pages();
    const page = pages[0] || await context.newPage();
    await page.goto(process.env.CHATGPT_URL || "https://chatgpt.com/", { waitUntil: "domcontentloaded", timeout: 60_000 });
    const composer = await findComposer(page).catch(() => {
      throw new Error("ChatGPT login was not completed. Sign in in the opened window and try again.");
    });
    const previousCount = await page.locator("[data-message-author-role='assistant']").count();
    await composer.fill(applicationPrompt(question, profile, job));
    await composer.press("Enter");
    const answer = await waitForAnswer(page, previousCount);
    if (answer === "HUMAN INPUT REQUIRED") throw new Error("ChatGPT found insufficient evidence. Ata must answer this manually.");
    return answer;
  } finally {
    await context.close().catch(() => undefined);
    active = false;
  }
}
