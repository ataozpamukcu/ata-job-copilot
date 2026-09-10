import type { CompanyTarget } from "./targets";
import type { Opportunity } from "./types";
import {extractListingLocation} from "./location";

const positives: [RegExp,string,number][] = [
  [/physics|physical science/i,"Physics background requested",18],
  [/process|fabrication|wafer|cleanroom|photolithography|etch|deposition|sputter/i,"Semiconductor process fit",15],
  [/photonics|optical|laser|optoelectronic/i,"Optics/photonics fit",14],
  [/characteri[sz]ation|validation|test|metrology|applications engineer/i,"Characterisation/test/applications fit",12],
  [/matlab|comsol|simulation|modelling|modeling|data analysis/i,"Modelling and data fit",12],
  [/technician|equipment|manufacturing|product engineer/i,"Equipment/manufacturing pathway",10],
  [/hvac|filtration|air.?handling|humidity control|piping (?:and|&) instrumentation|p&ids?|user requirement specifications|\burs\b|cleanroom facilit/i,"Cleanroom facilities and systems fit",12],
  [/materials|compound semiconductor|gan|sic|graphene/i,"Materials/device fit",10],
];
const negatives: [RegExp,string,number][] = [
  [/ph\.?d\.? (is )?(required|essential)|requires? a ph\.?d/i,"PhD explicitly required",-35],
  [/rtl|systemverilog|verilog|asic verification|cpu microarchitecture/i,"RTL/ASIC-heavy role",-22],
  [/full.?stack|front.?end|back.?end|software developer/i,"Software-development role",-25],
];

const numberWords:Record<string,string>={zero:"0",one:"1",two:"2",three:"3",four:"4",five:"5",six:"6",seven:"7",eight:"8",nine:"9",ten:"10"};

function asksForMoreThanOneYear(text:string){
  const normalized=text.toLowerCase().replace(/\b(zero|one|two|three|four|five|six|seven|eight|nine|ten)\b/g,word=>numberWords[word]);
  const values:number[]=[];
  const patterns=[
    /\b(\d+)\s*(?:[-–—~～]|to)\s*(\d+)\+?\s*(?:years?|yrs?)\b[^.\n]{0,80}\bexperience\b/g,
    /\bexperience\b[^.\n]{0,80}\b(\d+)\s*(?:[-–—~～]|to)\s*(\d+)\+?\s*(?:years?|yrs?)\b/g,
    /\b(\d+)\+?\s*(?:years?|yrs?)\b[^.\n]{0,80}\bexperience\b/g,
    /\bexperience\b[^.\n]{0,80}\b(\d+)\+?\s*(?:years?|yrs?)\b/g,
    /\b(?:minimum|at least|more than|over|requires?|required|must have)\b[^.\n]{0,50}\b(\d+)\+?\s*(?:years?|yrs?)\b/g,
  ];
  for(const pattern of patterns)for(const match of normalized.matchAll(pattern))for(const value of match.slice(1))if(value!==undefined)values.push(Number(value));
  return values.some(value=>value>1);
}

export function scoreOpportunity(target: CompanyTarget,title:string,description:string,url:string): Opportunity {
  const text=`${title}\n${description}`; let score={A:35,B:27,C:20,D:15}[target.tier]; const fitReasons:string[]=[]; const concerns:string[]=[];
  if(/graduate|entry.level|junior|early career/i.test(title)){score+=22;fitReasons.push("Graduate or junior level")}
  if(/senior|principal|staff engineer|\blead\b|director|head of/i.test(title)){score-=35;concerns.push("Senior-level title")}
  for(const [pattern,reason,points] of positives)if(pattern.test(text)){score+=points;fitReasons.push(reason)}
  for(const [pattern,reason,points] of negatives)if(pattern.test(text)){score+=points;concerns.push(reason)}
  if(asksForMoreThanOneYear(text)){score-=45;concerns.push("More than 1 year of experience requested")}
  if(/(?:significant|extensive|advanced|proven) experience (?:in|within|of|with)/i.test(description)&&!/graduate|junior|entry.level/i.test(title)){score-=20;concerns.push("Advanced/significant experience required")}
  const workAuth=/(?:no|not (?:be )?able to|unable to|cannot) (?:offer|provide)? ?(?:visa )?sponsorship|must (?:already )?have (?:the )?right to work|required to demonstrate evidence of right to (?:live and )?work/i.test(text);
  if(workAuth)concerns.push("Right-to-work/sponsorship restriction — Ata must confirm manually");
  const location=extractListingLocation(description)||(description.match(/(?:London|Cambridge|Cardiff|Newport|Durham|Bristol|Oxford|Swansea|Scotland|United Kingdom|UK)/i)||[])[0]||"Check listing";
  const outsideHome=target.country!=="United Kingdom";
  if(outsideHome)concerns.push(`Visa/right-to-work for ${target.country} must be confirmed manually`);
  if(target.country==="United States"){score=0;concerns.push("United States role excluded by Ata's search rules")}
  score=Math.max(0,Math.min(100,score));
  const hard=concerns.some(x=>/Senior|PhD|More than 1 year|Advanced\/significant|United States role excluded/.test(x));
  return {id:crypto.randomUUID(),company:target.company,tier:target.tier,country:target.country,region:target.region,title:title.trim(),url,location,description:description.slice(0,6000),fitScore:score,fitReasons:[...new Set(fitReasons)],concerns:[...new Set(concerns)],eligibility:hard?"unlikely":workAuth||outsideHome?"manual-check":score>=50?"likely":"manual-check",status:"found",discoveredAt:new Date().toISOString()};
}
