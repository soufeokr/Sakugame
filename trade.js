/* Sakugame — échanges directs entre joueurs.
   • Composer : ouvert depuis la vitrine d'un autre joueur (bouton « Proposer un échange »).
   • « Mes affaires » (onglet du marché) : propositions reçues / envoyées, ventes en cours, historique.
   Toute la logique sensible (réservation, limites par paire, transfert) est côté serveur (migration 295). */
(function(){'use strict';
const $=id=>document.getElementById(id), tr=s=>typeof t==='function'?t(s):s;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const L3=(fr,en,es)=>({fr,en,es}[(window.SAKU_I18N||{}).lang]||en);
const M=()=>window.sakuMarket||null, uid=()=>window.sakuSecureUserId||null;
const LIMITS={special:1,mythic:3,legendary:15}, MAX_SIDE=5;
const RAR=['common','uncommon','rare','epic','legendary','mythic','special'];
const RAR_COL={common:'#cfd6df',uncommon:'#3fd69a',rare:'#3fb8f0',epic:'#a07cf5',legendary:'#f2a93b',mythic:'#f28ab0',special:'#e8c469'};
const rarName=r=>M()?M().rarName(r):r;
const CODES={
 trade_self:()=>L3("Tu ne peux pas échanger avec toi-même.","You can't trade with yourself.","No puedes intercambiar contigo mismo."),
 trade_size:()=>L3("Choisis entre 1 et 5 cartes de chaque côté.","Pick between 1 and 5 cards on each side.","Elige entre 1 y 5 cartas de cada lado."),
 trade_too_many:()=>L3("Trop de propositions en attente : 10 au total et 3 par joueur au maximum.","Too many pending proposals: at most 10 in total and 3 per player.","Demasiadas propuestas pendientes: 10 en total y 3 por jugador como máximo."),
 trade_not_shown:()=>L3("Tu ne peux demander que des cartes exposées dans sa vitrine.","You can only request cards shown in their showcase.","Solo puedes pedir cartas expuestas en su vitrina."),
 trade_closed:()=>L3("Cette proposition n'est plus en attente.","This proposal is no longer pending.","Esta propuesta ya no está pendiente."),
 trade_want_locked:()=>L3("Une des cartes demandées est verrouillée dans ta collection : déverrouille-la pour accepter.","One of the requested cards is locked in your collection: unlock it to accept.","Una de las cartas pedidas está bloqueada en tu colección: desbloquéala para aceptar."),
 trade_want_missing:()=>L3("Tu ne possèdes plus toutes les cartes demandées.","You no longer own all the requested cards.","Ya no tienes todas las cartas pedidas."),
 unavailable:()=>L3("Échange impossible avec ce joueur.","Exchange unavailable with this player.","Intercambio imposible con este jugador."),
 pair_limit:()=>L3("Limite atteinte avec ce joueur : sur 14 jours, deux comptes peuvent s'échanger au plus 1 spéciale, 3 mythiques et 15 légendaires (ventes du marché comprises).","Limit reached with this player: over 14 days, two accounts can exchange at most 1 special, 3 mythic and 15 legendary cards (market sales included).","Límite alcanzado con este jugador: en 14 días, dos cuentas pueden intercambiar como máximo 1 especial, 3 míticas y 15 legendarias (ventas del mercado incluidas)."),
 card_locked:()=>L3("Cette carte est verrouillée.","This card is locked.","Esta carta está bloqueada."),
 card_unavailable:()=>L3("Tu ne possèdes plus cette carte.","You no longer own this card.","Ya no tienes esta carta."),
 not_found:()=>L3("Proposition introuvable.","Proposal not found.","Propuesta no encontrada."),
 catalog_invalid:()=>L3("Carte inconnue.","Unknown card.","Carta desconocida.")
};
function errText(e){const raw=String(e&&e.message||e||'').trim();if(CODES[raw])return CODES[raw]();if(/auth session|jwt|not_authenticated|refresh token|session missing|Connexion requise/i.test(raw))return L3('Ta session a expiré : reconnecte-toi.','Your session expired — sign in again.','Tu sesión ha caducado: vuelve a conectarte.');return raw||L3('Action impossible.','Action failed.','Acción imposible.');}
function card(id){const m=M();return m?m.card(String(id)):null;}
function art(c,level){const m=M();if(!m||!c)return '';return m.image(Object.assign({},c,{marketLevel:level||0}));}
function stars(l){l=Number(l)||0;return l?'★'.repeat(l):'';}
function sfx(k){try{if(window.SakuSfx)window.SakuSfx.play(k);}catch(e){}}

/* ---------- Toast ---------- */
let toastTimer=0;
function toast(text,bad){let el=$('tradeToast');if(!el){el=document.createElement('div');el.id='tradeToast';el.className='trade-toast';el.setAttribute('role','status');document.body.appendChild(el);}el.textContent=text;el.classList.toggle('bad',!!bad);el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),4200);}

