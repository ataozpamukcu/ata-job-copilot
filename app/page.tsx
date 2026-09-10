"use client";

import { useEffect, useMemo, useState } from "react";
import { companyTargets, targetCountries, targetRegions, type Region, type Tier } from "@/lib/targets";
import type { OpportunityStatus, Store } from "@/lib/types";

const tiers: Tier[] = ["A","B","C","D"];
const statuses: OpportunityStatus[] = ["found","saved","applied","interview","rejected","offer"];
const priorityCountries = ["United Kingdom","France","Taiwan","Netherlands","Singapore"] as const;
const countryLabels:Record<(typeof priorityCountries)[number],string>={"United Kingdom":"İngiltere",France:"Fransa",Taiwan:"Tayvan",Netherlands:"Hollanda",Singapore:"Singapur"};
const networkUrl=(country:string)=>`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`semiconductor process photonics ${country}`)}`;
const eligibilityLabel={likely:"UYGUN", "manual-check":"VİZE / ELLE KONTROL", unlikely:"OTOMATİK ELENDİ"} as const;

export default function Home(){
  const [store,setStore]=useState<Store|null>(null);
  const [tier,setTier]=useState<Tier>("A");
  const [country,setCountry]=useState("United Kingdom");
  const [region,setRegion]=useState<Region|"All regions">("All regions");
  const [query,setQuery]=useState("");
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");

  const load=()=>fetch("/api/store").then(response=>response.json()).then(setStore);
  useEffect(()=>{load()},[]);

  async function save(next:Store,messageText="Saved locally"){
    setStore(next);
    await fetch("/api/store",{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify(next)});
    setMessage(messageText);
  }

  async function discover(){
    if(country==="All countries"){
      setMessage("Choose one country for a live scan. The global portal directory is already available below.");
      return;
    }
    setBusy(true);
    setMessage(`Scanning live ${tier}-tier roles in ${country}…`);
    const response=await fetch("/api/discover",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({tier,country})});
    const result=await response.json();
    const asmCount=result.companyCounts?.["ASM Taiwan"]||0;
    setMessage(response.ok?`${result.found} canlı ilan bulundu: ${result.eligible} uygun/kontrol edilecek, ${result.excluded} otomatik elendi.${asmCount?` ASM Taiwan: ${asmCount} ilan.`:""}`:result.error);
    await load();
    setBusy(false);
  }

  async function updateStatus(id:string,status:OpportunityStatus){
    if(!store)return;
    const next=structuredClone(store);
    const opportunity=(next.opportunities||[]).find(item=>item.id===id);
    if(opportunity)opportunity.status=status;
    await save(next,`Marked as ${status}`);
  }

  const portals=useMemo(()=>companyTargets.filter(target=>
    target.tier===tier &&
    (country==="All countries"?region==="All regions"||target.region===region:target.country===country) &&
    (!query||`${target.company} ${target.country} ${target.focus}`.toLowerCase().includes(query.toLowerCase()))
  ),[tier,country,region,query]);

  if(!store)return <main><p>Loading…</p></main>;

  const visibleOpportunities=(store.opportunities||[]).filter(opportunity=>(opportunity.country||"United Kingdom")!=="United States");
  const opportunities=visibleOpportunities.filter(opportunity=>
    opportunity.tier===tier &&
    (country==="All countries"?region==="All regions"||opportunity.region===region:(opportunity.country||"United Kingdom")===country) &&
    (!query||`${opportunity.title} ${opportunity.company} ${opportunity.location}`.toLowerCase().includes(query.toLowerCase()))
  );
  const tracked=visibleOpportunities.filter(opportunity=>(opportunity.status||"found")!=="found");
  const likedCountries=[...new Set(tracked.map(opportunity=>opportunity.country||"United Kingdom"))].sort((a,b)=>{
    const ai=priorityCountries.indexOf(a as (typeof priorityCountries)[number]);
    const bi=priorityCountries.indexOf(b as (typeof priorityCountries)[number]);
    return (ai<0?99:ai)-(bi<0?99:bi)||a.localeCompare(b);
  });

  return <main>
    <header>
      <div><span className="eyebrow">GLOBAL · MANUAL APPLICATIONS</span><h1>Ata Semiconductor Job Map</h1><p>Find the right chip roles worldwide, score the fit, then apply yourself on the official company portal.</p></div>
      <div className="guard">◎ Manual apply mode</div>
    </header>
    <nav><a href="#campaign">Country plan</a><a href="#hunter">Job map <b>{targetCountries.length}</b></a><a href="#portals">Company portals <b>{companyTargets.length}</b></a><a href="#profile">Ata profile</a><a href="#liked">Beğendiğim işler <b>{tracked.length}</b></a></nav>
    {message&&<div className="message">{message}</div>}

    <section className="global-hero">
      <div><span className="eyebrow">WORLDWIDE SEMICONDUCTOR SEARCH</span><h2>One CV. Every serious chip hub.</h2><p>Manufacturing, equipment, materials, packaging, photonics, foundry and design markets are organised by country. Foreign roles are not penalised; visa and work permission stay a separate manual check.</p></div>
      <div className="global-stats"><div><b>{targetCountries.length}</b><span>countries</span></div><div><b>{companyTargets.length}</b><span>official portals</span></div><div><b>4</b><span>fit tiers</span></div></div>
    </section>

    <section id="campaign" className="campaign">
      <div className="section-title"><div><span className="eyebrow">COUNTRY CAMPAIGN ORDER</span><h2>Önce network, sonra başvuru</h2></div><p>İlk dalga İngiltere ve Fransa. Ardından Tayvan, Hollanda ve Singapur’a geçiyoruz.</p></div>
      <div className="campaign-grid">{priorityCountries.map((item,index)=><article key={item} className={`${country===item?"active":""} ${index<2?"phase-one":"phase-two"}`}><button onClick={()=>{setCountry(item);setRegion("All regions");document.getElementById("hunter")?.scrollIntoView()}}><span>{index+1}</span><div><small>{index<2?"ŞİMDİ BAKILACAK":"SONRAKİ DALGA"}</small><b>{countryLabels[item]}</b></div></button><a href={networkUrl(item)} target="_blank" rel="noreferrer">LinkedIn&apos;de network ara ↗</a></article>)}</div>
    </section>

    <section id="hunter">
      <div className="section-title"><div><span className="eyebrow">ROLE–CV FIT, NOT COMPANY PRESTIGE</span><h2>Global job hunter</h2></div><p>A is the closest route into chips for Ata’s physics, cleanroom, process and photonics background. Visa is never guessed.</p></div>
      <div className="world-controls">
        <label>Country<select value={country} onChange={event=>{setCountry(event.target.value);setRegion("All regions")}}><option>All countries</option>{targetCountries.map(item=><option key={item}>{item}</option>)}</select></label>
        <label>Search<input value={query} onChange={event=>setQuery(event.target.value)} placeholder="process, photonics, ASML…"/></label>
        <button disabled={busy||country==="All countries"} onClick={discover}>Scan live jobs →</button>
      </div>
      {country==="All countries"&&<div className="region-tabs"><button className={region==="All regions"?"active":""} onClick={()=>setRegion("All regions")}>All regions</button>{targetRegions.map(item=><button key={item} className={region===item?"active":""} onClick={()=>setRegion(item)}>{item}</button>)}</div>}
      <div className="tier-tabs">{tiers.map(item=><button key={item} className={tier===item?"active":""} onClick={()=>setTier(item)}><b>{item}</b> tier</button>)}</div>
      <div className="tier-note"><b>{tier} tier:</b> {tier==="A"?"Best direct fit — process, equipment, materials, fabrication and photonics.":tier==="B"?"Strong semiconductor route, usually broader or more competitive.":tier==="C"?"Design-heavy companies; target test, validation, applications and device roles.":"Adjacent suppliers and distributors; useful fallback routes."}</div>

      <div className="opportunities">
        {opportunities.length===0?<div className="empty">No live scan saved for this country and tier yet. Use the official portals below immediately, or run a live scan.</div>:opportunities.map(op=><article key={op.id} className={`opportunity ${op.eligibility}`}>
          <div className="score">{op.fitScore}<small>/100</small></div>
          <div><span className="eyebrow">{op.country||"United Kingdom"} · ŞİRKET {op.tier} TIER · {eligibilityLabel[op.eligibility]}</span><h3>{op.title}</h3><p>{op.company} · {op.location}</p><div className="chips">{op.fitReasons.map(reason=><span key={reason}>{reason}</span>)}</div>{op.concerns.length>0&&<p className="concerns">⚠ {op.concerns.join(" · ")}</p>}</div>
          <div className="op-actions"><a className="primary-link" href={op.url} target="_blank" rel="noreferrer">Open application portal ↗</a><button className={`favourite ${(op.status||"found")!=="found"?"selected":""}`} disabled={!["found","saved"].includes(op.status||"found")} onClick={()=>updateStatus(op.id,(op.status||"found")==="found"?"saved":"found")}>{(op.status||"found")==="found"?"♡ Beğendiklerime ekle":"♥ Listemde"}</button><label>Status<select value={op.status||"found"} onChange={event=>updateStatus(op.id,event.target.value as OpportunityStatus)}>{statuses.map(status=><option key={status}>{status}</option>)}</select></label></div>
        </article>)}
      </div>
    </section>

    <section id="portals">
      <div className="section-title"><div><span className="eyebrow">CURATED OFFICIAL LINKS</span><h2>Company portal directory</h2></div><p>These links remain useful even when a career site blocks automated scanning or renders jobs dynamically.</p></div>
      <div className="portal-grid">{portals.map(target=><article className="portal" key={`${target.company}-${target.country}`}><div><span className="country-tag">{target.country}</span><span className={`tier-badge tier-${target.tier.toLowerCase()}`}>{target.tier}</span></div><h3>{target.company}</h3><p>{target.focus}</p><a href={target.careers} target="_blank" rel="noreferrer">Open official careers portal ↗</a></article>)}</div>
      {portals.length===0&&<div className="empty">No portal matches these filters.</div>}
    </section>

    <section id="profile"><div className="section-title"><div><span className="eyebrow">SOURCE OF TRUTH · ATA ONLY</span><h2>Scoring profile</h2></div><p>Blank means unknown. The app never invents eligibility, experience or personal details.</p></div><div className="profile-grid"><label>Full name<input value={store.profile.fullName} onChange={event=>setStore({...store,profile:{...store.profile,fullName:event.target.value}})}/></label><label>Email<input value={store.profile.email} onChange={event=>setStore({...store,profile:{...store.profile,email:event.target.value}})}/></label><label>Phone<input value={store.profile.phone} onChange={event=>setStore({...store,profile:{...store.profile,phone:event.target.value}})}/></label><label>Location<input value={store.profile.location} onChange={event=>setStore({...store,profile:{...store.profile,location:event.target.value}})}/></label><label className="wide">Skills<textarea value={store.profile.skills.join(", ")} onChange={event=>setStore({...store,profile:{...store.profile,skills:event.target.value.split(",").map(item=>item.trim()).filter(Boolean)}})}/></label><div className="wide facts"><b>Verified CV facts</b><p>{store.profile.education.map(item=>`${item.degree} — ${item.institution}`).join(" · ")}</p><p>{store.profile.experience.map(item=>`${item.title}, ${item.organization}`).join(" · ")}</p><b>Personal interests (self-reported)</b><p>{store.profile.interests.map(item=>`${item.area}: ${item.detail}`).join(" · ")}</p></div><label>Sponsorship required<select value={store.profile.sponsorshipRequired} onChange={event=>setStore({...store,profile:{...store.profile,sponsorshipRequired:event.target.value as "yes"|"no"|"unknown"}})}><option>unknown</option><option>yes</option><option>no</option></select></label><button onClick={()=>save(store)}>Save profile</button></div></section>

    <section id="liked"><div className="section-title"><div><span className="eyebrow">COUNTRY-BY-COUNTRY SHORTLIST</span><h2>Beğendiğim işler</h2></div><p>Kaydettiğin ve başvurduğun ilanlar ülkelere göre ayrılır; en yüksek puanlı ilan her ülkede üstte görünür.</p></div>{tracked.length===0?<div className="empty">Henüz beğendiğin ilan yok. Bir ilanı taradıktan sonra “♡ Beğendiklerime ekle” düğmesine bas.</div>:<div className="liked-groups">{likedCountries.map(likedCountry=><div className="liked-country" key={likedCountry}><div className="liked-country-head"><div><span className="eyebrow">COUNTRY LIST</span><h3>{countryLabels[likedCountry as (typeof priorityCountries)[number]]||likedCountry}</h3></div><b>{tracked.filter(op=>(op.country||"United Kingdom")===likedCountry).length} ilan</b></div><div className="liked-list">{tracked.filter(op=>(op.country||"United Kingdom")===likedCountry).sort((a,b)=>b.fitScore-a.fitScore).map(op=><article key={op.id}><div className="liked-score">{op.fitScore}<small>/100</small></div><div><span className="eyebrow">{op.tier} TIER · {op.status}</span><h3>{op.title}</h3><p>{op.company} · {op.location}</p></div><div><a href={op.url} target="_blank" rel="noreferrer">Başvuru portalını aç ↗</a><select aria-label={`${op.title} status`} value={op.status||"saved"} onChange={event=>updateStatus(op.id,event.target.value as OpportunityStatus)}>{statuses.map(status=><option key={status}>{status}</option>)}</select></div></article>)}</div></div>)}</div>}</section>
    <footer>Local-only data · official career links · no automatic form filling or submission</footer>
  </main>;
}
