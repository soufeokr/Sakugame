/* Sakugame — « Tout hypothéquer » : Sakugame rachète les doublons (hors marché) à 50 % de leur prix médian.
   Le navigateur affiche seulement l'aperçu ; les prix et la vente sont calculés par le serveur
   (buyback_quote / buyback_sell), qui ne rachète jamais les cartes verrouillées ni l'exemplaire du meilleur niveau. */
(function(){'use strict';
const L3=(fr,en,es)=>{const l=(window.SAKU_I18N||{}).lang;return l==='fr'?fr:l==='es'?es:en;};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=id=>document.getElementById(id);
const NEED3=[7,6,4,0]; // doublons nécessaires pour monter au niveau 3 depuis le niveau 0, 1, 2, 3
const KEEPS=[0,1,2,-1];
const PAGE=120,COIN='<img class="mg-coin" src="summon-machines/coin.svg" alt="">';
let keep=1,skipFav=true,mode='rarity',rars=null,picked=new Set(),query='',cardRar='',shown=PAGE,busy=false,request=null,requestKey='';
let prices=null,pricesFor='',loading=false,loadError=false;
const M=()=>window.sakuMarket;
const nf=n=>Number(n||0).toLocaleString((window.SAKU_I18N||{}).lang||undefined);
const flags=id=>(typeof cardState!=='undefined'&&cardState&&cardState.flags&&cardState.flags[id])||{};
function info(id){const m=M();const c=m&&m.card(id);if(c)return c;const p=typeof cardPoolById!=='undefined'&&cardPoolById&&cardPoolById[String(id)];return p?{id:String(id),name:p.name,image:p.image,series:p.series,rarity:p.rarity,edition:p.edition}:null;}
/* Doublons vendables d'une carte selon l'option « garder ». */
function simulate(id){
 const counts=window.sakuCardLevelCounts(typeof cardState!=='undefined'?cardState:null,id);
 const total=counts.reduce((a,b)=>a+b,0);if(!total)return null;
 const best=[3,2,1].find(l=>counts[l])||0,k=keep>=0?keep:NEED3[best];
 const sell=Math.max(0,counts[0]-(best===0?1:0)-k);
 const c=info(id),f=flags(String(id));
 const price=prices&&prices[String(id)];
 return {id:String(id),c,rarity:c&&c.rarity||'common',best,sell,locked:!!f.locked,favorite:!!f.favorite,value:price?price.value:0,source:price?price.source:'',known:!!price,total:sell*(price?price.value:0)};
}
function owned(){const cards=(typeof cardState!=='undefined'&&cardState&&cardState.cards)||{};return Object.keys(cards).filter(id=>cards[id]>0);}
function all(){return owned().map(simulate).filter(s=>s&&s.c);}
function sellable(list){return list.filter(s=>s.sell>0&&!s.locked&&!(skipFav&&s.favorite)&&(!prices||s.known));}
function plan(list){const ok=sellable(list);return mode==='rarity'?ok.filter(s=>rars.has(s.rarity)):ok.filter(s=>picked.has(s.id));}
function countAvailable(){const k=keep;keep=1;const n=owned().map(simulate).filter(s=>s&&s.sell>0&&!s.locked).length;keep=k;return n;}

async function loadPrices(){
 const ids=owned().filter(id=>{const c=window.sakuCardLevelCounts(cardState,id);return c[0]>0;}).sort(),key=ids.join(',');
 if(prices&&pricesFor===key)return;
 if(!window.sakuBackend||!window.sakuBackend.buybackQuote){prices=null;return;}
 loading=true;loadError=false;render();
 try{const out={};for(let i=0;i<ids.length;i+=2000){const r=await window.sakuBackend.buybackQuote(ids.slice(i,i+2000));(r||[]).forEach(v=>{out[String(v.card)]={value:Number(v.value)||0,base:Number(v.base)||0,source:v.source};});}
  prices=out;pricesFor=key;}
 catch(e){loadError=true;}
 loading=false;render();
}
function ensure(){
 let d=$('mgDialog');if(d)return d;
 d=document.createElement('dialog');d.id='mgDialog';d.className='trade-dialog ua-dialog mg-dialog';d.setAttribute('aria-labelledby','mgTitle');
 d.innerHTML='<form class="trade-shell" id="mgForm" novalidate>'+
  '<header class="trade-top"><div><span class="market-kicker" data-noi18n>COLLECTION</span><h2 id="mgTitle"></h2><p class="trade-with" id="mgHelp"></p></div><button type="button" class="trade-x" id="mgClose">×</button></header>'+
  '<section class="ua-block"><div class="ua-head"><h3 id="mgKeepTitle"></h3><label class="xb-only mg-fav"><input type="checkbox" id="mgFav" checked><span id="mgFavLabel"></span></label></div><div class="mg-keeps" id="mgKeeps" role="radiogroup"></div></section>'+
  '<section class="ua-block"><div class="ua-head"><h3 id="mgWhichTitle"></h3><div class="ua-seg" id="mgMode" role="group"></div></div><div id="mgBody"></div></section>'+
  '<div class="ua-sum mg-sum" id="mgSum" aria-live="polite"></div>'+
  '<footer class="trade-foot"><p class="trade-note" id="mgNote"></p><p class="trade-error" id="mgError" role="alert"></p><button type="submit" class="market-button" id="mgSubmit"></button></footer>'+
 '</form>';
 document.body.appendChild(d);
 $('mgClose').addEventListener('click',()=>{if(!busy)d.close();});
 d.addEventListener('cancel',e=>{if(busy)e.preventDefault();});
 d.addEventListener('click',e=>{if(e.target===d&&!busy)d.close();});
 $('mgForm').addEventListener('submit',e=>{e.preventDefault();submit();});
 $('mgFav').addEventListener('change',e=>{skipFav=e.target.checked;render();});
 $('mgKeeps').addEventListener('click',e=>{const b=e.target.closest('button[data-keep]');if(!b||busy)return;keep=Number(b.dataset.keep);render();});
 $('mgMode').addEventListener('click',e=>{const b=e.target.closest('button[data-mode]');if(!b||busy)return;mode=b.dataset.mode;shown=PAGE;render();});
 $('mgBody').addEventListener('click',e=>{if(busy)return;
  const r=e.target.closest('[data-rar]');if(r&&!r.disabled){const k=r.dataset.rar;if(mode==='rarity'){rars.has(k)?rars.delete(k):rars.add(k);}else{cardRar=cardRar===k?'':k;shown=PAGE;}render();return;}
  const t=e.target.closest('.ua-tile');if(t&&!t.disabled){const id=t.dataset.id;picked.has(id)?picked.delete(id):picked.add(id);const on=picked.has(id);t.classList.toggle('picked',on);t.setAttribute('aria-pressed',String(on));const art=t.querySelector('.trade-tile-art'),ck=t.querySelector('.trade-tile-check');if(on&&!ck)art.insertAdjacentHTML('beforeend','<span class="trade-tile-check">✓</span>');else if(!on&&ck)ck.remove();renderSum(all());return;}
  const a=e.target.closest('[data-act]');if(!a)return;
  if(a.dataset.act==='all')visible(all()).forEach(s=>picked.add(s.id));
  else if(a.dataset.act==='none')picked.clear();
  else if(a.dataset.act==='more')shown+=PAGE;
  else if(a.dataset.act==='retry'){pricesFor='';loadPrices();return;}
  const g=$('mgGrid'),top=g?g.scrollTop:0;renderBody(all(),true);renderSum(all());const g2=$('mgGrid');if(g2)g2.scrollTop=top;});
 $('mgBody').addEventListener('input',e=>{if(e.target.id==='mgSearch'){query=e.target.value;shown=PAGE;renderBody(all(),true);renderSum(all());}});
 return d;
}
function visible(list){const q=query.trim().toLocaleLowerCase();return sellable(list).filter(s=>(!cardRar||s.rarity===cardRar)&&(!q||(s.c.name+' '+(s.c.series||'')).toLocaleLowerCase().includes(q)))
 .sort((a,b)=>b.total-a.total||String(a.c.name).localeCompare(String(b.c.name)));}
function keepLabel(k){return k<0?[L3('De quoi','Enough for','Lo justo para'),L3('monter au niv. 3','level 3','el nivel 3')]:k===0?[L3('Aucun','None','Ninguno'),L3('tout vendre','sell all','vender todo')]:[String(k),L3(k>1?'doublons':'doublon',k>1?'duplicates':'duplicate',k>1?'duplicados':'duplicado')];}
function render(){
 const d=$('mgDialog');if(!d)return;const list=all(),m=M();
 if(!rars)rars=new Set(m.RAR);
 $('mgTitle').textContent=L3('Tout hypothéquer','Mortgage all','Hipotecar todo');
 $('mgHelp').textContent=L3('Sakugame te rachète tes doublons à 50 % de leur prix médian, sans passer par le marché.','Sakugame buys back your duplicates at 50% of their median price, without going through the market.','Sakugame te recompra tus duplicados al 50 % de su precio mediano, sin pasar por el mercado.');
 $('mgClose').setAttribute('aria-label',L3('Fermer','Close','Cerrar'));
 $('mgKeepTitle').textContent=L3('Doublons à garder par carte','Duplicates to keep per card','Duplicados que conservar por carta');
 $('mgFavLabel').textContent=L3('Garder les favoris','Keep favorites','Conservar favoritos');$('mgFav').checked=skipFav;
 $('mgKeeps').setAttribute('aria-label',L3('Doublons à garder','Duplicates to keep','Duplicados que conservar'));
 $('mgKeeps').innerHTML=KEEPS.map(k=>{const l=keepLabel(k);return '<button type="button" role="radio" data-keep="'+k+'" aria-checked="'+(k===keep)+'" class="mg-keep"><b>'+esc(l[0])+'</b><small>'+esc(l[1])+'</small></button>';}).join('');
 $('mgWhichTitle').textContent=L3('Quelles cartes','Which cards','Qué cartas');
 $('mgMode').setAttribute('aria-label',L3('Choisir par','Choose by','Elegir por'));
 $('mgMode').innerHTML=[['rarity',L3('Par rareté','By rarity','Por rareza')],['cards',L3('Par carte','By card','Por carta')]].map(([k,v])=>'<button type="button" data-mode="'+k+'" aria-pressed="'+(mode===k)+'">'+esc(v)+'</button>').join('');
 renderBody(list,false);renderSum(list);
}
function renderBody(list,keepTools){
 const m=M(),body=$('mgBody');
 if(loading){body.innerHTML='<p class="ua-empty mg-wait">'+esc(L3('Calcul des prix de rachat…','Calculating buyback prices…','Calculando precios de recompra…'))+'</p>';return;}
 if(loadError){body.innerHTML='<p class="ua-empty">'+esc(L3('Les prix de rachat n\'ont pas pu être chargés.','Buyback prices could not be loaded.','No se pudieron cargar los precios de recompra.'))+' <button type="button" class="ua-link" data-act="retry">'+esc(L3('Réessayer','Retry','Reintentar'))+'</button></p>';return;}
 const ok=sellable(list);
 if(mode==='rarity'){
  body.innerHTML='<div class="ua-rars">'+m.RAR.map(k=>{const g=ok.filter(s=>s.rarity===k),n=g.reduce((a,s)=>a+s.sell,0),coins=g.reduce((a,s)=>a+s.total,0),on=rars.has(k)&&n>0;
   return '<button type="button" class="ua-rar" data-rar="'+k+'" style="--r:'+m.RAR_COL[k]+'" aria-pressed="'+on+'"'+(n?'':' disabled')+'><span class="ua-rar-top"><i></i><b>'+esc(m.rarName(k))+'</b><span class="ua-check" aria-hidden="true"></span></span><small>'+(n?esc(nf(n)+' '+L3(n>1?'doublons':'doublon',n>1?'duplicates':'duplicate',n>1?'duplicados':'duplicado')):esc(L3('Aucun doublon à vendre','No duplicates to sell','Ningún duplicado para vender')))+'</small><span class="mg-rar-coins">'+(n?'+'+nf(coins)+' '+COIN:'')+'</span></button>';}).join('')+'</div>';
  return;
 }
 const vis=visible(list),page=vis.slice(0,shown);
 const grid='<div class="trade-grid ua-grid" id="mgGrid">'+(page.length?page.map(s=>{const sel=picked.has(s.id);
   return '<button type="button" class="trade-tile ua-tile'+(sel?' picked':'')+'" data-id="'+esc(s.id)+'" style="--r:'+(m.RAR_COL[s.rarity]||'#cfd6df')+'" aria-pressed="'+sel+'" aria-label="'+esc(s.c.name+' · '+m.rarName(s.rarity)+' · × '+s.sell+' · '+nf(s.total))+'"><span class="trade-tile-art">'+m.image(Object.assign({},s.c,{marketLevel:0}))+'<span class="trade-tile-count">× '+s.sell+'</span>'+(sel?'<span class="trade-tile-check">✓</span>':'')+'</span><span class="trade-tile-foot"><i></i><span data-noi18n>'+esc(s.c.name)+'</span></span><span class="ua-tile-lv mg-tile-coins">+'+nf(s.total)+' '+COIN+'</span></button>';}).join(''):'<p class="ua-empty">'+esc(L3('Aucun doublon à vendre avec ces réglages.','No duplicates to sell with these settings.','Ningún duplicado para vender con estos ajustes.'))+'</p>')+'</div>'+
  (vis.length>shown?'<button type="button" class="ua-more" data-act="more">'+esc(L3('Afficher plus','Show more','Mostrar más')+' ('+nf(vis.length-shown)+')')+'</button>':'');
 if(keepTools&&$('mgGridWrap')){$('mgGridWrap').innerHTML=grid;return;}
 body.innerHTML='<div class="trade-picker-tools ua-tools"><input type="search" id="mgSearch" placeholder="'+esc(L3('Chercher une carte ou une série…','Search a card or series…','Buscar una carta o serie…'))+'" aria-label="'+esc(L3('Chercher une carte ou une série…','Search a card or series…','Buscar una carta o serie…'))+'" value="'+esc(query)+'"><div class="trade-rar">'+m.RAR.map(k=>{const n=ok.filter(s=>s.rarity===k).length;return n?'<button type="button" data-rar="'+k+'" style="--r:'+m.RAR_COL[k]+'" aria-pressed="'+(cardRar===k)+'"><i></i>'+esc(m.rarName(k))+' <b>'+nf(n)+'</b></button>':'';}).join('')+'</div>'+
  '<span class="ua-pick-acts"><button type="button" class="ua-link" data-act="all">'+esc(L3('Tout sélectionner','Select all','Seleccionar todo'))+'</button><button type="button" class="ua-link" data-act="none">'+esc(L3('Aucune','None','Ninguna'))+'</button></span></div><div id="mgGridWrap">'+grid+'</div>';
}
function renderSum(list){
 const p=(loading||loadError)?[]:plan(list),copies=p.reduce((a,s)=>a+s.sell,0),coins=p.reduce((a,s)=>a+s.total,0);
 const cell=(v,l,cls)=>'<div class="ua-stat'+(cls?' '+cls:'')+'"><b>'+v+'</b><span>'+esc(l)+'</span></div>';
 $('mgSum').innerHTML=cell(nf(p.length),L3(p.length>1?'cartes':'carte',p.length>1?'cards':'card',p.length>1?'cartas':'carta'))+cell(nf(copies),L3('doublons vendus','duplicates sold','duplicados vendidos'))+cell('+'+nf(coins)+' '+COIN,L3('pièces','coins','monedas'),'coins');
 const btn=$('mgSubmit');btn.disabled=busy||loading||!p.length;
 btn.textContent=busy?L3('Vente en cours…','Selling…','Vendiendo…'):p.length?L3('Vendre '+nf(copies)+(copies>1?' doublons':' doublon'),'Sell '+nf(copies)+(copies>1?' duplicates':' duplicate'),'Vender '+nf(copies)+(copies>1?' duplicados':' duplicado')):L3('Rien à vendre','Nothing to sell','Nada que vender');
 $('mgNote').textContent=L3('Prix médian des ventes au niveau 0 sur 30 jours (si au moins 3 vendeurs et 3 acheteurs différents), sinon prix minimum de la rareté. Les cartes verrouillées ne sont jamais vendues. Une vente est définitive.','Median price of level 0 sales over 30 days (with at least 3 different sellers and 3 different buyers), otherwise the rarity\'s minimum price. Locked cards are never sold. Sales are final.','Precio mediano de las ventas de nivel 0 en 30 días (con al menos 3 vendedores y 3 compradores distintos); si no, el precio mínimo de la rareza. Las cartas bloqueadas nunca se venden. La venta es definitiva.');
}
async function submit(){
 if(busy||loading)return;const p=plan(all());if(!p.length)return;
 if(!window.sakuSecureUserId||!window.sakuBackend||!window.sakuBackend.buybackSell){$('mgError').textContent=L3('Connecte-toi pour vendre tes doublons.','Sign in to sell your duplicates.','Inicia sesión para vender tus duplicados.');return;}
 const ids=p.map(s=>s.id).sort(),key=keep+':'+skipFav+':'+ids.join(',');
 if(key!==requestKey||!request){request=crypto.randomUUID();requestKey=key;} // même demande = même identifiant (un nouvel essai ne vend pas deux fois)
 busy=true;$('mgError').textContent='';renderSum(all());const actor=window.sakuSecureUserId;
 try{
  const r=await window.sakuBackend.buybackSell(ids,keep,skipFav,request);request=null;requestKey='';
  if(r&&Number.isFinite(Number(r.coins))&&window.sakuProgressSetCoins)window.sakuProgressSetCoins(Number(r.coins));
  try{const state=await window.sakuBackend.gameCollection();if(window.sakuSecureUserId===actor){cardState=cardNormalize(state);if(typeof currentAccount!=='undefined'&&currentAccount)currentAccount.cards=cardNormalize(state);}}catch(e){}
  if(typeof cardsRenderStats==='function')cardsRenderStats();
  if(typeof cardsRenderAlbum==='function'&&$('collectionScreen')&&$('collectionScreen').classList.contains('active'))cardsRenderAlbum();
  busy=false;picked.clear();pricesFor='';$('mgDialog').close();
  const n=Number(r&&r.copies)||0,coins=Number(r&&r.coins_gained)||0;
  const msg=n?L3(nf(n)+(n>1?' doublons vendus':' doublon vendu')+' · +'+nf(coins)+' pièces',nf(n)+(n>1?' duplicates sold':' duplicate sold')+' · +'+nf(coins)+' coins',nf(n)+(n>1?' duplicados vendidos':' duplicado vendido')+' · +'+nf(coins)+' monedas'):L3('Aucun doublon n\'a été vendu.','No duplicate was sold.','No se vendió ningún duplicado.');
  if(window.sakuTradeKit&&window.sakuTradeKit.toast)window.sakuTradeKit.toast(msg);else if(typeof showNotification==='function')showNotification(msg);
 }catch(e){busy=false;$('mgError').textContent=L3('La vente n\'a pas pu être faite. Réessaie.','The sale could not be done. Try again.','No se pudo hacer la venta. Inténtalo de nuevo.');renderSum(all());}
}
function open(){
 if(!window.sakuMarket||typeof cardState==='undefined'||!cardState)return;
 const d=ensure();if(!rars)rars=new Set(M().RAR);
 $('mgError').textContent='';render();
 if(!d.open)d.showModal();
 loadPrices();
}
window.sakuMortgageOpen=open;
function syncButton(){const b=$('cardsMortgageAll');if(!b)return;let n=0;try{n=(typeof cardState!=='undefined'&&cardState&&window.sakuMarket)?countAvailable():0;}catch(e){}
 const lab=b.querySelector('.ua-btn-label');if(lab)lab.textContent=L3('Tout hypothéquer','Mortgage all','Hipotecar todo');
 const c=b.querySelector('.ua-btn-count');if(c){c.textContent=n?nf(n):'';c.hidden=!n;}}
window.sakuMortgageSync=syncButton;
if(typeof window.cardsRenderStats==='function'){const orig=window.cardsRenderStats;window.cardsRenderStats=function(){const r=orig.apply(this,arguments);syncButton();return r;};}
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#cardsMortgageAll'))open();});
})();
