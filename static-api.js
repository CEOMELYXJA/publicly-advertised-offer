const storeKey='radar-gratuit-pages-v1';
let saved; try{saved=JSON.parse(localStorage.getItem(storeKey))||{}}catch{saved={}}
saved.settings={country:'Canada',region:'',interval:12,notify:true,keywords:'',hideUsed:false,...saved.settings};saved.edits||={};saved.hidden||={};saved.alerts||=[];saved.seen||={};
const saveLocal=()=>localStorage.setItem(storeKey,JSON.stringify(saved));
let catalogCache=null,catalogAt=0;
async function loadCatalog(force=false){if(!force&&catalogCache&&Date.now()-catalogAt<60000)return catalogCache;
  const remote='https://raw.githubusercontent.com/CEOMELYXJA/publicly-advertised-offer/main/data/catalog.json';
  let response;try{response=await fetch(location.hostname.endsWith('github.io')?remote:'./data/catalog.json',{cache:'no-store'});if(!response.ok)throw Error('catalogue distant indisponible')}catch(e){response=await fetch('./data/catalog.json',{cache:'no-store'});if(!response.ok)throw e}
  let data=await response.json(); if(!Array.isArray(data.offers)||!Array.isArray(data.sources))throw Error('Catalogue invalide');
  if(saved.lastGenerated && data.generatedAt && saved.lastGenerated!==data.generatedAt && saved.settings.notify){
    for(const o of data.offers){let old=saved.seen[o.url],current=o.observedText||o.description||'';if(!old){let kws=String(saved.settings.keywords||'').toLowerCase().split(',').map(x=>x.trim()).filter(Boolean);if(!kws.length||kws.some(k=>(o.title+' '+o.description).toLowerCase().includes(k)))saved.alerts.unshift({id:Date.now()+Math.random(),message:'Nouvelle offre à vérifier : '+o.title,created:new Date().toISOString(),read:0})}else if(old.text!==current){let edit=saved.edits[o.url];if(edit){edit.checks={deposit:false,purchase:false,fees:false,subscription:false,deferred:false};edit.verification='';edit.status='À vérifier'}saved.alerts.unshift({id:Date.now()+Math.random(),message:'Contenu modifié, vérification nécessaire : '+o.title,created:new Date().toISOString(),read:0})}if(o.code&&old&&old.code!==o.code)saved.alerts.unshift({id:Date.now()+Math.random(),message:'Nouveau code à vérifier : '+o.code,created:new Date().toISOString(),read:0})}
  }
  for(const o of data.offers){let e=saved.edits[o.url]||{};let date=e.expiry||o.expiry;let days=date?Math.ceil((Date.parse(date+'T23:59:59')-Date.now())/86400000):999;let key='expiry:'+o.url+':'+date;if(saved.settings.notify&&e.favorite&&days>=0&&days<=3&&!saved.alerts.some(a=>a.key===key))saved.alerts.unshift({id:Date.now()+Math.random(),key,message:'Offre favorite bientôt expirée : '+(e.title||o.title),created:new Date().toISOString(),read:0})}saved.seen=Object.fromEntries(data.offers.map(o=>[o.url,{text:o.observedText||o.description||'',code:o.code||''}]));if(data.generatedAt)saved.lastGenerated=data.generatedAt;saved.alerts=saved.alerts.slice(0,200);saveLocal();catalogAt=Date.now();catalogCache=data;return data;
}
function statusOf(o){if(o.expiry && o.expiry<new Date().toISOString().slice(0,10))return 'Expirée';if(o.status==='Indisponible'||o.status==='Frais ou achat requis')return o.status;if(o.category==='Concours')return 'Concours';return ['deposit','purchase','fees','subscription','deferred'].every(k=>o.checks?.[k]===true)&&String(o.verification||'').trim()?'100 % gratuite confirmée':'À vérifier'}
async function api(path,method='GET',body){let data=await loadCatalog();let list=()=>data.offers.filter(o=>!saved.hidden[o.url]).map(o=>{let x={...o,...(saved.edits[o.url]||{})};x.status=statusOf(x);return x});
  if(path==='offers'&&method==='GET')return list();
  if(path==='sources'&&method==='GET')return data.sources;
  if(path==='state'&&method==='GET')return {scanning:false,settings:saved.settings,alerts:saved.alerts,generatedAt:data.generatedAt};
  if(path==='scan'&&method==='POST'){await loadCatalog(true);return {ok:true}}
  if(path==='settings'&&method==='PUT'){saved.settings={...saved.settings,...body};saveLocal();return {ok:true}}
  if(path==='alerts/read'&&method==='POST'){saved.alerts.forEach(a=>a.read=1);saveLocal();return {ok:true}}
  let match=path.match(/^offers\/(\d+)$/);if(match){let o=data.offers.find(x=>x.id===Number(match[1]));if(!o)throw Error('Offre introuvable');if(method==='DELETE')saved.hidden[o.url]=true;else if(method==='PATCH'){if(body.officialUrl){try{let u=new URL(body.officialUrl);if(!['http:','https:'].includes(u.protocol))throw Error()}catch{throw Error('Lien officiel invalide')}}saved.edits[o.url]={...(saved.edits[o.url]||{}),...body}}saveLocal();return {ok:true}}
  throw Error('Cette fonction nécessite le scanner local.');
}
