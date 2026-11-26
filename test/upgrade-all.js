/* Sakugame — « Tout améliorer » : monter plusieurs cartes de niveau en une fois.
   Le navigateur calcule seulement l'aperçu ; l'amélioration elle-même est faite par le serveur
   (upgrade_cards_bulk), qui vérifie les doublons et verse l'XP. */
(function(){'use strict';
const L3=(fr,en,es)=>{const l=(window.SAKU_I18N||{}).lang;return l==='fr'?fr:l==='es'?es:en;};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=id=>document.getElementById(id);
const XP={common:1,uncommon:2,rare:4,epic:6,legendary:10,mythic:25,special:50};
const COST=[2,2,4]; // doublons de niveau 0 consommés pour passer de 0→1 (l'exemplaire amélioré compris), 1→2, 2→3
const NAMES=()=>[L3('Normale','Normal','Normal'),L3('Brillante','Shiny','Brillante'),L3('Prismatique','Prismatic','Prismática'),L3('Arc-en-ciel','Rainbow','Arcoíris')];
const PAGE=120;
let target=3,mode='rarity',rars=null,picked=new Set(),query='',cardRar='',shown=PAGE,busy=false,request=null,requestKey='';
const M=()=>window.sakuMarket;
const nf=n=>Number(n||0).toLocaleString((window.SAKU_I18N||{}).lang||undefined);
function info(id){const m=M();const c=m&&m.card(id);if(c)return c;const p=typeof cardPoolById!=='undefined'&&cardPoolById&&cardPoolById[String(id)];return p?{id:String(id),name:p.name,image:p.image,series:p.series,rarity:p.rarity,edition:p.edition}:null;}
/* Ce qui se passera pour une carte : niveau de départ, niveau atteint, doublons utilisés, XP. */
function simulate(id,goal){
 const counts=window.sakuCardLevelCounts(typeof cardState!=='undefined'?cardState:null,id);
 const total=counts.reduce((a,b)=>a+b,0);if(!total)return null;
 let lv=[3,2,1].find(l=>counts[l])||0;const from=lv;let base=counts[0],used=0;
 while(lv<goal&&base>=COST[lv]){base-=COST[lv];used+=COST[lv]-(lv===0?1:0);lv++;}
 const c=info(id),r=c&&c.rarity||'common';
 return {id:String(id),c,rarity:r,from,to:lv,steps:lv-from,used,xp:(lv-from)*(XP[r]||1)};
}
function all(){const cards=(typeof cardState!=='undefined'&&cardState&&cardState.cards)||{};const out=[];Object.keys(cards).forEach(id=>{if(!(cards[id]>0))return;const s=simulate(id,target);if(s&&s.c)out.push(s);});return out;}
function upgradable(list){return list.filter(s=>s.steps>0);}
function plan(list){const up=upgradable(list);return mode==='rarity'?up.filter(s=>rars.has(s.rarity)):up.filter(s=>picked.has(s.id));}
function countAvailable(){return upgradable(all()).length;}
window.sakuUpgradeAllCount=countAvailable;

function starRow(level){return window.sakuStarBadge?window.sakuStarBadge(level,{always:true}):'★'.repeat(level);}
function ensure(){
 let d=$('uaDialog');if(d)return d;
 d=document.createElement('dialog');d.id='uaDialog';d.className='trade-dialog ua-dialog';d.setAttribute('aria-labelledby','uaTitle');
 d.innerHTML='<form class="trade-shell" id="uaForm" novalidate>'+
  '<header class="trade-top"><div><span class="market-kicker" data-noi18n>COLLECTION</span><h2 id="uaTitle"></h2><p class="trade-with" id="uaHelp"></p></div><button type="button" class="trade-x" id="uaClose">×</button></header>'+
  '<section class="ua-block"><h3 id="uaLevelTitle"></h3><div class="ua-levels" id="uaLevels" role="radiogroup"></div></section>'+
  '<section class="ua-block"><div class="ua-head"><h3 id="uaWhichTitle"></h3><div class="ua-seg" id="uaMode" role="group"></div></div><div id="uaBody"></div></section>'+
  '<div class="ua-sum" id="uaSum" aria-live="polite"></div>'+
  '<footer class="trade-foot"><p class="trade-note" id="uaNote"></p><p class="trade-error" id="uaError" role="alert"></p><button type="submit" class="market-button" id="uaSubmit"></button></footer>'+
 '</form>';
 document.body.appendChild(d);
 $('uaClose').addEventListener('click',()=>{if(!busy)d.close();});
 d.addEventListener('cancel',e=>{if(busy)e.preventDefault();});
 d.addEventListener('click',e=>{if(e.target===d&&!busy)d.close();});
 $('uaForm').addEventListener('submit',e=>{e.preventDefault();submit();});
 $('uaLevels').addEventListener('click',e=>{const b=e.target.closest('button[data-lv]');if(!b||busy)return;target=Number(b.dataset.lv);render();});
 $('uaMode').addEventListener('click',e=>{const b=e.target.closest('button[data-mode]');if(!b||busy)return;mode=b.dataset.mode;shown=PAGE;render();});
 $('uaBody').addEventListener('click',e=>{if(busy)return;
  const r=e.target.closest('[data-rar]');if(r&&!r.disabled){const k=r.dataset.rar;if(mode==='rarity'){rars.has(k)?rars.delete(k):rars.add(k);}else{cardRar=cardRar===k?'':k;shown=PAGE;}render();return;}
  const t=e.target.closest('.ua-tile');if(t&&!t.disabled){const id=t.dataset.id;picked.has(id)?picked.delete(id):picked.add(id);const on=picked.has(id);t.classList.toggle('picked',on);t.setAttribute('aria-pressed',String(on));const art=t.querySelector('.trade-tile-art'),ck=t.querySelector('.trade-tile-check');if(on&&!ck)art.insertAdjacentHTML('beforeend','<span class="trade-tile-check">✓</span>');else if(!on&&ck)ck.remove();renderSum(all());return;}
  const a=e.target.closest('[data-act]');if(!a)return;
  if(a.dataset.act==='all')visible(all()).forEach(s=>picked.add(s.id));
  else if(a.dataset.act==='none')picked.clear();
  else if(a.dataset.act==='more')shown+=PAGE;
  const g=$('uaGrid'),top=g?g.scrollTop:0;renderBody(all(),true);renderSum(all());const g2=$('uaGrid');if(g2)g2.scrollTop=top;});
 $('uaBody').addEventListener('input',e=>{if(e.target.id==='uaSearch'){query=e.target.value;shown=PAGE;renderBody(all(),true);renderSum(all());}});
 return d;
}
function visible(list){const q=query.trim().toLocaleLowerCase();return upgradable(list).filter(s=>(!cardRar||s.rarity===cardRar)&&(!q||(s.c.name+' '+(s.c.series||'')).toLocaleLowerCase().includes(q)))
 .sort((a,b)=>M().RAR.indexOf(b.rarity)-M().RAR.indexOf(a.rarity)||String(a.c.name).localeCompare(String(b.c.name)));}
function render(){
 const list=all(),names=NAMES(),m=M();
 if(!rars)rars=new Set(m.RAR);
 $('uaTitle').textContent=L3('Tout améliorer','Upgrade all','Mejorar todo');
 $('uaHelp').textContent=L3('Utilise tes doublons pour monter tes cartes de niveau en une seule fois.','Use your duplicates to level up your cards in one go.','Usa tus duplicados para subir de nivel tus cartas de una vez.');
 $('uaClose').setAttribute('aria-label',L3('Fermer','Close','Cerrar'));
 $('uaLevelTitle').textContent=L3('Jusqu\'au niveau','Up to level','Hasta el nivel');
 $('uaLevels').setAttribute('aria-label',L3('Niveau visé','Target level','Nivel objetivo'));
 $('uaLevels').innerHTML=[1,2,3].map(l=>'<button type="button" role="radio" data-lv="'+l+'" aria-checked="'+(l===target)+'" class="ua-level lv-'+l+'">'+starRow(l)+'<b>'+esc(names[l])+'</b><small>'+esc(L3('Niveau ','Level ','Nivel ')+l)+'</small></button>').join('');
 $('uaWhichTitle').textContent=L3('Quelles cartes','Which cards','Qué cartas');
 $('uaMode').setAttribute('aria-label',L3('Choisir par','Choose by','Elegir por'));
 $('uaMode').innerHTML=[['rarity',L3('Par rareté','By rarity','Por rareza')],['cards',L3('Par carte','By card','Por carta')]].map(([k,v])=>'<button type="button" data-mode="'+k+'" aria-pressed="'+(mode===k)+'">'+esc(v)+'</button>').join('');
 renderBody(list,false);renderSum(list);
}
function renderBody(list,keepTools){
 const m=M(),body=$('uaBody'),up=upgradable(list);
 if(mode==='rarity'){
  body.innerHTML='<div class="ua-rars">'+m.RAR.map(k=>{const g=up.filter(s=>s.rarity===k),n=g.length,on=rars.has(k)&&n>0;
   return '<button type="button" class="ua-rar" data-rar="'+k+'" style="--r:'+m.RAR_COL[k]+'" aria-pressed="'+on+'"'+(n?'':' disabled')+'><span class="ua-rar-top"><i></i><b>'+esc(m.rarName(k))+'</b><span class="ua-check" aria-hidden="true"></span></span><small>'+(n?esc(nf(n)+' '+L3(n>1?'cartes':'carte',n>1?'cards':'card',n>1?'cartas':'carta')):esc(L3('Rien à améliorer','Nothing to upgrade','Nada que mejorar')))+'</small><span class="ua-rar-xp">'+esc(L3((XP[k])+' XP par niveau',(XP[k])+' XP per level',(XP[k])+' XP por nivel'))+'</span></button>';}).join('')+'</div>';
  return;
 }
 const vis=visible(list),page=vis.slice(0,shown);
 const grid='<div class="trade-grid ua-grid" id="uaGrid">'+(page.length?page.map(s=>{const sel=picked.has(s.id);
   return '<button type="button" class="trade-tile ua-tile'+(sel?' picked':'')+'" data-id="'+esc(s.id)+'" style="--r:'+(m.RAR_COL[s.rarity]||'#cfd6df')+'" aria-pressed="'+sel+'" aria-label="'+esc(s.c.name+' · '+m.rarName(s.rarity)+' · '+L3('niveau ','level ','nivel ')+s.from+' → '+s.to)+'"><span class="trade-tile-art">'+m.image(Object.assign({},s.c,{marketLevel:s.from}))+(sel?'<span class="trade-tile-check">✓</span>':'')+'</span><span class="trade-tile-foot"><i></i><span data-noi18n>'+esc(s.c.name)+'</span></span><span class="ua-tile-lv">'+s.from+' → <b>'+s.to+'</b></span></button>';}).join(''):'<p class="ua-empty">'+esc(L3('Aucune carte ne peut monter à ce niveau avec tes doublons.','No card can reach this level with your duplicates.','Ninguna carta puede llegar a este nivel con tus duplicados.'))+'</p>')+'</div>'+
  (vis.length>shown?'<button type="button" class="ua-more" data-act="more">'+esc(L3('Afficher plus','Show more','Mostrar más')+' ('+nf(vis.length-shown)+')')+'</button>':'');
 if(keepTools&&$('uaGridWrap')){$('uaGridWrap').innerHTML=grid;return;}
 body.innerHTML='<div class="trade-picker-tools ua-tools"><input type="search" id="uaSearch" placeholder="'+esc(L3('Chercher une carte ou une série…','Search a card or series…','Buscar una carta o serie…'))+'" aria-label="'+esc(L3('Chercher une carte ou une série…','Search a card or series…','Buscar una carta o serie…'))+'" value="'+esc(query)+'"><div class="trade-rar">'+m.RAR.map(k=>{const n=up.filter(s=>s.rarity===k).length;return n?'<button type="button" data-rar="'+k+'" style="--r:'+m.RAR_COL[k]+'" aria-pressed="'+(cardRar===k)+'"><i></i>'+esc(m.rarName(k))+' <b>'+nf(n)+'</b></button>':'';}).join('')+'</div>'+
  '<span class="ua-pick-acts"><button type="button" class="ua-link" data-act="all">'+esc(L3('Tout sélectionner','Select all','Seleccionar todo'))+'</button><button type="button" class="ua-link" data-act="none">'+esc(L3('Aucune','None','Ninguna'))+'</button></span></div><div id="uaGridWrap">'+grid+'</div>';
}
function renderSum(list){
 const p=plan(list),steps=p.reduce((a,s)=>a+s.steps,0),used=p.reduce((a,s)=>a+s.used,0),xp=p.reduce((a,s)=>a+s.xp,0);
 const cell=(v,l,cls)=>'<div class="ua-stat'+(cls?' '+cls:'')+'"><b>'+v+'</b><span>'+esc(l)+'</span></div>';
 $('uaSum').innerHTML=cell(nf(p.length),L3(p.length>1?'cartes':'carte',p.length>1?'cards':'card',p.length>1?'cartas':'carta'))+cell(nf(steps),L3('niveaux gagnés','levels gained','niveles ganados'))+cell(nf(used),L3('doublons utilisés','duplicates used','duplicados usados'))+cell('+'+nf(xp),'XP','xp');
 const btn=$('uaSubmit');btn.disabled=busy||!p.length;
 btn.textContent=busy?L3('Amélioration en cours…','Upgrading…','Mejorando…'):p.length?L3('Améliorer '+nf(p.length)+(p.length>1?' cartes':' carte'),'Upgrade '+nf(p.length)+(p.length>1?' cards':' card'),'Mejorar '+nf(p.length)+(p.length>1?' cartas':' carta')):L3('Rien à améliorer','Nothing to upgrade','Nada que mejorar');
 $('uaNote').textContent=L3('Les doublons utilisés disparaissent : ils ne pourront plus être vendus ni échangés.','Duplicates used are consumed: they can no longer be sold or traded.','Los duplicados usados se consumen: ya no podrán venderse ni intercambiarse.');
}
async function submit(){
 if(busy)return;const p=plan(all());if(!p.length)return;
 if(!window.sakuSecureUserId||!window.sakuBackend||!window.sakuBackend.upgradeCardsBulk){$('uaError').textContent=L3('Connecte-toi pour améliorer tes cartes.','Sign in to upgrade your cards.','Inicia sesión para mejorar tus cartas.');return;}
 const ids=p.map(s=>s.id).sort(),key=target+':'+ids.join(',');
 if(key!==requestKey||!request){request=crypto.randomUUID();requestKey=key;} // même demande = même identifiant (un nouvel essai n'améliore pas deux fois)
 busy=true;$('uaError').textContent='';renderSum(all());const actor=window.sakuSecureUserId;
 try{
  const r=await window.sakuBackend.upgradeCardsBulk(ids,target,request);request=null;requestKey='';
  try{const state=await window.sakuBackend.gameCollection();if(window.sakuSecureUserId===actor){cardState=cardNormalize(state);if(typeof currentAccount!=='undefined'&&currentAccount)currentAccount.cards=cardNormalize(state);}}catch(e){}
  if(typeof cardsRenderStats==='function')cardsRenderStats();
  if(typeof cardsRenderAlbum==='function'&&$('collectionScreen')&&$('collectionScreen').classList.contains('active'))cardsRenderAlbum();
  if(typeof window.sakuProgressRefresh==='function')window.sakuProgressRefresh();
  busy=false;picked.clear();$('uaDialog').close();
  const n=Number(r&&r.cards)||0,xp=Number(r&&r.xp)||0;
  const msg=n?L3(nf(n)+(n>1?' cartes améliorées':' carte améliorée')+' · +'+nf(xp)+' XP',nf(n)+(n>1?' cards upgraded':' card upgraded')+' · +'+nf(xp)+' XP',nf(n)+(n>1?' cartas mejoradas':' carta mejorada')+' · +'+nf(xp)+' XP'):L3('Aucune carte n\'a pu être améliorée.','No card could be upgraded.','No se pudo mejorar ninguna carta.');
  if(window.sakuTradeKit&&window.sakuTradeKit.toast)window.sakuTradeKit.toast(msg);else if(typeof showNotification==='function')showNotification(msg);
 }catch(e){busy=false;$('uaError').textContent=L3('L\'amélioration n\'a pas pu être faite. Réessaie.','The upgrade could not be done. Try again.','No se pudo hacer la mejora. Inténtalo de nuevo.');renderSum(all());}
}
function open(){
 if(!window.sakuMarket||typeof cardState==='undefined'||!cardState)return;
 const d=ensure();if(!rars)rars=new Set(M().RAR);
 $('uaError').textContent='';render();
 if(!d.open)d.showModal();
}
window.sakuUpgradeAllOpen=open;
/* Bouton de la collection : nombre de cartes améliorables. */
function syncButton(){const b=$('cardsUpgradeAll');if(!b)return;let n=0;try{n=(typeof cardState!=='undefined'&&cardState&&window.sakuMarket)?countAvailable():0;}catch(e){}
 const lab=b.querySelector('.ua-btn-label');if(lab)lab.textContent=L3('Tout améliorer','Upgrade all','Mejorar todo');
 const c=b.querySelector('.ua-btn-count');if(c){c.textContent=n?nf(n):'';c.hidden=!n;}b.classList.toggle('has',!!n);}
window.sakuUpgradeAllSync=syncButton;
if(typeof window.cardsRenderStats==='function'){const orig=window.cardsRenderStats;window.cardsRenderStats=function(){const r=orig.apply(this,arguments);syncButton();return r;};}
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#cardsUpgradeAll'))open();});
})();
