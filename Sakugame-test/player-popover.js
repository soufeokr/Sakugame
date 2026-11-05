/* Account-only draw reserve. Separate from the older free-booster album. */
(function () {
  'use strict';
  const INTERVAL=12*60*1000, MAX=5;
  const tr=s=>typeof t==='function'?t(s):s;
  let ref=null, listener=null, uid=null, state=null, busy=false, retryAfter=0;
  function n(x){ return Number.isFinite(Number(x))?Math.max(0,Math.floor(Number(x))):0; }
  function accrue(raw, now) {
    if (!raw || typeof raw!=='object') return {available:MAX,nextAt:0};
    let available=Math.min(MAX,n(raw.available)), nextAt=n(raw.nextAt);
    if(available===MAX) return {available:MAX,nextAt:0};
    if(!nextAt) nextAt=now+INTERVAL;
    if(nextAt<=now) { const added=Math.min(MAX-available,1+Math.floor((now-nextAt)/INTERVAL)); available+=added; nextAt=available===MAX?0:nextAt+added*INTERVAL; }
    return {available,nextAt};
  }
  function refresh(force) {
    if(!ref || busy || Date.now()<retryAfter) return;
    const now=Date.now();
    if(!force && state && (state.available===MAX || state.nextAt>now)) return;
    const target=ref, owner=uid; busy=true;
    target.transaction(raw=>accrue(raw,now),undefined,false).then(result=>{
      if(owner===uid && result.committed) { state=accrue(result.snapshot.val(),Date.now()); render(); }
    }).catch(()=>{ if(owner===uid) retryAfter=Date.now()+10000; }).finally(()=>{if(owner===uid) busy=false;});
  }
  function detach() {
    if(ref && listener) ref.off('value',listener);
    ref=null; listener=null; uid=null; state=null; busy=false; retryAfter=0; close(false);
  }
  function attach() {
    if(!currentAccount){detach();return;}
    const owner=sakuMyDcId(); if(owner===uid && ref) return;
    detach(); uid=owner; ref=sakuAcctRef(owner).child('drawReserve');
    listener=snap=>{ if(uid!==owner) return; const raw=snap.val(); state=raw?accrue(raw,Date.now()):null; render();
      // A due reserve is persisted once rather than rewriting every second.
      if(!raw || (n(raw.available)<MAX && (!n(raw.nextAt) || n(raw.nextAt)<=Date.now()))) refresh(true);
    };
    ref.on('value',listener,()=>{if(uid===owner){state=null;render();}}); refresh();
  }
  function position() {
    const pop=document.getElementById('playerPopover'), btn=document.getElementById('usernameBtn');
    if(!pop || pop.hidden || !btn) return;
    const r=btn.getBoundingClientRect(), gap=10, width=pop.offsetWidth, height=pop.offsetHeight;
    const left=Math.max(10,Math.min(window.innerWidth-width-10,r.right-width));
    const below=window.innerHeight-r.bottom >= height+gap+10;
    const top=below ? r.bottom+gap : Math.max(10,r.top-height-gap);
    pop.style.left=left+'px'; pop.style.top=top+'px';
  }
  function render() {
    const pop=document.getElementById('playerPopover'); if(!pop || pop.hidden) return;
    const p=window.sakuProgressSnapshot && window.sakuProgressSnapshot();
    document.getElementById('playerPopLevel').textContent=p ? tr('Level')+' '+p.level : tr('Loading…');
    document.getElementById('playerPopXp').textContent=p ? p.xp+' / '+p.needed+' XP' : '—';
    const bar=document.getElementById('playerPopBar'); const pc=p?Math.min(100,Math.floor(p.xp/p.needed*100)):0;
    bar.firstElementChild.style.width=pc+'%';bar.setAttribute('aria-valuenow',String(pc));
    document.getElementById('playerPopCoins').textContent=p ? p.coins.toLocaleString()+' '+tr('coins') : '—';
    document.getElementById('playerPopDraws').textContent=state ? state.available+' / '+MAX : '—';
    let text=tr('Loading…');
    if(state) {
      if(state.available>=MAX) text=tr('Reserve full')+' · '+tr('One draw every 12 min');
      else { const secs=Math.max(0,Math.ceil((state.nextAt-Date.now())/1000)); text=tr('Next draw in')+' '+String(Math.floor(secs/60)).padStart(2,'0')+':'+String(secs%60).padStart(2,'0')+' · '+tr('One draw every 12 min'); }
    }
    document.getElementById('playerPopTimer').textContent=text;
  }
  function close(restore) { const pop=document.getElementById('playerPopover'),btn=document.getElementById('usernameBtn'); if(!pop)return;const open=!pop.hidden;pop.hidden=true; if(btn) btn.setAttribute('aria-expanded','false'); if(open && restore && btn)btn.focus(); }
  function toggle(){ const pop=document.getElementById('playerPopover'); if(!currentAccount||!pop)return; if(!pop.hidden){close(false);return;} if(!ref)attach();pop.hidden=false;document.getElementById('usernameBtn').setAttribute('aria-expanded','true');render();position(); }
  document.addEventListener('click',e=>{ const pop=document.getElementById('playerPopover'),btn=document.getElementById('usernameBtn'); if(pop && !pop.hidden && !pop.contains(e.target) && !btn.contains(e.target)) close(false); });
  document.addEventListener('keydown',e=>{const pop=document.getElementById('playerPopover');if(e.key==='Escape' && pop && !pop.hidden){e.preventDefault();close(true);}});
  window.addEventListener('resize',position); window.addEventListener('scroll',position,{passive:true});
  document.addEventListener('DOMContentLoaded',()=>{if(currentAccount)attach();});
  setInterval(()=>{if(!currentAccount)return; refresh();render();},1000);
  window.sakuPlayerToggle=toggle; window.sakuPlayerClose=()=>close(true); window.sakuPlayerAttach=attach; window.sakuPlayerDetach=detach; window.sakuPlayerRender=render;
})();
