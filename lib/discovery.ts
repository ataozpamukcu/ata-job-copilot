import { chromium, type Browser, type Page } from "playwright";
import { companyTargets, targetsFor, type CompanyTarget, type Tier } from "./targets";
import { scoreOpportunity } from "./fit";
import { locationVerdict } from "./location";
import type { Opportunity } from "./types";

const jobHref=/\/jobs?\/|vacanc|\/position|jobid=|job_id=|myworkdayjobs|greenhouse|lever\.co|workable|teamtailor/i;
const roleText=/engineer|physicist|scientist|technician|graduate|intern|operator|analyst|specialist|applications|process|test|manufacturing|materials|photonics|optical|equipment|product/i;
const titlePriority=/graduate|junior|early career|process|equipment|photon|optical|test|characteri|validation|applications|technician|materials/i;
const seniorTitle=/senior|manager|director|principal|staff|\blead\b|head of/i;
const paginationHref=/[?&](?:page|start|offset)=\d+|\/page\/\d+\/?$/i;
const maxListingPages=4;
const maxJobsPerTarget=24;

type JobLink={title:string;href:string;snippet:string};

function companyFamily(company:string){return company.toLowerCase().replace(/\s+taiwan$/i,"").replace(/\s+products\s+vietnam$/i,"").replace(/\s*\/.*$/,"").trim()}
const multiCountryFamilies=new Set([...new Set(companyTargets.map(target=>companyFamily(target.company)))].filter(family=>new Set(companyTargets.filter(target=>companyFamily(target.company)===family).map(target=>target.country)).size>1));
function countryScopedUrl(target:CompanyTarget){
  const slug=target.country.toLowerCase().replace(/[^a-z]+/g,"-").replace(/^-|-$/g,"");
  const compact=slug.replace(/-/g,"");
  const url=target.careers.toLowerCase();
  return url.includes(slug)||url.includes(compact)||target.country==="United Kingdom"&&/(?:uk|united-kingdom)/.test(url);
}

async function safeGoto(page:Page,url:string){await page.goto(url,{waitUntil:"domcontentloaded",timeout:25_000});await page.waitForTimeout(1_200)}

async function linksOn(page:Page):Promise<JobLink[]>{
  return page.locator("a[href]").evaluateAll(anchors=>anchors.map(anchor=>{
    const el=anchor as HTMLAnchorElement;
    const parent=el.closest("article,li,[class*='job'],[class*='vacan'],[class*='position']");
    return {title:(el.textContent||"").replace(/\s+/g," ").trim(),href:el.href,snippet:(parent?.textContent||"").replace(/\s+/g," ").trim()};
  }));
}

async function applyCountryFilter(page:Page,country:string){
  try{
    const select=page.locator("select").filter({has:page.locator("option")}).filter({hasText:new RegExp(country,"i")}).first();
    if(await select.count()&&await select.isVisible()){const option=await select.locator("option").filter({hasText:new RegExp(country,"i")}).first().getAttribute("value");if(option){await select.selectOption(option);await page.waitForTimeout(1_200);return}}
    const input=page.locator('input[placeholder*="location" i],input[aria-label*="location" i],input[name*="location" i]').first();
    if(await input.count()&&await input.isVisible()){await input.fill(country);await input.press("Enter");await page.waitForTimeout(1_500)}
  }catch(error){console.warn("[discovery] country filter unavailable",{country,error:error instanceof Error?error.message:String(error)})}
}

async function collectListingLinks(browser:Browser,target:CompanyTarget){
  const queue=[target.careers];
  const visited=new Set<string>();
  const collected:JobLink[]=[];
  while(queue.length&&visited.size<maxListingPages){
    const requested=queue.shift()!;
    if(visited.has(requested))continue;
    const page=await browser.newPage();
    try{
      await safeGoto(page,requested);
      if(visited.size===0&&!/[?&]Location=/i.test(requested))await applyCountryFilter(page,target.country);
      visited.add(page.url());
      const links=await linksOn(page);
      collected.push(...links);
      const pagination=await page.locator('a[href]').evaluateAll(anchors=>anchors.map(anchor=>({href:(anchor as HTMLAnchorElement).href,text:(anchor.textContent||"").trim(),rel:anchor.getAttribute("rel")||""})));
      for(const link of pagination){
        if(queue.length+visited.size>=maxListingPages)break;
        if((/next/i.test(`${link.text} ${link.rel}`)||paginationHref.test(link.href))&&!jobHref.test(link.href)&&new URL(link.href).host===new URL(page.url()).host&&!visited.has(link.href))queue.push(link.href);
      }
    }catch(error){console.warn("[discovery] listing page failed",{company:target.company,url:requested,error:error instanceof Error?error.message:String(error)})}
    finally{await page.close()}
  }
  return collected;
}

