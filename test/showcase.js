/* Public showcase. Only explicitly opted-in linked account names are public. */
(function(){'use strict';
const $=id=>document.getElementById(id), tr=s=>typeof t==='function'?t(s):s;
let lastData=null,ownerId=null,loadedId=null,selected=[],request=0,publicUid=null,attachVersion=0,attachPromise=Promise.resolve();
let lastIdentity=null,catalogIndex=null,choiceLimit=60,privacy={discord:false,anilist:false},accountData=null,accountRef=null,accountListener=null;
const validId=id=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id||''));
const color=(s,fallback)=>/^#[0-9a-f]{6}$/i.test(String(s||''))?String(s):fallback;
const txt=(id,s)=>{const el=$(id);if(el)el.textContent=s;};
const num=n=>Math.max(0,Math.floor(Number(n)||0));
const GAMES=[['classic','Detective Showdown','i-game-guesswho'],['undercover','Undercover','i-game-undercover'],['battle','Detective Royale','i-game-battle'],['race','Wanted!','i-game-race'],['blur','Blur Guess','i-game-blur'],['hotcold','Cold Case','i-game-hotcold'],['codenames','Ninja','i-game-codenames'],['snapshot','Snapshot!','i-game-snapshot']];
function gameSummary(a){
 const games={};GAMES.forEach(([id])=>games[id]={played:0,wins:0,partial:false});
 const matches=a&&a.progress&&a.progress.matches||{};
 Object.keys(matches).forEach(key=>{const match=key.match(/^[^_]+_[^_]+_(classic|undercover|battle|race|blur|hotcold|codenames|snapshot)_/);if(!match||match[1]==='blur'||match[1]==='snapshot')return;const game=games[match[1]],v=matches[key];game.played++;if(v&&typeof v==='object'&&typeof v.won==='boolean'){if(v.won)game.wins++;}else game.partial=true;});
 Object.keys((a&&a.progress&&a.progress.rounds)||{}).forEach(key=>{const m=key.match(/^[^_]+_[^_]+_(blur|snapshot)_/);if(!m)return;const r=a.progress.rounds[key];games[m[1]].played++;if(r&&r.won===true)games[m[1]].wins++;});
 // These two games already had lifetime win/loss counters before progression existed.
 games.classic={played:num(a.wins)+num(a.losses),wins:num(a.wins),partial:false};
 games.undercover={played:num(a.uWins)+num(a.uLosses),wins:num(a.uWins),partial:false};
 return games;
}
function renderGames(raw){
 const list=$('showcaseGameStats');clear(list);const data=raw||{},games=data.games||{},legacy=raw&&!data.games?{classic:{played:num(data.wins)+num(data.losses),wins:num(data.wins)},undercover:{played:num(data.uWins)+num(data.uLosses),wins:num(data.uWins)}}:{};let partial=false;
 GAMES.forEach(([id,name,icon])=>{const stat=games[id]||legacy[id],row=document.createElement('div');row.className='showcase-game-row';const title=document.createElement('div');title.className='showcase-game-name';const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('ic');svg.setAttribute('aria-hidden','true');const use=document.createElementNS('http://www.w3.org/2000/svg','use');use.setAttribute('href','#'+icon);svg.appendChild(use);const text=document.createElement('span');text.textContent=tr(name);title.append(svg,text);const played=document.createElement('span'),wins=document.createElement('span');played.className='showcase-game-number';wins.className='showcase-game-number';played.textContent=stat?String(num(stat.played)):'—';wins.textContent=stat?(stat.partial?'≥ ':'')+num(stat.wins):'—';const roundGame=id==='blur'||id==='snapshot';played.setAttribute('aria-label',tr(roundGame?'Rounds played':'Games played')+' : '+played.textContent);wins.setAttribute('aria-label',tr(roundGame?'Correct rounds':'Wins')+' : '+wins.textContent);const pLabel=document.createElement('small'),wLabel=document.createElement('small');pLabel.textContent=tr(roundGame?'Rounds played':'Games played');wLabel.textContent=tr(roundGame?'Correct rounds':'Wins');played.prepend(pLabel);wins.prepend(wLabel);if(stat&&stat.partial)partial=true;row.append(title,played,wins);list.appendChild(row);});$('showcaseStatsNote').hidden=!partial;
}
function clear(el){if(window.sakuBasicRelease)window.sakuBasicRelease(el);while(el.firstChild)el.removeChild(el.firstChild);}
function avatar(el,url){clear(el);if(/^https:\/\//i.test(String(url||''))){const img=document.createElement('img');img.alt='';img.src=String(url);img.decoding='async';img.referrerPolicy='no-referrer';img.onerror=()=>{clear(el);el.textContent='✦';};el.appendChild(img);}else el.textContent='✦';}
function myId(){return currentAccount && validId(sakuMyDcId())?sakuMyDcId():null;}
function ensurePool(){if(typeof GENERIC_CHARACTERS==='undefined'||!GENERIC_CHARACTERS.length)return false;cardBuildPool();return true;}
function catalog(){if(!catalogIndex){catalogIndex={};if(typeof ENCYCLOPEDIA!=='undefined')ENCYCLOPEDIA.list.forEach(g=>g.cards.forEach(c=>{catalogIndex[String(c.i)]={id:String(c.i),name:c.m,image:c.u,series:c.series||g.label,rank:c.k||99999,rarity:c.r||'common',edition:c.edition||g.edition||''};}));}return catalogIndex;}
function publicCard(id){return cardPoolById[id]||catalog()[id];}
function myCards(){if(!ensurePool())return [];if(!cardState)cardsLoad();const owned=cardState.cards||{},list=cardPool.filter(c=>Number(owned[String(c.id)])>0);Object.keys(owned).forEach(id=>{if(Number(owned[id])>0&&!cardPoolById[id]){const c=catalog()[id];if(c)list.push(c);}});return list;}
function collectionStats(){if(!accountData||!accountData.cards||!ensurePool())return null;const ids=new Set(Object.keys(catalog()));cardPool.forEach(c=>ids.add(String(c.id)));const owned=accountData.cards.cards||{};let count=0;ids.forEach(id=>{if(Number(owned[id])>0)count++;});return {owned:count,total:ids.size};}
function identity(){const d=lastData||{},url=String(myAvatar()||'');return {name:String(d.name||playerName||'').slice(0,60),avatar:/^https:\/\/[^\s"'<>]+$/i.test(url)?url.slice(0,1200):'',level:d.level==null?null:d.level,showDiscord:privacy.discord,showAni:privacy.anilist,discord:privacy.discord?String(d.name||playerName||'').slice(0,80)||null:null,anilist:privacy.anilist?String(currentAccount&&currentAccount.anilist||'').slice(0,80)||null:null,gameStats:d.gameStats||{games:{}},collectionStats:d.collectionStats||null};}
function theme(data){const screen=$('showcaseScreen'),root=document.documentElement;[['--show-bg',color(data.background,'#141d3d')],['--show-bg2',color(data.secondary,'#272047')],['--show-accent',color(data.accent,'#9fd8ff')]].forEach(([key,value])=>{screen.style.setProperty(key,value);root.style.setProperty(key,value);});}
function cardHTML(c){return (c.edition==='strongest'||c.edition==='hoshi')&&window.sakuStrongestCard?window.sakuStrongestCard(c,true):window.sakuBasicCard?window.sakuBasicCard(c,true,c.level==null?{finish:true}:{level:Math.max(0,Math.min(3,Number(c.level)||0)),finish:true}):'';}
let viewed=null;window.sakuShowcaseViewed=()=>viewed;
function buildView(data){
 {const tb=$('showcaseTradeBtn'),other=!!(data&&data.isOwner===false&&data.id&&myId());viewed=other?data:null;if(tb)tb.hidden=!other;$('showcaseHero').classList.toggle('can-trade',other);}
 if(!data){$('showcasePreview').hidden=true;$('showcaseHero').classList.remove('is-loaded');return;}theme(data);$('showcasePreview').hidden=false;$('showcaseHero').classList.add('is-loaded');
 txt('showcaseName',String(data.name||tr('Player')).slice(0,60));txt('showcaseLevel',data.level?String(Math.max(1,Math.floor(Number(data.level)||1))):'—');avatar($('showcaseAvatar'),data.avatar);
 const dc=data.showDiscord===true&&!!data.discord,ani=data.showAni===true&&!!data.anilist;$('showcaseDiscordWrap').hidden=!dc;$('showcaseAniWrap').hidden=!ani;$('showcaseConnections').hidden=!dc&&!ani;txt('showcaseDiscord',dc?String(data.discord).slice(0,80):'');txt('showcaseAni',ani?String(data.anilist).slice(0,80):'');
 renderGames(data.gameStats);
 const cs=data.collectionStats, total=cs?num(cs.total):0,owned=cs?Math.min(total,num(cs.owned)):0,pct=total?Math.round(1000*owned/total)/10:0;
 txt('showcaseOwned',cs?String(owned):'—');txt('showcaseTotal',cs?' / '+total:'');txt('showcasePercent',cs?pct+'%':'—');if(cs)$('showcaseProgress').setAttribute('aria-valuenow',String(pct));else $('showcaseProgress').removeAttribute('aria-valuenow');$('showcaseProgress').querySelector('.showcase-ring-value').style.strokeDashoffset=String(100-pct);
 const grid=$('showcaseCards');clear(grid);let count=0;
 if(ensurePool()&&Array.isArray(data.cards)){data.cards.slice(0,10).forEach(item=>{const id=String(item&&item.id||''),source=publicCard(id);if(!source)return;const c=Object.assign({},source,{rarity:(source.edition==='strongest'||source.edition==='hoshi')?'special':(/^(common|uncommon|rare|epic|legendary|mythic)$/.test(item.rarity)?item.rarity:source.rarity),level:item.level==null?null:Number(item.level)||0});const el=document.createElement('div');el.className='showcase-card';el.setAttribute('aria-label',c.name);el.innerHTML=cardHTML(c);grid.appendChild(el);count++;});}
 txt('showcaseCount',count+' / 10');$('showcaseEmpty').hidden=count>0;document.querySelector('.showcase-swipe-note').hidden=count===0;if(window.sakuBasicObserve)window.sakuBasicObserve(grid);
}
/* ===== Éditeur (fenêtre) : brouillon, aperçu, enregistrement explicite ===== */
let saved=null,editing=false,previewing=false,dirty=false,saving=false,lastFocus=null;
/* Téléphone : carte exposée choisie d'un toucher (barre Déplacer / Retirer) et onglets Cartes / Apparence. */
let picked=null,dragEndedAt=0;const touchLayout=window.matchMedia('(max-width: 700px)');
function setEdTab(tab){const panel=document.querySelector('#showcaseEditor .showcase-modal-panel');if(!panel)return;panel.dataset.edTab=tab;document.querySelectorAll('#showcaseEditor [data-ed-tab]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.edTab===tab)));const body=$('showcaseModalBody');if(body)body.scrollTop=0;}
function syncOrderBar(){const bar=$('showcaseOrderBar');if(!bar)return;if(picked&&!selected.includes(picked))picked=null;
 $('showcaseOrder').querySelectorAll('.showcase-order-item').forEach(el=>{const on=el.dataset.id===picked;el.classList.toggle('is-picked',on);el.setAttribute('aria-current',on?'true':'false');});
 bar.hidden=!picked;if(!picked)return;const i=selected.indexOf(picked),c=cardsById().get(picked);txt('showcaseOrderBarName',(i+1)+'. '+(c?c.name:''));
 bar.querySelector('[data-bar-move="-1"]').disabled=i<=0;bar.querySelector('[data-bar-move="1"]').disabled=i>=selected.length-1;}
function cardsById(){return new Map(myCards().map(c=>[String(c.id),c]));}
function inputsState(){return {selected:selected.slice(),bg:$('showcaseBg').value,bg2:$('showcaseBg2').value,accent:$('showcaseAccent').value,discord:$('showcaseShowDiscord').checked,anilist:$('showcaseShowAni').checked};}
function applyState(st){selected=st.selected.slice();$('showcaseBg').value=st.bg;$('showcaseBg2').value=st.bg2;$('showcaseAccent').value=st.accent;$('showcaseShowDiscord').checked=st.discord;$('showcaseShowAni').checked=st.anilist;privacy={discord:st.discord,anilist:st.anilist};}
function setDirty(on){dirty=on;txt('showcaseSaveStatus',on?tr('Unsaved changes'):'');$('showcaseSave').disabled=saving;}
const RARITY_WEIGHT={special:7,mythic:6,legendary:5,epic:4,rare:3,uncommon:2,common:1};
function shownRarity(c){try{return (c.edition==='strongest'||c.edition==='hoshi')?'special':cardRarityFor(c.testOnlyNinja?{id:c.id}:c,c.rank);}catch(e){return c.rarity||'common';}}
function sortedCards(){
 const flags=(typeof cardState!=='undefined'&&cardState&&cardState.flags)||{};
 return myCards().map((c,i)=>({c,i,fav:!!(flags[String(c.id)]&&flags[String(c.id)].favorite),w:RARITY_WEIGHT[shownRarity(c)]||0}))
  .sort((a,b)=>(b.fav-a.fav)||(b.w-a.w)||((Number(a.c.rank)||99999)-(Number(b.c.rank)||99999))||(a.i-b.i)).map(x=>x.c);
}
function renderChoices(){
 const list=$('showcaseChoices'),scroll=list.scrollTop;clear(list);
 let owned=sortedCards(),query=$('showcaseSearch').value.trim().toLocaleLowerCase();
 if(query)owned=owned.filter(c=>String(c.name).toLocaleLowerCase().includes(query)||String(c.series).toLocaleLowerCase().includes(query));
 const visible=owned.slice(0,choiceLimit),fragment=document.createDocumentFragment();
 visible.forEach(c=>{const id=String(c.id),b=document.createElement('button');b.type='button';b.className='showcase-choice';b.dataset.id=id;
  b.setAttribute('aria-pressed',String(selected.includes(id)));b.setAttribute('aria-label',c.name+' · '+c.series);b.title=c.name+' · '+c.series;
  const art=document.createElement('span');art.className='showcase-choice-art';art.innerHTML=cardHTML(c);
  const mark=document.createElement('span');mark.className='showcase-choice-mark';mark.textContent=selected.includes(id)?'✓':'+';
  b.append(art,mark);
  const fl=(typeof cardState!=='undefined'&&cardState&&cardState.flags)||{};if(fl[id]&&fl[id].favorite){const star=document.createElement('span');star.className='showcase-choice-fav';star.textContent='★';star.title=tr('Favorite');b.appendChild(star);}fragment.appendChild(b);});
 list.appendChild(fragment);list.scrollTop=scroll;
 if(!owned.length){const note=document.createElement('p');note.className='showcase-empty';note.textContent=tr('No owned cards found.');list.appendChild(note);}
 txt('showcaseChoicesCount',visible.length+' / '+owned.length+' '+tr('cards shown'));
 $('showcaseMore').hidden=visible.length>=owned.length;
 if(window.sakuBasicObserve)window.sakuBasicObserve(list);
}
function renderOrder(){
 const list=$('showcaseOrder');clear(list);const map=cardsById();
 selected=selected.filter(id=>map.has(id)).slice(0,10);
 selected.forEach((id,i)=>{const c=map.get(id),item=document.createElement('div');item.className='showcase-order-item';item.dataset.id=id;item.setAttribute('role','listitem');
  item.setAttribute('aria-label',(i+1)+'. '+c.name);item.title=c.name+' · '+c.series;
  const num=document.createElement('span');num.className='showcase-order-num';num.textContent=String(i+1);
  const art=document.createElement('span');art.className='showcase-choice-art';art.innerHTML=cardHTML(c);
  const tools=document.createElement('div');tools.className='showcase-order-tools';
  [['-1','‹',tr('Move left')],['remove','✕',tr('Remove from showcase')],['1','›',tr('Move right')]].forEach(([k,label,aria])=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.setAttribute('aria-label',aria+' — '+c.name);
   if(k==='remove')b.dataset.remove='1';else{b.dataset.move=k;b.disabled=(k==='-1'&&i===0)||(k==='1'&&i===selected.length-1);}tools.appendChild(b);});
  item.append(num,art,tools);list.appendChild(item);});
 $('showcaseOrderEmpty').hidden=selected.length>0;txt('showcaseSelectedCount',selected.length+' / 10');syncOrderBar();
 list.querySelectorAll('img,svg').forEach(el=>{el.setAttribute('draggable','false');});
 if(window.sakuBasicObserve)window.sakuBasicObserve(list);
}
function refreshChoiceMarks(){$('showcaseChoices').querySelectorAll('button[data-id]').forEach(b=>{const on=selected.includes(b.dataset.id);b.setAttribute('aria-pressed',String(on));b.querySelector('.showcase-choice-mark').textContent=on?'✓':'+';});}
function preferenceSnapshot(){const map=cardsById();
 return {background:color($('showcaseBg').value,'#141d3d'),secondary:color($('showcaseBg2').value,'#272047'),accent:color($('showcaseAccent').value,'#9fd8ff'),
  cards:selected.filter(id=>map.has(id)).map(id=>{const c=map.get(id);return {id,rarity:(c.edition==='strongest'||c.edition==='hoshi')?'special':cardRarityFor(c.testOnlyNinja?{id:c.id}:c,c.rank)};}),
  showDiscord:privacy.discord,showAni:privacy.anilist,avatar:identity().avatar,discord:privacy.discord?String(playerName||'').slice(0,80)||null:null,
  anilist:privacy.anilist?String((currentAccount&&currentAccount.anilist)||'').slice(0,80)||null:null};}
function previewDraft(){if(!myId()||ownerId!==myId())return;buildView(Object.assign(identity(),preferenceSnapshot()));}
function showSaved(){previewDraft();}
function changed(){setDirty(true);theme(preferenceSnapshot());}
async function saveNow(){
 const me=myId();if(!me||ownerId!==me||loadedId!==me||saving)return false;
 saving=true;$('showcaseSave').disabled=true;$('showcaseSaveFromPreview').disabled=true;txt('showcaseSaveStatus',tr('Saving…'));
 const patch=preferenceSnapshot();
 try{const data=await window.sakuRpc('showcase_save',{p_background:patch.background,p_secondary:patch.secondary,p_accent:patch.accent,p_cards:patch.cards.map(c=>String(c.id)),p_show_discord:!!patch.showDiscord,p_show_anilist:!!patch.showAni,p_anilist:patch.showAni?patch.anilist:null});
  if(me!==myId())return false;if(data)lastData=data;saved=inputsState();setDirty(false);closeEditor(true);
  if(typeof showNotification==='function')showNotification(tr('Showcase saved.'));return true;
 }catch(e){txt('showcaseSaveStatus',tr('Could not save changes. Try again.'));return false;}
 finally{saving=false;$('showcaseSave').disabled=false;$('showcaseSaveFromPreview').disabled=false;}
}
function openEditor(){if(!myId()||ownerId!==myId()||loadedId!==myId())return;
 lastFocus=document.activeElement;saved=inputsState();editing=true;previewing=false;choiceLimit=60;$('showcaseSearch').value='';
 picked=null;setEdTab('cards');$('showcasePreviewBar').hidden=true;$('showcaseEditor').hidden=false;$('showcaseEdit').setAttribute('aria-expanded','true');document.body.classList.add('showcase-modal-open');
 renderOrder();renderChoices();setDirty(false);$('showcaseModalBody').scrollTop=0;
 setTimeout(()=>{try{$('showcaseClose').focus();}catch(e){}},30);}
function closeEditor(keep){
 if(!keep&&dirty&&!window.confirm(tr('Discard your unsaved changes?')))return false;
 if(!keep&&saved){applyState(saved);}
 editing=false;previewing=false;$('showcaseEditor').hidden=true;$('showcasePreviewBar').hidden=true;$('showcaseEdit').setAttribute('aria-expanded','false');
 document.body.classList.remove('showcase-modal-open');setDirty(false);showSaved();
 try{(lastFocus&&document.contains(lastFocus)?lastFocus:$('showcaseEdit')).focus();}catch(e){}return true;}
function startPreview(){previewing=true;$('showcaseEditor').hidden=true;document.body.classList.remove('showcase-modal-open');$('showcasePreviewBar').hidden=false;
 previewDraft();try{window.scrollTo({top:0,behavior:'smooth'});}catch(e){}setTimeout(()=>{try{$('showcaseBackToEdit').focus();}catch(e){}},30);}
function backToEdit(){previewing=false;$('showcasePreviewBar').hidden=true;$('showcaseEditor').hidden=false;document.body.classList.add('showcase-modal-open');previewDraft();
 setTimeout(()=>{try{$('showcasePreviewBtn').focus();}catch(e){}},30);}
function moveCard(id,to){const from=selected.indexOf(id);if(from<0)return;to=Math.max(0,Math.min(selected.length-1,to));if(to===from)return;selected.splice(from,1);selected.splice(to,0,id);renderOrder();changed();}
/* Réordonner : appui court (≈0,18 s) sur une carte, puis glisser. Les flèches ‹ › restent disponibles (clavier, accessibilité). */
/* Réorganisation des cartes exposées : on attrape une carte et on la lâche sur une autre, les deux échangent
   leur place (les autres ne bougent pas). Souris : le glissement part dès qu'on bouge. Tactile : après un court
   appui (un glissement rapide fait défiler la page). Les changements de place sont animés (FLIP). */
function orderRects(){const m=new Map();$('showcaseOrder').querySelectorAll('.showcase-order-item').forEach(el=>m.set(el.dataset.id,el.getBoundingClientRect()));return m;}
function animateOrder(before,override){
 if(window.sakuReducedMotion&&window.sakuReducedMotion())return;
 $('showcaseOrder').querySelectorAll('.showcase-order-item').forEach(el=>{const old=(override&&override.get(el.dataset.id))||before.get(el.dataset.id);if(!old||!el.animate)return;
  const now=el.getBoundingClientRect(),dx=old.left-now.left,dy=old.top-now.top;if(Math.abs(dx)<1&&Math.abs(dy)<1)return;
  el.animate([{transform:'translate('+dx+'px,'+dy+'px)'},{transform:'translate(0,0)'}],{duration:220,easing:'cubic-bezier(.2,.8,.2,1)'});});
}
function swapCards(a,b,override){const i=selected.indexOf(a),j=selected.indexOf(b);if(i<0||j<0||i===j)return;const before=orderRects();
 selected[i]=b;selected[j]=a;renderOrder();animateOrder(before,override);changed();}
const moveCardInstant=moveCard;
moveCard=function(id,to){const before=orderRects();moveCardInstant(id,to);animateOrder(before);};
function setupReorder(list,scroller){
 let press=null,drag=null,raf=0;
 const HOLD_TOUCH=140,SLOP=8,MOUSE_START=4;
 function cancelPress(){if(press){clearTimeout(press.timer);press.item.classList.remove('is-pressing');press=null;}}
 function items(){return Array.from(list.querySelectorAll('.showcase-order-item'));}
 function begin(){if(!press)return;const p=press;press=null;p.item.classList.remove('is-pressing');
  const r=p.item.getBoundingClientRect(),ghost=p.item.cloneNode(true);ghost.classList.add('showcase-order-ghost');ghost.removeAttribute('role');ghost.setAttribute('aria-hidden','true');
  ghost.style.width=r.width+'px';ghost.style.height=r.height+'px';ghost.style.left=r.left+'px';ghost.style.top=r.top+'px';document.body.appendChild(ghost);
  p.item.classList.add('is-placeholder');document.body.classList.add('showcase-dragging');
  drag={item:p.item,id:p.item.dataset.id,ghost,dx:p.x-r.left,dy:p.y-r.top,x:p.lx||p.x,y:p.ly||p.y,ox:r.left,oy:r.top,pointerId:p.pointerId,target:null};
  try{list.setPointerCapture(p.pointerId);}catch(e){}
  if(p.touch){try{if(navigator.vibrate)navigator.vibrate(10);}catch(e){}}
  frame();}
 function targetAt(x,y){let best=null,bestD=Infinity;
  items().forEach(el=>{if(el===drag.item)return;const r=el.getBoundingClientRect();
   if(x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom){best=el;bestD=0;return;}
   const cx=r.left+r.width/2,cy=r.top+r.height/2,d=Math.hypot(x-cx,y-cy);if(d<bestD&&d<Math.max(r.width,r.height)*.75){bestD=d;best=el;}});
  return best;}
 function frame(){raf=0;if(!drag)return;
  drag.ghost.style.transform='translate('+(drag.x-drag.dx-drag.ox)+'px,'+(drag.y-drag.dy-drag.oy)+'px) scale(1.06)';
  const t=targetAt(drag.x,drag.y);if(t!==drag.target){if(drag.target)drag.target.classList.remove('is-swap-target');drag.target=t;if(t)t.classList.add('is-swap-target');}
  if(scroller){const sr=scroller.getBoundingClientRect();if(drag.y<sr.top+40)scroller.scrollTop-=10;else if(drag.y>sr.bottom-40)scroller.scrollTop+=10;}}
 function schedule(){if(!raf)raf=requestAnimationFrame(frame);}
 function finish(commit){if(!drag)return;const d=drag;drag=null;dragEndedAt=Date.now();if(raf){cancelAnimationFrame(raf);raf=0;}
  const g=d.ghost.getBoundingClientRect();d.ghost.remove();d.item.classList.remove('is-placeholder');if(d.target)d.target.classList.remove('is-swap-target');document.body.classList.remove('showcase-dragging');
  try{list.releasePointerCapture(d.pointerId);}catch(e){}
  if(commit&&d.target){swapCards(d.id,d.target.dataset.id,new Map([[d.id,g]]));return;}
  const back=new Map([[d.id,g]]);animateOrder(orderRects(),back);}
 list.addEventListener('pointerdown',e=>{if(drag||(e.pointerType==='mouse'&&e.button!==0))return;const item=e.target.closest('.showcase-order-item');if(!item||e.target.closest('button'))return;
  cancelPress();const touch=e.pointerType!=='mouse';press={item,x:e.clientX,y:e.clientY,pointerId:e.pointerId,touch,timer:touch?setTimeout(begin,HOLD_TOUCH):0};
  if(touch)item.classList.add('is-pressing');else e.preventDefault();});
 list.addEventListener('pointermove',e=>{
  if(drag){if(e.pointerId!==drag.pointerId)return;drag.x=e.clientX;drag.y=e.clientY;schedule();e.preventDefault();return;}
  if(!press||e.pointerId!==press.pointerId)return;const moved=Math.hypot(e.clientX-press.x,e.clientY-press.y);
  if(!press.touch){if(moved>MOUSE_START){press.lx=e.clientX;press.ly=e.clientY;begin();}}
  else if(moved>SLOP)cancelPress();});
 list.addEventListener('pointerup',()=>{if(drag)finish(true);else cancelPress();});
 list.addEventListener('pointercancel',()=>{if(drag)finish(false);else cancelPress();});
 list.addEventListener('lostpointercapture',()=>{if(drag)finish(true);});
 list.addEventListener('touchmove',e=>{if(drag)e.preventDefault();},{passive:false});
 list.addEventListener('contextmenu',e=>{if(press||drag||e.target.closest('.showcase-order-item'))e.preventDefault();});
 list.addEventListener('dragstart',e=>e.preventDefault());
 document.addEventListener('keydown',e=>{if(drag&&e.key==='Escape'){finish(false);}});
}
async function open(id){
 const token=++request,me=myId();ownerId=id&&validId(id)?String(id):me;loadedId=null;selected=[];choiceLimit=60;
 $('showcaseGuest').hidden=true;$('showcaseEditor').hidden=true;$('showcasePreviewBar').hidden=true;editing=false;previewing=false;dirty=false;saved=null;document.body.classList.remove('showcase-modal-open');$('showcaseEdit').hidden=true;$('showcaseEdit').setAttribute('aria-expanded','false');if($('showcaseTradeBtn'))$('showcaseTradeBtn').hidden=true;$('showcasePreview').hidden=true;$('showcaseHero').classList.remove('is-loaded');txt('showcaseName',tr('Showcase'));txt('showcaseStatus','');txt('showcaseSaveStatus','');theme({});
 if(!ownerId){$('showcaseGuest').hidden=false;return;}txt('showcaseStatus',tr('Loading showcase…'));
 try{const data=await window.sakuRpc('showcase_get',{p_owner:ownerId===me?null:ownerId});if(token!==request)return;if(ownerId===me)lastData=data;loadedId=ownerId;if(window.sakuDataReady)await window.sakuDataReady;if(token!==request)return;
  if(ownerId===me){if(!data)throw Error('public showcase unavailable');const map=new Set(myCards().map(c=>String(c.id)));selected=(Array.isArray(data.cards)?data.cards.map(c=>String(c.id)):[]).filter(id=>map.has(id)).slice(0,10);privacy={discord:data.showDiscord===true,anilist:data.showAni===true};$('showcaseShowDiscord').checked=privacy.discord;$('showcaseShowAni').checked=privacy.anilist;
   $('showcaseBg').value=color(data.background,'#141d3d');$('showcaseBg2').value=color(data.secondary,'#272047');$('showcaseAccent').value=color(data.accent,'#9fd8ff');$('showcaseSearch').value='';$('showcaseEdit').hidden=false;txt('showcaseStatus',tr('Your showcase is public.'));previewDraft();
  }else if(data){txt('showcaseStatus',tr('Public player profile'));buildView(data);}else txt('showcaseStatus',tr('This player’s showcase is unavailable.'));
 }catch(e){if(token===request)txt('showcaseStatus',tr(String(e&&e.message)==='unavailable'?'This player’s showcase is unavailable.':'Could not load the showcase. Please try again.'));}
}
function refreshPublic(){}
window.sakuShowcaseProgressChanged=function(){if(ownerId&&ownerId===myId()&&loadedId===ownerId&&!$('showcasePreview').hidden&&window.sakuRpc)window.sakuRpc('showcase_get',{p_owner:null}).then(d=>{if(d&&ownerId===myId()){lastData=d;if(!editing)previewDraft();}}).catch(()=>{});};
window.sakuShowcaseDetach=function(){lastData=null;privacy={discord:false,anilist:false};};
window.sakuShowcaseAttach=function(){window.sakuShowcaseDetach();};
window.showShowcase=function(id){id=validId(id)?String(id):'';showScreen('showcaseScreen');if(id){try{history.replaceState(null,'','#/showcase/'+encodeURIComponent(id));}catch(e){}}open(id);try{window.scrollTo(0,0);}catch(e){}};
document.addEventListener('DOMContentLoaded',()=>{
 $('showcaseEdit').addEventListener('click',openEditor);
 $('showcaseClose').addEventListener('click',()=>closeEditor(false));
 $('showcaseCancel').addEventListener('click',()=>closeEditor(false));
 $('showcaseSave').addEventListener('click',saveNow);
 $('showcaseSaveFromPreview').addEventListener('click',saveNow);
 $('showcasePreviewBtn').addEventListener('click',startPreview);
 $('showcaseBackToEdit').addEventListener('click',backToEdit);
 $('showcaseEditor').addEventListener('click',e=>{if(e.target===$('showcaseEditor'))closeEditor(false);});
 document.addEventListener('keydown',e=>{if(e.key!=='Escape'||document.body.classList.contains('showcase-dragging'))return;if(previewing){e.preventDefault();backToEdit();}else if(editing){e.preventDefault();closeEditor(false);}});
 $('showcaseChoices').addEventListener('click',e=>{const b=e.target.closest('button[data-id]');if(!b)return;
  const id=b.dataset.id,i=selected.indexOf(id);
  if(i>=0)selected.splice(i,1);else if(selected.length<10)selected.push(id);else{txt('showcaseSaveStatus',tr('Choose up to 10 cards.'));return;}
  refreshChoiceMarks();renderOrder();changed();});
 $('showcaseOrder').addEventListener('click',e=>{const b=e.target.closest('button');
  if(!b){const it=e.target.closest('.showcase-order-item');if(it&&touchLayout.matches&&Date.now()-dragEndedAt>350){picked=picked===it.dataset.id?null:it.dataset.id;syncOrderBar();}return;}const item=b.closest('.showcase-order-item');if(!item)return;const id=item.dataset.id;
  if(b.dataset.remove){selected=selected.filter(x=>x!==id);renderOrder();refreshChoiceMarks();changed();}
  else if(b.dataset.move){moveCard(id,selected.indexOf(id)+Number(b.dataset.move));const again=$('showcaseOrder').querySelector('.showcase-order-item[data-id="'+CSS.escape(id)+'"] button[data-move="'+b.dataset.move+'"]');if(again&&!again.disabled)again.focus();}});
 $('showcaseOrderBar').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!picked)return;
  if(b.dataset.barRemove){selected=selected.filter(x=>x!==picked);picked=null;renderOrder();refreshChoiceMarks();changed();}
  else if(b.dataset.barMove){moveCard(picked,selected.indexOf(picked)+Number(b.dataset.barMove));syncOrderBar();}});
 document.querySelectorAll('#showcaseEditor [data-ed-tab]').forEach(b=>b.addEventListener('click',()=>setEdTab(b.dataset.edTab)));
 setupReorder($('showcaseOrder'),$('showcaseModalBody'));
 $('showcaseSearch').addEventListener('input',()=>{choiceLimit=60;$('showcaseChoices').scrollTop=0;renderChoices();});
 $('showcaseMore').addEventListener('click',()=>{choiceLimit+=60;renderChoices();});
 ['showcaseBg','showcaseBg2','showcaseAccent'].forEach(id=>$(id).addEventListener('input',changed));
 ['showcaseShowDiscord','showcaseShowAni'].forEach(id=>$(id).addEventListener('change',()=>{privacy={discord:$('showcaseShowDiscord').checked,anilist:$('showcaseShowAni').checked};lastIdentity=null;changed();}));
 try{new MutationObserver(()=>{if((editing||previewing)&&!$('showcaseScreen').classList.contains('active')){dirty=false;closeEditor(false);}}).observe($('showcaseScreen'),{attributes:true,attributeFilter:['class']});}catch(e){}
 window.addEventListener('beforeunload',e=>{if(dirty&&(editing||previewing)){e.preventDefault();e.returnValue='';}});
});
})();
