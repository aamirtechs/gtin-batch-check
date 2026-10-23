
const test=require("node:test");const assert=require("node:assert/strict");const L=require("../src/logic.js");
test("check digit for known EAN-13 body",()=>{assert.equal(L.computeCheckDigit("590123412345"),"7");assert.equal(L.isValidCheck("5901234123457"),true);});
test("valid UPC-A",()=>{assert.equal(L.isValidCheck("036000291452"),true);const r=L.analyzeRow("036000291452","SKU1");assert.equal(r.status,"valid");assert.equal(r.type,"GTIN-12");});
test("wrong check digit is fixed",()=>{const r=L.analyzeRow("5901234123450","S2");assert.equal(r.status,"fixed");assert.equal(r.corrected,"5901234123457");});
test("missing check digit is computed",()=>{const r=L.analyzeRow("9638507","S3");assert.equal(r.status,"fixed");assert.equal(r.corrected,"9638507"+L.computeCheckDigit("9638507"));});
test("ISBN-13 detection",()=>{const body="978030640615";const code=body+L.computeCheckDigit(body);assert.equal(L.detectType(code),"ISBN-13");assert.equal(L.isValidCheck(code),true);});
test("invalid length and non-digit flagged",()=>{assert.equal(L.analyzeRow("12345").status,"invalid");assert.match(L.analyzeRow("12345").reason,/Wrong length/);assert.equal(L.analyzeRow("ABC123").status,"invalid");});
test("GTIN-8 and GTIN-14 valid",()=>{for(const body of ["9638507","1234567890123"]){const c=body+L.computeCheckDigit(body);assert.equal(L.isValidCheck(c),true);}});
test("CSV parse and annotated CSV",()=>{const rows=L.parseCSV('sku,gtin\nA1,"5901234123457"\n');assert.deepEqual(rows[1],["A1","5901234123457"]);const out=L.buildAnnotatedCSV(L.analyzeBatch([{sku:"A1",code:"5901234123457"}]));assert.match(out,/valid/);assert.match(out,/sku,input/);});
