import test from 'node:test';
import assert from 'node:assert/strict';
import {eligibleTitle} from './scripts/eligible.mjs';
test('le catalogue écarte les achats évidents et les promotions payantes',()=>{for(const t of ['Buy One, Get One Free','FREE mist with purchase','Shoes Only $12','Sheets + FREE Shipping','BOGO FREE minis'])assert.equal(eligibleTitle(t),false,t)});
test('les pistes gratuites, remboursements et concours restent à vérifier',()=>{for(const t of ['Free sample','Free spins no deposit','Class action settlement','Sweepstakes: win a prize'])assert.equal(eligibleTitle(t),true,t)});
