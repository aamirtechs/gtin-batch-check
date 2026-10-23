
function cleanCode(v){return String(v==null?"":v).replace(/[\s-]/g,"");}
function computeCheckDigit(body){const s=String(body);let t=0;for(let i=0;i<s.length;i++){const d=+s[s.length-1-i];t+=d*(i%2===0?3:1);}return String((10-(t%10))%10);}
function isValidCheck(code){const s=cleanCode(code);if(!/^\d+$/.test(s)||s.length<2)return false;return computeCheckDigit(s.slice(0,-1))===s.slice(-1);}
function typeForLength(n){return {8:"GTIN-8",12:"GTIN-12",13:"GTIN-13",14:"GTIN-14"}[n]||null;}
function detectType(code){const s=cleanCode(code);const t=typeForLength(s.length);if(!t)return null;if(s.length===13&&(s.startsWith("978")||s.startsWith("979")))return "ISBN-13";return t;}
function parseCSV(text){const rows=[];let row=[],cur="",q=false;const src=String(text||"");for(let i=0;i<src.length;i++){const c=src[i];if(q){if(c==='"'){if(src[i+1]==='"'){cur+='"';i++;}else q=false;}else cur+=c;}else if(c==='"')q=true;else if(c===","){row.push(cur);cur="";}else if(c==="\n"){row.push(cur);rows.push(row);row=[];cur="";}else if(c!=="\r")cur+=c;}if(cur!==""||row.length){row.push(cur);rows.push(row);}return rows.filter(r=>r.some(c=>String(c).trim()!==""));}
function csvEscape(v){const s=String(v==null?"":v);return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}
function analyzeRow(raw,sku){const original=String(raw==null?"":raw).trim();const s=cleanCode(original);const base={input:original,sku:sku||"",cleaned:s,length:s.length,type:detectType(s),status:"invalid",corrected:"",reason:""};
 if(!s){base.reason="Empty code";return base;}
 if(!/^\d+$/.test(s)){base.reason="Contains non-digit characters";return base;}
 if(typeForLength(s.length)){base.type=detectType(s);if(isValidCheck(s)){base.status="valid";base.corrected=s;base.reason="Check digit OK";}else{base.status="fixed";base.corrected=s.slice(0,-1)+computeCheckDigit(s.slice(0,-1));base.reason="Wrong check digit, corrected";}return base;}
 // missing check digit: length one less than a valid length
 if([7,11,12,13].includes(s.length)){const full=s+computeCheckDigit(s);base.status="fixed";base.corrected=full;base.type=detectType(full);base.reason="Missing check digit, computed and appended";return base;}
 // leading zero loss: pad an 11-digit code to 12 etc? 11 handled above as missing check; try padding left with zero to next valid length
 for(const target of [8,12,13,14]){if(s.length<target){const padded=s.padStart(target-1,"0");const cand=padded+computeCheckDigit(padded);/* candidate built as fixed length */}}
 if(s.length===11){/* already handled */}
 base.reason="Wrong length "+s.length+", expected 8, 12, 13 or 14 digits (check for stripped leading zeros)";
 return base;}
function analyzeBatch(items){return items.map(it=>analyzeRow(it.code||it.gtin||it.input||"",it.sku||""));}
function buildAnnotatedCSV(results){const head="sku,input,cleaned,length,type,status,corrected,reason";const lines=results.map(r=>[r.sku,r.input,r.cleaned,r.length,r.type||"",r.status,r.corrected,r.reason].map(csvEscape).join(","));return [head,...lines].join("\n")+"\n";}
const api={cleanCode,computeCheckDigit,isValidCheck,typeForLength,detectType,parseCSV,csvEscape,analyzeRow,analyzeBatch,buildAnnotatedCSV};
if(typeof module!=="undefined"&&module.exports){module.exports=api;} if(typeof window!=="undefined"){window.GtinBatchCheck=api;}
