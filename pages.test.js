import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile('static-api.js','utf8');
const sample={generatedAt:'2026-01-01T00:00:00Z',sources:[],offers:[{id:23,url:'https://example.com/offre',title:'Offre',category:'Échantillon',description:'À vérifier',checks:{},status:'À vérifier'}]};
function context(){let memory={};let x={location:{hostname:'localhost'},localStorage:{getItem:k=>memory[k]||null,setItem:(k,v)=>memory[k]=v},fetch:async()=>({ok:true,json:async()=>structuredClone(sample)}),URL,Date,Math};vm.createContext(x);vm.runInContext(source,x);return x}
test('les favoris et corrections persistent dans le navigateur',async()=>{let c=context();await vm.runInContext("api('offers/23','PATCH',{favorite:true})",c);let list=await vm.runInContext("api('offers')",c);assert.equal(list[0].favorite,true);assert.equal(list[0].status,'À vérifier')});
test('une preuve et les cinq vérifications sont exigées',async()=>{let c=context();await vm.runInContext("api('offers/23','PATCH',{checks:{deposit:true,purchase:true,fees:true,subscription:true,deferred:true}})",c);assert.equal((await vm.runInContext("api('offers')",c))[0].status,'À vérifier');await vm.runInContext("api('offers/23','PATCH',{verification:'conditions vérifiées'})",c);assert.equal((await vm.runInContext("api('offers')",c))[0].status,'100 % gratuite confirmée')});
test('un lien officiel malveillant est refusé',async()=>{let c=context();await assert.rejects(vm.runInContext("api('offers/23','PATCH',{officialUrl:'javascript:alert(1)'})",c),/Lien officiel invalide/)});
