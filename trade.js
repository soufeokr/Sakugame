/* Sakugame — échanges directs entre joueurs.
   • Composer : ouvert depuis la vitrine d'un autre joueur (bouton « Proposer un échange »).
   • « Mes affaires » (onglet du marché) : propositions reçues / envoyées, ventes en cours, historique.
   Toute la logique sensible (réservation, limites par paire, transfert) est côté serveur (migration 295). */
(function(){'use strict';
const $=id=>document.getElementById(id), tr=s=>typeof t==='function'?t(s):s;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const L3=(fr,en,es)=>({fr,en,es}[(window.SAKU_I18N||{}).lang]||en);
const M=()=>window.sakuMarket||null, uid=()=>window.sakuSecureUserId||null;
const LIMITS={special:1,mythic:3,legendary:15};
const RAR=['common','uncommon','rare','epic','legendary','mythic','special'];
const RAR_COL={common:'#cfd6df',uncommon:'#3fd69a',rare:'#3fb8f0',epic:'#a07cf5',legendary:'#f2a93b',mythic:'#f28ab0',special:'#e8c469'};
const rarName=r=>M()?M().rarName(r):r;
const CODES={
 trade_self:()=>L3("Tu ne peux pas échanger avec toi-même.","You can't trade with yourself.","No puedes intercambiar contigo mismo."),
 trade_size:()=>L3("Mets au moins une carte ou des pièces de chaque côté (et au moins une carte dans l'échange).","Put at least one card or some coins on each side (and at least one card in the exchange).","Pon al menos una carta o monedas en cada lado (y al menos una carta en el intercambio)."),
 trade_want_unavailable:()=>L3("Ce joueur ne possède pas (ou plus) assez d'exemplaires d'une carte demandée, ou elle est verrouillée.","This player doesn't own enough copies of a requested card, or it is locked.","Este jugador no tiene suficientes ejemplares de una carta pedida, o está bloqueada."),
 trade_too_many:()=>L3("Trop de propositions en attente : 10 au total et 3 par joueur au maximum.","Too many pending proposals: at most 10 in total and 3 per player.","Demasiadas propuestas pendientes: 10 en total y 3 por jugador como máximo."),
 trade_not_shown:()=>L3("Tu ne peux demander que des cartes exposées dans sa vitrine.","You can only request cards shown in their showcase.","Solo puedes pedir cartas expuestas en su vitrina."),
 trade_closed:()=>L3("Cette proposition n'est plus en attente.","This proposal is no longer pending.","Esta propuesta ya no está pendiente."),
 trade_want_locked:()=>L3("Une des cartes demandées est verrouillée dans ta collection : déverrouille-la pour accepter.","One of the requested cards is locked in your collection: unlock it to accept.","Una de las cartas pedidas está bloqueada en tu colección: desbloquéala para aceptar."),
 trade_want_missing:()=>L3("Tu ne possèdes plus toutes les cartes demandées.","You no longer own all the requested cards.","Ya no tienes todas las cartas pedidas."),
 unavailable:()=>L3("Échange impossible avec ce joueur.","Exchange unavailable with this player.","Intercambio imposible con este jugador."),
 pair_limit:()=>L3("Ta limite de don envers ce joueur est atteinte : sur 14 jours, tu peux lui donner au plus 1 spéciale, 3 mythiques et 15 légendaires via les échanges (le marché n'est pas concerné).","Your giving limit towards this player is reached: over 14 days, you can give them at most 1 special, 3 mythic and 15 legendary cards through exchanges.","Has alcanzado tu límite de cesión con este jugador: en 14 días, puedes darle como máximo 1 especial, 3 míticas y 15 legendarias mediante intercambios."),
 pair_limit_in:()=>L3("Ce joueur a atteint sa limite de don envers toi : sur 14 jours, il peut te donner au plus 1 spéciale, 3 mythiques et 15 légendaires.","This player has reached their giving limit towards you: over 14 days, they can give you at most 1 special, 3 mythic and 15 legendary cards.","Este jugador ha alcanzado su límite de cesión contigo: en 14 días, puede darte como máximo 1 especial, 3 míticas y 15 legendarias."),
 card_locked:()=>L3("Cette carte est verrouillée.","This card is locked.","Esta carta está bloqueada."),
 card_unavailable:()=>L3("Tu ne possèdes plus cette carte.","You no longer own this card.","Ya no tienes esta carta."),
 post_closed:()=>L3("Cette annonce n'est plus disponible.","This post is no longer available.","Este anuncio ya no está disponible."),
 post_too_many:()=>L3("Tu as déjà 10 annonces ouvertes de ce type : retires-en une d'abord.","You already have 10 open posts of this type: remove one first.","Ya tienes 10 anuncios abiertos de este tipo: retira uno primero."),
 post_duplicate:()=>L3("Tu as déjà une annonce ouverte pour cette carte.","You already have an open post for this card.","Ya tienes un anuncio abierto para esta carta."),
 insufficient_coins:()=>L3("Pas assez de pièces.","Not enough coins.","No tienes suficientes monedas."),
 trade_want_coins:()=>L3("Ce joueur n'a pas assez de pièces pour ce que tu demandes.","This player doesn't have enough coins for what you ask.","Este jugador no tiene suficientes monedas para lo que pides."),
 trade_coins_invalid:()=>L3("Les pièces ne peuvent être que d'un seul côté de l'échange (100 000 au plus).","Coins can only be on one side of the exchange (100,000 at most).","Las monedas solo pueden estar en un lado del intercambio (100 000 como máximo)."),
 pair_limit_coins:()=>L3("Limite de pièces atteinte : sur 14 jours, tu peux donner au plus 50 000 pièces à ce joueur via les échanges.","Coin limit reached: over 14 days, you can give this player at most 50,000 coins through exchanges.","Límite de monedas alcanzado: en 14 días, puedes dar como máximo 50 000 monedas a este jugador mediante intercambios."),
 pair_limit_coins_in:()=>L3("Limite de pièces atteinte : sur 14 jours, ce joueur peut te donner au plus 50 000 pièces via les échanges.","Coin limit reached: over 14 days, this player can give you at most 50,000 coins through exchanges.","Límite de monedas alcanzado: en 14 días, este jugador puede darte como máximo 50 000 monedas mediante intercambios."),
 not_found:()=>L3("Proposition introuvable.","Proposal not found.","Propuesta no encontrada."),
 catalog_invalid:()=>L3("Carte inconnue.","Unknown card.","Carta desconocida.")
};
function errText(e){const raw=String(e&&e.message||e||'').trim();if(CODES[raw])return CODES[raw]();if(/auth session|jwt|not_authenticated|refresh token|session missing|Connexion requise/i.test(raw))return L3('Ta session a expiré : reconnecte-toi.','Your session expired — sign in again.','Tu sesión ha caducado: vuelve a conectarte.');return raw||L3('Action impossible.','Action failed.','Acción imposible.');}
function card(id){const m=M();return m?m.card(String(id)):null;}
function art(c,level){const m=M();if(!m||!c)return '';return m.image(Object.assign({},c,{marketLevel:level||0}));}
function stars(l){l=Number(l)||0;return l?'★'.repeat(l):'';}
/* Ce que j'ai de cette carte : manquante, possédée (niv. 0) ou mon meilleur niveau (1 à 3). Affiché sur les cartes de l'autre joueur. */
function mineStatus(id){const s=typeof cardState!=='undefined'&&cardState?cardState:null;if(!s||!window.sakuCardLevelInfo)return null;const i=window.sakuCardLevelInfo(s,String(id));if(!i.total)return {k:'miss',t:L3('Manquante','Missing','Te falta'),tip:L3('Tu n\'as pas encore cette carte','You don\'t own this card yet','Aún no tienes esta carta')};if(!i.level)return {k:'own',t:L3('Possédée','Owned','La tienes'),tip:L3('Tu as déjà cette carte (niveau 0)','You already own this card (level 0)','Ya tienes esta carta (nivel 0)')};return {k:'lv'+i.level,t:L3('Niv. ','Lv. ','Niv. ')+i.level,tip:L3('Tu as déjà cette carte au niveau ','You already own this card at level ','Ya tienes esta carta en nivel ')+i.level};}
function mineBadge(id,cls){const m=mineStatus(id);return m?'<span class="trade-mine trade-mine-'+m.k+(cls?' '+cls:'')+'" title="'+esc(m.tip)+'">'+esc(m.t)+'</span>':'';}
function sfx(k){try{if(window.SakuSfx)window.SakuSfx.play(k);}catch(e){}}

/* ---------- Toast ---------- */
let toastTimer=0;
function toast(text,bad){let el=$('tradeToast');if(!el){el=document.createElement('div');el.id='tradeToast';el.className='trade-toast';el.setAttribute('role','status');document.body.appendChild(el);}el.textContent=text;el.classList.toggle('bad',!!bad);el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),4200);}

