/* Sakugame — module branché sur Supabase (V1). Aucune écriture économique depuis le navigateur : tout passe par des fonctions serveur. */
(function(){'use strict';
const keys=['basic','strongest','retro','cinema'], names=['Basic','The Strongest','Retro','Cinéma'], $=id=>document.getElementById(id);
window.sakuInfiniteCoins=()=>false;
// Prix par défaut côté client (Basic et Retro : 200 x1 / 1000 x5)
const PORTAL_PRICE={[0]:{1:200,5:1000},[2]:{1:200,5:1000}};
let busy=false,pity={},pending=null,modal=null,session=null,fallTimer=0,revealTimer=0,autoTimer=0,freeDraws=0;
function updateFreeArtwork(){const stems=['basic','strongest','retro','cinema'];document.querySelectorAll('.summon-slide[data-index]').forEach(slide=>{const i=Number(slide.dataset.index),stem=stems[i];if(!stem)return;const freeSuffix=freeDraws>=5?'-free5':freeDraws>0?'-free':'';slide.querySelectorAll('.summon-machine-button img').forEach(img=>{const isStill=img.classList.contains('summon-still');const suffix=isStill&&i!==1?'-static':'';const src='summon-machines/'+stem+suffix+freeSuffix+'.svg';if(!img.src.endsWith('/'+src))img.src=src;});});}
window.sakuPortalFreeDraws=n=>{freeDraws=Math.max(0,Math.min(5,n||0));updateFreeArtwork()};
window.sakuPortalBuyFree=i=>{const n=Math.min(5,freeDraws);if(n>0){freeDraws-=n;window.sakuPortalFreeDraws(freeDraws);return n}return 0};
const lang=()=>((window.SAKU_I18N||{}).lang||'en');
const dict={fr:{buy:'Acheter',coins:'pièces',sign:'Connecte-toi pour invoquer.',funds:'Tu n’as pas assez de pièces.',error:'Impossible de terminer l’opération. Réessaie.',wait:'Une ouverture est déjà en attente.',resume:'Reprendre l’ouverture',click:'Clique sur le booster pour l’ouvrir',quick:'Ouverture rapide',later:'Plus tard',close:'Terminer',reveal:'Tout révéler',flip:'Clique sur les cartes pour les retourner',new:'NOUVEAU',packs:'boosters',cards:'cartes',invalid:'Ce portail n’est pas encore disponible.',loading:'Chargement des cartes…',earned:'Cartes ajoutées à ta collection',confirm:'Voir mes cartes'},en:{buy:'Buy',coins:'coins',sign:'Sign in to summon.',funds:'Not enough coins.',error:'Could not complete this action. Please try again.',wait:'An opening is already pending.',resume:'Resume opening',click:'Tap the booster to open it',quick:'Quick opening',later:'Later',close:'Done',reveal:'Reveal all',flip:'Tap cards to turn them over',new:'NEW',packs:'boosters',cards:'cards',invalid:'This portal is not available yet.',loading:'Loading cards…',earned:'Cards added to your collection',confirm:'See my cards'},es:{buy:'Comprar',coins:'monedas',sign:'Inicia sesión para invocar.',funds:'No tienes suficientes monedas.',error:'No se pudo completar la acción. Inténtalo de nuevo.',wait:'Ya hay una apertura pendiente.',resume:'Continuar la apertura',click:'Pulsa el sobre para abrirlo',quick:'Apertura rápida',later:'Más tarde',close:'Terminar',reveal:'Revelar todo',flip:'Pulsa las cartas para voltearlas',new:'NUEVO',packs:'sobres',cards:'cartas',invalid:'Este portal aún no está disponible.',loading:'Cargando cartas…',earned:'Cartas añadidas a tu colección',confirm:'Ver mis cartas'}};
const tr=k=>(dict[lang()]||dict.en)[k]||k,uid=()=>window.sakuSecureUserId||null;
function notice(k){if(typeof showNotification==='function')showNotification(tr(k));}
function safe(n){return Number.isSafeInteger(Number(n))&&Number(n)>=0?Number(n):0;}
function quick(){try{return localStorage.getItem('saku-portal-quick')==='1'}catch(e){return false}}
function setQuick(v){try{localStorage.setItem('saku-portal-quick',v?'1':'0')}catch(e){}}
function refreshDashboard(){if(window.portalDashboardRefresh)window.portalDashboardRefresh();}
window.sakuPortalPending=i=>!!pending&&pending.portal===i;
function sharedPity(p){if(p&&Number.isInteger(p.shared))return Math.min(399,safe(p.shared));return Math.min(399,Math.max(0,...keys.map(k=>safe(p&&p[k]))));}
window.sakuPortalPity=i=>uid()?sharedPity(pity):null;
function byRarity(pool){const bins={common:[],uncommon:[],rare:[],epic:[],legendary:[],mythic:[],special:[]};pool.forEach(c=>{if(bins[c.rarity])bins[c.rarity].push(c)});return bins;}
function drawTier(bins,i,r){let weights=window.sakuPortalRates[i],tiers=Object.keys(bins),total=weights.reduce((a,x,j)=>a+(bins[tiers[j]].length?x:0),0);if(!total)throw Error('empty pool');let n=r*total;for(let j=0;j<tiers.length;j++){if(!bins[tiers[j]].length)continue;n-=weights[j];if(n<0)return tiers[j];}return tiers.find(k=>bins[k].length);}
function choose(bin,r){return bin[Math.min(bin.length-1,Math.floor(r*bin.length))];}
function generate(i,count,start,specialStart,bins,randoms){
 let p=start,sp=Math.min(999,safe(specialStart)),packs=[],specialPortal=i===1||i===3;
 if(specialPortal&&!bins.special.length)throw Error('No special in pool');
 for(let b=0;b<count;b++){
  let next=p+1,nextSpecial=sp+(specialPortal?1:0),cards=[];
  for(let j=0;j<10;j++){let k=(b*10+j)*2,tier=drawTier(bins,i,randoms[k]);cards.push(choose(bins[tier],randoms[k+1]));}
  // Preserve a natural mythic when forcing a special, and vice versa.
  if(specialPortal&&nextSpecial>=1000&&!cards.some(c=>c.rarity==='special')){
   let at=cards.findLastIndex(c=>c.rarity!=='mythic');if(at<0)at=9;cards[at]=choose(bins.special,randoms[count*21+b]);
  }
  if(next>=400&&!cards.some(c=>c.rarity==='mythic')){
   if(!bins.mythic.length)throw Error('No mythic in pool');let at=cards.findLastIndex(c=>c.rarity!=='special');if(at<0)at=9;cards[at]=choose(bins.mythic,randoms[count*20+b]);
  }else if(next%50===0&&!cards.some(c=>['legendary','mythic','special'].includes(c.rarity))){
   if(!bins.legendary.length)throw Error('No legendary in pool');cards[9]=choose(bins.legendary,randoms[count*20+b]);
  }
  p=cards.some(c=>c.rarity==='mythic')?0:next;
  if(specialPortal)sp=cards.some(c=>c.rarity==='special')?0:nextSpecial;
  packs.push(cards.map(c=>({id:c.id,rarity:c.rarity})));
 }
 return{pity:p,specialPity:sp,packs};
}

// Les cartes sont attribuées au moment de la transaction serveur ; l’animation
// ne crédite jamais de cartes et une reprise rejoue le même identifiant.
function setServerResult(result){
 const i=keys.indexOf(result.portal);if(i<0||!Array.isArray(result.packs))throw Error('Réponse invalide');
 pity={shared:result.pity};pending={id:result.request_id,portal:i,count:result.packs.length,packs:result.packs,phase:'pack'};
 refreshDashboard();
}
async function refreshCollection(){
 const state=await window.sakuBackend.gameCollection();cardState=cardNormalize(state);
 if(currentAccount)currentAccount.cards=cardState;
 cardBuildPool();sakuIncludeOwnedCards();if(typeof cardsRenderStats==='function')cardsRenderStats();
}
async function enter(){
 if(!window.sakuBackend||!uid()){pity={};pending=null;refreshDashboard();return;}
 const who=uid();try{
  const fd=await window.sakuBackend.freeDraws();
  window.sakuPortalFreeDraws(fd);
  
  const request=await window.sakuBackend.pendingSummon();if(!request||who!==uid()){pending=null;refreshDashboard();return;}
  const result=await window.sakuBackend.summon(request.portal,request.count);if(who!==uid())return;
  setServerResult(result);await refreshCollection();openModal();
 }catch(e){console.warn('Reprise invocation',e);notice('error')}
}
window.sakuPortalSummonEnter=enter;
async function buy(i,n){
 if(![0,1,2,3].includes(i)||![1,5].includes(n)){notice('invalid');return}
 if(!window.sakuBackend||!uid()){notice('sign');if(typeof openAuthModal==='function')openAuthModal();return}
 if(busy)return;busy=true;const who=uid();
 try{
  if(window.sakuDataReady)await window.sakuDataReady;
  const result=await window.sakuBackend.summon(keys[i],n);if(who!==uid())return;
  if(Number.isInteger(result.free_remaining))window.sakuPortalFreeDraws(result.free_remaining);
  setServerResult(result);await refreshCollection();
  animateDrop(i,result.packs.length,()=>{if(uid()===who&&pending&&pending.id===result.request_id)openModal()});
 }catch(e){console.warn('Invocation sécurisée',e);notice(e&&e.message==='insufficient_coins'?'funds':'error')}finally{busy=false}}
window.sakuPortalBuy=buy;
function animateDrop(i,n,done){let slide=document.querySelector('.summon-slide[data-index="'+i+'"]');if(!slide){done();return}let tray=document.createElement('div');tray.className='portal-falling';tray.setAttribute('aria-hidden','true');for(let x=0;x<n;x++){let img=document.createElement('img');img.src='summon-machines/pack-'+keys[i]+'.png';img.style.setProperty('--pack-n',x);img.style.setProperty('--pack-total',n);tray.appendChild(img)}slide.appendChild(tray);clearTimeout(fallTimer);let ms=matchMedia('(prefers-reduced-motion: reduce)').matches?120:1250;fallTimer=setTimeout(()=>{tray.remove();done()},ms)}
function modalEl(){if(modal)return modal;modal=document.createElement('div');modal.id='portalOpenModal';modal.className='portal-open-modal';modal.hidden=true;modal.innerHTML='<div class="portal-open-panel" role="dialog" aria-modal="true" aria-labelledby="portalOpenTitle"><header><div><span>SAKUGAME / PORTALS</span><h2 id="portalOpenTitle"></h2></div><button type="button" class="portal-open-dismiss" aria-label="Close">×</button></header><div id="portalOpenBody"></div></div>';document.body.appendChild(modal);modal.querySelector('.portal-open-dismiss').onclick=closeModal;return modal;}
function closeModal(){if(!modal)return;clearTimeout(autoTimer);clearTimeout(revealTimer);modal.hidden=true;document.body.classList.remove('portal-modal-open');}
function openModal(){if(!pending||!uid())return;session=uid();let m=modalEl();m.hidden=false;document.body.classList.add('portal-modal-open');$('portalOpenTitle').textContent=names[pending.portal]+' · '+pending.count+' '+(pending.count===1?(lang()==='es'?'sobre':'booster'):tr('packs'));m.querySelector('.portal-open-panel').classList.toggle('portal-results-mode',pending.phase==='reveal');let body=$('portalOpenBody');body.innerHTML='';body.classList.remove('portal-automatic');if(pending.phase==='reveal'){renderResults(body);m.querySelector('.portal-open-panel').scrollTop=0;return}
 let text=document.createElement('p');text.className='portal-open-instruction';text.textContent=tr('click');body.appendChild(text);let button=document.createElement('button');button.className='portal-open-pack';button.type='button';button.setAttribute('aria-label',tr('click'));let src='summon-machines/pack-'+keys[pending.portal]+'.png';button.innerHTML='<span class="portal-pack-art"><img class="portal-pack-base" alt="" src="'+src+'"><img class="portal-pack-lid" alt="" src="'+src+'"><i class="portal-pack-flash"></i></span><span class="portal-pack-count">×'+pending.count+'</span>';button.onclick=()=>openPack(button);body.appendChild(button);
 let label=document.createElement('label');label.className='portal-quick';let input=document.createElement('input');input.type='checkbox';input.checked=quick();input.onchange=()=>{setQuick(input.checked);if(input.checked&&pending&&pending.phase==='reveal'&&uid()===session){clearTimeout(revealTimer);openModal()}};label.append(input,document.createTextNode(' '+tr('quick')));body.appendChild(label);let later=document.createElement('button');later.type='button';later.className='portal-later';later.textContent=tr('later');later.onclick=closeModal;body.appendChild(later);button.focus();}
async function openPack(btn){
 if(busy||!pending||uid()!==session)return;
 busy=true;btn.classList.add('opening');const who=uid(),id=pending.id;
 try{pending.phase='reveal';const delay=quick()||matchMedia('(prefers-reduced-motion: reduce)').matches?60:700;
  clearTimeout(revealTimer);revealTimer=setTimeout(()=>{if(uid()===who&&pending&&pending.id===id)openModal()},delay);
 }finally{busy=false}
}
/* The previous opening: one card on the central stage, first click turns
   it over, second click sends it to the tray and deals the next one. */
function viewKey(){return 'saku-portal-view-'+session+'-'+pending.id}
function saveView(v){try{localStorage.setItem(viewKey(),JSON.stringify(v))}catch(e){}}
function loadView(total){try{let v=JSON.parse(localStorage.getItem(viewKey())||'null');if(v&&Number.isInteger(v.index)&&v.index>=0&&v.index<=total)return {index:v.index,flipped:!!v.flipped}}catch(e){}return {index:0,flipped:false}}
function renderResults(body){
 let entries=pending.packs.flat(),pool=window.sakuPortalPool(pending.portal)||[],byId=new Map(pool.map(c=>[String(c.id),c])),view=loadView(entries.length);
 // The catalogue may change after purchase. Previously purchased cards still reveal normally.
 if(typeof ENCYCLOPEDIA!=='undefined'){const missing=new Set(entries.map(e=>String(e.id)).filter(id=>!byId.has(id)));if(missing.size)ENCYCLOPEDIA.list.forEach(g=>(g.cards||[]).forEach(c=>{const id=String(c.i);if(missing.has(id)){byId.set(id,{id:id,name:c.m,series:c.series||g.label,image:c.u,rarity:c.r,card:c});missing.delete(id)}}));}
 clearTimeout(autoTimer);
 let labels={fr:{turn:'Clique pour retourner',next:'Clique pour la carte suivante',last:'Clique pour voir le bilan',complete:'Ouverture terminée',auto:'Ouverture automatique',tray:'Contenu de l’ouverture',card:'Carte'},en:{turn:'Tap to reveal',next:'Tap for the next card',last:'Tap to see the results',complete:'Opening complete',auto:'Automatic opening',tray:'Opening contents',card:'Card'},es:{turn:'Pulsa para revelar',next:'Pulsa para la siguiente carta',last:'Pulsa para ver el resultado',complete:'Apertura completada',auto:'Apertura automática',tray:'Contenido de la apertura',card:'Carta'}};let L=labels[lang()]||labels.en;
 let instruction=document.createElement('p');instruction.className='portal-open-instruction portal-reveal-instruction';instruction.setAttribute('aria-live','polite');body.appendChild(instruction);
 let cb={checked:quick()};body.classList.toggle('portal-automatic',cb.checked);
 let done=document.createElement('button');done.className='portal-finish';done.type='button';done.textContent=tr('close');done.onclick=finish;done.disabled=true;body.appendChild(done);
 let scene=document.createElement('div');scene.className='portal-reveal-scene';body.appendChild(scene);
 let tray=document.createElement('section');tray.className='portal-reveal-tray';let title=document.createElement('h3'),slots=document.createElement('div');slots.className='portal-reveal-slots';tray.append(title,slots);body.appendChild(tray);
 function artwork(entry,mini){let c=byId.get(String(entry.id));if(!c)return '';let card=Object.assign({},c.card,{r:entry.rarity});return entry.rarity==='special'&&window.sakuStrongestCard?window.sakuStrongestCard(card,mini):window.sakuBasicCard(card,mini,{series:c.series,image:c.image});}
 function hydrate(node){node.querySelectorAll('image[data-saku-src]').forEach(im=>{im.setAttribute('href',im.getAttribute('data-saku-src'));im.removeAttribute('data-saku-src')})}
 function describe(){let complete=view.index>=entries.length;instruction.textContent=complete?L.complete:L.card+' '+(view.index+1)+' / '+entries.length+' · '+(cb.checked?L.auto:(view.flipped?(view.index===entries.length-1?L.last:L.next):L.turn));}
 function update(){let complete=view.index>=entries.length;describe();title.textContent=L.tray+' · '+view.index+' / '+entries.length;done.disabled=!complete;scene.innerHTML='';
  entries.forEach((entry,i)=>{let slot=slots.children[i];if(!slot){slot=document.createElement('div');slot.className='portal-reveal-slot';let b=document.createElement('b');b.textContent=i+1;slot.appendChild(b);slots.appendChild(slot)}if(i<view.index&&!slot.classList.contains('filled')){slot.classList.add('filled');slot.innerHTML=artwork(entry,true);hydrate(slot);slot.title=(byId.get(String(entry.id))||{}).name||''}});
  if(complete){let message=document.createElement('div');message.className='portal-reveal-complete';message.textContent=tr('earned');scene.appendChild(message);return}
  let entry=entries[view.index],record=byId.get(String(entry.id)),button=document.createElement('button');button.type='button';button.className='portal-reveal-card'+(view.flipped?' flipped':'');button.setAttribute('aria-label',view.flipped?L.next:L.turn);let inner=document.createElement('span');inner.className='portal-reveal-inner';let back=document.createElement('span'),front=document.createElement('span');back.className='portal-reveal-back';front.className='portal-reveal-front';back.innerHTML=record&&record.card&&record.card.edition==='hoshi'&&window.sakuHoshiBack?window.sakuHoshiBack():window.sakuRarityBack?window.sakuRarityBack(entry.rarity):(window.sakuBasicBack?window.sakuBasicBack():'');back.dataset.rarity=entry.rarity;front.innerHTML=artwork(entry,false);hydrate(front);if(entry.isNew){let tag=document.createElement('b');tag.className='portal-result-new';tag.textContent=tr('new');front.appendChild(tag)}inner.append(back,front);button.appendChild(inner);button.onclick=()=>{if(cb.checked)return;advance();};function advance(){if(!view.flipped){view.flipped=true;saveView(view);button.classList.add('flipped');describe();button.setAttribute('aria-label',view.index===entries.length-1?L.last:L.next)}else{view.index++;view.flipped=false;saveView(view);update();let next=scene.querySelector('button');if(next&&!cb.checked)next.focus({preventScroll:true})}}button.__advance=advance;scene.appendChild(button);
 }
 function scheduleAuto(){clearTimeout(autoTimer);if(!cb.checked||view.index>=entries.length||!modal||modal.hidden||uid()!==session)return;let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;autoTimer=setTimeout(()=>{let card=scene.querySelector('.portal-reveal-card');if(!card||!cb.checked)return;card.__advance();scheduleAuto()},reduced?45:(view.flipped?220:140));}
 update();if(cb.checked)scheduleAuto();
}
async function finish(){
 if(busy||!pending||uid()!==session)return;busy=true;const who=uid(),id=pending.id;
 try{await window.sakuBackend.acknowledgeSummon(id);if(who!==uid())return;
  try{localStorage.removeItem(viewKey())}catch(e){}pending=null;refreshDashboard();closeModal();
 }catch(e){console.warn('Fin invocation',e);notice('error')}finally{busy=false}
}
window.sakuPortalResume=()=>{if(pending)openModal();else enter()};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal&&!modal.hidden){e.preventDefault();closeModal()}});
})();
