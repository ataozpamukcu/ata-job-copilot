import test from "node:test";
import assert from "node:assert/strict";
import {companyTargets,targetsFor} from "../lib/targets";

test("Taiwan includes local and multinational semiconductor operations",()=>{
  const names=new Set(targetsFor("A","Taiwan").map(target=>target.company));
  for(const company of ["TSMC","ASML Taiwan","Applied Materials Taiwan","Lam Research Taiwan","KLA Taiwan","ASM Taiwan","Tokyo Electron Taiwan"]){
    assert.ok(names.has(company),`${company} should be visible under Taiwan`);
  }
});

test("United States operations remain excluded",()=>{
  assert.equal(companyTargets.some(target=>target.country==="United States"),false);
});