/* ---------- Valeur estimée (médiane du marché sur 30 jours, sinon prix minimum) ---------- */
const MIN_PRICE={common:5,uncommon:20,rare:50,epic:150,legendary:500,mythic:3000,special:10000};
const VAL={},valPending=new Set(),vkey=(id,l)=>String(id)+'|'+(l==null?'':Number(l));
function needValues(items,then){
 if(!window.sakuBackend||!window.sakuBackend.marketCardValues)return;
 const miss=[],seen=new Set();items.forEach(i=>{const k=vkey(i.card,i.level);if(k in VAL||valPending.has(k)||seen.has(k))return;seen.add(k);miss.push(i);});
 if(!miss.length)return;
 miss.forEach(i=>valPending.add(vkey(i.card,i.level)));
 const chunks=[];for(let i=0;i<miss.length;i+=500)chunks.push(miss.slice(i,i+500));
 Promise.all(chunks.map(ch=>window.sakuBackend.marketCardValues(ch.map(i=>i.level==null?{card:String(i.card)}:{card:String(i.card),level:Number(i.level)})).then(list=>{(list||[]).forEach(v=>{VAL[vkey(v.card,v.level)]={value:Number(v.value)||0,source:v.source,sales:Number(v.sales)||0};});}).catch(()=>{}).then(()=>{ch.forEach(i=>{const k=vkey(i.card,i.level);if(!(k in VAL)){const c=card(i.card);VAL[k]={value:MIN_PRICE[c&&c.rarity]||5,source:'min',sales:0};}});})))
  .then(()=>{miss.forEach(i=>valPending.delete(vkey(i.card,i.level)));if(then)then();});
}
function valueOf(id,level){const v=VAL[vkey(id,level)];if(v)return {value:v.value,known:true,source:v.source};const c=card(id);return {value:MIN_PRICE[c&&c.rarity]||5,known:false,source:'min'};}
function sumSide(items,levelOf){let total=0,pending=false,estimated=false;(items||[]).forEach(it=>{const v=valueOf(it.card,levelOf(it));if(!v.known)pending=true;if(v.source!=='median')estimated=true;total+=v.value*(Number(it.qty)||1);});return {total,pending,estimated};}
const coin='<img class="trade-coin" src="summon-machines/coin.svg" alt="">';
const nfmt=n=>Number(n||0).toLocaleString((window.SAKU_I18N||{}).lang||'en');
function totalHtml(s){return '<span class="trade-total'+(s.pending?' pending':'')+'" title="'+esc(L3('Somme des médianes du marché','Sum of market medians','Suma de las medianas del mercado'))+'">≈ '+nfmt(s.total)+' '+coin+'</span>';}
function balanceHtml(give,get){
 const a=give.total,b=get.total;if(!a&&!b)return '';
 const diff=b-a,big=Math.max(a,b)||1,pct=Math.round(100*Math.abs(diff)/big);
 let cls,label;
 if(pct<=10){cls='even';label=L3('Échange équilibré','Balanced exchange','Intercambio equilibrado');}
 else if(diff>0){cls=pct>35?'up big':'up';label=L3('En ta faveur','In your favour','A tu favor');}
 else{cls=pct>35?'down big':'down';label=L3('En sa faveur','In their favour','A su favor');}
 const wGive=Math.round(100*a/(a+b||1));
 return '<div class="trade-balance-row '+cls+'"><span class="trade-balance-label"><i></i>'+esc(label)+(pct>10?' · '+(diff>0?'+':'−')+nfmt(Math.abs(diff))+' '+coin+' ('+pct+' %)':'')+'</span><span class="trade-balance-bar" aria-hidden="true"><b style="width:'+wGive+'%"></b><b style="width:'+(100-wGive)+'%"></b></span><span class="trade-balance-legend"><span>'+esc(L3('Tu donnes','You give','Das'))+' ≈ '+nfmt(a)+'</span><span>'+esc(L3('Tu reçois','You receive','Recibes'))+' ≈ '+nfmt(b)+'</span></span></div>';
}
const VALUE_NOTE=()=>L3("Estimation : médiane des ventes du marché sur 30 jours, ou prix minimum de la rareté quand la carte ne s'est pas vendue.","Estimate: median market sale price over 30 days, or the rarity's minimum price when the card hasn't sold.","Estimación: mediana de las ventas del mercado en 30 días, o el precio mínimo de la rareza si la carta no se ha vendido.");

