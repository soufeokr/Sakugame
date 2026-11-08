/* Sakugame — module branché sur Supabase (V1). Aucune écriture économique depuis le navigateur : tout passe par des fonctions serveur. */
(function(){'use strict';
const labels={fr:{title:'Niveau de carte',level:'Niveau',copies:'ex.',dup:'doublons disponibles',cost:'doublon',costs:'doublons',upgrade:'Améliorer',max:'Niveau maximum',missing:'Carte non possédée',error:'Impossible de réaliser cette amélioration.',progress:'Amélioration en cours…'},en:{title:'Card level',level:'Level',copies:'copies',dup:'duplicates available',cost:'duplicate',costs:'duplicates',upgrade:'Upgrade',max:'Maximum level',missing:'Card not owned',error:'Could not upgrade this card.',progress:'Upgrading…'},es:{title:'Nivel de carta',level:'Nivel',copies:'copias',dup:'duplicados disponibles',cost:'duplicado',costs:'duplicados',upgrade:'Mejorar',max:'Nivel máximo',missing:'Carta no obtenida',error:'No se pudo mejorar la carta.',progress:'Mejorando…'}};
const lang=()=>labels[(window.SAKU_I18N||{}).lang]||labels.en, cost=[1,2,4];let working=false;
function buckets(state,id){state=state||{};id=String(id);let total=Math.max(0,Number((state.cards||{})[id])||0),v=(state.levels||{})[id]||{},out=[0,0,0,0],left=total;[3,2,1].forEach(l=>{let n=Math.max(0,Number(v[l])||0);n=Math.min(left,Math.floor(n));out[l]=n;left-=n;});out[0]=left;return out;}
window.sakuCardLevelCounts=buckets;
function safeText(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function stars(n){return n?'★'.repeat(n):'';}
function render(container,id){if(!container)return;const old=container.querySelector('.card-levels');if(old)old.remove();const w=lang(),counts=buckets(cardState,id),total=counts.reduce((a,b)=>a+b,0);let el=document.createElement('section');el.className='card-levels';el.innerHTML='<h3>'+safeText(w.title)+'</h3>';if(!total){el.insertAdjacentHTML('beforeend','<p class="card-level-muted">'+safeText(w.missing)+'</p>');container.appendChild(el);return;}
 for(let level=0;level<4;level++){if(!counts[level])continue;const available=counts[0]-(level===0?1:0),need=cost[level]||0;let row=document.createElement('div');row.className='card-level-row';let name=w.level+' '+level+(level?' · '+stars(level):'');row.innerHTML='<div><strong>'+safeText(name)+'</strong> <small>× '+counts[level]+'</small>'+(level<3?'<p>'+available+' '+safeText(w.dup)+' · '+need+' '+safeText(need===1?w.cost:w.costs)+'</p>':'<p>'+safeText(w.max)+'</p>')+'</div>';if(level<3){let btn=document.createElement('button');btn.type='button';btn.className='card-level-up';btn.textContent=w.upgrade+' → '+(level+1)+' ★';btn.disabled=working||available<need;btn.addEventListener('click',e=>{e.stopPropagation();upgrade(id,level,container)});row.appendChild(btn);}el.appendChild(row);}
 container.appendChild(el);let box=container.closest('#cardsDetail,#encDetail');if(box&&window.sakuDetailStars)window.sakuDetailStars(box,id);
}
window.sakuCardLevelsRender=render;
async function upgrade(id,level,container){
 if(working||level<0||level>2)return;const actor=window.sakuSecureUserId;
 if(!actor||!window.sakuBackend){if(typeof showNotification==='function')showNotification('Connecte-toi pour améliorer cette carte.');return;}
 working=true;render(container,id);
 try{
  await window.sakuBackend.upgradeCard(String(id),level);
  const state=await window.sakuBackend.gameCollection();if(window.sakuSecureUserId!==actor)return;
  cardState=cardNormalize(state);if(currentAccount)currentAccount.cards=cardNormalize(state);
  if(typeof cardsRenderStats==='function')cardsRenderStats();if(typeof cardsRenderAlbum==='function'&&document.getElementById('collectionScreen')?.classList.contains('active'))cardsRenderAlbum();
  const dl=container.querySelector('dl');if(dl){const row=Array.from(dl.querySelectorAll('.card-detail-row')).find(x=>/collection|colección/i.test(x.textContent));if(row&&row.querySelector('dd'))row.querySelector('dd').textContent='× '+(cardState.cards[id]||0);}
 }catch(e){if(typeof showNotification==='function')showNotification(lang().error);}finally{working=false;if(container.isConnected)render(container,id);}
}

})();
