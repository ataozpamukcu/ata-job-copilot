export type Tier = "A" | "B" | "C" | "D";
export type Region = "UK & Ireland" | "Europe" | "North America" | "East Asia" | "South & Southeast Asia" | "Middle East" | "Oceania";

export type CompanyTarget = {
  company: string;
  tier: Tier;
  country: string;
  region: Region;
  careers: string;
  focus: string;
};

const t = (company:string,tier:Tier,country:string,region:Region,careers:string,focus:string):CompanyTarget => ({company,tier,country,region,careers,focus});

/**
 * Curated official career portals in established semiconductor markets.
 * A company is repeated when the same global portal covers several relevant
 * countries; the country represents the market to search, not a visa claim.
 */
export const companyTargets: CompanyTarget[] = [
  // UK & Ireland
  t("KLA / SPTS","A","United Kingdom","UK & Ireland","https://www.kla.com/careers","Process equipment, etch, deposition and metrology"),
  t("Oxford Instruments Plasma Technology","A","United Kingdom","UK & Ireland","https://careers.oxinst.com/","Plasma, etch, deposition and applications"),
  t("Pragmatic Semiconductor","A","United Kingdom","UK & Ireland","https://talent.pragmaticsemi.com/jobs","Flexible semiconductor manufacturing"),
  t("INEX Microtechnology","A","United Kingdom","UK & Ireland","https://inexmicro.com/careers/","Compound semiconductors, MEMS and fabrication"),
  t("IQE","A","United Kingdom","UK & Ireland","https://careers.iqep.com/","Epitaxy, compound semiconductors and characterisation"),
  t("Paragraf","A","United Kingdom","UK & Ireland","https://www.paragraf.com/careers/","Graphene devices, process and materials"),
  t("Space Forge","A","United Kingdom","UK & Ireland","https://www.spaceforge.com/careers","Semiconductor materials and in-space manufacturing"),
  t("Infinitesima","A","United Kingdom","UK & Ireland","https://www.infinitesima.com/careers/","Semiconductor metrology and AFM"),
  t("Vector Photonics","A","United Kingdom","UK & Ireland","https://vectorphotonics.co.uk/careers/","Lasers and photonic devices"),
  t("Phlux Technology","A","United Kingdom","UK & Ireland","https://phluxtechnology.com/careers/","Infrared detectors and photonics"),
  t("Cambridge GaN Devices","A","United Kingdom","UK & Ireland","https://camgandevices.com/careers/","GaN power devices and reliability"),
  t("Plessey Semiconductors","A","United Kingdom","UK & Ireland","https://plesseysemiconductors.com/careers/","GaN and microLED devices"),
  t("Vishay Newport","B","United Kingdom","UK & Ireland","https://www.vishay.com/en/company/careers/","Power semiconductors and manufacturing"),
  t("Dynex Semiconductor","B","United Kingdom","UK & Ireland","https://www.dynexsemi.com/careers/","Power semiconductor manufacturing"),
  t("Semefab","B","United Kingdom","UK & Ireland","https://www.semefab.com/careers/","MEMS and semiconductor fabrication"),
  t("Nexperia","B","United Kingdom","UK & Ireland","https://www.nexperia.com/careers","Devices, product and manufacturing"),
  t("Arm","C","United Kingdom","UK & Ireland","https://careers.arm.com/","Processor and semiconductor IP design"),
  t("Graphcore","C","United Kingdom","UK & Ireland","https://www.graphcore.ai/careers","AI accelerator design"),
  t("Intel","B","Ireland","UK & Ireland","https://jobs.intel.com/","Wafer fabrication, process and equipment"),
  t("Analog Devices","B","Ireland","UK & Ireland","https://analogdevices.wd1.myworkdayjobs.com/External","Analog devices, product and test"),

  // Continental Europe
  t("ASML","A","Netherlands","Europe","https://www.asml.com/en/careers/find-your-job","Lithography, optics, systems and applications"),
  t("ASM","A","Netherlands","Europe","https://www.asm.com/careers/vacancies/","Deposition equipment and process engineering"),
  t("Besi","A","Netherlands","Europe","https://www.besi.com/careers/vacancies","Semiconductor assembly and packaging equipment"),
  t("SMART Photonics","A","Netherlands","Europe","https://smartphotonics.nl/careers/","Photonic integrated circuits and foundry process"),
  t("NXP Semiconductors","B","Netherlands","Europe","https://www.nxp.com/company/about-nxp/careers:CAREERS","Mixed-signal devices, product and test"),
  t("Infineon","A","Germany","Europe","https://www.infineon.com/cms/en/careers/jobsearch/","Power semiconductors, process and device engineering"),
  t("ZEISS Semiconductor Manufacturing Technology","A","Germany","Europe","https://www.zeiss.com/career/en/job-search.html","Semiconductor optics, metrology and systems"),
  t("GlobalFoundries","B","Germany","Europe","https://gf.com/careers/","Wafer fabrication, process and equipment"),
  t("Bosch Semiconductor","B","Germany","Europe","https://www.bosch.de/en/career/job-offers/","MEMS, sensors and wafer manufacturing"),
  t("X-FAB","B","Germany","Europe","https://www.xfab.com/career/jobs","Analog and MEMS foundry manufacturing"),
  t("STMicroelectronics","A","France","Europe","https://stmicroelectronics.eightfold.ai/careers","Semiconductor process, device, product and test"),
  t("Soitec","A","France","Europe","https://careers.soitec.com/","Engineered substrates and materials"),
  t("CEA-Leti","A","France","Europe","https://www.cea.fr/english/Pages/careers/job-offers.aspx","Semiconductor and photonics research"),
  t("Lynred","A","France","Europe","https://www.lynred.com/careers","Infrared detectors and imaging"),
  t("imec","A","Belgium","Europe","https://www.imec-int.com/en/work-at-imec/job-opportunities","Nanoelectronics, process and photonics R&D"),
  t("Melexis","B","Belgium","Europe","https://careers.melexis.com/","Sensors, mixed-signal product and test"),
  t("Infineon","A","Austria","Europe","https://www.infineon.com/cms/en/careers/jobsearch/","Power devices, process, product and test"),
  t("ams OSRAM","A","Austria","Europe","https://ams-osram.com/careers/job-search","Optical semiconductors, sensors and photonics"),
  t("STMicroelectronics","A","Italy","Europe","https://stmicroelectronics.eightfold.ai/careers","MEMS, power, process and device engineering"),
  t("LFoundry","B","Italy","Europe","https://www.lfoundry.com/en/careers","CMOS image sensor foundry and fabrication"),
  t("STMicroelectronics","B","Switzerland","Europe","https://stmicroelectronics.eightfold.ai/careers","Devices, product and mixed-signal engineering"),
  t("SynSense","C","Switzerland","Europe","https://www.synsense.ai/careers/","Neuromorphic semiconductor design"),
  t("Sivers Semiconductors","A","Sweden","Europe","https://www.sivers-semiconductors.com/careers/","Photonics and RF semiconductors"),
  t("Mycronic","A","Sweden","Europe","https://www.mycronic.com/career/job-openings/","Semiconductor and display production equipment"),
  t("Okmetic","A","Finland","Europe","https://www.okmetic.com/careers/","Silicon wafers and materials"),
  t("Nordic Semiconductor","C","Norway","Europe","https://careers.nordicsemi.com/","Wireless semiconductor design and test"),
  t("NKT Photonics","A","Denmark","Europe","https://www.nktphotonics.com/about-us/careers/","Lasers, fibres and photonics"),
  t("onsemi","B","Czechia","Europe","https://careers.onsemi.com/","Wafer manufacturing, process and product"),
  t("VIGO Photonics","A","Poland","Europe","https://vigophotonics.com/career/","Infrared detectors and photonics"),
  t("IMB-CNM","A","Spain","Europe","https://www.imb-cnm.csic.es/en/job-offers","Microelectronics and nanofabrication research"),
  t("Amkor Technology","A","Portugal","Europe","https://amkor.com/careers/","Semiconductor packaging and test"),

  // North America
  t("Applied Materials","A","United States","North America","https://careers.appliedmaterials.com/","Semiconductor process equipment and applications"),
  t("Lam Research","A","United States","North America","https://opportunities.lamresearch.com/","Etch, deposition and process equipment"),
  t("KLA","A","United States","North America","https://www.kla.com/careers","Metrology, inspection and process control"),
  t("Micron","A","United States","North America","https://careers.micron.com/careers","Memory fabrication, process and equipment"),
  t("Wolfspeed","A","United States","North America","https://careers.wolfspeed.com/","SiC materials, devices and fabrication"),
  t("Coherent","A","United States","North America","https://jobs.coherent.com/","Compound semiconductors, lasers and photonics"),
  t("SkyWater Technology","A","United States","North America","https://www.skywatertechnology.com/careers/","Specialty foundry and process engineering"),
  t("GlobalFoundries","B","United States","North America","https://gf.com/careers/","Wafer fabrication, process and equipment"),
  t("Intel","B","United States","North America","https://jobs.intel.com/","Wafer fabrication, process and equipment"),
  t("Texas Instruments","B","United States","North America","https://careers.ti.com/","Analog manufacturing, product and test"),
  t("Teledyne DALSA","A","Canada","North America","https://careers.teledyne.com/","Image sensors, MEMS and semiconductor fabrication"),
  t("Lumentum","A","Canada","North America","https://careers.lumentum.com/","Photonics, lasers and optical devices"),

  // East Asia
  t("TSMC","A","Taiwan","East Asia","https://careers.tsmc.com/en_US/careers/SearchJobs","Foundry process, equipment and integration"),
  t("UMC","A","Taiwan","East Asia","https://careers.umc.com/","Foundry process and manufacturing"),
  t("ASE Technology","A","Taiwan","East Asia","https://www.aseglobal.com/careers/","Advanced packaging and semiconductor test"),
  t("Micron","A","Taiwan","East Asia","https://careers.micron.com/careers","Memory fabrication, process and equipment"),
  t("ASML Taiwan","A","Taiwan","East Asia","https://www.asml.com/en/careers/find-your-job?facets=vacancycountry%3DTaiwan&page=1&sortBy=relevance","Lithography, optical metrology, e-beam inspection, manufacturing and customer support"),
  t("Applied Materials Taiwan","A","Taiwan","East Asia","https://jobs.appliedmaterials.com/location/taiwan-jobs/95/1668284-7280291/3","Process equipment, manufacturing, customer engineering and technical support"),
  t("Lam Research Taiwan","A","Taiwan","East Asia","https://opportunities.lamresearch.com/go/Search/8797500/","Etch, deposition, clean, field service and process support"),
  t("KLA Taiwan","A","Taiwan","East Asia","https://kla.wd1.myworkdayjobs.com/en-US/Taiwan","Inspection, metrology, applications and customer service engineering"),
  t("ASM Taiwan","A","Taiwan","East Asia","https://www.asm.com/open-vacancies/","ALD, EPI, PEALD, CVD and field process engineering"),
  t("Tokyo Electron Taiwan","A","Taiwan","East Asia","https://www.tel.com/careers/","Semiconductor production equipment, field service and process support"),
  t("MediaTek","C","Taiwan","East Asia","https://careers.mediatek.com/","Fabless semiconductor design"),
  t("Samsung Semiconductor","A","South Korea","East Asia","https://semiconductor.samsung.com/about-us/careers/","Memory, foundry, process and device engineering"),
  t("SK hynix","A","South Korea","East Asia","https://recruit.skhynix.com/","Memory process, equipment and product engineering"),
  t("DB HiTek","A","South Korea","East Asia","https://dbhitek.com/eng/recruit/job","Specialty foundry process and manufacturing"),
  t("Tokyo Electron","A","Japan","East Asia","https://www.tel.com/careers/","Semiconductor production equipment and process"),
  t("Sony Semiconductor Solutions","A","Japan","East Asia","https://www.sony-semicon.com/en/jobs/","Image sensors, devices and process"),
  t("Kioxia","A","Japan","East Asia","https://www.kioxia-holdings.com/en-jp/careers.html","Flash memory process, device and product"),
  t("Rapidus","A","Japan","East Asia","https://www.rapidus.inc/en/career/","Advanced logic foundry and process"),
  t("Renesas","B","Japan","East Asia","https://jobs.renesas.com/","Embedded, analog, product and test"),
  t("ROHM Semiconductor","A","Japan","East Asia","https://www.rohm.com/career","Power and compound semiconductor devices"),
  t("SMIC","A","China","East Asia","https://www.smics.com/en/site/company_careers","Foundry process and manufacturing"),
  t("Hua Hong Semiconductor","A","China","East Asia","https://www.huahonggrace.com/en/recruit","Foundry process and manufacturing"),

  // South & Southeast Asia
  t("Micron","A","Singapore","South & Southeast Asia","https://careers.micron.com/careers","Memory, process, equipment and packaging"),
  t("GlobalFoundries","A","Singapore","South & Southeast Asia","https://gf.com/careers/","Wafer fabrication, process and equipment"),
  t("Applied Materials","A","Singapore","South & Southeast Asia","https://careers.appliedmaterials.com/","Semiconductor equipment and manufacturing"),
  t("SSMC","A","Singapore","South & Southeast Asia","https://www.ssmc.com/careers/","Specialty foundry process and manufacturing"),
  t("Infineon","A","Malaysia","South & Southeast Asia","https://www.infineon.com/cms/en/careers/jobsearch/","Power semiconductor manufacturing and test"),
  t("Intel","B","Malaysia","South & Southeast Asia","https://jobs.intel.com/","Advanced packaging, manufacturing and test"),
  t("Bosch Semiconductor","A","Malaysia","South & Southeast Asia","https://www.bosch.com/careers/job-offers/","Semiconductor backend and sensor manufacturing"),
  t("ASE Technology","A","Malaysia","South & Southeast Asia","https://www.aseglobal.com/careers/","Semiconductor packaging and test"),
  t("Micron","A","India","South & Southeast Asia","https://careers.micron.com/careers","Assembly, test, process and equipment"),
  t("Applied Materials","A","India","South & Southeast Asia","https://careers.appliedmaterials.com/","Process equipment, applications and engineering"),
  t("Lam Research","A","India","South & Southeast Asia","https://opportunities.lamresearch.com/","Semiconductor equipment and process engineering"),
  t("Intel","C","India","South & Southeast Asia","https://jobs.intel.com/","Semiconductor design, validation and product"),
  t("Analog Devices","A","Philippines","South & Southeast Asia","https://analogdevices.wd1.myworkdayjobs.com/External","Assembly, product, test and failure analysis"),
  t("onsemi","A","Philippines","South & Southeast Asia","https://careers.onsemi.com/","Semiconductor manufacturing, product and test"),
  t("Amkor Technology","A","Philippines","South & Southeast Asia","https://amkor.com/careers/","Packaging and semiconductor test"),
  t("Intel Products Vietnam","A","Vietnam","South & Southeast Asia","https://jobs.intel.com/","Assembly, manufacturing and test"),
  t("Amkor Technology","A","Vietnam","South & Southeast Asia","https://amkor.com/careers/","Advanced packaging and test"),
  t("Hana Microelectronics","A","Thailand","South & Southeast Asia","https://www.hanagroup.com/careers/","Semiconductor assembly, sensors and test"),

  // Middle East & Oceania
  t("Tower Semiconductor","A","Israel","Middle East","https://towersemi.com/careers/","Specialty foundry process and manufacturing"),
  t("Nova","A","Israel","Middle East","https://www.novami.com/careers/","Semiconductor metrology and process control"),
  t("Applied Materials","A","Israel","Middle East","https://careers.appliedmaterials.com/","Inspection, metrology and process equipment"),
  t("Intel","B","Israel","Middle East","https://jobs.intel.com/","Wafer fabrication, process and development"),
  t("YongaTek","C","Türkiye","Middle East","https://www.yongatek.com/career/","Semiconductor and embedded system design"),
  t("Silanna Semiconductor","A","Australia","Oceania","https://www.silanna.com/careers/","Power semiconductors and advanced materials"),
  t("BluGlass","A","Australia","Oceania","https://bluglass.com.au/careers/","GaN lasers, epitaxy and photonics"),
  t("Morse Micro","C","Australia","Oceania","https://www.morsemicro.com/careers/","Fabless wireless semiconductor design"),
].filter(target=>target.country!=="United States");

export const targetCountries = [...new Set(companyTargets.map(target=>target.country))];
export const targetRegions = [...new Set(companyTargets.map(target=>target.region))];

export function targetsFor(tier:Tier,country:string){
  return companyTargets.filter(target=>target.tier===tier && (country==="All countries" || target.country===country));
}
