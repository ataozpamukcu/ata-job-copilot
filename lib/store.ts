import { promises as fs } from "node:fs";
import path from "node:path";
import type { Store } from "./types";

const initial: Store = { profile: { id: "candidate", fullName: "", email: "", phone: "", location: "", links: {}, education: [], skills: [], experience: [], projects: [], languages: [], interests: [], narrativeStrengths: [], sourceDocuments: [], identityGuardrails: { allowedPerson: "Current user", forbiddenNames: [], rule: "Use only facts explicitly supplied by the current user. Never infer or blend another person's facts." }, workAuthorization: { country: "", status: "unknown", detail: "Always ask the user." }, sponsorshipRequired: "unknown", evidence: [] }, jobs: [], applications: [] };
const file = () => path.resolve(process.cwd(), process.env.DATA_FILE || "data/store.json");
async function ensure() { try { await fs.access(file()); } catch { await fs.mkdir(path.dirname(file()), { recursive: true }); await fs.writeFile(file(), JSON.stringify(initial, null, 2)); } }
export async function readStore(): Promise<Store> { await ensure(); return JSON.parse(await fs.readFile(file(), "utf8")); }
export async function writeStore(store: Store) { await fs.mkdir(path.dirname(file()), { recursive: true }); const tmp = `${file()}.tmp`; await fs.writeFile(tmp, JSON.stringify(store, null, 2)); await fs.rename(tmp, file()); }
