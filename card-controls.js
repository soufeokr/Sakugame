/* Sakugame — module branché sur Supabase (V1). Aucune écriture économique depuis le navigateur : tout passe par des fonctions serveur. */
(function(){'use strict';let busy=false;
const icons={wishlist:'<path d="M20.8 4.9c-1.8-1.9-4.8-1.8-6.6 0L12 7.1 9.8 4.9a4.7 4.7 0 0 0-6.6 6.7L12 20l8.8-8.4a4.7 4.7 0 0 0 0-6.7Z"/>',favorite:'<path d="m12 2.8 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.4l6.2-.9Z"/>',locked:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>'};
const labels={fr:{wishlist:'Wishlist',favorite:'Favori de collection',locked:'Verrouiller la carte',unlock:'Déverrouiller la carte',blocked:'Annule d’abord les offres ou échanges en cours pour cette carte.',error:'Impossible de modifier cette option.',own:'Il faut posséder cette carte.'},en:{wishlist:'Wishlist',favorite:'Collection favorite',locked:'Lock card',unlock:'Unlock card',blocked:'Cancel active listings or outgoing trades for this card first.',error:'Could not update this setting.',own:'You must own this card.'},es:{wishlist:'Lista de deseos',favorite:'Favorito de colección',locked:'Bloquear carta',unlock:'Desbloquear carta',blocked:'Cancela primero las ventas o intercambios activos de esta carta.',error:'No se pudo actualizar.',own:'Debes tener esta carta.'}};
const L=()=>labels[(window.SAKU_I18N||{}).lang]||labels.en;
function flags(st,id){return ((st&&st.flags||{})[id]||{});}
window.sakuCardFlags=flags;
function stars(box,id){let art=box.querySelector('.ac-detail-card,.enc-detail-card');if(!art)return;let counts=window.sakuCardLevelCounts(cardState,id),lv=[3,2,1].find(k=>counts[k])||0;let text=art.querySelector('.chud');if(text)text.textContent='★'.repeat(lv);let old=art.querySelector('.detail-star-mark');if(old)old.remove();if(!text&&lv){let mark=document.createElement('span');mark.className='detail-star-mark';mark.textContent='★'.repeat(lv);art.appendChild(mark);}}
window.sakuDetailStars=stars;
function draw(box,id,context){stars(box,id);let previous=box.querySelector('.card-detail-actions');if(previous)previous.remove();let host=box.querySelector('.card-detail-panel')||box;let bar=document.createElement('div');bar.className='card-detail-actions '+(context==='encyclopedia'?'encyclopedia-actions':'');const state=flags(cardState,id),own=Number((cardState&&cardState.cards||{})[id])>0;
 (context==='collection'?['wishlist','locked','favorite']:['wishlist']).forEach(k=>{let b=document.createElement('button');b.type='button';b.dataset.flag=k;b.className='detail-action';b.setAttribute('aria-pressed',state[k]?'true':'false');b.disabled=busy||(k!=='wishlist'&&!own);let title=k==='locked'&&state[k]?L().unlock:L()[k];b.setAttribute('aria-label',title);b.title=title;b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+icons[k]+'</svg>';b.onclick=e=>{e.stopPropagation();toggle(id,k,box,context)};bar.appendChild(b)});host.appendChild(bar);
}
window.sakuDetailControls=draw;
window.sakuAppendWishlist=function(tile,id){if(!tile)return;id=String(id);const b=document.createElement('button');b.type='button';b.className='quick-wish';b.dataset.id=id;b.setAttribute('aria-label',L().wishlist);b.setAttribute('aria-pressed',flags(cardState,id).wishlist?'true':'false');b.title=L().wishlist;b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+icons.wishlist+'</svg>';b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggle(id,'wishlist',null,'quick')});b.addEventListener('keydown',e=>e.stopPropagation());tile.appendChild(b);};

async function toggle(id,key,box,context){
 if(busy)return;const actor=window.sakuSecureUserId;if(!actor||!window.sakuBackend){if(typeof showNotification==='function')showNotification('Connecte-toi pour modifier cette option.');return;}
 busy=true;if(box)draw(box,id,context);let why='error';
 try{
  await window.sakuBackend.setCardOption(String(id),key,!flags(cardState,id)[key]);
  const state=await window.sakuBackend.gameCollection();if(window.sakuSecureUserId!==actor)return;
  cardState=cardNormalize(state);if(currentAccount)currentAccount.cards=cardNormalize(state);
  if(window.portalDashboardRefresh)window.portalDashboardRefresh();
  if(key==='wishlist'&&document.getElementById('encWishlistOnly')?.checked&&typeof encRender==='function')encRender(true);
  if(key==='favorite'&&document.getElementById('cardsFavoriteOnly')?.checked&&typeof cardsRenderAlbum==='function')cardsRenderAlbum();
 }catch(e){if(e&&e.message==='active_listing')why='blocked';else if(e&&e.message==='card_unavailable')why='own';if(typeof showNotification==='function')showNotification(L()[why]);}
 finally{busy=false;if(box&&box.isConnected&&box.classList.contains('show'))draw(box,id,context);document.querySelectorAll('.quick-wish').forEach(b=>{if(b.dataset.id===String(id))b.setAttribute('aria-pressed',flags(cardState,id).wishlist?'true':'false')});}
}

})();
