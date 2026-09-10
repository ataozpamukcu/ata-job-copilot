import test from "node:test";
import assert from "node:assert/strict";
import {extractListingLocation,locationVerdict} from "../lib/location";

test("extracts common ATS location fields",()=>{
  assert.equal(extractListingLocation("Job ID\n123\nLocation\nTainan City, Taiwan\nCategory\nEngineering"),"Tainan City, Taiwan");
  assert.equal(extractListingLocation("Location:\n\nFremont, CA, US, 94538\nReq ID: 1"),"Fremont, CA, US, 94538");
});

test("accepts the requested country and rejects a disguised US result",()=>{
  assert.equal(locationVerdict("Location\nHsinchu, Taiwan","Taiwan").verdict,"match");
  assert.equal(locationVerdict("Location\nTaoyuan, TW","Taiwan").verdict,"match");
  assert.equal(locationVerdict("Location:\nFremont, CA, US, 94538","Taiwan").verdict,"mismatch");
});

test("keeps missing location evidence explicitly unknown",()=>{
  assert.equal(locationVerdict("Process Engineer\nJoin our team","France").verdict,"unknown");
});
