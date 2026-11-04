import { annotateSource, shouldPublish } from './catalog-utils.mjs';
import { eligibleTitle } from './eligible.mjs';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const temporary = await mkdtemp(join(tmpdir(), 'radar-pages-'));
const port = 3210;
const base = `http://127.0.0.1:${port}`;
const child = spawn(process.execPath, ['server.js'], { env: {...process.env, RADAR_DATA: temporary, PORT: String(port)}, stdio:'inherit' });
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
let old={offers:[]};
const canadianSources=JSON.parse(await readFile('scripts/sources.json','utf8'));
const canadianNames=new Set(canadianSources.map(x=>x.name));
try {
  try {old=JSON.parse(await readFile('data/catalog.json','utf8'))} catch {}
  let ready=false;
  for(let i=0;i<30;i++){try {let r=await fetch(base+'/api/state'); if(r.ok){ready=true;break}}catch{} await wait(500)}
  if(!ready)throw new Error('Le scanner ne démarre pas.');
  for(const source of canadianSources){const response=await fetch(base+'/api/sources',{method:'POST',headers:{origin:base,'content-type':'application/json'},body:JSON.stringify(source)});if(!response.ok)throw new Error('Impossible d’ajouter '+source.name)}
  let start=await fetch(base+'/api/scan',{method:'POST',headers:{origin:base,'content-type':'application/json'},body:'{}'});
  if(!start.ok)throw new Error('Impossible de lancer le scanner.');
  let completed=false;
  for(let i=0;i<360;i++){await wait(1000);let s=await (await fetch(base+'/api/state')).json();if(!s.scanning){completed=true;break}}
  if(!completed)throw new Error('Analyse interrompue : délai dépassé.');
  const [detected,sources]=await Promise.all(['offers','sources'].map(x=>fetch(base+'/api/'+x).then(r=>r.json())));
  const annotate=(offer,prior)=>annotateSource(offer,prior,canadianNames);
  const byUrl=new Map((old.offers||[]).filter(x=>eligibleTitle(x.title)).map(x=>[x.url,annotate(x,x)]));
  for (const item of detected.filter(x=>eligibleTitle(x.title))){
    const prior=byUrl.get(item.url); const id=parseInt(createHash('sha256').update(item.url).digest('hex').slice(0,12),16);
    byUrl.set(item.url,annotate({...item,id,created:prior?.created||item.created},prior));
  }
  const taggedSources=sources.map(source=>({...source,scope:canadianNames.has(source.name)?'Canada':'International'}));
  const data={generatedAt:new Date().toISOString(),sources:taggedSources,offers:[...byUrl.values()].sort((a,b)=>b.created.localeCompare(a.created)).slice(0,1500)};
  if(shouldPublish(old,data))await writeFile('data/catalog.json',JSON.stringify(data,null,2)+'\n');
  else console.log('Aucun changement : catalogue conservé.');
  console.log(`${detected.length} résultats ; ${sources.map(s=>s.name+': '+s.status).join(' | ')}`);
} finally {child.kill();await wait(300);await rm(temporary,{recursive:true,force:true})}
