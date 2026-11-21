/* Sakugame — module branché sur Supabase (V1). Aucune écriture économique depuis le navigateur : tout passe par des fonctions serveur. */
(function(){'use strict';
const labels={fr:{title:'Niveau de carte',level:'Niveau',copies:'ex.',dup:'doublons disponibles',cost:'doublon',costs:'doublons',upgrade:'Améliorer',max:'Niveau maximum',missing:'Carte non possédée',error:'Impossible de réaliser cette amélioration.',progress:'Amélioration en cours…',next:'Prochain niveau',others:'Autres exemplaires :',short:'Il manque {n} doublon.',shortN:'Il manque {n} doublons.',names:['Normale','Brillante','Prismatique','Prismatique arc-en-ciel'],gain:'Gagné : +{n} XP'},en:{title:'Card level',level:'Level',copies:'copies',dup:'duplicates available',cost:'duplicate',costs:'duplicates',upgrade:'Upgrade',max:'Maximum level',missing:'Card not owned',error:'Could not upgrade this card.',progress:'Upgrading…',next:'Next level',others:'Other copies:',short:'{n} more duplicate needed.',shortN:'{n} more duplicates needed.',names:['Normal','Shiny','Prismatic','Rainbow prismatic'],gain:'Earned: +{n} XP'},es:{title:'Nivel de carta',level:'Nivel',copies:'copias',dup:'duplicados disponibles',cost:'duplicado',costs:'duplicados',upgrade:'Mejorar',max:'Nivel máximo',missing:'Carta no obtenida',error:'No se pudo mejorar la carta.',progress:'Mejorando…',next:'Siguiente nivel',others:'Otras copias:',short:'Falta {n} duplicado.',shortN:'Faltan {n} duplicados.',names:['Normal','Brillante','Prismática','Prismática arcoíris'],gain:'Ganado: +{n} XP'}};
const lang=()=>labels[(window.SAKU_I18N||{}).lang]||labels.en, cost=[1,2,4];let working=false;
const XP={common:1,uncommon:2,rare:4,epic:6,legendary:10,mythic:25,special:50};
function xpFor(id){let c=window.sakuMarket&&window.sakuMarket.card(id),r=c&&c.rarity;if(!r&&typeof cardPoolById!=='undefined'&&cardPoolById&&cardPoolById[String(id)])r=cardPoolById[String(id)].rarity;return XP[r]||1;}
function buckets(state,id){state=state||{};id=String(id);let total=Math.max(0,Number((state.cards||{})[id])||0),v=(state.levels||{})[id]||{},out=[0,0,0,0],left=total;[3,2,1].forEach(l=>{let n=Math.max(0,Number(v[l])||0);n=Math.min(left,Math.floor(n));out[l]=n;left-=n;});out[0]=left;return out;}
window.sakuCardLevelCounts=buckets;
function safeText(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function stars(n){return n?'★'.repeat(n):'';}
/* Niveau d'une carte = niveau de son meilleur exemplaire. Les exemplaires de niveau 0 en plus servent de doublons. */
function levelInfo(state,id){const counts=buckets(state,id),total=counts.reduce((a,b)=>a+b,0),level=total?([3,2,1].find(l=>counts[l])||0):0,spare=Math.max(0,counts[0]-(level===0?1:0)),need=level<3?cost[level]:0;return {counts,total,level,spare,need,canUpgrade:!!total&&level<3&&spare>=need};}
window.sakuCardLevelInfo=levelInfo;
const STAR_PATH='M12 2.6l2.85 5.95 6.55.82-4.8 4.53 1.22 6.5L12 17.2l-5.82 3.2 1.22-6.5-4.8-4.53 6.55-.82z';
function starBadge(level,opts){level=Math.max(0,Math.min(3,Number(level)||0));opts=opts||{};if(!level&&!opts.always)return '';const w=lang();let h='<span class="detail-star-mark saku-stars lv-'+level+(opts.cls?' '+opts.cls:'')+'" role="img" aria-label="'+safeText(w.level+' '+level+' / 3')+'" title="'+safeText(w.level+' '+level+' / 3')+'">';for(let i=1;i<=3;i++)h+='<svg viewBox="0 0 24 24" aria-hidden="true" class="'+(i<=level?'on':'off')+'"><path d="'+STAR_PATH+'"/></svg>';return h+'</span>';}
window.sakuStarBadge=starBadge;
function render(container,id){if(!container)return;const old=container.querySelector('.card-levels');if(old)old.remove();const w=lang(),info=levelInfo(cardState,id);let el=document.createElement('section');el.className='card-levels';el.innerHTML='<h3>'+safeText(w.title)+'</h3>';if(!info.total){el.insertAdjacentHTML('beforeend','<p class="card-level-muted">'+safeText(w.missing)+'</p>');container.appendChild(el);return;}
 const L=info.level,next=L+1;
 let head='<div class="card-level-current">'+starBadge(L,{always:true,cls:'saku-stars-lg'})+'<div><strong>'+safeText(w.level+' '+L+' · '+w.names[L])+'</strong><small>'+info.spare+' '+safeText(w.dup)+'</small></div></div>';
 el.insertAdjacentHTML('beforeend',head);
 if(L<3){const row=document.createElement('div');row.className='card-level-next';row.innerHTML='<p>'+safeText(w.next)+' '+starBadge(next,{always:true})+' <span>'+info.need+' '+safeText(info.need===1?w.cost:w.costs)+'</span> <span class="card-level-xp">+'+xpFor(id)+' XP</span></p>';
  const btn=document.createElement('button');btn.type='button';btn.className='card-level-up';btn.textContent=working?w.progress:(w.upgrade+' → '+w.level+' '+next);btn.disabled=working||!info.canUpgrade;btn.addEventListener('click',e=>{e.stopPropagation();upgrade(id,L,container)});row.appendChild(btn);
  if(!info.canUpgrade&&!working)row.insertAdjacentHTML('beforeend','<small class="card-level-missing">'+safeText((info.need-info.spare===1?w.short:w.shortN).replace('{n}',String(info.need-info.spare)))+'</small>');el.appendChild(row);}
 else el.insertAdjacentHTML('beforeend','<p class="card-level-max">'+safeText(w.max)+'</p>');
 const extra=[1,2].filter(l=>l<L&&info.counts[l]).map(l=>'★'.repeat(l)+' × '+info.counts[l]);
 if(extra.length)el.insertAdjacentHTML('beforeend','<p class="card-level-muted">'+safeText(w.others)+' '+safeText(extra.join(' · '))+'</p>');
 container.appendChild(el);let box=container.closest('#cardsDetail,#encDetail');if(box&&window.sakuDetailStars)window.sakuDetailStars(box,id);
}
window.sakuCardLevelsRender=render;
async function upgrade(id,level,container){
 if(working||level<0||level>2)return;const actor=window.sakuSecureUserId;
 if(!actor||!window.sakuBackend){if(typeof showNotification==='function')showNotification('Connecte-toi pour améliorer cette carte.');return;}
 working=true;render(container,id);
 try{
  const res=await window.sakuBackend.upgradeCard(String(id),level);
  const gained=Number(res&&res.xp)||0;if(gained&&typeof showNotification==='function')showNotification(lang().gain.replace('{n}',String(gained)));
  if(gained&&typeof window.sakuProgressRefresh==='function')window.sakuProgressRefresh();
  const state=await window.sakuBackend.gameCollection();if(window.sakuSecureUserId!==actor)return;
  cardState=cardNormalize(state);if(currentAccount)currentAccount.cards=cardNormalize(state);
  if(typeof cardsRenderStats==='function')cardsRenderStats();if(typeof cardsRenderAlbum==='function'&&document.getElementById('collectionScreen')?.classList.contains('active'))cardsRenderAlbum();
  const dl=container.querySelector('dl');if(dl){const row=Array.from(dl.querySelectorAll('.card-detail-row')).find(x=>/collection|colección/i.test(x.textContent));if(row&&row.querySelector('dd'))row.querySelector('dd').textContent='× '+(cardState.cards[id]||0);}
 }catch(e){if(typeof showNotification==='function')showNotification(lang().error);}finally{working=false;if(container.isConnected)render(container,id);}
}

})();
