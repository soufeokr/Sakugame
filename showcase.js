/* Public showcase. Only explicitly opted-in linked account names are public. */
(function(){'use strict';
const $=id=>document.getElementById(id), tr=s=>typeof t==='function'?t(s):s;
let ownerId=null,loadedId=null,selected=[],request=0,publicUid=null,attachVersion=0,attachPromise=Promise.resolve();
let saveTimer=null,saveQueue=Promise.resolve(),lastIdentity=null,catalogIndex=null,choiceLimit=60,privacy={discord:false,anilist:false},accountData=null,accountRef=null,accountListener=null;
const validId=id=>/^\d{1,30}$/.test(String(id||''));
const color=(s,fallback)=>/^#[0-9a-f]{6}$/i.test(String(s||''))?String(s):fallback;
const txt=(id,s)=>{const el=$(id);if(el)el.textContent=s;};
const num=n=>Math.max(0,Math.floor(Number(n)||0));
const GAMES=[['classic','Detective Showdown','i-game-guesswho'],['undercover','Undercover','i-game-undercover'],['battle','Detective Royale','i-game-battle'],['race','Wanted!','i-game-race'],['blur','Blur Guess','i-game-blur'],['hotcold','Cold Case','i-game-hotcold'],['codenames','Ninja Scrolls','i-game-codenames'],['snapshot','Snapshot!','i-game-snapshot']];
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
function avatar(el,url){clear(el);if(/^https:\/\//i.test(String(url||''))){const img=document.createElement('img');img.alt='';img.src=String(url);img.onerror=()=>{clear(el);el.textContent='✦';};el.appendChild(img);}else el.textContent='✦';}
function myId(){return currentAccount && validId(sakuMyDcId())?sakuMyDcId():null;}
function ensurePool(){if(typeof GENERIC_CHARACTERS==='undefined'||!GENERIC_CHARACTERS.length)return false;cardBuildPool();return true;}
function catalog(){if(!catalogIndex){catalogIndex={};if(typeof ENCYCLOPEDIA!=='undefined')ENCYCLOPEDIA.list.forEach(g=>g.cards.forEach(c=>{catalogIndex[String(c.i)]={id:String(c.i),name:c.m,image:c.u,series:c.series||g.label,rank:c.k||99999,rarity:c.r||'common',edition:c.edition||g.edition||''};}));}return catalogIndex;}
function publicCard(id){return cardPoolById[id]||catalog()[id];}
function myCards(){if(!ensurePool())return [];if(!cardState)cardsLoad();const owned=cardState.cards||{},list=cardPool.filter(c=>Number(owned[String(c.id)])>0);Object.keys(owned).forEach(id=>{if(Number(owned[id])>0&&!cardPoolById[id]){const c=catalog()[id];if(c)list.push(c);}});return list;}
function collectionStats(){if(!accountData||!accountData.cards||!ensurePool())return null;const ids=new Set(Object.keys(catalog()));cardPool.forEach(c=>ids.add(String(c.id)));const owned=accountData.cards.cards||{};let count=0;ids.forEach(id=>{if(Number(owned[id])>0)count++;});return {owned:count,total:ids.size};}
function identity(){const p=window.sakuProgressSnapshot&&window.sakuProgressSnapshot(),a=accountData||currentAccount||{};return {name:String(playerName||'').slice(0,60),avatar:(!privacy.discord && /^https?:\/\/(?:cdn|media)\.discordapp\.(?:com|net)\//i.test(String(myAvatar()||'')))?'':String(myAvatar()||'').slice(0,1200),level:p?p.level:null,showDiscord:privacy.discord,showAni:privacy.anilist,discord:privacy.discord?String(currentAccount.dcUsername||'').slice(0,80)||null:null,anilist:privacy.anilist?String(currentAccount.anilist||'').slice(0,80)||null:null,gameStats:{games:gameSummary(a)},collectionStats:collectionStats()};}
function theme(data){const screen=$('showcaseScreen'),root=document.documentElement;[['--show-bg',color(data.background,'#141d3d')],['--show-bg2',color(data.secondary,'#272047')],['--show-accent',color(data.accent,'#9fd8ff')]].forEach(([key,value])=>{screen.style.setProperty(key,value);root.style.setProperty(key,value);});}
function cardHTML(c){return (c.edition==='strongest'||c.edition==='hoshi')&&window.sakuStrongestCard?window.sakuStrongestCard(c,true):window.sakuBasicCard?window.sakuBasicCard(c,true):'';}
function buildView(data){
 if(!data){$('showcasePreview').hidden=true;return;}theme(data);$('showcasePreview').hidden=false;
 txt('showcaseName',String(data.name||tr('Player')).slice(0,60));txt('showcaseLevel',data.level?String(Math.max(1,Math.floor(Number(data.level)||1))):'—');avatar($('showcaseAvatar'),data.avatar);
 const dc=data.showDiscord===true&&!!data.discord,ani=data.showAni===true&&!!data.anilist;$('showcaseDiscordWrap').hidden=!dc;$('showcaseAniWrap').hidden=!ani;$('showcaseConnections').hidden=!dc&&!ani;txt('showcaseDiscord',dc?String(data.discord).slice(0,80):'');txt('showcaseAni',ani?String(data.anilist).slice(0,80):'');
 renderGames(data.gameStats);
 const cs=data.collectionStats, total=cs?num(cs.total):0,owned=cs?Math.min(total,num(cs.owned)):0,pct=total?Math.round(1000*owned/total)/10:0;
 txt('showcaseOwned',cs?String(owned):'—');txt('showcaseTotal',cs?' / '+total:'');txt('showcasePercent',cs?pct+'%':'—');if(cs)$('showcaseProgress').setAttribute('aria-valuenow',String(pct));else $('showcaseProgress').removeAttribute('aria-valuenow');$('showcaseProgress').querySelector('.showcase-ring-value').style.strokeDashoffset=String(100-pct);
 const grid=$('showcaseCards');clear(grid);let count=0;
 if(ensurePool()&&Array.isArray(data.cards)){data.cards.slice(0,10).forEach(item=>{const id=String(item&&item.id||''),source=publicCard(id);if(!source)return;const c=Object.assign({},source,{rarity:(source.edition==='strongest'||source.edition==='hoshi')?'special':(/^(common|uncommon|rare|epic|legendary|mythic)$/.test(item.rarity)?item.rarity:source.rarity)});const el=document.createElement('div');el.className='showcase-card';el.setAttribute('aria-label',c.name);el.innerHTML=cardHTML(c);grid.appendChild(el);count++;});}
 txt('showcaseCount',count+' / 10');$('showcaseEmpty').hidden=count>0;document.querySelector('.showcase-swipe-note').hidden=count===0;if(window.sakuBasicObserve)window.sakuBasicObserve(grid);
}
function renderChoices(){
 const list=$('showcaseChoices'),scroll=list.scrollTop;clear(list);let owned=myCards(),query=$('showcaseSearch').value.trim().toLocaleLowerCase();
 if(query)owned=owned.filter(c=>String(c.name).toLocaleLowerCase().includes(query)||String(c.series).toLocaleLowerCase().includes(query));
 const visible=owned.slice(0,choiceLimit),fragment=document.createDocumentFragment();visible.forEach(c=>{const id=String(c.id),b=document.createElement('button');b.type='button';b.className='showcase-choice';b.dataset.id=id;b.setAttribute('aria-pressed',String(selected.includes(id)));b.setAttribute('aria-label',c.name+' · '+c.series);b.title=c.name+' · '+c.series;const art=document.createElement('span');art.className='showcase-choice-art';art.innerHTML=cardHTML(c);const mark=document.createElement('span');mark.className='showcase-choice-mark';mark.textContent=selected.includes(id)?'✓':'+';b.append(art,mark);fragment.appendChild(b);});list.appendChild(fragment);list.scrollTop=scroll;
 if(!owned.length){const note=document.createElement('p');note.className='showcase-empty';note.textContent=tr('No owned cards found.');list.appendChild(note);}txt('showcaseSelectedCount',selected.length+' / 10');txt('showcaseChoicesCount',visible.length+' / '+owned.length+' '+tr('cards shown'));$('showcaseMore').hidden=visible.length>=owned.length;if(window.sakuBasicObserve)window.sakuBasicObserve(list);
}
function preferenceSnapshot(){const map=new Map(myCards().map(c=>[String(c.id),c]));return {background:color($('showcaseBg').value,'#141d3d'),secondary:color($('showcaseBg2').value,'#272047'),accent:color($('showcaseAccent').value,'#9fd8ff'),cards:selected.filter(id=>map.has(id)).map(id=>{const c=map.get(id);return {id,rarity:(c.edition==='strongest'||c.edition==='hoshi')?'special':cardRarityFor(c.testOnlyNinja?{id:c.id}:c,c.rank)};}),showDiscord:privacy.discord,showAni:privacy.anilist,avatar:identity().avatar,discord:privacy.discord?String(currentAccount.dcUsername||'').slice(0,80)||null:null,anilist:privacy.anilist?String(currentAccount.anilist||'').slice(0,80)||null:null};}
function previewDraft(){if(!myId()||ownerId!==myId())return;buildView(Object.assign(identity(),preferenceSnapshot()));}
function enqueue(me,patch,notify){saveQueue=saveQueue.catch(()=>{}).then(()=>database.ref('publicShowcases/'+me).update(patch)).then(()=>{if(notify&&me===myId()&&ownerId===me)txt('showcaseSaveStatus',tr('Changes saved.'));}).catch(()=>{if(me===myId()&&ownerId===me)txt('showcaseSaveStatus',tr('Could not save changes. Try again.'));lastIdentity=null;});}
function queueSave(immediate){const me=myId();if(!me||ownerId!==me||loadedId!==me)return;clearTimeout(saveTimer);const patch=preferenceSnapshot();txt('showcaseSaveStatus',tr('Saving…'));if(immediate)enqueue(me,patch,true);else saveTimer=setTimeout(()=>enqueue(me,patch,true),300);}
async function open(id){
 const token=++request,me=myId();ownerId=id&&validId(id)?String(id):me;loadedId=null;selected=[];choiceLimit=60;
 $('showcaseGuest').hidden=true;$('showcaseEditor').hidden=true;$('showcaseEdit').hidden=true;$('showcaseEdit').setAttribute('aria-expanded','false');$('showcasePreview').hidden=true;txt('showcaseStatus','');txt('showcaseSaveStatus','');theme({});
 if(!ownerId){$('showcaseGuest').hidden=false;return;}txt('showcaseStatus',tr('Loading showcase…'));
 try{if(ownerId===me){await attachPromise;if(window.sakuTestNinjaWait)await window.sakuTestNinjaWait;}const snap=await database.ref('publicShowcases/'+ownerId).once('value');if(token!==request)return;const data=snap.val()||null;loadedId=ownerId;if(window.sakuDataReady)await window.sakuDataReady;if(token!==request)return;
  if(ownerId===me){if(!data)throw Error('public showcase unavailable');const map=new Set(myCards().map(c=>String(c.id)));selected=(Array.isArray(data.cards)?data.cards.map(c=>String(c.id)):[]).filter(id=>map.has(id)).slice(0,10);privacy={discord:data.showDiscord===true,anilist:data.showAni===true};$('showcaseShowDiscord').checked=privacy.discord;$('showcaseShowAni').checked=privacy.anilist;
   $('showcaseBg').value=color(data.background,'#141d3d');$('showcaseBg2').value=color(data.secondary,'#272047');$('showcaseAccent').value=color(data.accent,'#9fd8ff');$('showcaseSearch').value='';$('showcaseEdit').hidden=false;txt('showcaseStatus',tr('Your showcase is public.'));previewDraft();
  }else if(data){txt('showcaseStatus','');buildView(data);}else txt('showcaseStatus',tr('This player’s showcase is unavailable.'));
 }catch(e){if(token===request)txt('showcaseStatus',tr('Could not load the showcase. Please try again.'));}
}
function refreshPublic(){const me=myId();if(!me||publicUid!==me)return;const data=identity(),key=me+JSON.stringify(data);if(key===lastIdentity)return;lastIdentity=key;enqueue(me,data,false);if(ownerId===me&&loadedId===me&&!$('showcasePreview').hidden)previewDraft();}
window.sakuShowcaseProgressChanged=refreshPublic;
window.sakuShowcaseDetach=function(){++attachVersion;publicUid=null;lastIdentity=null;if(accountRef&&accountListener)accountRef.off('value',accountListener);accountRef=null;accountListener=null;accountData=null;privacy={discord:false,anilist:false};};
window.sakuShowcaseAttach=function(){window.sakuShowcaseDetach();const me=myId(),version=++attachVersion;if(!me)return;privacy={discord:false,anilist:false};
 const base={name:String(playerName||'').slice(0,60),avatar:'',background:'#141d3d',secondary:'#272047',accent:'#9fd8ff',cards:[],showDiscord:false,showAni:false};
 // Legacy records did not contain consent flags: erase their account handles on next sign-in.
 attachPromise=database.ref('publicShowcases/'+me).transaction(old=>{const v=old||base;if(v.showDiscord!==true){v.showDiscord=false;delete v.discord;if(/^https?:\/\/(?:cdn|media)\.discordapp\.(?:com|net)\//i.test(String(v.avatar||'')))delete v.avatar;}if(v.showAni!==true){v.showAni=false;delete v.anilist;}return v;},undefined,false).then(result=>{if(version!==attachVersion||me!==myId())return;const v=result.snapshot.val()||{};privacy={discord:v.showDiscord===true,anilist:v.showAni===true};publicUid=me;accountRef=sakuAcctRef(me);accountListener=snap=>{if(me!==myId()||version!==attachVersion)return;accountData=snap.val()||{};refreshPublic();};accountRef.on('value',accountListener);if(window.sakuDataReady)window.sakuDataReady.then(()=>{if(version===attachVersion){catalogIndex=null;refreshPublic();}}).catch(()=>{});refreshPublic();}).catch(()=>{});
};
window.showShowcase=function(id){id=validId(id)?String(id):'';showScreen('showcaseScreen');if(id){try{history.replaceState(null,'','#/showcase/'+encodeURIComponent(id));}catch(e){}}open(id);try{window.scrollTo(0,0);}catch(e){}};
document.addEventListener('DOMContentLoaded',()=>{
 function edit(on){$('showcaseEditor').hidden=!on;$('showcaseEdit').setAttribute('aria-expanded',String(on));if(on){renderChoices();$('showcaseEditor').scrollIntoView({behavior:'smooth',block:'start'});}else $('showcaseEdit').focus();}
 $('showcaseEdit').addEventListener('click',()=>edit($('showcaseEditor').hidden));$('showcaseDone').addEventListener('click',()=>edit(false));
 $('showcaseChoices').addEventListener('click',e=>{const b=e.target.closest('button[data-id]');if(!b)return;const id=b.dataset.id,i=selected.indexOf(id);if(i>=0)selected.splice(i,1);else if(selected.length<10)selected.push(id);else{txt('showcaseSaveStatus',tr('Choose up to 10 cards.'));return;}b.setAttribute('aria-pressed',String(selected.includes(id)));b.querySelector('.showcase-choice-mark').textContent=selected.includes(id)?'✓':'+';txt('showcaseSelectedCount',selected.length+' / 10');previewDraft();queueSave();});
 $('showcaseSearch').addEventListener('input',()=>{choiceLimit=60;$('showcaseChoices').scrollTop=0;renderChoices();});$('showcaseMore').addEventListener('click',()=>{choiceLimit+=60;renderChoices();});
 ['showcaseBg','showcaseBg2','showcaseAccent'].forEach(id=>$(id).addEventListener('input',()=>{previewDraft();queueSave();}));
 ['showcaseShowDiscord','showcaseShowAni'].forEach(id=>$(id).addEventListener('change',()=>{privacy={discord:$('showcaseShowDiscord').checked,anilist:$('showcaseShowAni').checked};lastIdentity=null;previewDraft();queueSave(true);}));
});
})();
