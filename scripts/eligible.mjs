// Filtre volontairement prudent : une piste conservée exige une vérification humaine.
export function eligibleTitle(title){
  const t=String(title||'').toLowerCase();
  if(!/\bfree\b|freebie|gratuit|échantillon|\bsample\b|no[ -]deposit|sans dépôt|concours|sweepstakes|giveaway|remboursement|\brefund\b|\bsettlement\b|free spins|promo code|code promo/.test(t))return false;
  if(/\bbogo\b|buy\s+(one|1|two|2|\d+).{0,35}get|with (?:any )?purchase|purchase (?:is )?required|avec achat|achat obligatoire|free shipping|livraison gratuite|\b(?:only|just|from|as low as)\s*[$£€]\s*\d|\d+\s*%\s*off/.test(t))return false;
  return true;
}
