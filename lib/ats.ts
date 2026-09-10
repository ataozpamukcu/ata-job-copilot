import { chromium } from "playwright";
import { classifyField } from "./mapping";
import type { DetectedField } from "./types";

export async function inspectAts(url: string) {
  const parsed = new URL(url); if (!["http:","https:"].includes(parsed.protocol)) throw new Error("Only http(s) URLs are allowed");
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage(); await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    if(await page.locator("input:not([type=hidden]), textarea, select").count()===0){const apply=page.getByRole("link",{name:/apply/i}).or(page.getByRole("button",{name:/apply/i})).first();if(await apply.count()){await apply.click();await page.waitForLoadState("domcontentloaded").catch(()=>undefined);await page.waitForTimeout(1200)}}
    const title = await page.title();
    const raw = await page.locator("input:not([type=hidden]), textarea, select").evaluateAll((els) => els.map((el, i) => {
      const e = el as HTMLInputElement; const id=e.id||`field-${i}`; const label=(id && document.querySelector(`label[for="${CSS.escape(id)}"]`)?.textContent) || e.getAttribute("aria-label") || e.getAttribute("placeholder") || e.name || id;
      return { id, label: (label||"").trim(), name:e.name||id, type: el.tagName.toLowerCase()==="textarea"?"textarea":el.tagName.toLowerCase()==="select"?"select":e.type||"text", required:e.required||e.getAttribute("aria-required")==="true", options: el instanceof HTMLSelectElement ? [...el.options].map(o=>o.text.trim()).filter(Boolean) : undefined };
    }));
    const fields: DetectedField[] = raw.map(f => ({ ...f, category: classifyField(f.label, f.type), needsReview: true }));
    const host=parsed.hostname; const ats=/greenhouse/.test(host)?"Greenhouse":/lever/.test(host)?"Lever":/workday|myworkdayjobs/.test(host)?"Workday":"Unknown";
    return { title, ats, fields };
  } finally { await browser.close(); }
}
