/* Account progression. Transactions keep a match and each quest reward idempotent.
   Daily quests reset at 00:00 UTC. Rewards are provisional and can be rebalanced. */
(function () {
  'use strict';
  const QUESTS = [
    { id:'play1', title:'Finish 1 game', kind:'games', goal:1, xp:40, coins:30 },
    { id:'play3', title:'Finish 3 games', kind:'games', goal:3, xp:80, coins:80 },
    { id:'win1', title:'Win 1 game', kind:'wins', goal:1, xp:60, coins:50 }
  ];
  // Permanent cumulative challenges. A tier is claimed once; historical match
  // entries count as games, while only recorded outcomes count as wins.
  const GAME_QUESTS = [
    {id:'classic',name:'Detective Showdown',icon:'guesswho'}, {id:'undercover',name:'Undercover',icon:'undercover'},
    {id:'battle',name:'Detective Royale',icon:'battle'}, {id:'race',name:'Wanted!',icon:'race'},
    {id:'blur',name:'Blur Guess',icon:'blur'}, {id:'hotcold',name:'Cold Case',icon:'hotcold'},
    {id:'codenames',name:'Ninja Scrolls',icon:'codenames'}, {id:'snapshot',name:'Snapshot!',icon:'snapshot'}
  ];
  // Cumulative goals. Round-based modes use ten times each threshold.
  const GAME_TIERS = [
    {games:3,wins:1,coins:200},{games:30,wins:15,coins:500},{games:100,wins:75,coins:1500},{games:250,wins:200,coins:5000},{games:500,wins:500,coins:10000}
  ];
  const OLD_COINS={games:[30,60,120,220,400],wins:[50,100,180,320,550]};
  const COLLECTION_QUESTS=[
    {id:'collection',name:'Collection completed',goals:[1,...Array.from({length:20},(_,i)=>(i+1)*5)]},
    {id:'boosters',name:'Boosters opened',goals:[1,10,50,100,500]},
    {id:'mythics',name:'Distinct mythic cards owned',goals:[1,5,10,25,50]},
    {id:'duplicates',name:'Duplicates obtained',goals:[1,10,50,100,500]}
  ];
  const COLLECTION_REWARDS=[100,250,500,1500,5000];
  function collectionReward(q,tier){return q.id==='collection'?([100,250,500,750,1000][tier]||Math.min(5000,1000+(tier-4)*250)):COLLECTION_REWARDS[tier];}
  function collectionState(v,q){if(q.id!=='collection')return {tier:Math.min(q.goals.length,safe(v.collectionMilestones[q.id])),credit:0};const m=v.collectionPercent||{};let credit=0;if(m.creditRemaining==null){const legacy=Math.min(5,safe(v.collectionMilestones.collection));for(let i=0;i<legacy;i++)credit+=COLLECTION_REWARDS[i];}else credit=safe(m.creditRemaining);return {tier:Math.min(q.goals.length,safe(m.tier)),credit};}
  let ref = null, listener = null, value = null, boundUid = null, accountRef = null, accountListener = null, accountValue = null;
  const pending = new Set();
  const tr = s => typeof t === 'function' ? t(s) : s;
  const safe = n => Number.isFinite(Number(n)) ? Math.max(0, Math.floor(Number(n))) : 0;
  function today() { return new Date().toISOString().slice(0,10); }
  function need(level) { const n = level - 1; return 100 + 40*n + 10*n*n; }
  function reward(level) { return 100 + 50*(level-2); }
  function normal(v, day) {
    v = v && typeof v === 'object' ? v : {};
    const d = v.daily && v.daily.day === day ? v.daily : { day:day, games:0, wins:0, claimed:{} };
    return { level:Math.max(1,safe(v.level)), xp:safe(v.xp), coins:safe(v.coins),
      daily:{day:day, games:safe(d.games), wins:safe(d.wins), rounds:safe(d.rounds), roundWins:safe(d.roundWins), claimed:d.claimed || {}, byGame:d.byGame && typeof d.byGame==='object'?d.byGame:{}},
      matches:v.matches && typeof v.matches === 'object' ? v.matches : {},
      milestones:v.milestones && typeof v.milestones === 'object' ? v.milestones : {},
      rounds:v.rounds && typeof v.rounds === 'object' ? v.rounds : {},
      collectionMilestones:v.collectionMilestones && typeof v.collectionMilestones === 'object' ? v.collectionMilestones : {},
      collectionPercent:v.collectionPercent && typeof v.collectionPercent === 'object' ? v.collectionPercent : {} };
  }
  function gain(v, xp) {
    v.xp += xp;
    while (v.xp >= need(v.level)) { v.xp -= need(v.level); v.level++; v.coins += reward(v.level); }
  }
  function gameCounts(v) {
    const counts={};GAME_QUESTS.forEach(g=>counts[g.id]={games:0,wins:0});
    Object.keys(v.matches||{}).forEach(key=>{
      const m=key.match(/^[^_]+_[^_]+_(classic|undercover|battle|race|blur|hotcold|codenames|snapshot)_/);
      if(!m||m[1]==='blur'||m[1]==='snapshot')return;
      const result=v.matches[key];counts[m[1]].games++;if(result&&typeof result==='object'&&result.won===true)counts[m[1]].wins++;
    });
    Object.keys(v.rounds||{}).forEach(key=>{const m=key.match(/^[^_]+_[^_]+_(blur|snapshot)_/);if(!m)return;const r=v.rounds[key];counts[m[1]].games++;if(r&&r.won===true)counts[m[1]].wins++;});
    return counts;
  }
  function dailyQuests(day){
    const dayNum=Math.floor(Date.parse(day+'T00:00:00Z')/86400000),n=GAME_QUESTS.length;
    return QUESTS.concat([0,3,5].map((shift,i)=>{const g=GAME_QUESTS[((dayNum+shift)%n+n)%n],rounds=g.id==='blur'||g.id==='snapshot',metric=i===1?'wins':'games',base=i===0?3:1;return {id:'game_'+g.id+'_'+metric,game:g.id,gameName:g.name,kind:metric,goal:base*(rounds?10:1),rounds,xp:i===0?90:60,coins:i===0?90:60};}));
  }
  function dailyCount(v,q){if(q.game){const data=v.daily.byGame[q.game]||{};return safe(data[q.kind]);}return v.daily[q.kind]+Math.floor((q.kind==='games'?v.daily.rounds:v.daily.roundWins)/10);}
  function dailyTitle(q){if(!q.game)return tr(q.title);const action=q.rounds?(q.kind==='games'?tr('Play rounds'):tr('Answer rounds correctly')):(q.kind==='games'?tr('Finish games'):tr('Win games'));return action+' · '+tr(q.gameName);}
  function legacyCredit(m){let n=0;['games','wins'].forEach(k=>{const count=Math.min(5,safe(m&&m[k]));for(let i=0;i<count;i++)n+=OLD_COINS[k][i];});return n;}
  function milestoneState(v,id){const m=v.milestones[id]||{};return {tier:Math.min(5,safe(m.tier)),credit:m.creditRemaining==null?legacyCredit(m):safe(m.creditRemaining)};}
  function objective(label,n,goal){return '<div class="game-quest-objective"><div class="game-quest-objective-head"><strong>'+tr(label)+'</strong><span>'+Math.min(n,goal)+' / '+goal+'</span></div><div class="quest-meter"><span style="width:'+Math.min(100,Math.floor(n/goal*100))+'%"></span></div></div>';}
  function gameQuestSection(v){const counts=gameCounts(v);return '<div class="quest-section-head"><div><span class="progress-eyebrow">SAKUGAME / GAMES</span><h2>'+tr('Game quests')+'</h2><p>'+tr('Complete both objectives to claim the tier reward. Progress is cumulative.')+'</p></div></div><div class="game-quest-grid">'+GAME_QUESTS.map(g=>{
    const state=milestoneState(v,g.id),tier=state.tier,done=tier>=GAME_TIERS.length,goal=GAME_TIERS[Math.min(tier,4)],rounds=g.id==='blur'||g.id==='snapshot',scale=rounds?10:1,n=counts[g.id],ready=!done&&n.games>=goal.games*scale&&n.wins>=goal.wins*scale,net=Math.max(0,goal.coins-state.credit);
    return '<article class="game-quest-card"><div class="game-quest-header"><svg class="ic" aria-hidden="true"><use href="#i-game-'+g.icon+'"/></svg><h3>'+tr(g.name)+'</h3><span class="game-quest-tier">'+tr('Tier')+' '+Math.min(tier+1,5)+' / 5</span></div>'+(done?'<p class="game-quest-complete">'+tr('All tiers completed')+'</p>':objective(rounds?'Rounds played':'Completed games',n.games,goal.games*scale)+objective(rounds?'Correct rounds':'Victories',n.wins,goal.wins*scale)+'<div class="game-quest-tier-footer"><span class="game-quest-rewards">'+coin()+' '+goal.coins+'</span><button type="button" class="quest-claim game-quest-claim" '+(ready?'':'disabled')+' onclick="sakuClaimGameQuest(\''+g.id+'\','+tier+')">'+tr(ready?'Claim':'In progress')+'</button></div>'+(state.credit?'<p class="game-quest-credit">'+tr('Previously claimed rewards credited')+' · '+tr('Available now')+' : '+net+' '+tr('coins')+'</p>':''))+'</article>';
  }).join('')+'</div><p class="quest-footnote">'+tr('Blur Guess and Snapshot: 10 rounds equal one game for the targets. Only rounds recorded from this update count.')+' '+tr('Earlier games count when recorded in progression. Older victories may be unavailable.')+'</p>';}
  function collectionCounts(account){
    const state=(account&&account.cards)||{},owned=state.cards||{};let unique=0,mythics=0;const index={};
    if(typeof ENCYCLOPEDIA!=='undefined')ENCYCLOPEDIA.list.forEach(g=>(g.cards||[]).forEach(c=>{index[String(c.i)]={c:c,edition:c.edition||g.edition||''};}));
    if(typeof GENERIC_CHARACTERS!=='undefined'&&GENERIC_CHARACTERS.length&&typeof cardBuildPool==='function')cardBuildPool();
    if(typeof cardPool!=='undefined'&&cardPool)cardPool.forEach(c=>{if(!index[String(c.id)])index[String(c.id)]={c:c,edition:c.edition||''};});
    Object.keys(owned).forEach(id=>{if(Number(owned[id])<=0||!index[id])return;unique++;const e=index[id],c=e.c;if(e.edition!=='strongest'&&typeof cardRarityFor==='function'&&cardRarityFor({id:id},c.k||c.rank||99999)==='mythic')mythics++;});
    const total=Object.keys(index).length;return {collection:total?unique*100/total:0,collectionOwned:unique,collectionTotal:total,boosters:safe(state.opened),mythics,duplicates:safe(state.dupes)};
  }
  function collectionQuestSection(v,account){const counts=collectionCounts(account);return '<div class="quest-section-head"><div><span class="progress-eyebrow">SAKUGAME / CARDS</span><h2>'+tr('Collection quests')+'</h2><p>'+tr('Collect cards and advance through permanent milestones.')+'</p></div></div><div class="game-quest-grid">'+COLLECTION_QUESTS.map(q=>{
    const state=collectionState(v,q),tier=state.tier,len=q.goals.length,done=tier>=len,goal=q.goals[Math.min(tier,len-1)],n=counts[q.id],ready=!done&&n>=goal&&(q.id!=='collection'||counts.collectionTotal>0),reward=collectionReward(q,tier),pct=q.id==='collection',shown=pct?Math.floor(n*10)/10:n;
    return '<article class="game-quest-card collection-quest-card"><div class="game-quest-header"><svg class="ic" aria-hidden="true"><use href="#i-cards"/></svg><h3>'+tr(q.name)+'</h3><span class="game-quest-tier">'+tr('Tier')+' '+Math.min(tier+1,len)+' / '+len+'</span></div>'+(done?'<p class="game-quest-complete">'+tr('All tiers completed')+'</p>':'<div class="game-quest-objective"><div class="game-quest-objective-head"><strong>'+tr(q.name)+'</strong><span>'+Math.min(shown,goal)+(pct?'%':'')+' / '+goal+(pct?'%':'')+'</span></div><div class="quest-meter"><span style="width:'+Math.min(100,Math.floor(n/goal*100))+'%"></span></div>'+(pct?'<small class="collection-quest-detail">'+counts.collectionOwned+' / '+counts.collectionTotal+' '+tr('cards')+'</small>':'')+'</div><div class="game-quest-tier-footer"><span class="game-quest-rewards">'+coin()+' '+reward+'</span><button type="button" class="quest-claim game-quest-claim" '+(ready?'':'disabled')+' onclick="sakuClaimCollectionQuest(\''+q.id+'\','+tier+')">'+tr(ready?'Claim':'In progress')+'</button></div>'+(state.credit?'<p class="game-quest-credit">'+tr('Previously claimed rewards credited')+' · '+tr('Available now')+' : '+Math.max(0,reward-state.credit)+' '+tr('coins')+'</p>':''))+'</article>';
  }).join('')+'</div><p class="quest-footnote">'+tr('Collection and mythic goals count cards currently owned. Booster openings and duplicates use recorded totals; new summons are not yet active.')+'</p>';}
  function coin() { return '<img class="progress-coin" src="summon-machines/coin.svg" alt="">'; }
  function renderClipboard(){
    const box=document.getElementById('homeQuestContent');if(!box)return;
    if(!currentAccount){box.innerHTML='<p class="home-quest-empty">'+tr('Sign in to track your quests.')+' <button type="button" onclick="openAuthModal()">'+tr('Continue with Discord')+'</button></p>';return;}
    if(!value){box.innerHTML='<p class="home-quest-empty">'+tr('Loading progression…')+'</p>';return;}
    const v=normal(value,today()),daily=dailyQuests(today()),counts=gameCounts(v),cc=collectionCounts(accountValue),near=[];
    GAME_QUESTS.forEach(g=>{const state=milestoneState(v,g.id);if(state.tier>=5)return;const goal=GAME_TIERS[state.tier],factor=(g.id==='blur'||g.id==='snapshot')?10:1,n=counts[g.id],score=Math.min(n.games/(goal.games*factor),n.wins/(goal.wins*factor));if(score>0)near.push({name:tr(g.name),score:Math.min(1,score)});});
    COLLECTION_QUESTS.forEach(q=>{const state=collectionState(v,q);if(state.tier>=q.goals.length)return;const score=cc[q.id]/q.goals[state.tier];if(score>0)near.push({name:tr(q.name),score:Math.min(1,score)});});near.sort((a,b)=>b.score-a.score);
    box.innerHTML='<div class="home-quest-column"><h3>'+tr('Daily quests')+'</h3>'+daily.map(q=>{const n=Math.min(q.goal,dailyCount(v,q)),done=!!v.daily.claimed[q.id],ready=n>=q.goal;return '<div class="home-quest-row"><span class="home-quest-check '+(done?'done':ready?'ready':'')+'">'+(done?'✓':ready?'!':'')+'</span><span>'+dailyTitle(q)+'</span><b>'+(done?tr('Claimed'):n+' / '+q.goal)+'</b></div>';}).join('')+'</div><div class="home-quest-column home-quest-near"><h3>'+tr('Almost there')+'</h3>'+(near.length?near.slice(0,2).map(q=>'<div class="home-quest-near-row"><div><span>'+q.name+'</span><b>'+Math.floor(q.score*100)+'%</b></div><div class="quest-meter"><span style="width:'+Math.floor(q.score*100)+'%"></span></div></div>').join(''):'<p class="home-quest-empty">'+tr('Play or collect to start a milestone.')+'</p>')+'</div>';
  }
  function panel(v) {
    const limit=need(v.level), pc=Math.min(100,Math.floor(100*v.xp/limit));
    return '<div class="progress-top"><div><span class="progress-eyebrow">'+tr('Your progression')+'</span><h2>'+tr('Level')+' '+v.level+'</h2></div><div class="progress-balance">'+coin()+'<strong>'+v.coins.toLocaleString()+'</strong><span>'+tr('coins')+'</span></div></div>'+
      '<div class="progress-xp-label"><span>'+tr('Experience')+'</span><b>'+v.xp+' / '+limit+' XP</b></div><div class="progress-bar"><span style="width:'+pc+'%"></span></div>'+
      '<p class="progress-next">'+tr('Next level reward')+' : '+coin()+' '+reward(v.level+1)+' '+tr('coins')+'</p>';
  }
  function render() {
    const acc = document.getElementById('accountProgress'), box = document.getElementById('questsContent');
    const signed = !!currentAccount;
    renderClipboard();
    if (acc) { acc.hidden = !signed; if (signed) acc.innerHTML = value ? panel(normal(value,today())) : '<p>'+tr('Loading progression…')+'</p>'; }
    if (!box) return;
    if (!signed) { box.innerHTML='<section class="quest-guest"><div class="quest-guest-star">✦</div><h2>'+tr('Your quests are waiting')+'</h2><p>'+tr('Sign in to earn experience, collect coins and track your quests.')+'</p><button class="hub-primary hub-discord" onclick="openAuthModal()"><svg class="ic"><use href="#i-discord"/></svg> '+tr('Continue with Discord')+'</button></section>'; return; }
    if (!value) { box.innerHTML='<section class="quest-empty">'+tr('Loading progression…')+'</section>'; return; }
    const v=normal(value,today());
    box.innerHTML='<section class="quest-progress">'+panel(v)+'</section><div class="quest-section-head"><div><span class="progress-eyebrow">'+tr('YOUR OBJECTIVES')+'</span><h2>'+tr('Daily quests')+'</h2><p>'+tr('Resets every day at 00:00 UTC. Claim your rewards before the reset.')+'</p></div></div><div class="quest-list">'+dailyQuests(today()).map(q=>{
      const count=dailyCount(v,q);
      const n=Math.min(q.goal,count), claimed=!!v.daily.claimed[q.id], ready=n>=q.goal;
      return '<article class="quest-card"><div class="quest-symbol">✦</div><div class="quest-main"><h3>'+dailyTitle(q)+'</h3><div class="quest-meter"><span style="width:'+Math.floor(n/q.goal*100)+'%"></span></div><div class="quest-count">'+n+' / '+q.goal+'</div></div><div class="quest-rewards"><span>+'+q.xp+' XP</span><span>'+coin()+' +'+q.coins+'</span></div><button type="button" class="quest-claim" '+(!ready||claimed?'disabled':'')+' onclick="sakuClaimQuest(\''+q.id+'\')">'+tr(claimed?'Claimed':ready?'Claim':'In progress')+'</button></article>';
    }).join('')+'</div><p class="quest-footnote">'+tr('A game earns 40 XP, plus 20 XP for a win. Blur Guess and Snapshot earn 4 XP per round, plus 2 XP for a correct answer.')+' '+tr('For daily quests, 10 rounds count as one game and 10 correct rounds as one win.')+'</p>'+gameQuestSection(v)+collectionQuestSection(v,accountValue);
  }
  function detach() { if(ref && listener) ref.off('value',listener);if(accountRef&&accountListener)accountRef.off('value',accountListener);ref=null;listener=null;accountRef=null;accountListener=null;accountValue=null;boundUid=null;value=null;pending.clear();render(); }
  function attach() {
    if (!currentAccount) { detach(); return; }
    const uid=sakuMyDcId(); if (uid===boundUid && ref) { render(); return; }
    if(ref && listener) ref.off('value',listener); value=null; boundUid=uid;
    ref=sakuAcctRef(uid).child('progress');
    listener = snap=>{ if(boundUid!==uid) return; value=normal(snap.val(),today()); render(); if(window.sakuPlayerRender) window.sakuPlayerRender(); if(window.sakuShowcaseProgressChanged) window.sakuShowcaseProgressChanged(); };
    ref.on('value', listener, ()=>{ value=null; render(); });
    if(accountRef&&accountListener)accountRef.off('value',accountListener);accountRef=sakuAcctRef(uid);accountListener=snap=>{if(uid!==boundUid)return;accountValue=snap.val()||{};if(document.getElementById('questsScreen').classList.contains('active'))render();else renderClipboard();};accountRef.on('value',accountListener);
    if(window.sakuDataReady)window.sakuDataReady.then(()=>{if(boundUid===uid)render();}).catch(()=>{});
    render();
  }
  function game(kind, gid, won) {
    if (!currentAccount || !ref || !gid || !roomCode || !currentRoom) return;
    const id=[roomCode,currentRoom.createdAt || 0,kind,gid].join('_').replace(/[.#$\[\]\/]/g,'_');
    if (pending.has(id)) return;
    pending.add(id); const day=today(), uid=boundUid, target=ref;
    target.transaction(raw=>{
      if (raw && raw.daily && raw.daily.day > day) return;
      const v=normal(raw,day); if(v.matches[id]) return;
      v.matches[id]={won:!!won}; if(kind!=='blur'&&kind!=='snapshot'){v.daily.games++;if(won)v.daily.wins++;const d=v.daily.byGame[kind]||(v.daily.byGame[kind]={games:0,wins:0});d.games=safe(d.games)+1;if(won)d.wins=safe(d.wins)+1;gain(v,40+(won?20:0));} return v;
    },undefined,false).then(result=>{ if (!result.committed) return; if (boundUid===uid&&kind!=='blur'&&kind!=='snapshot') showNotification(tr('Game complete: experience earned!')); }).catch(()=>{pending.delete(id); if(boundUid===uid) showNotification(tr('Progress could not be saved.'));});
  }
  function round(kind,gid,index,won){
    if(!currentAccount||!ref||!gid||!roomCode||!currentRoom||!['blur','snapshot'].includes(kind)||!Number.isInteger(index)||index<0)return;
    const key=[roomCode,currentRoom.createdAt||0,kind,gid,index].join('_').replace(/[.#$\[\]\/]/g,'_'),token='round:'+key;
    if(pending.has(token))return;pending.add(token);const day=today(),target=ref,uid=boundUid;
    target.transaction(raw=>{if(raw&&raw.daily&&raw.daily.day>day)return;const v=normal(raw,day);if(v.rounds[key])return;v.rounds[key]={won:!!won};v.daily.rounds++;if(won)v.daily.roundWins++;const d=v.daily.byGame[kind]||(v.daily.byGame[kind]={games:0,wins:0});d.games=safe(d.games)+1;if(won)d.wins=safe(d.wins)+1;gain(v,4+(won?2:0));return v;},undefined,false).catch(()=>{pending.delete(token);if(uid===boundUid)showNotification(tr('Progress could not be saved.'));});
  }
  function multi(kind, room) {
    if (!room || !room.players || !room.players[playerId]) return;
    const k={battle:'br',race:'rc',blur:'bg',snapshot:'sn',codenames:'cn'}[kind], g=room[k];
    if (!g || !g.gameId || room.players[playerId].outInGame===g.gameId) return;
    let won=false;
    if(kind==='race') { if(g.targetPid!==playerId && !(g.hunters||[]).includes(playerId)) return; won=g.winner===playerId; }
    else if(kind==='codenames') { const team=cnTeamOf(playerId,g); if(!team || !g.winner) return; won=team===g.winner.team; }
    else if(kind==='battle') {
      if(!g.secrets || !g.secrets[playerId]) return;
      const rank=(g.order||[]).filter(pid=>room.players[pid]).sort((a,b)=>((g.points||{})[b]||0)-((g.points||{})[a]||0) || ((g.found||{})[a]?1:0)-((g.found||{})[b]?1:0)); won=rank[0]===playerId;
    } else {
      const rank=Object.keys(room.players).filter(pid=>room.players[pid].outInGame!==g.gameId).sort((a,b)=>((g.scores||{})[b]||0)-((g.scores||{})[a]||0)); won=rank[0]===playerId;
    }
    game(kind,g.gameId,won);
  }
  async function claim(id) {
    const q=dailyQuests(today()).find(x=>x.id===id); if(!q||!ref||!currentAccount) return;
    const day=today(), uid=boundUid, target=ref;
    try {
      const result=await target.transaction(raw=>{
        if (raw && raw.daily && raw.daily.day > day) return;
        const v=normal(raw,day);
        if(v.daily.claimed[id] || dailyCount(v,q)<q.goal) return;
        v.daily.claimed[id]=true; v.coins+=q.coins; gain(v,q.xp); return v;
      },undefined,false);
      if(result.committed && boundUid===uid) showNotification(tr('Quest reward collected!'));
    } catch(e) { if(boundUid===uid) showNotification(tr('Progress could not be saved.')); }
  }
  async function claimGameQuest(id,expected){
    if(!ref||!currentAccount||!GAME_QUESTS.some(g=>g.id===id)||!Number.isInteger(expected)||expected<0||expected>=GAME_TIERS.length)return;
    const uid=boundUid,target=ref,day=today();
    try{const result=await target.transaction(raw=>{if(raw&&raw.daily&&raw.daily.day>day)return;const v=normal(raw,day),state=milestoneState(v,id),q=GAME_TIERS[expected],n=gameCounts(v)[id],factor=(id==='blur'||id==='snapshot')?10:1;
      if(state.tier!==expected||n.games<q.games*factor||n.wins<q.wins*factor)return;
      const creditUsed=Math.min(state.credit,q.coins);v.milestones[id]=Object.assign({},v.milestones[id]||{},{tier:expected+1,creditRemaining:state.credit-creditUsed});v.coins+=q.coins-creditUsed;return v;
    },undefined,false);if(result.committed&&uid===boundUid)showNotification(tr('Game quest reward collected!'));}catch(e){if(uid===boundUid)showNotification(tr('Progress could not be saved.'));}
  }
  async function claimCollectionQuest(id,expected){
    const q=COLLECTION_QUESTS.find(x=>x.id===id);if(!q||!currentAccount||!Number.isInteger(expected)||expected<0||expected>=q.goals.length)return;
    const uid=boundUid,target=sakuAcctRef(uid),day=today();
    try{const result=await target.transaction(raw=>{if(!raw||(raw.progress&&raw.progress.daily&&raw.progress.daily.day>day))return;const v=normal(raw.progress,day),state=collectionState(v,q),counts=collectionCounts(raw);if(state.tier!==expected||counts[id]<q.goals[expected]||(id==='collection'&&(!counts.collectionTotal||typeof GENERIC_CHARACTERS==='undefined'||!GENERIC_CHARACTERS.length||typeof ENCYCLOPEDIA==='undefined')))return;const reward=collectionReward(q,expected),credit=Math.min(state.credit,reward);if(id==='collection')v.collectionPercent={tier:expected+1,creditRemaining:state.credit-credit};else v.collectionMilestones[id]=expected+1;v.coins+=reward-credit;raw.progress=v;return raw;},undefined,false);if(result.committed&&uid===boundUid)showNotification(tr('Quest reward collected!'));}catch(e){if(uid===boundUid)showNotification(tr('Progress could not be saved.'));}
  }
  window.sakuClaimGameQuest=claimGameQuest;window.sakuClaimCollectionQuest=claimCollectionQuest;
  window.showQuests=function(){ showScreen('questsScreen'); render(); try { window.scrollTo(0,0); } catch(e) {} };
  window.sakuProgressAttach=attach; window.sakuProgressDetach=detach; window.sakuProgressGame=game; window.sakuProgressRound=round; window.sakuProgressMulti=multi; window.sakuClaimQuest=claim; window.sakuProgressRender=render;window.sakuProgressClipboard=renderClipboard; window.sakuProgressSnapshot=function(){ if(!value) return null; const v=normal(value,today()); return {level:v.level,xp:v.xp,needed:need(v.level),coins:v.coins}; };
  window.addEventListener('saku-lang-change',render);
  document.addEventListener('DOMContentLoaded',()=>{ if(currentAccount) attach(); else render(); });
  setInterval(()=>{ if(document.getElementById('questsScreen').classList.contains('active')||document.getElementById('homepageScreen').classList.contains('active')) render(); },60000);
})();
