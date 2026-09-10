import { NextResponse } from "next/server";
import { discoverTier } from "@/lib/discovery";
import { readStore,writeStore } from "@/lib/store";
import { targetCountries } from "@/lib/targets";

export const runtime="nodejs";
export const maxDuration=360;

export async function POST(req:Request){
  try{
    const {tier="A",country="United Kingdom"}=await req.json();
    if(!["A","B","C","D"].includes(tier))throw new Error("Invalid tier");
    if(country!=="All countries"&&!targetCountries.includes(country))throw new Error("Invalid country");
    const found=await discoverTier(tier,country);
    const store=await readStore();
    const old=(store.opportunities||[]).filter(opportunity=>(opportunity.country||"United Kingdom")!=="United States");
    const keep=old.filter(x=>!(x.tier===tier&&(country==="All countries"||x.country===country)));
    store.opportunities=[...found,...keep];
    store.lastDiscoveryAt=new Date().toISOString();
    await writeStore(store);
    const companyCounts=Object.fromEntries([...new Set(found.map(opportunity=>opportunity.company))].map(company=>[company,found.filter(opportunity=>opportunity.company===company).length]));
    return NextResponse.json({found:found.length,eligible:found.filter(opportunity=>opportunity.eligibility!=="unlikely").length,excluded:found.filter(opportunity=>opportunity.eligibility==="unlikely").length,companyCounts,opportunities:found});
  }catch(error){
    return NextResponse.json({error:error instanceof Error?error.message:"Discovery failed"},{status:400});
  }
}
