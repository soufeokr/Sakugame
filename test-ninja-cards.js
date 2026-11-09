/* TEST ONLY: Ninja Tester owns every catalogue card. No guest/other account is changed. */
(function(){'use strict';
const NINJA='900000000000000001';let generation=0;
function removeTestPool(){if(typeof cardPool==='undefined'||!cardPool)return;cardPool=cardPool.filter(c=>!c.testOnlyNinja);cardPoolById={};cardPoolBySeries={};cardPool.forEach((c,i)=>{cardPoolById[String(c.id)]=c;if(!cardPoolBySeries[c.series||''])cardPoolBySeries[c.series||'']=[];cardPoolBySeries[c.series||''].push(i);});}
function detach(){generation++;removeTestPool();}
async function attach(){
 detach();const run=++generation;
 if(!currentAccount||sakuMyDcId()!==NINJA)return;
 try{
  if(window.sakuDataReady)await window.sakuDataReady;if(run!==generation||!currentAccount||sakuMyDcId()!==NINJA)return;
  cardBuildPool();
  const existing=(await sakuAcctRef(NINJA).once('value')).val()||{};
  if(run!==generation||!currentAccount||sakuMyDcId()!==NINJA)return;
  if(existing.ninjaCollectionGranted){
   // One-time allocation of the new build's cards only; never re-create old sold cards.
   const added=['134054','204442','204894','325758','325759','325760','manual-utaite-kanaria','manual-utaite-sou','manual-ado-yorupi','manual-ado-ashura','manual-ado-dominic','manual-ado-hanabi','manual-ado-keiko-tanaka','manual-ado-aoi','manual-ado-hinata','manual-ado-romero','manual-ado-lugosi','manual-ado-carpenter','manual-ado-lulu','manual-eve-kurukuru'];
   if(!existing.ninjaCards235Granted){await sakuAcctRef(NINJA).transaction(function(account){if(!account||account.ninjaCards235Granted)return;account.cards=account.cards||{};account.cards.cards=account.cards.cards||{};added.forEach(id=>{if(!account.cards.cards[id])account.cards.cards[id]=1;});account.ninjaCards235Granted=true;return account;});}
   if(!existing.ninjaStrongest245Granted)await sakuAcctRef(NINJA).transaction(function(account){if(!account||account.ninjaStrongest245Granted)return;account.cards=account.cards||{};account.cards.cards=account.cards.cards||{};['strongest_edward%20newgate','strongest_madoka%20kaname'].forEach(id=>{if(!account.cards.cards[id])account.cards.cards[id]=1;});account.ninjaStrongest245Granted=true;return account;});
   if(!existing.ninjaHoshiGranted)await sakuAcctRef(NINJA).transaction(function(account){if(!account||account.ninjaHoshiGranted)return;account.cards=account.cards||{};account.cards.cards=account.cards.cards||{};CARD_HOSHI.forEach(c=>{if(!account.cards.cards[c.id])account.cards.cards[c.id]=1;});account.ninjaHoshiGranted=true;return account;});
   if(run!==generation||!currentAccount||sakuMyDcId()!==NINJA)return;
   const latest=(await sakuAcctRef(NINJA).once('value')).val();if(latest&&latest.cards){currentAccount.cards=latest.cards;cardState=cardNormalize(latest.cards);}else if(!cardState)cardsLoad();
   sakuIncludeOwnedCards();if(document.getElementById('homepageScreen').classList.contains('active'))sakuCardHomeRefresh();if(document.getElementById('collectionScreen').classList.contains('active')){cardsRenderStats();cardsRenderAlbum();}return;
  }
  if(typeof ENCYCLOPEDIA!=='undefined')ENCYCLOPEDIA.list.forEach(group=>group.cards.forEach(c=>{
   const id=String(c.i);if(cardPoolById[id])return;
   const item={id:id,name:c.m,image:c.u,series:group.label,rank:c.k||99999,rarity:cardRarityFor({id:id},c.k||99999),edition:'',collectibleOnly:true,testOnlyNinja:true};
   if(window.sakuBindCharacterName)window.sakuBindCharacterName(item,'name',id);
   const index=cardPool.length;cardPool.push(item);cardPoolById[id]=item;if(!cardPoolBySeries[item.series])cardPoolBySeries[item.series]=[];cardPoolBySeries[item.series].push(index);
  }));
  if(!cardState)cardsLoad();const owned=Object.assign({},cardState.cards||{});cardPool.forEach(c=>{if(!owned[String(c.id)])owned[String(c.id)]=1;});cardState.cards=owned;
  currentAccount.cards=cardNormalize(cardState);
  // Persist only on Ninja's simulated account; do not write the guest local collection.
  await sakuAcctRef(NINJA).update({cards:currentAccount.cards,ninjaCollectionGranted:true,ninjaCards235Granted:true,ninjaHoshiGranted:true,ninjaStrongest245Granted:true});
  if(run!==generation||!currentAccount||sakuMyDcId()!==NINJA)return;
  if(document.getElementById('collectionScreen').classList.contains('active')){cardsRenderStats();cardsRenderAlbum();}
  if(document.getElementById('homepageScreen').classList.contains('active'))sakuCardHomeRefresh();
  if(window.sakuTestNinjaReady)window.sakuTestNinjaReady();
 }catch(e){console.warn('Ninja test collection:',e);}
}
window.sakuTestNinjaAttach=function(){window.sakuTestNinjaWait=attach();return window.sakuTestNinjaWait;};window.sakuTestNinjaDetach=detach;
if(typeof currentAccount!=='undefined'&&currentAccount)window.sakuTestNinjaAttach();
})();
