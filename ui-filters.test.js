import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const script=readFileSync('app.js','utf8');
const fn=script.slice(script.indexOf('function visible()'),script.indexOf('function similar('));
function setup(){let c={Date,parseFloat,Number,offers:[{id:1,title:'Offre Canada',sourceRegion:'Canada',country:'Inconnu',region:'Inconnue',published:new Date(Date.now()-864e5).toISOString(),created:new Date().toISOString(),category:'Échantillon',reward:'',status:'À vérifier',favorite:true},{id:2,title:'Offre US',sourceRegion:'Inconnue',country:'Inconnu',region:'Inconnue',published:new Date().toISOString(),created:new Date().toISOString(),category:'Échantillon',reward:'',status:'À vérifier'},{id:3,title:'Ancienne',sourceRegion:'Canada',country:'Inconnu',region:'Inconnue',published:new Date(Date.now()-180*864e5).toISOString(),created:new Date().toISOString(),category:'Échantillon',reward:'',status:'À vérifier',favorite:true}],view:'offers',query:'',filters:{category:'',country:'',reward:'',expiry:'',canada:false,old:true,free:false,card:false,hide:false,sort:'new'},state:{settings:{country:'Canada',region:'',hideUsed:false}}};vm.createContext(c);vm.runInContext(fn,c);return c}
test('les sources canadiennes sont prioritaires et le filtre les isole',()=>{let c=setup();let first=vm.runInContext('visible()',c);assert.equal(first[0].id,1);assert.equal(first.some(x=>x.id===3),false);c.filters.canada=true;assert.deepEqual(Array.from(vm.runInContext('visible()',c),x=>x.id),[1])});
test('les favoris anciens restent accessibles dans la liste de favoris',()=>{let c=setup();c.view='favorites';assert.equal(vm.runInContext('visible()',c).some(x=>x.id===3),true)});

