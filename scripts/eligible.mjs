// Filtre volontairement prudent : une piste conservée exige une vérification humaine.
export function eligibleTitle(title){
  const t=String(title||'').toLowerCase();
  if(!/\bfree\b|freebie|gratuit|échantillon|\bsample\b|no[ -]deposit|sans dépôt|concours|sweepstakes|giveaway|remboursement|\brefund\b|\bsettlement\b|free spins|promo code|code promo/.test(t))return false;
  if(/\bbogo\b|buy\s+(one|1|two|2|\d+).{0,35}get|with (?:any )?purchase|purchase (?:is )?required|avec achat|achat obligatoire|free shipping|livraison gratuite|\b(?:only|just|from|as low as)\s*[$£€]\s*\d|\d+\s*%\s*off/.test(t))return false;
  return true;
}
export function eligibleOffer(title,description=''){
  if(!eligibleTitle(title))return false;
  const text=String(title+' '+description).toLowerCase().replace(/\bno purchase (?:is )?(?:necessary|required)\b/g,'');
  return !/\b(?:when|if|after) you (?:spend|buy|purchase)\b|\b(?:you must|you need to|required to) (?:buy|purchase|spend)\b|\bwith (?:a |any |an? eligible |a qualifying )?purchase\b|\bpurchase (?:is )?(?:required|necessary)\b|\b(?:buy|purchase) (?:one|two|three|four|\d+) (?:specially marked |qualifying |eligible )?(?:boxes|products|items|packs|packages)\b|\b(?:achetez|acheter) (?:un|une|deux|trois|quatre|\d+)\b|\b(?:achat|dépôt) (?:est )?(?:obligatoire|requis|exigé)\b/.test(text);
}
