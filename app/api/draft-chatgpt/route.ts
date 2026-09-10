import { NextResponse } from "next/server";
import { draftViaChatGPT } from "@/lib/chatgpt-bridge";
import { readStore, writeStore } from "@/lib/store";

export const runtime = "nodejs";
export const maxDuration = 360;

export async function POST(req: Request) {
  try {
    const { applicationId, fieldId } = await req.json();
    const store = await readStore();
    const application = store.applications.find((item) => item.id === applicationId);
    if (!application) throw new Error("Application not found");
    const field = application.fields.find((item) => item.id === fieldId);
    const job = store.jobs.find((item) => item.id === application.jobId);
    if (!field || !job) throw new Error("Field or job not found");
    if (field.category === "eligibility") throw new Error("Eligibility answers must be entered by Ata during review");
    const answer = await draftViaChatGPT(field.label, store.profile, job);
    field.value = answer;
    field.evidence = "Ata profile → ChatGPT subscription → mandatory human review";
    field.confidence = 0.7;
    field.needsReview = true;
    application.updatedAt = new Date().toISOString();
    await writeStore(store);
    return NextResponse.json({ answer });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "ChatGPT bridge failed" }, { status: 400 });
  }
}