/* ---------- Composer ---------- */
let target=null,give=[],want=[],pick='mine',rar='all',query='',sending=false;
function owned(){const s=typeof cardState!=='undefined'&&cardState?cardState:null;return s;}
function isLocked(s,id){return !!(s&&s.flags&&s.flags[id]&&s.flags[id].locked);}
function giveQty(id,level){const g=give.find(x=>x.id===id&&x.level===level);return g?g.qty:0;}
function mineItems(){const s=owned();if(!s||!s.cards)return [];const out=[];Object.keys(s.cards).forEach(id=>{if(!(Number(s.cards[id])>0)||isLocked(s,id))return;const c=card(id);if(!c)return;window.sakuCardLevelCounts(s,id).forEach((n,level)=>{if(n>0)out.push({c,level,count:n});});});return out;}
function theirItems(){return (target&&Array.isArray(target.cards)?target.cards:[]).map(x=>{const c=card(x.id);return c?{c:Object.assign({},c,{rarity:c.rarity||x.rarity}),level:null,count:1}:null;}).filter(Boolean);}
function rarityCounts(){const n={};give.forEach(g=>{const c=card(g.id);if(c)n[c.rarity]=(n[c.rarity]||0)+g.qty;});want.forEach(w=>{const c=card(w.id);if(c)n[c.rarity]=(n[c.rarity]||0)+1;});return n;}
function overLimit(){const n=rarityCounts();return Object.keys(LIMITS).some(r=>(n[r]||0)>LIMITS[r]);}
function slotHtml(side,item,i){
 if(!item)return '<div class="trade-slot empty"><span>'+(i+1)+'</span></div>';
 const c=card(item.id);if(!c)return '';
 const lv=side==='give'?item.level:0,label=side==='give'?(item.level?stars(item.level):L3('Niv. 0','Lv. 0','Niv. 0')):L3('Plus bas niveau','Lowest level','Nivel más bajo');
 return '<div class="trade-slot" style="--r:'+(RAR_COL[c.rarity]||'#cfd6df')+'"><span class="trade-slot-art">'+art(c,lv)+(item.qty>1?'<b class="trade-qty">× '+item.qty+'</b>':'')+'</span><span class="trade-slot-name" data-noi18n>'+esc(c.name)+'</span><small>'+esc(label)+'</small><button type="button" class="trade-slot-x" data-remove="'+side+'" data-i="'+i+'" aria-label="'+esc(L3('Retirer','Remove','Quitar'))+'">−</button></div>';
}
function renderSlots(){
 const gs=$('tradeGiveSlots'),ws=$('tradeWantSlots');
 gs.innerHTML=Array.from({length:MAX_SIDE},(_,i)=>slotHtml('give',give[i],i)).join('');
 ws.innerHTML=Array.from({length:MAX_SIDE},(_,i)=>slotHtml('want',want[i],i)).join('');
 const n=rarityCounts();
 $('tradeLimits').innerHTML='<span class="trade-limits-label">'+esc(L3('Limites entre vous deux sur 14 jours','Limits between you two over 14 days','Límites entre vosotros en 14 días'))+'</span>'+Object.keys(LIMITS).map(r=>{const v=n[r]||0;return '<span class="trade-limit'+(v>LIMITS[r]?' over':v?' used':'')+'" style="--r:'+RAR_COL[r]+'"><i></i>'+esc(rarName(r))+' <b>'+v+' / '+LIMITS[r]+'</b></span>';}).join('')+'<small>'+esc(L3('Ventes du marché et échanges déjà faits avec ce joueur comptent aussi.','Market sales and past exchanges with this player count too.','Las ventas del mercado y los intercambios ya hechos con este jugador también cuentan.'))+'</small>';
 const ok=give.length>0&&want.length>0&&!overLimit();$('tradeSend').disabled=!ok||sending;
 if(window.sakuBasicObserve){window.sakuBasicObserve(gs);window.sakuBasicObserve(ws);}
}
function renderGrid(){
 const grid=$('tradeGrid'),items=pick==='mine'?mineItems():theirItems(),q=query.trim().toLocaleLowerCase(),counts={all:0},list=[];
 items.forEach(it=>{if(q&&!(it.c.name+' '+it.c.series).toLocaleLowerCase().includes(q))return;counts.all++;counts[it.c.rarity]=(counts[it.c.rarity]||0)+1;if(rar==='all'||it.c.rarity===rar)list.push(it);});
 const rk=c=>RAR.indexOf(c.rarity);list.sort((a,b)=>rk(b.c)-rk(a.c)||(b.level||0)-(a.level||0)||String(a.c.name).localeCompare(String(b.c.name)));
 $('tradeRarities').innerHTML=['all'].concat(RAR.filter(r=>counts[r])).map(r=>'<button type="button" data-rar="'+r+'" aria-pressed="'+(rar===r)+'"'+(r==='all'?'':' style="--r:'+RAR_COL[r]+'"')+'>'+(r==='all'?esc(L3('Toutes','All','Todas')):'<i></i>'+esc(rarName(r)))+'<b>'+(counts[r]||0)+'</b></button>').join('');
 document.querySelectorAll('#tradeDialog [data-pick]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.pick===pick)));
 if(!list.length){grid.innerHTML='<p class="trade-empty">'+esc(pick==='mine'?(q||rar!=='all'?L3('Aucune carte ne correspond.','No card matches.','Ninguna carta coincide.'):L3('Aucune carte échangeable : les cartes verrouillées ne peuvent pas être proposées.','No tradable card: locked cards cannot be offered.','Ninguna carta intercambiable: las cartas bloqueadas no se pueden ofrecer.')):(theirItems().length?L3('Aucune carte ne correspond.','No card matches.','Ninguna carta coincide.'):L3("Ce joueur n'expose aucune carte dans sa vitrine pour l'instant.","This player isn't showing any card in their showcase yet.","Este jugador aún no expone ninguna carta en su vitrina.")))+'</p>';return;}
 grid.innerHTML=list.slice(0,120).map(it=>{
  const id=String(it.c.id);let sel=0,left=it.count,disabled=false;
  if(pick==='mine'){sel=giveQty(id,it.level);left=it.count-sel;disabled=left<1||sel>=5||(!sel&&give.length>=MAX_SIDE);}
  else{sel=want.some(w=>w.id===id)?1:0;disabled=!sel&&want.length>=MAX_SIDE;}
  return '<button type="button" class="trade-tile'+(sel?' picked':'')+'" data-id="'+esc(id)+'" data-level="'+(it.level==null?'':it.level)+'"'+(disabled&&!(pick==='theirs'&&sel)?' disabled':'')+' style="--r:'+(RAR_COL[it.c.rarity]||'#cfd6df')+'" aria-pressed="'+(!!sel)+'" aria-label="'+esc(it.c.name+' · '+rarName(it.c.rarity)+(it.level?' · '+stars(it.level):''))+'"><span class="trade-tile-art">'+art(it.c,it.level||0)+(pick==='mine'?'<span class="trade-tile-count">× '+left+'</span>':'')+(sel?'<span class="trade-tile-check">'+(pick==='mine'&&sel>1?'× '+sel:'✓')+'</span>':'')+'</span><span class="trade-tile-foot"><i></i><span data-noi18n>'+esc(it.c.name)+'</span></span></button>';
 }).join('');
 if(window.sakuBasicObserve)window.sakuBasicObserve(grid);
}
function renderAll(){renderSlots();renderGrid();}
async function openComposer(data){
 if(!data||!data.id)return;
 if(!uid()){toast(L3('Connecte-toi pour proposer un échange.','Sign in to propose an exchange.','Inicia sesión para proponer un intercambio.'),true);return;}
 target={id:String(data.id),name:String(data.name||tr('Player')).slice(0,60),cards:Array.isArray(data.cards)?data.cards.slice(0,10):[]};
 give=[];want=[];pick=target.cards.length?'theirs':'mine';rar='all';query='';sending=false;
 $('tradeWith').textContent=L3('Avec ','With ','Con ')+target.name;$('tradeSearch').value='';$('tradeMessage').value='';$('tradeError').textContent='';
 const d=$('tradeDialog');if(!d.open)d.showModal();renderAll();
 // Collection fraîche (les réservations du marché ont pu changer les quantités).
 try{if(window.sakuBackend&&typeof cardNormalize==='function'){const cards=await window.sakuBackend.gameCollection();if(d.open&&uid()){cardState=cardNormalize(cards);if(typeof currentAccount!=='undefined'&&currentAccount)currentAccount.cards=cardState;renderAll();}}}catch(e){}
}
async function send(){
 if(sending||!target)return;
 if(!give.length||!want.length){$('tradeError').textContent=CODES.trade_size();return;}
 if(overLimit()){$('tradeError').textContent=CODES.pair_limit();return;}
 sending=true;$('tradeSend').disabled=true;$('tradeError').textContent='';$('tradeSend').textContent=L3('Envoi…','Sending…','Enviando…');
 try{
  await window.sakuBackend.tradePropose(target.id,give.map(g=>({card:g.id,level:g.level,qty:g.qty})),want.map(w=>({card:w.id,qty:1})),$('tradeMessage').value.trim().slice(0,200));
  $('tradeDialog').close();sfx('coin');toast(L3('Proposition envoyée à ','Proposal sent to ','Propuesta enviada a ')+target.name+L3(' — suis-la dans Marché › Mes affaires.',' — follow it in Market › My deals.',' — síguela en Mercado › Mis negocios.'));
  try{if(typeof cardNormalize==='function'){const cards=await window.sakuBackend.gameCollection();cardState=cardNormalize(cards);if(typeof currentAccount!=='undefined'&&currentAccount)currentAccount.cards=cardState;}}catch(e){}
 }catch(e){$('tradeError').textContent=errText(e);sfx('wrong');}
 finally{sending=false;$('tradeSend').textContent=L3('Envoyer la proposition','Send proposal','Enviar la propuesta');renderSlots();}
}

/* ---------- Mes affaires ---------- */
let deals=[],dealsListings=[],dealsToken=0,confirmId=null,dealBusy=false;
function relTime(iso){const ms=Date.parse(iso)-Date.now();if(!(ms>0))return L3('expire bientôt','expiring','caduca pronto');const h=Math.ceil(ms/3600000);return h>=48?L3('expire dans '+Math.ceil(h/24)+' j','expires in '+Math.ceil(h/24)+' d','caduca en '+Math.ceil(h/24)+' d'):L3('expire dans '+h+' h','expires in '+h+' h','caduca en '+h+' h');}
function ago(iso){const d=new Date(iso);if(isNaN(d))return '';try{return d.toLocaleDateString((window.SAKU_I18N||{}).lang||'en',{day:'numeric',month:'short'});}catch(e){return d.toISOString().slice(0,10);}}
function thumbs(items,side){return '<div class="deal-cards">'+(items||[]).map(it=>{const c=card(it.card);const nm=c?c.name:it.card;const lvl=it.level==null?null:Number(it.level);return '<span class="deal-card" style="--r:'+(RAR_COL[(c&&c.rarity)||it.rarity]||'#cfd6df')+'" title="'+esc(nm+(lvl?' '+stars(lvl):''))+'"><span class="deal-card-art">'+(c?art(c,lvl||0):'')+(Number(it.qty)>1?'<b class="trade-qty">× '+Number(it.qty)+'</b>':'')+'</span><span class="deal-card-name" data-noi18n>'+esc(nm)+'</span>'+(side==='want'&&lvl==null?'':'<small>'+esc(lvl?stars(lvl):L3('Niv. 0','Lv. 0','Niv. 0'))+'</small>')+'</span>';}).join('')+'</div>';}
const STATE_LABEL={accepted:()=>L3('Accepté','Accepted','Aceptado'),declined:()=>L3('Refusé','Declined','Rechazado'),cancelled:()=>L3('Annulé','Cancelled','Cancelado'),expired:()=>L3('Expiré','Expired','Caducado'),pending:()=>L3('En attente','Pending','Pendiente')};
function dealHtml(x){
 const inc=!!x.incoming,mineSide=inc?x.want:x.give,theirSide=inc?x.give:x.want;
 let actions='';
 if(x.state==='pending'){
  if(inc)actions=confirmId===x.id?'<button type="button" class="market-subtle" data-deal="back" data-id="'+esc(x.id)+'">'+esc(L3('Retour','Back','Volver'))+'</button><button type="button" class="market-button deal-confirm" data-deal="accept" data-id="'+esc(x.id)+'">'+esc(L3("Confirmer l'échange","Confirm exchange","Confirmar intercambio"))+'</button>':'<button type="button" class="market-subtle" data-deal="decline" data-id="'+esc(x.id)+'">'+esc(L3('Refuser','Decline','Rechazar'))+'</button><button type="button" class="market-button" data-deal="ask" data-id="'+esc(x.id)+'">'+esc(L3('Accepter','Accept','Aceptar'))+'</button>';
  else actions='<button type="button" class="market-subtle" data-deal="cancel" data-id="'+esc(x.id)+'">'+esc(L3('Annuler la proposition','Cancel proposal','Cancelar la propuesta'))+'</button>';
 }
 const meta=x.state==='pending'?relTime(x.expires_at):(STATE_LABEL[x.state]?STATE_LABEL[x.state]():x.state)+' · '+ago(x.closed_at||x.created_at);
 return '<article class="deal deal-'+esc(x.state)+(inc?' deal-in':' deal-out')+'">'
  +'<header class="deal-head"><button type="button" class="deal-who" data-deal="profile" data-id="'+esc(x.other)+'"><span class="deal-avatar" aria-hidden="true">'+esc(String(x.other_name||'?').trim().charAt(0).toUpperCase()||'?')+'</span><span><b data-noi18n>'+esc(x.other_name||tr('Player'))+'</b><small>'+esc(inc?L3('te propose un échange','offers you an exchange','te propone un intercambio'):L3('ta proposition','your proposal','tu propuesta'))+'</small></span></button><span class="deal-state">'+esc(meta)+'</span></header>'
  +(x.message?'<p class="deal-msg" data-noi18n>« '+esc(x.message)+' »</p>':'')
  +'<div class="deal-body"><div class="deal-side deal-get"><h4>'+esc(L3('Tu reçois','You receive','Recibes'))+'</h4>'+thumbs(theirSide,inc?'give':'want')+'</div><div class="deal-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 7h12m0 0-4-4m4 4-4 4M17 17H5m0 0 4 4m-4-4 4-4"/></svg></div><div class="deal-side deal-give"><h4>'+esc(L3('Tu donnes','You give','Das'))+'</h4>'+thumbs(mineSide,inc?'want':'give')+'</div></div>'
  +(x.state==='pending'&&inc?'<p class="deal-hint">'+esc(confirmId===x.id?L3("Les cartes seront échangées immédiatement. Pour chaque carte demandée, ton exemplaire de plus bas niveau est donné.","The cards will be exchanged immediately. For each requested card, your lowest-level copy is given.","Las cartas se intercambiarán de inmediato. Por cada carta pedida, se da tu ejemplar de nivel más bajo."):L3('Ton exemplaire de plus bas niveau sera donné pour chaque carte demandée.','Your lowest-level copy is given for each requested card.','Se da tu ejemplar de nivel más bajo por cada carta pedida.'))+'</p>':'')
  +(actions?'<footer class="deal-actions">'+actions+'</footer>':'')+'</article>';
}
function listingHtml(l){const c=card(l.cardId),m=M();if(!c)return '';const auction=l.type==='auction';return '<article class="deal-listing" style="--r:'+(RAR_COL[c.rarity]||'#cfd6df')+'"><span class="deal-card-art">'+art(c,l.cardLevel||0)+'</span><div><b data-noi18n>'+esc(c.name)+'</b><small>'+esc(auction?(l.bid?L3('Enchère : ','Auction: ','Subasta: ')+m.nf(l.price):L3('Enchère sans offre · ','Auction, no bid · ','Subasta sin oferta · ')+m.nf(l.price)):L3('Prix fixe : ','Fixed price: ','Precio fijo: ')+m.nf(l.price))+'</small></div>'+(auction&&l.bid?'':'<button type="button" class="market-subtle" data-deal="unlist" data-id="'+esc(l.id)+'">'+esc(L3('Retirer','Withdraw','Retirar'))+'</button>')+'</article>';}
function empty(text){return '<p class="deals-empty">'+esc(text)+'</p>';}
function renderDeals(){
 if(!$('marketDeals'))return;
 const inc=deals.filter(x=>x.state==='pending'&&x.incoming),out=deals.filter(x=>x.state==='pending'&&!x.incoming),hist=deals.filter(x=>x.state!=='pending');
 $('dealsIncoming').innerHTML=inc.length?inc.map(dealHtml).join(''):empty(L3('Aucune proposition reçue pour le moment.','No proposal received yet.','Aún no has recibido propuestas.'));
 $('dealsOutgoing').innerHTML=out.length?out.map(dealHtml).join(''):empty(L3("Tu n'as envoyé aucune proposition en attente.","You have no pending proposal sent.","No tienes propuestas enviadas pendientes."));
 $('dealsListings').innerHTML=dealsListings.length?dealsListings.map(listingHtml).join(''):empty(L3("Aucune carte en vente.","No card for sale.","Ninguna carta en venta."));
 $('dealsHistory').innerHTML=hist.length?hist.map(dealHtml).join(''):empty(L3('Rien sur les 30 derniers jours.','Nothing in the last 30 days.','Nada en los últimos 30 días.'));
 const cnt=(id,n)=>{const el=$(id);if(el)el.textContent=n?String(n):'';};cnt('dealsInCount',inc.length);cnt('dealsOutCount',out.length);cnt('dealsListCount',dealsListings.length);cnt('dealsHistCount',hist.length);
 $('dealsStats').innerHTML=[[inc.length,L3('reçues','received','recibidas')],[out.length,L3('envoyées','sent','enviadas')],[dealsListings.length,L3('en vente','for sale','en venta')]].map(([n,l])=>'<span><b>'+n+'</b>'+esc(l)+'</span>').join('');
 setBadge(inc.length);
 if(window.sakuBasicObserve)window.sakuBasicObserve($('marketDeals'));
}
async function refreshDeals(listings){
 if(Array.isArray(listings))dealsListings=listings;
 if(!uid()||!window.sakuBackend||!window.sakuBackend.tradeList)return;
 const token=++dealsToken;if(!deals.length)$('dealsIncoming').innerHTML=empty(L3('Chargement…','Loading…','Cargando…'));
 try{const list=await window.sakuBackend.tradeList();if(token!==dealsToken)return;deals=Array.isArray(list)?list:[];renderDeals();}
 catch(e){if(token===dealsToken){renderDeals();if(M())M().msg(errText(e),true);}}
}
async function dealAction(kind,id){
 if(dealBusy)return;
 if(kind==='profile'){if(window.showShowcase)window.showShowcase(id);return;}
 if(kind==='ask'){confirmId=id;renderDeals();return;}
 if(kind==='back'){confirmId=null;renderDeals();return;}
 if(kind==='unlist'){if(M())await M().cancelListing(id);return;}
 dealBusy=true;document.querySelectorAll('#marketDeals [data-deal]').forEach(b=>{if(b.dataset.id===id)b.disabled=true;});
 try{
  let res;
  if(kind==='accept')res=await window.sakuBackend.tradeRespond(id,true);
  else if(kind==='decline')res=await window.sakuBackend.tradeRespond(id,false);
  else if(kind==='cancel')res=await window.sakuBackend.tradeCancel(id);
  confirmId=null;
  const st=res&&res.state;
  const text=st==='accepted'?L3('Échange conclu ! Les cartes sont dans ta collection.','Exchange done! The cards are in your collection.','¡Intercambio hecho! Las cartas están en tu colección.'):st==='expired'?L3('Cette proposition avait expiré : les cartes ont été rendues.','This proposal had expired: the cards were returned.','Esta propuesta había caducado: se devolvieron las cartas.'):kind==='decline'?L3('Proposition refusée.','Proposal declined.','Propuesta rechazada.'):L3('Proposition annulée : tes cartes sont revenues dans ta collection.','Proposal cancelled: your cards are back in your collection.','Propuesta cancelada: tus cartas han vuelto a tu colección.');
  sfx(st==='accepted'?'reward':'tap');
  dealBusy=false;
  if(M())await M().refresh();await refreshDeals();if(M())M().msg(text,false);
  if(window.sakuProgressRefresh)window.sakuProgressRefresh();
 }catch(e){dealBusy=false;if(M())M().msg(errText(e),true);sfx('wrong');await refreshDeals();}
 finally{dealBusy=false;}
}

/* ---------- Badge (propositions reçues en attente) ---------- */
let badgeUser=null,badgeAt=0;
function setBadge(n){['marketDealsBadge','tradeNavBadge'].forEach(id=>{const b=$(id);if(b){b.hidden=!n;b.textContent=n>9?'9+':String(n);}});}
async function pollBadge(force){
 const me=uid();if(!me||!window.sakuBackend||!window.sakuBackend.tradePendingCount){if(badgeUser){badgeUser=null;deals=[];setBadge(0);}return;}
 if(!force&&me===badgeUser&&Date.now()-badgeAt<90000)return;
 if(document.hidden&&!force&&me===badgeUser)return;
 badgeUser=me;badgeAt=Date.now();
 try{setBadge(await window.sakuBackend.tradePendingCount());}catch(e){}
}

window.sakuTradeOpen=openComposer;
window.sakuDealsRefresh=refreshDeals;
window.sakuDealsRender=listings=>{if(Array.isArray(listings))dealsListings=listings;renderDeals();};

document.addEventListener('DOMContentLoaded',()=>{
 const d=$('tradeDialog');if(!d)return;
 $('tradeClose').addEventListener('click',()=>d.close());
 d.addEventListener('click',e=>{if(e.target===d){d.close();return;}
  const p=e.target.closest('[data-pick]');if(p){pick=p.dataset.pick;rar='all';renderGrid();return;}
  const r=e.target.closest('[data-rar]');if(r){rar=r.dataset.rar;renderGrid();return;}
  const x=e.target.closest('[data-remove]');if(x){const i=Number(x.dataset.i);if(x.dataset.remove==='give'){const g=give[i];if(g){g.qty--;if(g.qty<1)give.splice(i,1);}}else want.splice(i,1);sfx('tap');renderAll();return;}
  const tile=e.target.closest('.trade-tile');if(tile&&!tile.disabled){const id=tile.dataset.id;
   if(pick==='mine'){const level=Number(tile.dataset.level)||0,item=mineItems().find(it=>String(it.c.id)===id&&it.level===level);if(!item)return;const g=give.find(x=>x.id===id&&x.level===level);if(g){if(g.qty<Math.min(5,item.count))g.qty++;}else if(give.length<MAX_SIDE)give.push({id,level,qty:1});}
   else{const i=want.findIndex(w=>w.id===id);if(i>=0)want.splice(i,1);else if(want.length<MAX_SIDE)want.push({id});}
   sfx('tap');$('tradeError').textContent='';renderAll();}
 });
 $('tradeSearch').addEventListener('input',e=>{query=e.target.value;renderGrid();});
 $('tradeForm').addEventListener('submit',e=>{e.preventDefault();send();});
 const btn=$('showcaseTradeBtn');if(btn)btn.addEventListener('click',()=>{if(window.sakuShowcaseViewed)openComposer(window.sakuShowcaseViewed());});
 const deal=$('marketDeals');if(deal)deal.addEventListener('click',e=>{const b=e.target.closest('[data-deal]');if(b&&!b.disabled)dealAction(b.dataset.deal,b.dataset.id);});
 setInterval(()=>pollBadge(false),15000);setTimeout(()=>pollBadge(true),2500);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)pollBadge(false);});
});
})();
