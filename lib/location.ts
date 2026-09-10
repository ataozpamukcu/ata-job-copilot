const isoAliases:Record<string,string[]>={
  "United Kingdom":["UK","GB","GBR","England","Scotland","Wales","Northern Ireland"],
  France:["FR","FRA"],Netherlands:["NL","NLD","Holland"],Germany:["DE","DEU"],Belgium:["BE","BEL"],Austria:["AT","AUT"],Italy:["IT","ITA"],Switzerland:["CH","CHE"],Sweden:["SE","SWE"],Finland:["FI","FIN"],Norway:["NO","NOR"],Denmark:["DK","DNK"],Czechia:["CZ","CZE","Czech Republic"],Poland:["PL","POL"],Spain:["ES","ESP"],Portugal:["PT","PRT"],Ireland:["IE","IRL"],
  Taiwan:["TW","TWN"],"South Korea":["Korea","KR","KOR"],Japan:["JP","JPN"],China:["CN","CHN"],Singapore:["SG","SGP"],Malaysia:["MY","MYS"],India:["IN","IND"],Philippines:["PH","PHL"],Vietnam:["VN","VNM"],Thailand:["TH","THA"],
  Israel:["IL","ISR"],"Türkiye":["Turkey","TR","TUR"],Australia:["AU","AUS"],Canada:["CA","CAN"],
};

const knownCountries=[...Object.keys(isoAliases),"United States"];
const usPattern=/\bUnited States(?: of America)?\b|\bUSA\b|\bU\.S\.A?\.?\b|,\s*[A-Z]{2},\s*US(?:\b|,)|\bUS,\s*\d{5}\b/i;

function escaped(value:string){return value.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}
function aliasPattern(country:string){
  const aliases=[country,...(isoAliases[country]||[])];
  return new RegExp(aliases.map(alias=>alias.length<=3?`\\b${escaped(alias)}\\b`:escaped(alias)).join("|"),"i");
}

export function extractListingLocation(text:string){
  const head=text.slice(0,7_000).replace(/\r/g,"");
  const patterns=[
    /(?:^|\n)(?:Job )?Locations?\s*(?:·|:)?\s*\n\s*([^\n]{2,240})/im,
    /(?:^|\n)(?:Job )?Locations?\s*(?:·|:)\s*([^\n]{2,240})/im,
    /(?:^|\n)(?:City|Workplace location)\s*(?:·|:)?\s*\n?\s*([^\n]{2,160})/im,
  ];
  for(const pattern of patterns){const value=head.match(pattern)?.[1]?.trim();if(value&&!/category|engineering|apply/i.test(value))return value}
  const asm=head.match(/(Taiwan|Netherlands)\s*>\s*(Hsinchu|Kaohsiung|Taichung|Tainan|Taoyuan|Taipei|Almere)/i);
  return asm?`${asm[1]} · ${asm[2]}`:"";
}

export function locationVerdict(text:string,targetCountry:string){
  const location=extractListingLocation(text);
  if(!location)return {verdict:"unknown" as const,location:""};
  if(targetCountry!=="United States"&&usPattern.test(location))return {verdict:"mismatch" as const,location};
  if(aliasPattern(targetCountry).test(location))return {verdict:"match" as const,location};
  const other=knownCountries.find(country=>country!==targetCountry&&aliasPattern(country).test(location));
  return {verdict:other?"mismatch" as const:"unknown" as const,location};
}