async function asmCountryUrls(browser:Browser,target:CompanyTarget){
  const base="https://www.asm.com/open-vacancies/";
  const page=await browser.newPage();
  try{
    await safeGoto(page,base);
    const countrySlug=target.country.toLowerCase().replace(/[^a-z]+/g,"-").replace(/^-|-$/g,"");
    const values=await page.locator('input[name="Location"]').evaluateAll((inputs,slug)=>inputs.map(input=>(input as HTMLInputElement).value).filter(value=>value.toLowerCase().startsWith(`${String(slug)}--`)),countrySlug);
    return values.length?values.map(value=>`${base}?Location=${encodeURIComponent(value)}`):[target.careers];
  }catch{return [target.careers]}finally{await page.close()}
}

async function inspectLinks(browser:Browser,target:CompanyTarget,links:JobLink[],limit:number):Promise<Opportunity[]>{
  const selected=links.slice(0,limit);
  const results:Opportunity[]=[];
  const strictLocation=multiCountryFamilies.has(companyFamily(target.company));
  for(let i=0;i<selected.length;i+=4){
    const batch=await Promise.all(selected.slice(i,i+4).map(async link=>{
      const detail=await browser.newPage();
      try{
        await safeGoto(detail,link.href);
        const text=(await detail.locator("body").innerText()).slice(0,20_000);
        const relevant=text.split(/Current Opportunities At|Jobs in the same category/i)[0];
        const heading=(await detail.locator("h1").first().textContent().catch(()=>null))?.trim()||link.title;
        if(!roleText.test(heading))return null;
        const location=locationVerdict(relevant,target.country);
        if(location.verdict==="mismatch"||(strictLocation&&location.verdict!=="match"&&!countryScopedUrl(target))){
          console.info("[discovery] location rejected",{company:target.company,targetCountry:target.country,detected:location.location||"unknown",title:heading});
          return null;
        }
        return scoreOpportunity(target,heading,relevant,detail.url());
      }catch(error){
        console.warn("[discovery] detail skipped",{company:target.company,url:link.href,error:error instanceof Error?error.message:String(error)});
        return null;
      }finally{await detail.close()}
    }));
    results.push(...batch.filter((result):result is Opportunity=>result!==null));
  }
  return results;
}

async function scanTarget(browser:Browser,target:CompanyTarget):Promise<Opportunity[]>{
  if(!target.careers)return [];
  console.info("[discovery] target start",{company:target.company,country:target.country,url:target.careers});
  try{
    let links:JobLink[]=[];
    if(/asm\.com/i.test(target.careers)){
      const urls=await asmCountryUrls(browser,target);
      const batches=await Promise.all(urls.map(url=>collectListingLinks(browser,{...target,careers:url})));
      links=batches.flat();
    }else links=await collectListingLinks(browser,target);
    const unique=[...new Map(links.filter(link=>link.title.length>3&&roleText.test(`${link.title} ${link.snippet}`)&&jobHref.test(link.href)&&!link.href.includes("#")&&!link.href.startsWith("mailto:")).map(link=>[link.href,link])).values()]
      .filter(link=>!seniorTitle.test(link.title))
      .sort((a,b)=>Number(titlePriority.test(b.title))-Number(titlePriority.test(a.title)));
    const results=await inspectLinks(browser,target,unique,maxJobsPerTarget);
    console.info("[discovery] target complete",{company:target.company,country:target.country,candidates:unique.length,accepted:results.length});
    return results;
  }catch(error){console.error("[discovery] target failed",{company:target.company,error:error instanceof Error?error.message:String(error)});return []}
}

export async function discoverTier(tier:Tier,country:string){
  const browser=await chromium.launch({headless:true});
  try{
    const targets=targetsFor(tier,country);
    const found:Opportunity[]=[];
    for(let i=0;i<targets.length;i+=3){const batch=await Promise.all(targets.slice(i,i+3).map(target=>scanTarget(browser,target)));found.push(...batch.flat())}
    return [...new Map(found.map(opportunity=>[opportunity.url,opportunity])).values()].sort((a,b)=>b.fitScore-a.fitScore);
  }finally{await browser.close()}
}

export async function discoverTarget(target:CompanyTarget){
  const browser=await chromium.launch({headless:true});
  try{return await scanTarget(browser,target)}finally{await browser.close()}
}
