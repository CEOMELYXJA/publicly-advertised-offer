export function annotateSource(offer, prior, canadianNames){
  let origins=[...new Set([...(prior?.sources||[prior?.source]).filter(Boolean),...(offer.sources||[offer.source]).filter(Boolean)])].sort();
  let categorized=offer.site==='gg.deals'&&offer.category==='Cadeau physique'?{...offer,category:'Jeu ou service gratuit'}:offer;
  return {...categorized,sources:origins,sourceRegion:origins.some(name=>canadianNames.has(name))?'Canada':(prior?.sourceRegion||'Inconnue')};
}
export function fingerprint(data){
  const sources=(data.sources||[]).map(({checked,...source})=>source).sort((a,b)=>a.url.localeCompare(b.url));
  const offers=(data.offers||[]).map(({lastChecked,updated,...offer})=>offer).sort((a,b)=>a.url.localeCompare(b.url));
  return JSON.stringify({sources,offers});
}
export function shouldPublish(old,next,now=Date.now()){
  return !old.generatedAt||fingerprint(old)!==fingerprint(next)||now-Date.parse(old.generatedAt)>=3600000;
}
