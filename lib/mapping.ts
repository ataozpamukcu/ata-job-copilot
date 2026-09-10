import type { CandidateProfile, DetectedField } from "./types";
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
export function classifyField(label: string, type: string): DetectedField["category"] {
  const x = norm(label);
  if (/visa|sponsor|authori[sz]|eligible|right to work|citizen|nationality|disability|gender|ethnicity|salary/.test(x)) return "eligibility";
  if (type === "textarea" || /why|motivation|cover|describe|experience|interest|tell us/.test(x)) return "open-ended";
  if (/name|email|phone|location|linkedin|github|portfolio|website/.test(x)) return "static";
  return "unknown";
}
export function mapStatic(field: DetectedField, p: CandidateProfile): DetectedField {
  if (field.category !== "static") return field;
  const x = norm(`${field.label} ${field.name}`);
  let value = ""; let evidence = "";
  if (/email/.test(x)) { value=p.email; evidence="profile.email"; }
  else if (/phone|mobile/.test(x)) { value=p.phone; evidence="profile.phone"; }
  else if (/linkedin/.test(x)) { value=p.links.linkedin||""; evidence="profile.links.linkedin"; }
  else if (/github/.test(x)) { value=p.links.github||""; evidence="profile.links.github"; }
  else if (/portfolio|website/.test(x)) { value=p.links.portfolio||""; evidence="profile.links.portfolio"; }
  else if (/location|city|address/.test(x)) { value=p.location; evidence="profile.location"; }
  else if (/first name|given name/.test(x)) { value=p.fullName.split(/\s+/)[0]||""; evidence="profile.fullName"; }
  else if (/last name|family name|surname/.test(x)) { value=p.fullName.split(/\s+/).slice(1).join(" "); evidence="profile.fullName"; }
  else if (/name/.test(x)) { value=p.fullName; evidence="profile.fullName"; }
  return { ...field, value, evidence, confidence: value ? .98 : 0, needsReview: true };
}
