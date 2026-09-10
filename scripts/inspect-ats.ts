import { inspectAts } from "../lib/ats";
const url=process.argv[2]; if(!url){console.error("Usage: npm run inspect -- <job-url>");process.exit(1)}
inspectAts(url).then(x=>console.log(JSON.stringify(x,null,2))).catch(e=>{console.error(e);process.exit(1)});
