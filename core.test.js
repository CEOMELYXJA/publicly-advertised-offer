import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
process.env.NODE_ENV='test';process.env.RADAR_DATA=mkdtempSync(join(tmpdir(),'radar-test-'));
const {analyze,actualStatus,parseFeed,validUrl,isPublic,db}=await import('./server.js');
test.after(()=>{db.close();rmSync(process.env.RADAR_DATA,{recursive:true,force:true})});
test('une offre ne devient jamais confirmée par simple texte publicitaire',()=>{let o=analyze('Free no deposit','Free shipping, no purchase required','https://example.com/offer');assert.equal(actualStatus(o),'À vérifier');assert.equal(o.checks.fees,false)});
test('confirmation exige cinq contrôles et une preuve',()=>{let o=analyze('Offre','texte','https://example.com');o.checks={deposit:true,purchase:true,fees:true,subscription:true,deferred:true};assert.equal(actualStatus(o),'À vérifier');o.verification='Conditions officielles vérifiées le 2026-11-04';assert.equal(actualStatus(o),'100 % gratuite confirmée');o.checks.fees=false;assert.equal(actualStatus(o),'À vérifier')});
test('concours, frais et expiration priment sur confirmation',()=>{let o=analyze('Concours','texte','https://example.com');o.checks={deposit:true,purchase:true,fees:true,subscription:true,deferred:true};o.verification='preuve';assert.equal(actualStatus(o),'Concours');o.category='Échantillon';o.status='Frais ou achat requis';assert.equal(actualStatus(o),'Frais ou achat requis');o.expiry='2000-01-01';assert.equal(actualStatus(o),'Expirée')});
test('code extrait reste à vérifier et conditions de jeu signalées',()=>{let o=analyze('Free spins','Promo code: BONUS10. Wager 30 times.','https://example.com');assert.equal(o.code,'BONUS10');assert.equal(o.codeStatus,'À vérifier');assert.match(o.restrictions,/mise/);assert.equal(o.withdrawal,'Inconnue')});
test('analyse RSS et Atom',()=>{let r=parseFeed('<rss><item><title><![CDATA[Gratuit &amp; simple]]></title><link>https://example.com/a</link><description>Offre</description></item></rss>');assert.equal(r[0].title,'Gratuit & simple');assert.equal(r[0].url,'https://example.com/a');assert.equal(parseFeed('<feed><entry><title>Test</title><link href="https://example.com/b"/><summary>Offre</summary></entry></feed>')[0].url,'https://example.com/b')});
test('liens dangereux et adresses réseau privées refusés',()=>{assert.equal(validUrl('file:///etc/passwd'),null);assert.equal(validUrl('http://a:b@example.com'),null);assert.equal(isPublic('127.0.0.1'),false);assert.equal(isPublic('192.168.1.2'),false);assert.equal(isPublic('::1'),false);assert.equal(isPublic('8.8.8.8'),true);assert.equal(validUrl('https://example.com/a?utm_source=x&b=1#x'),'https://example.com/a?b=1')});

