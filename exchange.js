/* Sakugame — Marché › Échanges : annonces « Proposer » (une carte mise à l'échange) et « Chercher »
   (une carte recherchée). Chaque réponse à une annonce est un échange normal que l'auteur de l'annonce
   valide dans « Mes affaires ». Logique serveur : migration 299 (trade_post_*). */
(function(){'use strict';
const $=id=>document.getElementById(id), tr=s=>typeof t==='function'?t(s):s;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const L3=(fr,en,es)=>({fr,en,es}[(window.SAKU_I18N||{}).lang]||en);
const M=()=>window.sakuMarket||null, K=()=>window.sakuTradeKit||null, uid=()=>window.sakuSecureUserId||null;
const RAR=['common','uncommon','rare','epic','legendary','mythic','special'];
const RAR_COL={common:'#cfd6df',uncommon:'#3fd69a',rare:'#3fb8f0',epic:'#a07cf5',legendary:'#f2a93b',mythic:'#f28ab0',special:'#e8c469'};
const card=id=>M()?M().card(String(id)):null, rarName=r=>M()?M().rarName(r):r;
const stars=l=>{l=Number(l)||0;return l?'★'.repeat(l):'';};
const levelTxt=l=>Number(l)?stars(l):L3('Niv. 0','Lv. 0','Niv. 0');

let kind='offer',posts={offer:null,seek:null},loadedAt={offer:0,seek:0},query='',rar='all',only=false,token=0,visible=60;
function state(){return typeof cardState!=='undefined'&&cardState?cardState:null;}
function ownedFree(id){const s=state();if(!s||!s.cards)return 0;if(s.flags&&s.flags[id]&&s.flags[id].locked)return 0;return Number(s.cards[id])||0;}
function ownedAny(id){const s=state();return s&&s.cards?Number(s.cards[id])||0:0;}
function ago(iso){const ms=Date.now()-Date.parse(iso);if(!(ms>=0))return '';const m=Math.floor(ms/60000),h=Math.floor(m/60),d=Math.floor(h/24);
 if(m<60)return L3('il y a '+Math.max(1,m)+' min',Math.max(1,m)+' min ago','hace '+Math.max(1,m)+' min');
 if(h<48)return L3('il y a '+h+' h',h+' h ago','hace '+h+' h');return L3('il y a '+d+' j',d+' d ago','hace '+d+' d');}
function msg(text,bad){if(M())M().msg(text,bad);}

async function load(force){
 if(!uid()||!window.sakuBackend||!window.sakuBackend.tradePostList)return;
 const k=kind;if(!force&&posts[k]&&Date.now()-loadedAt[k]<30000){render();return;}
 const tok=++token;if(!posts[k])render();
 try{const list=await window.sakuBackend.tradePostList(k);if(tok!==token)return;posts[k]=Array.isArray(list)?list:[];loadedAt[k]=Date.now();render();}
 catch(e){if(tok!==token)return;posts[k]=posts[k]||[];render();msg(K()?K().errText(e):String(e.message||e),true);}
}
function postHtml(p){
 const c=card(p.card),k=K();if(!c||!k)return '';
 const lvl=p.level==null?null:Number(p.level),v=k.valueOf(p.card,lvl),has=ownedFree(String(p.card)),offers=Number(p.offers)||0;
 let actions='';
 if(p.mine){actions='<span class="xb-mine">'+esc(L3('Ton annonce','Your post','Tu anuncio'))+'</span>'+(offers?'<button type="button" class="market-subtle" data-xa="deals">'+esc(L3('Voir les offres','See offers','Ver ofertas'))+' ('+offers+')</button>':'')+'<button type="button" class="market-subtle" data-xa="close" data-id="'+esc(p.id)+'">'+esc(L3('Retirer','Withdraw','Retirar'))+'</button>';}
 else if(p.my_offer){actions='<button type="button" class="market-subtle" data-xa="deals">'+esc(L3('Offre envoyée · voir','Offer sent · view','Oferta enviada · ver'))+'</button>';}
 else if(p.kind==='offer'){actions='<button type="button" class="market-button" data-xa="answer" data-id="'+esc(p.id)+'">'+esc(L3('Faire une offre','Make an offer','Hacer una oferta'))+'</button>';}
 else{actions=has?'<button type="button" class="market-button" data-xa="answer" data-id="'+esc(p.id)+'">'+esc(L3("Je l'ai — proposer","I have it — offer","La tengo — ofrecer"))+'</button>':'<button type="button" class="market-subtle" disabled>'+esc(L3("Tu ne l'as pas",'You don\'t have it','No la tienes'))+'</button>';}
 const flag=p.kind==='seek'&&!p.mine&&has?'<span class="xb-flag have">'+esc(L3("Tu l'as !",'You have it!','¡La tienes!'))+'</span>':p.kind==='offer'&&!p.mine&&!ownedAny(String(p.card))?'<span class="xb-flag new">'+esc(L3('Te manque','Missing','Te falta'))+'</span>':'';
 return '<article class="xb-post'+(p.mine?' is-mine':'')+'" style="--r:'+(RAR_COL[c.rarity]||'#cfd6df')+'">'
  +'<div class="xb-art">'+k.art(c,lvl||0)+flag+'</div>'
  +'<div class="xb-info"><div class="xb-title"><b data-noi18n>'+esc(c.name)+'</b><small data-noi18n>'+esc(c.series||'')+'</small></div>'
  +'<div class="xb-tags"><span class="xb-rar"><i></i>'+esc(rarName(c.rarity))+'</span>'+(lvl!=null?'<span class="xb-lvl">'+esc(levelTxt(lvl))+'</span>':'')+k.totalHtml({total:v.value,pending:!v.known})+'</div>'
  +(p.note?'<p class="xb-note" data-noi18n>« '+esc(p.note)+' »</p>':'')
  +'<div class="xb-meta"><button type="button" class="xb-owner" data-xa="profile" data-id="'+esc(p.owner)+'"><span>'+esc(String(p.owner_name||'?').trim().charAt(0).toUpperCase()||'?')+'</span><b data-noi18n>'+esc(p.owner_name||tr('Player'))+'</b></button><small>'+esc(ago(p.created_at))+(offers&&!p.mine?' · '+offers+' '+(offers>1?L3('offres','offers','ofertas'):L3('offre','offer','oferta')):'')+'</small></div>'
  +'<div class="xb-actions">'+actions+'</div></div></article>';
}
function render(){
 const grid=$('xbGrid');if(!grid)return;
 document.querySelectorAll('[data-xb]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.xb===kind)));
 $('xbExplain').textContent=kind==='offer'?L3("Des joueurs mettent ici une carte à l'échange. Fais une offre avec tes cartes : l'auteur de l'annonce choisit l'offre qu'il accepte.","Players put a card up for exchange here. Make an offer with your cards: the author of the post picks the offer they accept.","Aquí los jugadores ponen una carta para intercambiar. Haz una oferta con tus cartas: el autor del anuncio elige la oferta que acepta."):L3("Des joueurs cherchent ces cartes. Si tu en as une, propose-la contre des cartes de sa collection : l'auteur de l'annonce valide.","Players are looking for these cards. If you have one, offer it in exchange for cards from their collection: the author of the post validates.","Los jugadores buscan estas cartas. Si tienes una, ofrécela a cambio de cartas de su colección: el autor del anuncio valida.");
 $('xbCreate').textContent=kind==='offer'?L3('+ Proposer une carte','+ Offer a card','+ Ofrecer una carta'):L3('+ Chercher une carte','+ Look for a card','+ Buscar una carta');
 $('xbOnlyLabel').textContent=kind==='offer'?L3('Seulement les cartes qui me manquent','Only cards I\'m missing','Solo las cartas que me faltan'):L3('Seulement les cartes que je possède','Only cards I own','Solo las cartas que tengo');
 $('xbOnly').checked=only;
 const list=posts[kind];
 if(!list){$('xbRarities').innerHTML='';grid.innerHTML='<p class="trade-empty">'+esc(L3('Chargement des annonces…','Loading posts…','Cargando anuncios…'))+'</p>';return;}
 const k=K();if(k)k.needValues(list.map(p=>({card:p.card,level:p.level==null?null:Number(p.level)})),()=>{if(!$('marketExchange').hidden)render();});
 const q=query.trim().toLocaleLowerCase(),counts={all:0},shown=[];
 list.forEach(p=>{const c=card(p.card);if(!c)return;if(q&&!(c.name+' '+(c.series||'')+' '+(p.owner_name||'')).toLocaleLowerCase().includes(q))return;
  if(only&&!p.mine){if(kind==='offer'&&ownedAny(String(p.card)))return;if(kind==='seek'&&!ownedFree(String(p.card)))return;}
  counts.all++;counts[c.rarity]=(counts[c.rarity]||0)+1;if(rar==='all'||c.rarity===rar)shown.push(p);});
 $('xbRarities').innerHTML=['all'].concat(RAR.filter(r=>counts[r])).map(r=>'<button type="button" data-xrar="'+r+'" aria-pressed="'+(rar===r)+'"'+(r==='all'?'':' style="--r:'+RAR_COL[r]+'"')+'>'+(r==='all'?esc(L3('Toutes','All','Todas')):'<i></i>'+esc(rarName(r)))+'<b>'+(counts[r]||0)+'</b></button>').join('');
 if(!shown.length){grid.innerHTML='<div class="xb-empty"><b>'+esc(list.length?L3('Aucune annonce ne correspond.','No post matches.','Ningún anuncio coincide.'):kind==='offer'?L3("Aucune carte à l'échange pour l'instant.","No card up for exchange yet.","Aún no hay cartas para intercambiar."):L3('Personne ne cherche de carte pour le moment.','Nobody is looking for a card right now.','Nadie busca cartas por ahora.'))+'</b>'+(list.length?'':'<small>'+esc(kind==='offer'?L3('Sois le premier : mets une de tes cartes à l\'échange.','Be the first: put one of your cards up for exchange.','Sé el primero: pon una de tus cartas a intercambiar.'):L3('Publie la carte qui te manque : les joueurs qui l\'ont pourront te la proposer.','Post the card you\'re missing: players who have it can offer it to you.','Publica la carta que te falta: los jugadores que la tengan podrán ofrecértela.'))+'</small>')+'</div>';return;}
 grid.innerHTML=shown.slice(0,visible).map(postHtml).join('')+(shown.length>visible?'<button type="button" class="market-subtle trade-more" data-xmore="1">'+esc(L3('Afficher plus','Show more','Mostrar más'))+' ('+(shown.length-visible)+')</button>':'');
 if(window.sakuBasicObserve)window.sakuBasicObserve(grid);
}
async function closePost(id,btn){
 if(btn)btn.disabled=true;
 try{await window.sakuBackend.tradePostClose(id);if(K())K().sfx('tap');msg(L3('Annonce retirée. Les offres en attente ont été refusées et leurs cartes rendues.','Post withdrawn. Pending offers were declined and their cards returned.','Anuncio retirado. Las ofertas pendientes se rechazaron y sus cartas se devolvieron.'),false);}
 catch(e){msg(K()?K().errText(e):String(e.message||e),true);}
 await load(true);
}

/* ---------- Création d'annonce ---------- */
let pKind='offer',pQuery='',pRar='all',pMissing=true,pSel=null,pVisible=120,pBusy=false;
function pickItems(){
 if(pKind==='offer'){const k=K();return k?k.mineItems().map(it=>({c:it.c,level:it.level,count:it.count})):[];}
 const list=M()?M().list():[];return list.filter(c=>!pMissing||!ownedAny(String(c.id))).map(c=>({c,level:null,count:ownedAny(String(c.id))}));
}
function renderPick(){
 const grid=$('xbPostGrid'),k=K(),q=pQuery.trim().toLocaleLowerCase(),counts={all:0},list=[];
 pickItems().forEach(it=>{if(q&&!(it.c.name+' '+(it.c.series||'')).toLocaleLowerCase().includes(q))return;counts.all++;counts[it.c.rarity]=(counts[it.c.rarity]||0)+1;if(pRar==='all'||it.c.rarity===pRar)list.push(it);});
 const rk=c=>RAR.indexOf(c.rarity);list.sort((a,b)=>rk(b.c)-rk(a.c)||(b.level||0)-(a.level||0)||String(a.c.name).localeCompare(String(b.c.name)));
 $('xbPostRarities').innerHTML=['all'].concat(RAR.filter(r=>counts[r])).map(r=>'<button type="button" data-prar="'+r+'" aria-pressed="'+(pRar===r)+'"'+(r==='all'?'':' style="--r:'+RAR_COL[r]+'"')+'>'+(r==='all'?esc(L3('Toutes','All','Todas')):'<i></i>'+esc(rarName(r)))+'<b>'+(counts[r]||0)+'</b></button>').join('');
 if(!list.length){grid.innerHTML='<p class="trade-empty">'+esc(q||pRar!=='all'?L3('Aucune carte ne correspond.','No card matches.','Ninguna carta coincide.'):pKind==='offer'?L3('Aucune carte échangeable : les cartes verrouillées ne peuvent pas être proposées.','No tradable card: locked cards cannot be offered.','Ninguna carta intercambiable: las cartas bloqueadas no se pueden ofrecer.'):L3('Tu possèdes déjà toutes les cartes !','You already own every card!','¡Ya tienes todas las cartas!'))+'</p>';}
 else grid.innerHTML=list.slice(0,pVisible).map(it=>{const id=String(it.c.id),sel=pSel&&pSel.id===id&&(pKind==='seek'||pSel.level===it.level);
  return '<button type="button" class="trade-tile'+(sel?' picked':'')+'" data-pid="'+esc(id)+'" data-plevel="'+(it.level==null?'':it.level)+'" style="--r:'+(RAR_COL[it.c.rarity]||'#cfd6df')+'" aria-pressed="'+(!!sel)+'" aria-label="'+esc(it.c.name+' · '+rarName(it.c.rarity)+(it.level?' · '+stars(it.level):''))+'"><span class="trade-tile-art">'+(k?k.art(it.c,it.level||0):'')+(pKind==='offer'?'<span class="trade-tile-count">× '+it.count+'</span>':'')+(sel?'<span class="trade-tile-check">✓</span>':'')+'</span><span class="trade-tile-foot"><i></i><span data-noi18n>'+esc(it.c.name)+'</span></span></button>';}).join('')+(list.length>pVisible?'<button type="button" class="market-subtle trade-more" data-pmore="1">'+esc(L3('Afficher plus','Show more','Mostrar más'))+' ('+(list.length-pVisible)+')</button>':'');
 if(window.sakuBasicObserve)window.sakuBasicObserve(grid);
 renderChosen();
}
function renderChosen(){
 const box=$('xbPostChosen'),k=K();
 if(!pSel){box.innerHTML='<p class="trade-slots-empty">'+esc(pKind==='offer'?L3('Choisis la carte à mettre à l\'échange.','Pick the card to put up for exchange.','Elige la carta que quieres intercambiar.'):L3('Choisis la carte que tu cherches.','Pick the card you are looking for.','Elige la carta que buscas.'))+'</p>';$('xbPostSubmit').disabled=true;return;}
 const c=card(pSel.id),v=k?k.valueOf(pSel.id,pSel.level):{value:0,known:true};
 if(k)k.needValues([{card:pSel.id,level:pSel.level}],()=>{if($('xbPostDialog').open)renderChosen();});
 box.innerHTML='<div class="xb-chosen" style="--r:'+(RAR_COL[c&&c.rarity]||'#cfd6df')+'"><span class="deal-card-art">'+(k&&c?k.art(c,pSel.level||0):'')+'</span><div><small>'+esc(pKind==='offer'?L3('Tu mets à l\'échange','You put up for exchange','Pones a intercambiar'):L3('Tu cherches','You are looking for','Buscas'))+'</small><b data-noi18n>'+esc(c?c.name:pSel.id)+'</b><span class="xb-tags"><span class="xb-rar"><i></i>'+esc(rarName(c&&c.rarity))+'</span>'+(pSel.level!=null?'<span class="xb-lvl">'+esc(levelTxt(pSel.level))+'</span>':'')+(k?k.totalHtml({total:v.value,pending:!v.known}):'')+'</span></div></div>';
 $('xbPostSubmit').disabled=pBusy;
 if(window.sakuBasicObserve)window.sakuBasicObserve(box);
}
async function openPost(k){
 if(!uid()){msg('Your session expired — sign in again to use the market.',true);return;}
 pKind=k;pQuery='';pRar='all';pMissing=true;pSel=null;pVisible=120;pBusy=false;
 $('xbPostKicker').textContent=pKind==='offer'?L3('PROPOSER','PROPOSE','PROPONER'):L3('CHERCHER','SEARCH','BUSCAR');
 $('xbPostTitle').textContent=pKind==='offer'?L3("Mettre une carte à l'échange","Put a card up for exchange","Poner una carta a intercambiar"):L3('Chercher une carte','Look for a card','Buscar una carta');
 $('xbPostHelp').textContent=pKind==='offer'?L3("Les autres joueurs te feront des offres avec leurs cartes. C'est toi qui choisis l'offre que tu acceptes.","Other players will make offers with their cards. You choose the offer you accept.","Los demás jugadores te harán ofertas con sus cartas. Tú eliges la oferta que aceptas."):L3('Les joueurs qui possèdent cette carte pourront te la proposer contre des cartes de ta collection. Tu valides ou refuses.','Players who own this card can offer it in exchange for cards from your collection. You accept or decline.','Los jugadores que tengan esta carta podrán ofrecértela a cambio de cartas de tu colección. Tú aceptas o rechazas.');
 $('xbPostNoteHelp').textContent=L3("L'annonce reste visible 14 jours, ou jusqu'à ce que tu acceptes une offre ou la retires. 10 annonces ouvertes maximum par type.","The post stays visible for 14 days, or until you accept an offer or withdraw it. Up to 10 open posts per type.","El anuncio queda visible 14 días, o hasta que aceptes una oferta o lo retires. Máximo 10 anuncios abiertos por tipo.");
 $('xbPostMissingWrap').hidden=pKind!=='seek';$('xbPostMissing').checked=true;$('xbPostMissingLabel').textContent=L3('Seulement les cartes qui me manquent','Only cards I\'m missing','Solo las cartas que me faltan');
 $('xbPostSearch').value='';$('xbPostNote').value='';$('xbPostError').textContent='';$('xbPostSubmit').textContent=L3("Publier l'annonce",'Publish the post','Publicar el anuncio');
 const d=$('xbPostDialog');if(!d.open)d.showModal();renderPick();
 try{if(pKind==='offer'&&window.sakuBackend&&typeof cardNormalize==='function'){const cards=await window.sakuBackend.gameCollection();cardState=cardNormalize(cards);if(typeof currentAccount!=='undefined'&&currentAccount)currentAccount.cards=cardState;if(d.open)renderPick();}}catch(e){}
}
async function submitPost(){
 if(pBusy||!pSel)return;pBusy=true;$('xbPostSubmit').disabled=true;$('xbPostError').textContent='';
 try{await window.sakuBackend.tradePostCreate(pKind,pSel.id,pKind==='offer'?pSel.level:null,$('xbPostNote').value.trim().slice(0,140));
  $('xbPostDialog').close();if(K())K().sfx('coin');kind=pKind;msg(pKind==='offer'?L3("Annonce publiée : les offres arriveront dans Mes affaires.","Post published: offers will arrive in My deals.","Anuncio publicado: las ofertas llegarán a Mis negocios."):L3('Recherche publiée : les propositions arriveront dans Mes affaires.','Search published: proposals will arrive in My deals.','Búsqueda publicada: las propuestas llegarán a Mis negocios.'),false);await load(true);}
 catch(e){$('xbPostError').textContent=K()?K().errText(e):String(e.message||e);}
 finally{pBusy=false;if($('xbPostDialog').open)renderChosen();}
}

window.sakuExchangeShow=()=>load(false);
window.sakuExchangeRefresh=()=>{loadedAt.offer=loadedAt.seek=0;if($('marketExchange')&&!$('marketExchange').hidden)load(true);};
document.addEventListener('DOMContentLoaded',()=>{
 const sec=$('marketExchange');if(!sec)return;
 sec.addEventListener('click',e=>{
  const seg=e.target.closest('[data-xb]');if(seg){kind=seg.dataset.xb;rar='all';visible=60;load(false);return;}
  const r=e.target.closest('[data-xrar]');if(r){rar=r.dataset.xrar;render();return;}
  if(e.target.closest('[data-xmore]')){visible+=60;render();return;}
  if(e.target.closest('#xbCreate')){openPost(kind);return;}
  const a=e.target.closest('[data-xa]');if(!a||a.disabled)return;
  const act=a.dataset.xa,id=a.dataset.id;
  if(act==='profile'){if(window.showShowcase)window.showShowcase(id);return;}
  if(act==='deals'){if(M())M().setTab('deals');return;}
  if(act==='close'){closePost(id,a);return;}
  if(act==='answer'){const p=(posts[kind]||[]).find(x=>String(x.id)===id);if(p&&window.sakuTradeOpen)window.sakuTradeOpen({id:p.owner,name:p.owner_name,cards:[]},{post:p});}
 });
 $('xbSearch').addEventListener('input',e=>{query=e.target.value;visible=60;render();});
 $('xbOnly').addEventListener('change',e=>{only=e.target.checked;render();});
 const d=$('xbPostDialog');
 $('xbPostClose').addEventListener('click',()=>d.close());
 d.addEventListener('click',e=>{if(e.target===d){d.close();return;}
  const r=e.target.closest('[data-prar]');if(r){pRar=r.dataset.prar;renderPick();return;}
  if(e.target.closest('[data-pmore]')){pVisible+=120;renderPick();return;}
  const tile=e.target.closest('[data-pid]');if(tile){const id=tile.dataset.pid,lv=tile.dataset.plevel===''?null:Number(tile.dataset.plevel);pSel=pSel&&pSel.id===id&&pSel.level===lv?null:{id,level:lv};$('xbPostError').textContent='';if(K())K().sfx('tap');renderPick();}
 });
 $('xbPostSearch').addEventListener('input',e=>{pQuery=e.target.value;pVisible=120;renderPick();});
 $('xbPostMissing').addEventListener('change',e=>{pMissing=e.target.checked;renderPick();});
 $('xbPostForm').addEventListener('submit',e=>{e.preventDefault();submitPost();});
});
})();