/* ---------- Composer ---------- */
let target=null,give=[],want=[],pick='theirs',rar='all',query='',sending=false,theirCol=null,theirErr='',usage=null,post=null,giveCoins=0,wantCoins=0,counter=null;
const COIN_MAX=100000,coinLimit=()=>Number(usage&&usage.coin_limit)||50000,myCoins=()=>{const p=window.sakuProgressSnapshot&&window.sakuProgressSnapshot();return p&&Number.isFinite(Number(p.coins))?Number(p.coins):Infinity;};
function owned(){const s=typeof cardState!=='undefined'&&cardState?cardState:null;return s;}
function isLocked(s,id){return !!(s&&s.flags&&s.flags[id]&&s.flags[id].locked);}
function giveQty(id,level){const g=give.find(x=>x.id===id&&x.level===level);return g?g.qty:0;}
function wantQty(id){const w=want.find(x=>x.id===id);return w?w.qty:0;}
function theirLevel(id){const x=theirCol&&theirCol.find(c=>String(c.id)===id);return x?Number(x.level)||0:null;}
function mineItems(){const s=owned();if(!s||!s.cards)return [];const out=[];Object.keys(s.cards).forEach(id=>{if(!(Number(s.cards[id])>0)||isLocked(s,id))return;const c=card(id);if(!c)return;window.sakuCardLevelCounts(s,id).forEach((n,level)=>{if(n>0)out.push({c,level,count:n});});});return out;}
function theirItems(){const shown=new Set((target&&target.cards||[]).map(x=>String(x.id)));return (theirCol||[]).map(x=>{const c=card(x.id);return c?{c:Object.assign({},c,{rarity:c.rarity||x.rarity}),level:Number(x.level)||0,count:Number(x.qty)||1,shown:shown.has(String(x.id))}:null;}).filter(Boolean);}
function rarityCounts(list){const n={};list.forEach(g=>{const c=card(g.id);if(c)n[c.rarity]=(n[c.rarity]||0)+g.qty;});return n;}
function limitState(){const out=rarityCounts(give),inn=rarityCounts(want),u=usage||{out:{},in:{}},res={out:{},in:{}};Object.keys(LIMITS).forEach(r=>{res.out[r]={used:Number(u.out&&u.out[r])||0,now:out[r]||0};res.in[r]={used:Number(u.in&&u.in[r])||0,now:inn[r]||0};});return res;}
function coinsOver(){const u=usage||{out:{},in:{}};return {out:(Number(u.out&&u.out.coins)||0)+giveCoins>coinLimit(),in:(Number(u.in&&u.in.coins)||0)+wantCoins>coinLimit()};}
function overLimit(){const st=limitState(),c=coinsOver();return c.out||c.in||Object.keys(LIMITS).some(r=>st.out[r].used+st.out[r].now>LIMITS[r]||st.in[r].used+st.in[r].now>LIMITS[r]);}
const wantLevel=w=>w.level!=null?w.level:theirLevel(w.id);
function slotHtml(side,item,i){
 const c=card(item.id);if(!c)return '';
 const exact=side==='give'||item.level!=null,lvl=side==='give'?item.level:wantLevel(item),lv=lvl||0,label=exact?(lvl?stars(lvl):L3('Niv. 0','Lv. 0','Niv. 0')):L3('Plus bas niveau','Lowest level','Nivel más bajo');
 const v=valueOf(item.id,lvl);
 return '<div class="trade-slot" style="--r:'+(RAR_COL[c.rarity]||'#cfd6df')+'"><span class="trade-slot-art">'+art(c,lv)+(side==='want'?mineBadge(item.id):'')+(item.qty>1?'<b class="trade-qty">× '+item.qty+'</b>':'')+'</span><span class="trade-slot-name" data-noi18n>'+esc(c.name)+'</span><small>'+esc(label)+'</small><small class="trade-slot-val">≈ '+nfmt(v.value*item.qty)+'</small>'+(item.fixed?'<span class="trade-slot-lock" title="'+esc(L3("Carte de l'annonce",'Card from the post','Carta del anuncio'))+'">📌</span>':'<button type="button" class="trade-slot-x" data-remove="'+side+'" data-i="'+i+'" aria-label="'+esc(L3('Retirer','Remove','Quitar'))+'">−</button>')+'</div>';
}
const addCoins=(s,n)=>(s.total+=n,s);
const giveSum=()=>addCoins(sumSide(give.map(g=>({card:g.id,level:g.level,qty:g.qty})),it=>it.level),giveCoins);
const wantSum=()=>addCoins(sumSide(want.map(w=>({card:w.id,qty:w.qty,level:wantLevel(w)})),it=>it.level),wantCoins);
function renderSlots(){
 const gs=$('tradeGiveSlots'),ws=$('tradeWantSlots'),hint=t=>'<p class="trade-slots-empty">'+esc(t)+'</p>';
 gs.innerHTML=give.length?give.map((g,i)=>slotHtml('give',g,i)).join(''):hint(L3('Choisis tes cartes dans « Ma collection ».','Pick your cards in “My collection”.','Elige tus cartas en «Mi colección».'));
 ws.innerHTML=want.length?want.map((w,i)=>slotHtml('want',w,i)).join(''):hint(L3('Choisis ses cartes dans « Sa collection ».','Pick their cards in “Their collection”.','Elige sus cartas en «Su colección».'));
 needValues(give.map(g=>({card:g.id,level:g.level})).concat(want.map(w=>({card:w.id,level:wantLevel(w)}))),()=>{if($('tradeDialog').open)renderSlots();});
 const gS=giveSum(),wS=wantSum(),qty=a=>a.reduce((n,x)=>n+x.qty,0);
 const nc=n=>n+' '+(n>1?L3('cartes','cards','cartas'):L3('carte','card','carta'));$('tradeGiveTotal').innerHTML=give.length?'<em>'+nc(qty(give))+'</em>'+totalHtml(gS):'';$('tradeWantTotal').innerHTML=want.length?'<em>'+nc(qty(want))+'</em>'+totalHtml(wS):'';
 $('tradeBalance').innerHTML=give.length&&want.length?balanceHtml(gS,wS)+'<small>'+esc(VALUE_NOTE())+'</small>':'';
 const st=limitState(),row=(dir,label)=>'<div class="trade-limit-row"><span class="trade-limit-who">'+esc(label)+'</span>'+Object.keys(LIMITS).map(r=>{const x=st[dir][r],v=x.used+x.now;return '<span class="trade-limit'+(v>LIMITS[r]?' over':x.now?' used':'')+'" style="--r:'+RAR_COL[r]+'" title="'+esc(x.used?L3('Déjà donné sur 14 jours : ','Already given over 14 days: ','Ya dado en 14 días: ')+x.used:'')+'"><i></i>'+esc(rarName(r))+' <b>'+v+' / '+LIMITS[r]+'</b></span>';}).join('')+'</div>';
 $('tradeLimits').innerHTML='<span class="trade-limits-label">'+esc(L3('Limites de don sur 14 jours','Giving limits over 14 days','Límites de cesión en 14 días'))+'</span>'+row('out',L3('Tu lui donnes','You give them','Le das'))+row('in',L3('Il te donne','They give you','Te da'))+'<small>'+esc(L3('Chaque joueur a sa propre limite envers l\'autre. Seuls les échanges comptent (ceux des 14 derniers jours et ceux en attente) ; le marché est libre.','Each player has their own limit towards the other. Only exchanges count (the last 14 days and pending ones); the market is unrestricted.','Cada jugador tiene su propio límite con el otro. Solo cuentan los intercambios (los de los últimos 14 días y los pendientes); el mercado es libre.'))+'</small>';
 const coinRow=(dir,label)=>{const u=usage||{out:{},in:{}},used=Number(u[dir]&&u[dir].coins)||0,now=dir==='out'?giveCoins:wantCoins,v=used+now;return '<span class="trade-limit trade-limit-coins'+(v>coinLimit()?' over':now?' used':'')+'"><img src="summon-machines/coin.svg" alt=""> '+esc(L3('Pièces','Coins','Monedas'))+' <b>'+nfmt(v)+' / '+nfmt(coinLimit())+'</b></span>';};
 $('tradeLimits').querySelectorAll('.trade-limit-row').forEach((r,i)=>r.insertAdjacentHTML('beforeend',coinRow(i?'in':'out')));
 const cards=give.length+want.length,both=giveCoins>0&&wantCoins>0,broke=giveCoins>myCoins();
 const gc=$('tradeGiveCoinsNote'),wcn=$('tradeWantCoinsNote');
 if(gc)gc.textContent=broke?L3('Tu n\'as que ','You only have ','Solo tienes ')+nfmt(myCoins())+' '+L3('pièces','coins','monedas'):(giveCoins?L3('Réservées jusqu\'à la réponse','Reserved until they answer','Reservadas hasta la respuesta'):'');
 if(wcn)wcn.textContent=both?L3('Les pièces ne peuvent être que d\'un côté','Coins can only be on one side','Las monedas solo pueden ir en un lado'):'';
 const ok=(give.length>0||giveCoins>0)&&(want.length>0||wantCoins>0)&&cards>0&&!both&&!broke&&!overLimit();$('tradeSend').disabled=!ok||sending;
 if(window.sakuBasicObserve){window.sakuBasicObserve(gs);window.sakuBasicObserve(ws);}
}
let gridVisible=120;
function renderGrid(){
 const grid=$('tradeGrid'),items=pick==='mine'?mineItems():theirItems(),q=query.trim().toLocaleLowerCase(),counts={all:0},list=[];
 document.querySelectorAll('#tradeDialog [data-pick]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.pick===pick)));
 if(pick==='theirs'&&!theirCol){$('tradeRarities').innerHTML='';grid.innerHTML='<p class="trade-empty">'+esc(theirErr||L3('Chargement de sa collection…','Loading their collection…','Cargando su colección…'))+'</p>';return;}
 items.forEach(it=>{if(q&&!(it.c.name+' '+it.c.series).toLocaleLowerCase().includes(q))return;counts.all++;counts[it.c.rarity]=(counts[it.c.rarity]||0)+1;if(rar==='all'||it.c.rarity===rar)list.push(it);});
 const rk=c=>RAR.indexOf(c.rarity);list.sort((a,b)=>(b.shown?1:0)-(a.shown?1:0)||rk(b.c)-rk(a.c)||(b.level||0)-(a.level||0)||String(a.c.name).localeCompare(String(b.c.name)));
 $('tradeRarities').innerHTML=['all'].concat(RAR.filter(r=>counts[r])).map(r=>'<button type="button" data-rar="'+r+'" aria-pressed="'+(rar===r)+'"'+(r==='all'?'':' style="--r:'+RAR_COL[r]+'"')+'>'+(r==='all'?esc(L3('Toutes','All','Todas')):'<i></i>'+esc(rarName(r)))+'<b>'+(counts[r]||0)+'</b></button>').join('');
 if(!list.length){grid.innerHTML='<p class="trade-empty">'+esc(q||rar!=='all'?L3('Aucune carte ne correspond.','No card matches.','Ninguna carta coincide.'):pick==='mine'?L3('Aucune carte échangeable : les cartes verrouillées ne peuvent pas être proposées.','No tradable card: locked cards cannot be offered.','Ninguna carta intercambiable: las cartas bloqueadas no se pueden ofrecer.'):L3("Ce joueur n'a aucune carte échangeable pour l'instant.","This player has no tradable card yet.","Este jugador aún no tiene cartas intercambiables."))+'</p>';return;}
 grid.innerHTML=list.slice(0,gridVisible).map(it=>{
  const id=String(it.c.id),sel=pick==='mine'?giveQty(id,it.level):wantQty(id),left=it.count-sel;
  return '<button type="button" class="trade-tile'+(sel?' picked':'')+'" data-id="'+esc(id)+'" data-level="'+it.level+'"'+(left<1?' data-full="1"':'')+' style="--r:'+(RAR_COL[it.c.rarity]||'#cfd6df')+'" aria-pressed="'+(!!sel)+'" aria-label="'+esc(it.c.name+' · '+rarName(it.c.rarity)+(it.level?' · '+stars(it.level):'')+' · × '+it.count)+'"><span class="trade-tile-art">'+art(it.c,it.level||0)+'<span class="trade-tile-count">× '+left+'</span>'+(sel?'<span class="trade-tile-check">'+(sel>1?'× '+sel:'✓')+'</span>':'')+(pick==='theirs'?mineBadge(id):'')+(it.shown?'<span class="trade-tile-shown" title="'+esc(L3('Dans sa vitrine','In their showcase','En su vitrina'))+'">★</span>':'')+'</span><span class="trade-tile-foot"><i></i><span data-noi18n>'+esc(it.c.name)+'</span></span></button>';
 }).join('')+(list.length>gridVisible?'<button type="button" class="market-subtle trade-more" data-more="1">'+esc(L3('Afficher plus','Show more','Mostrar más'))+' ('+(list.length-gridVisible)+')</button>':'');
 if(window.sakuBasicObserve)window.sakuBasicObserve(grid);
}
function renderAll(){renderSlots();renderGrid();}
function setPickTabs(){document.querySelectorAll('#tradeDialog [data-pick]').forEach(b=>{b.hidden=!!post&&((post.kind==='offer'&&b.dataset.pick==='theirs')||(post.kind==='seek'&&b.dataset.pick==='mine'));});}
async function openComposer(data,opts){
 if(!data||!data.id)return;
 if(!uid()){toast(L3('Connecte-toi pour proposer un échange.','Sign in to propose an exchange.','Inicia sesión para proponer un intercambio.'),true);return;}
 post=opts&&opts.post?opts.post:null;counter=opts&&opts.counter?opts.counter:null;
 target={id:String(data.id),name:String(data.name||tr('Player')).slice(0,60),cards:Array.isArray(data.cards)?data.cards.slice(0,10):[]};
 give=[];want=[];giveCoins=0;wantCoins=0;pick=post&&post.kind==='offer'?'mine':'theirs';rar='all';query='';sending=false;theirCol=null;theirErr='';usage=null;gridVisible=120;
 if(counter){want=(counter.give||[]).map(it=>({id:String(it.card),qty:Number(it.qty)||1}));giveCoins=Number(counter.want_coins)||0;wantCoins=Number(counter.give_coins)||0;pick='mine';}
 if(post&&post.kind==='offer')want=[{id:String(post.card),qty:1,level:Number(post.level)||0,fixed:true}];
 $('tradeTitle').textContent=counter?L3('Contre-proposition','Counter-offer','Contrapropuesta'):post?(post.kind==='offer'?L3('Faire une offre','Make an offer','Hacer una oferta'):L3('Proposer sa carte','Offer the card','Ofrecer la carta')):L3('Proposer un échange','Propose a trade','Proponer un intercambio');
 $('tradeWith').textContent=(post?L3('Annonce de ','Post by ','Anuncio de '):L3('Avec ','With ','Con '))+target.name;$('tradeSearch').value='';$('tradeMessage').value='';$('tradeError').textContent='';
 syncCoinInputs();$('tradeDialog').querySelectorAll('.trade-coins').forEach(el=>{el.hidden=!!post;const lb=el.querySelector('.trade-coins-label');if(lb)lb.textContent=el.dataset.side==='give'?L3('pièces que tu donnes','coins you give','monedas que das'):L3('pièces que tu demandes','coins you ask for','monedas que pides');});
 $('tradeSend').textContent=counter?L3('Envoyer la contre-proposition','Send counter-offer','Enviar la contrapropuesta'):L3('Envoyer la proposition','Send proposal','Enviar la propuesta');
 setPickTabs();
 const d=$('tradeDialog'),tok=target;if(!d.open)d.showModal();renderAll();
 if(window.sakuBackend.tradePairUsage)window.sakuBackend.tradePairUsage(target.id,counter&&counter.id).then(u=>{if(target!==tok)return;usage=u;renderSlots();}).catch(()=>{});
 if(!post||post.kind==='seek')window.sakuBackend.tradeCollection(target.id).then(list=>{if(target!==tok)return;theirCol=Array.isArray(list)?list.slice():[];
  // contre-proposition : ses cartes réservées par la première offre lui reviennent, on peut donc les redemander
  if(counter)(counter.give||[]).forEach(it=>{const x=theirCol.find(c=>String(c.id)===String(it.card));if(x)x.qty=(Number(x.qty)||1)+(Number(it.qty)||1);else theirCol.push({id:String(it.card),level:Number(it.level)||0,qty:Number(it.qty)||1,rarity:it.rarity});});
  renderAll();}).catch(e=>{if(target!==tok)return;theirErr=errText(e);renderGrid();});
 // Collection fraîche (les réservations du marché ont pu changer les quantités).
 try{if(window.sakuBackend&&typeof cardNormalize==='function'){const cards=await window.sakuBackend.gameCollection();if(d.open&&uid()&&target===tok){cardState=cardNormalize(cards);if(typeof currentAccount!=='undefined'&&currentAccount)currentAccount.cards=cardState;}}}catch(e){}
 if(target!==tok)return;
 if(counter){const mine=mineItems(),miss=[];give=[];(counter.want||[]).forEach(it=>{const id=String(it.card),c=mine.filter(m=>String(m.c.id)===id).sort((x,y)=>x.level-y.level);let need=Number(it.qty)||1;c.forEach(m=>{if(need<1)return;const take=Math.min(need,m.count);give.push({id,level:m.level,qty:take});need-=take;});if(need>0)miss.push(id);});if(miss.length)$('tradeError').textContent=L3('Certaines cartes demandées ne sont plus dans ta collection (ou sont verrouillées).','Some requested cards are no longer in your collection (or are locked).','Algunas cartas pedidas ya no están en tu colección (o están bloqueadas).');}
 if(post&&post.kind==='seek'){const mine=mineItems().filter(it=>String(it.c.id)===String(post.card)).sort((x,y)=>x.level-y.level)[0];if(!mine){$('tradeError').textContent=L3("Tu ne possèdes pas (ou plus) cette carte, ou elle est verrouillée.","You don't own this card (anymore), or it is locked.","No tienes (o ya no tienes) esta carta, o está bloqueada.");}else give=[{id:String(post.card),level:mine.level,qty:1,fixed:true}];}
 renderAll();
}
async function send(){
 if(sending||!target)return;
 if(!(give.length||giveCoins)||!(want.length||wantCoins)||!(give.length+want.length)){$('tradeError').textContent=CODES.trade_size();return;}
 if(giveCoins>0&&wantCoins>0){$('tradeError').textContent=CODES.trade_coins_invalid();return;}
 if(giveCoins>myCoins()){$('tradeError').textContent=CODES.insufficient_coins();return;}
 if(overLimit()){const st=limitState(),outOver=Object.keys(LIMITS).some(r=>st.out[r].used+st.out[r].now>LIMITS[r]),co=coinsOver();$('tradeError').textContent=co.out?CODES.pair_limit_coins():co.in?CODES.pair_limit_coins_in():outOver?CODES.pair_limit():CODES.pair_limit_in();return;}
 sending=true;$('tradeSend').disabled=true;$('tradeError').textContent='';$('tradeSend').textContent=L3('Envoi…','Sending…','Enviando…');
 try{
  const msgTxt=$('tradeMessage').value.trim().slice(0,200);
  if(post){if(post.kind==='offer')await window.sakuBackend.tradePostOffer(post.id,give.map(g=>({card:g.id,level:g.level,qty:g.qty})),null,msgTxt);else await window.sakuBackend.tradePostOffer(post.id,want.map(w=>({card:w.id,qty:w.qty})),give[0].level,msgTxt);if(window.sakuExchangeRefresh)window.sakuExchangeRefresh();}
  else if(counter){await window.sakuBackend.tradeCounter(counter.id,give.map(g=>({card:g.id,level:g.level,qty:g.qty})),want.map(w=>({card:w.id,qty:w.qty})),msgTxt,giveCoins,wantCoins);counter=null;if(window.sakuDealsRefresh)window.sakuDealsRefresh();}
  else await window.sakuBackend.tradePropose(target.id,give.map(g=>({card:g.id,level:g.level,qty:g.qty})),want.map(w=>({card:w.id,qty:w.qty})),msgTxt,giveCoins,wantCoins);
  if(window.sakuProgressRefresh)window.sakuProgressRefresh();
  $('tradeDialog').close();sfx('coin');toast(L3('Proposition envoyée à ','Proposal sent to ','Propuesta enviada a ')+target.name+L3(' — suis-la dans Marché › Mes affaires.',' — follow it in Market › My deals.',' — síguela en Mercado › Mis negocios.'));
  try{if(typeof cardNormalize==='function'){const cards=await window.sakuBackend.gameCollection();cardState=cardNormalize(cards);if(typeof currentAccount!=='undefined'&&currentAccount)currentAccount.cards=cardState;}}catch(e){}
 }catch(e){$('tradeError').textContent=errText(e);sfx('wrong');}
 finally{sending=false;$('tradeSend').textContent=counter?L3('Envoyer la contre-proposition','Send counter-offer','Enviar la contrapropuesta'):L3('Envoyer la proposition','Send proposal','Enviar la propuesta');renderSlots();}
}

function syncCoinInputs(){const g=$('tradeGiveCoins'),w=$('tradeWantCoins');if(g)g.value=giveCoins?String(giveCoins):'';if(w)w.value=wantCoins?String(wantCoins):'';}
function readCoins(el){let n=Math.floor(Number(String(el.value).replace(/[^0-9]/g,''))||0);if(n>COIN_MAX){n=COIN_MAX;el.value=String(n);}return Math.max(0,n);}

/* ---------- Mes affaires ---------- */
let myPosts=[],deals=[],dealsListings=[],dealsToken=0,confirmId=null,dealBusy=false;
function relTime(iso){const ms=Date.parse(iso)-Date.now();if(!(ms>0))return L3('expire bientôt','expiring','caduca pronto');const h=Math.ceil(ms/3600000);return h>=48?L3('expire dans '+Math.ceil(h/24)+' j','expires in '+Math.ceil(h/24)+' d','caduca en '+Math.ceil(h/24)+' d'):L3('expire dans '+h+' h','expires in '+h+' h','caduca en '+h+' h');}
function ago(iso){const d=new Date(iso);if(isNaN(d))return '';try{return d.toLocaleDateString((window.SAKU_I18N||{}).lang||'en',{day:'numeric',month:'short'});}catch(e){return d.toISOString().slice(0,10);}}
function coinChip(n){return n>0?'<span class="deal-coins"><img src="summon-machines/coin.svg" alt=""><b>'+nfmt(n)+'</b></span>':'';}
function thumbs(items,side,coins,mark){return '<div class="deal-cards">'+coinChip(coins)+(items||[]).map(it=>{const c=card(it.card);const nm=c?c.name:it.card;const lvl=it.level==null?null:Number(it.level);return '<span class="deal-card" style="--r:'+(RAR_COL[(c&&c.rarity)||it.rarity]||'#cfd6df')+'" title="'+esc(nm+(lvl?' '+stars(lvl):''))+'"><span class="deal-card-art">'+(c?art(c,lvl||0):'')+(Number(it.qty)>1?'<b class="trade-qty">× '+Number(it.qty)+'</b>':'')+(mark?mineBadge(it.card):'')+'</span><span class="deal-card-name" data-noi18n>'+esc(nm)+'</span>'+(side==='want'&&lvl==null?'':'<small>'+esc(lvl?stars(lvl):L3('Niv. 0','Lv. 0','Niv. 0'))+'</small>')+'</span>';}).join('')+'</div>';}
const STATE_LABEL={countered:()=>L3('Contre-proposé','Countered','Contrapropuesto'),accepted:()=>L3('Accepté','Accepted','Aceptado'),declined:()=>L3('Refusé','Declined','Rechazado'),cancelled:()=>L3('Annulé','Cancelled','Cancelado'),expired:()=>L3('Expiré','Expired','Caducado'),pending:()=>L3('En attente','Pending','Pendiente')};
function dealHtml(x){
 const inc=!!x.incoming,mineSide=inc?x.want:x.give,theirSide=inc?x.give:x.want;
 const myCoinsOut=Number(inc?x.want_coins:x.give_coins)||0,theirCoins=Number(inc?x.give_coins:x.want_coins)||0;
 const lv=it=>it.level==null?null:Number(it.level),giveS=addCoins(sumSide(mineSide,lv),myCoinsOut),getS=addCoins(sumSide(theirSide,lv),theirCoins);
 let actions='';
 if(x.state==='pending'){
  if(inc)actions=confirmId===x.id?'<button type="button" class="market-subtle" data-deal="back" data-id="'+esc(x.id)+'">'+esc(L3('Retour','Back','Volver'))+'</button><button type="button" class="market-button deal-confirm" data-deal="accept" data-id="'+esc(x.id)+'">'+esc(L3("Confirmer l'échange","Confirm exchange","Confirmar intercambio"))+'</button>':'<button type="button" class="market-subtle" data-deal="decline" data-id="'+esc(x.id)+'">'+esc(L3('Refuser','Decline','Rechazar'))+'</button><button type="button" class="market-subtle deal-counter" data-deal="counter" data-id="'+esc(x.id)+'">'+esc(L3('Contre-proposer','Counter-offer','Contraproponer'))+'</button><button type="button" class="market-button" data-deal="ask" data-id="'+esc(x.id)+'">'+esc(L3('Accepter','Accept','Aceptar'))+'</button>';
  else actions='<button type="button" class="market-subtle" data-deal="cancel" data-id="'+esc(x.id)+'">'+esc(L3('Annuler la proposition','Cancel proposal','Cancelar la propuesta'))+'</button>';
 }
 const meta=x.state==='pending'?relTime(x.expires_at):(STATE_LABEL[x.state]?STATE_LABEL[x.state]():x.state)+' · '+ago(x.closed_at||x.created_at);
 return '<article class="deal deal-'+esc(x.state)+(inc?' deal-in':' deal-out')+'">'
  +'<header class="deal-head"><button type="button" class="deal-who" data-deal="profile" data-id="'+esc(x.other)+'"><span class="deal-avatar" aria-hidden="true">'+esc(String(x.other_name||'?').trim().charAt(0).toUpperCase()||'?')+'</span><span><b data-noi18n>'+esc(x.other_name||tr('Player'))+'</b>'+(x.counter_of?'<em class="deal-tag">'+esc(L3('Contre-proposition','Counter-offer','Contrapropuesta'))+'</em>':'')+'<small>'+esc(x.post_id?(inc?(x.post_kind==='seek'?L3('a la carte que tu cherches','has the card you are looking for','tiene la carta que buscas'):L3('fait une offre sur ton annonce','makes an offer on your post','hace una oferta a tu anuncio')):(x.post_kind==='seek'?L3('ta réponse à son annonce « Chercher »','your answer to their “Search” post','tu respuesta a su anuncio «Buscar»'):L3('ton offre sur son annonce','your offer on their post','tu oferta a su anuncio'))):(inc?L3('te propose un échange','offers you an exchange','te propone un intercambio'):L3('ta proposition','your proposal','tu propuesta')))+'</small></span></button><span class="deal-state">'+esc(meta)+'</span></header>'
  +(x.message?'<p class="deal-msg" data-noi18n>« '+esc(x.message)+' »</p>':'')
  +'<div class="deal-body"><div class="deal-side deal-get"><h4>'+esc(L3('Tu reçois','You receive','Recibes'))+totalHtml(getS)+'</h4>'+thumbs(theirSide,inc?'give':'want',theirCoins,x.state==='pending')+'</div><div class="deal-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 7h12m0 0-4-4m4 4-4 4M17 17H5m0 0 4 4m-4-4 4-4"/></svg></div><div class="deal-side deal-give"><h4>'+esc(L3('Tu donnes','You give','Das'))+totalHtml(giveS)+'</h4>'+thumbs(mineSide,inc?'want':'give',myCoinsOut)+'</div></div>'+'<div class="trade-balance deal-balance">'+balanceHtml(giveS,getS)+'</div>'
  +(x.state==='pending'&&inc?'<p class="deal-hint">'+esc(confirmId===x.id?L3("Les cartes seront échangées immédiatement. Pour chaque carte demandée, ton exemplaire de plus bas niveau est donné.","The cards will be exchanged immediately. For each requested card, your lowest-level copy is given.","Las cartas se intercambiarán de inmediato. Por cada carta pedida, se da tu ejemplar de nivel más bajo."):L3('Ton exemplaire de plus bas niveau sera donné pour chaque carte demandée.','Your lowest-level copy is given for each requested card.','Se da tu ejemplar de nivel más bajo por cada carta pedida.'))+'</p>':'')
  +(actions?'<footer class="deal-actions">'+actions+'</footer>':'')+'</article>';
}
function listingHtml(l){const c=card(l.cardId),m=M();if(!c)return '';const auction=l.type==='auction';return '<article class="deal-listing" style="--r:'+(RAR_COL[c.rarity]||'#cfd6df')+'"><span class="deal-card-art">'+art(c,l.cardLevel||0)+'</span><div><b data-noi18n>'+esc(c.name)+'</b><small>'+esc(auction?(l.bid?L3('Enchère : ','Auction: ','Subasta: ')+m.nf(l.price):L3('Enchère sans offre · ','Auction, no bid · ','Subasta sin oferta · ')+m.nf(l.price)):L3('Prix fixe : ','Fixed price: ','Precio fijo: ')+m.nf(l.price))+'</small></div>'+(auction&&l.bid?'':'<button type="button" class="market-subtle" data-deal="unlist" data-id="'+esc(l.id)+'">'+esc(L3('Retirer','Withdraw','Retirar'))+'</button>')+'</article>';}
function postMiniHtml(p){const c=card(p.card);if(!c)return '';const lvl=p.level==null?null:Number(p.level);return '<article class="deal-listing deal-post" style="--r:'+(RAR_COL[c.rarity]||'#cfd6df')+'"><span class="deal-card-art">'+art(c,lvl||0)+'</span><div><span class="xb-kind '+esc(p.kind)+'">'+esc(p.kind==='offer'?L3('Je propose','Offering','Ofrezco'):L3('Je cherche','Looking for','Busco'))+'</span><b data-noi18n>'+esc(c.name)+(lvl?' '+stars(lvl):'')+'</b><small>'+esc(Number(p.offers)?(Number(p.offers)+' '+(Number(p.offers)>1?L3('offres en attente','pending offers','ofertas pendientes'):L3('offre en attente','pending offer','oferta pendiente'))):L3('Aucune offre pour le moment','No offer yet','Aún sin ofertas'))+'</small></div><button type="button" class="market-subtle" data-deal="unpost" data-id="'+esc(p.id)+'">'+esc(L3('Retirer','Withdraw','Retirar'))+'</button></article>';}
function empty(text){return '<p class="deals-empty">'+esc(text)+'</p>';}
function renderDeals(){
 if(!$('marketDeals'))return;
 needValues(deals.flatMap(x=>(x.give||[]).concat(x.want||[])).map(it=>({card:it.card,level:it.level==null?null:Number(it.level)})),()=>{if(!$('marketDeals').hidden)renderDeals();});
 const inc=deals.filter(x=>x.state==='pending'&&x.incoming),out=deals.filter(x=>x.state==='pending'&&!x.incoming),hist=deals.filter(x=>x.state!=='pending');
 $('dealsIncoming').innerHTML=inc.length?inc.map(dealHtml).join(''):empty(L3('Aucune proposition reçue pour le moment.','No proposal received yet.','Aún no has recibido propuestas.'));
 $('dealsOutgoing').innerHTML=out.length?out.map(dealHtml).join(''):empty(L3("Tu n'as envoyé aucune proposition en attente.","You have no pending proposal sent.","No tienes propuestas enviadas pendientes."));
 if($('dealsPosts'))$('dealsPosts').innerHTML=myPosts.length?myPosts.map(postMiniHtml).join(''):empty(L3("Aucune annonce ouverte. Publie-en une dans l'onglet Échanges.","No open post. Publish one in the Exchanges tab.","Ningún anuncio abierto. Publica uno en la pestaña Intercambios."));
 $('dealsListings').innerHTML=dealsListings.length?dealsListings.map(listingHtml).join(''):empty(L3("Aucune carte en vente.","No card for sale.","Ninguna carta en venta."));
 $('dealsHistory').innerHTML=hist.length?hist.map(dealHtml).join(''):empty(L3('Rien sur les 30 derniers jours.','Nothing in the last 30 days.','Nada en los últimos 30 días.'));
 const cnt=(id,n)=>{const el=$(id);if(el)el.textContent=n?String(n):'';};cnt('dealsInCount',inc.length);cnt('dealsOutCount',out.length);cnt('dealsListCount',dealsListings.length);cnt('dealsPostCount',myPosts.length);cnt('dealsHistCount',hist.length);
 $('dealsStats').innerHTML=[[inc.length,L3('reçues','received','recibidas')],[out.length,L3('envoyées','sent','enviadas')],[dealsListings.length,L3('en vente','for sale','en venta')]].map(([n,l])=>'<span><b>'+n+'</b>'+esc(l)+'</span>').join('');
 setBadge(inc.length);
 if(window.sakuBasicObserve)window.sakuBasicObserve($('marketDeals'));
}
async function refreshDeals(listings){
 if(Array.isArray(listings))dealsListings=listings;
 if(!uid()||!window.sakuBackend||!window.sakuBackend.tradeList)return;
 const token=++dealsToken;if(!deals.length)$('dealsIncoming').innerHTML=empty(L3('Chargement…','Loading…','Cargando…'));
 try{const [list,posts]=await Promise.all([window.sakuBackend.tradeList(),window.sakuBackend.tradePostMine?window.sakuBackend.tradePostMine().catch(()=>[]):[]]);if(token!==dealsToken)return;deals=Array.isArray(list)?list:[];myPosts=Array.isArray(posts)?posts:[];renderDeals();}
 catch(e){if(token===dealsToken){renderDeals();if(M())M().msg(errText(e),true);}}
}
async function dealAction(kind,id){
 if(dealBusy)return;
 if(kind==='profile'){if(window.showShowcase)window.showShowcase(id);return;}
 if(kind==='ask'){confirmId=id;renderDeals();return;}
 if(kind==='back'){confirmId=null;renderDeals();return;}
 if(kind==='counter'){const x=deals.find(d=>d.id===id);if(x)openComposer({id:x.other,name:x.other_name,cards:[]},{counter:x});return;}
 if(kind==='unlist'){if(M())await M().cancelListing(id);return;}
 if(kind==='unpost'){try{await window.sakuBackend.tradePostClose(id);sfx('tap');if(M())M().msg(L3('Annonce retirée. Les offres en attente ont été refusées et leurs cartes rendues.','Post withdrawn. Pending offers were declined and their cards returned.','Anuncio retirado. Las ofertas pendientes se rechazaron y sus cartas se devolvieron.'),false);}catch(e){if(M())M().msg(errText(e),true);}await refreshDeals();if(window.sakuExchangeRefresh)window.sakuExchangeRefresh();return;}
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
  if(M())await M().refresh();await refreshDeals();if(M())M().msg(text,false);if(window.sakuExchangeRefresh)window.sakuExchangeRefresh();
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
window.sakuTradeKit={needValues,valueOf,totalHtml,nfmt,errText,art,toast,relTime,stars,mineItems:()=>mineItems(),sfx};
window.sakuDealsRefresh=refreshDeals;
window.sakuDealsRender=listings=>{if(Array.isArray(listings))dealsListings=listings;renderDeals();};

document.addEventListener('DOMContentLoaded',()=>{
 const d=$('tradeDialog');if(!d)return;
 $('tradeClose').addEventListener('click',()=>d.close());
 d.addEventListener('click',e=>{if(e.target===d){d.close();return;}
  const p=e.target.closest('[data-pick]');if(p){pick=p.dataset.pick;rar='all';renderGrid();return;}
  const r=e.target.closest('[data-rar]');if(r){rar=r.dataset.rar;renderGrid();return;}
  const more=e.target.closest('[data-more]');if(more){gridVisible+=120;renderGrid();return;}
  const x=e.target.closest('[data-remove]');if(x){const i=Number(x.dataset.i),arr=x.dataset.remove==='give'?give:want,g=arr[i];if(g&&!g.fixed){g.qty--;if(g.qty<1)arr.splice(i,1);}sfx('tap');renderAll();return;}
  const tile=e.target.closest('.trade-tile');if(tile){const id=tile.dataset.id;if(tile.dataset.full){$('tradeError').textContent=(L3('Tous les exemplaires sont déjà dans l\'échange.','All copies are already in the exchange.','Todos los ejemplares ya están en el intercambio.'));return;}
   if(pick==='mine'){const level=Number(tile.dataset.level)||0,item=mineItems().find(it=>String(it.c.id)===id&&it.level===level);if(!item)return;const g=give.find(x=>x.id===id&&x.level===level);if(g){if(g.qty<item.count)g.qty++;}else give.push({id,level,qty:1});}
   else{const item=theirItems().find(it=>String(it.c.id)===id);if(!item)return;const w=want.find(x=>x.id===id);if(w){if(w.qty<item.count)w.qty++;}else want.push({id,qty:1});}
   sfx('tap');$('tradeError').textContent='';renderAll();}
 });
 $('tradeSearch').addEventListener('input',e=>{query=e.target.value;renderGrid();});
 const gci=$('tradeGiveCoins'),wci=$('tradeWantCoins');
 if(gci)gci.addEventListener('input',()=>{giveCoins=readCoins(gci);if(giveCoins&&wantCoins){wantCoins=0;if(wci)wci.value='';}$('tradeError').textContent='';renderSlots();});
 if(wci)wci.addEventListener('input',()=>{wantCoins=readCoins(wci);if(giveCoins&&wantCoins){giveCoins=0;if(gci)gci.value='';}$('tradeError').textContent='';renderSlots();});
 $('tradeForm').addEventListener('submit',e=>{e.preventDefault();send();});
 const btn=$('showcaseTradeBtn');if(btn)btn.addEventListener('click',()=>{if(window.sakuShowcaseViewed)openComposer(window.sakuShowcaseViewed());});
 const deal=$('marketDeals');if(deal)deal.addEventListener('click',e=>{const b=e.target.closest('[data-deal]');if(b&&!b.disabled)dealAction(b.dataset.deal,b.dataset.id);});
 setInterval(()=>pollBadge(false),15000);setTimeout(()=>pollBadge(true),2500);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)pollBadge(false);});
});
})();
