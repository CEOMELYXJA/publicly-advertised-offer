import test from 'node:test';
import assert from 'node:assert/strict';
import {eligibleTitle,eligibleOffer} from './scripts/eligible.mjs';
test('le catalogue écarte les achats évidents et les promotions payantes',()=>{for(const t of ['Buy One, Get One Free','FREE mist with purchase','Shoes Only $12','Sheets + FREE Shipping','BOGO FREE minis'])assert.equal(eligibleTitle(t),false,t)});
test('les pistes gratuites, remboursements et concours restent à vérifier',()=>{for(const t of ['Free sample','Free spins no deposit','Class action settlement','Sweepstakes: win a prize'])assert.equal(eligibleTitle(t),true,t)});
test('un achat explicite dans le titre ou le résumé exclut la piste',()=>{assert.equal(eligibleOffer('Get a FREE $5 gift card when you spend $15',''),false);assert.equal(eligibleOffer('Get a FREE Soccer Ball','When you buy two specially marked boxes of cereal'),false);assert.equal(eligibleOffer('Échantillon gratuit','Aucun achat nécessaire'),true)});
