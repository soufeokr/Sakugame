/* Le solde et le délai des tirages gratuits proviennent du même registre Supabase que les invocations. */
(function () {
  'use strict';
  const MAX=5;
  const narrow=window.matchMedia('(max-width: 600px)');
  const tr=s=>typeof t==='function'?t(s):s;
  let uid=null, state=null, busy=false, retryAfter=0;
  function getUid(){return window.sakuSecureUserId||null;}
  async function refresh(force) {
    if(!currentAccount||!window.sakuBackend||busy||Date.now()<retryAfter)return;
    const owner=getUid();
    if(!owner)return;
    if(owner!==uid){uid=owner;state=null;force=true;}
    if(!force&&state&&(state.available>=MAX||state.nextAt>Date.now()))return;
    busy=true;
    try {
      const status=await window.sakuBackend.freeDrawStatus();
      if(owner!==getUid())return;
      const available=Math.max(0,Math.min(MAX,Math.floor(Number(status.available)||0)));
      const seconds=Math.max(0,Math.ceil(Number(status.next_seconds)||0));
      const bonus=Math.max(0,Math.floor(Number(status.bonus)||0));
      state={available,bonus,nextAt:available>=MAX?0:Date.now()+seconds*1000};
      retryAfter=0;
      render();
    } catch(e) {
      if(owner===getUid())retryAfter=Date.now()+10000;
      console.warn('Solde des tirages gratuits indisponible',e);
    } finally {busy=false;}
  }
  // Barre du haut (ordinateur) : packs gratuits et pièces à gauche du pseudo.
  function renderBar() {
    const box=document.getElementById('topBalances'); if(!box)return;
    const on=!!currentAccount; box.hidden=!on; if(!on)return;
    const p=window.sakuProgressSnapshot&&window.sakuProgressSnapshot();
    const draws=state?state.available+'/'+MAX+(state.bonus?' +'+state.bonus:''):'—', full=!p?'—':p.coins===Infinity?'∞':Number(p.coins).toLocaleString((window.SAKU_I18N&&window.SAKU_I18N.lang)||undefined);
    // Sur téléphone, un gros solde s'écrit en abrégé (1,2 M) pour laisser de la place au pseudo ; le montant exact reste dans l'infobulle.
    let coins=full;if(p&&Number.isFinite(Number(p.coins))&&Number(p.coins)>=100000&&narrow.matches){try{coins=new Intl.NumberFormat((window.SAKU_I18N&&window.SAKU_I18N.lang)||undefined,{notation:'compact',maximumFractionDigits:Number(p.coins)<1e6?0:1}).format(Number(p.coins));}catch(e){}}
    const d=document.getElementById('topBalDrawsVal'), c=document.getElementById('topBalCoinsVal');
    if(d.textContent!==draws)d.textContent=draws; if(c.textContent!==coins)c.textContent=coins;
    const db=document.getElementById('topBalDraws'), cb=document.getElementById('topBalCoins');
    const dl=tr('Free packs')+' · '+draws, cl=tr('Coins')+' · '+full;
    if(db.title!==dl){db.title=dl;db.setAttribute('aria-label',dl);} if(cb.title!==cl){cb.title=cl;cb.setAttribute('aria-label',cl);}
  }
  if(narrow.addEventListener)narrow.addEventListener('change',()=>{renderBar();fitName();});
  // Pseudo de la barre du haut : s'il ne reste presque plus de place (téléphone étroit, salon ouvert…), on n'affiche que l'avatar.
  function fitName(){const btn=document.getElementById('usernameBtn'),n=btn&&btn.querySelector('.user-btn-name');if(!n)return;btn.classList.remove('name-squeezed');if(!narrow.matches)return;if(n.scrollWidth>n.clientWidth+1&&n.clientWidth<34)btn.classList.add('name-squeezed');}
  window.sakuFitTopName=fitName;
  try{const ro=new ResizeObserver(()=>fitName());const watch=()=>{['bottomBar','topBalances','usernameBtn'].forEach(id=>{const el=document.getElementById(id);if(el)ro.observe(el);});};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch);else watch();}catch(e){}
  function detach() { uid=null;state=null;busy=false;retryAfter=0;primedFor=null;close(false);renderBar(); }
  // b328 — statut des tirages gratuits déjà reçu avec le compte : pas de second appel.
  let primedFor=null;
  window.sakuFreeDrawsPrime=function(owner,status){if(!owner||!status)return;const available=Math.max(0,Math.min(MAX,Math.floor(Number(status.available)||0)));const seconds=Math.max(0,Math.ceil(Number(status.next_seconds)||0));const bonus=Math.max(0,Math.floor(Number(status.bonus)||0));uid=owner;state={available,bonus,nextAt:available>=MAX?0:Date.now()+seconds*1000};retryAfter=0;primedFor=owner;};
  function attach() { if(!currentAccount){detach();return;} if(primedFor&&primedFor===getUid()){primedFor=null;render();return;} primedFor=null; refresh(true); }
  function position() {
    const pop=document.getElementById('playerPopover'), btn=document.getElementById('usernameBtn');
    if(!pop||pop.hidden||!btn)return;
    const r=btn.getBoundingClientRect(),gap=10,width=pop.offsetWidth,height=pop.offsetHeight;
    const left=Math.max(10,Math.min(window.innerWidth-width-10,r.right-width));
    const below=window.innerHeight-r.bottom>=height+gap+10;
    const top=below?r.bottom+gap:Math.max(10,r.top-height-gap);
    pop.style.left=left+'px';pop.style.top=top+'px';
  }
  function render() {
    renderBar();
    const pop=document.getElementById('playerPopover'); if(!pop||pop.hidden)return;
    const p=window.sakuProgressSnapshot&&window.sakuProgressSnapshot();
    document.getElementById('playerPopLevel').textContent=p?tr('Level')+' '+p.level:tr('Loading…');
    document.getElementById('playerPopXp').textContent=p?p.xp+' / '+p.needed+' XP':'—';
    const bar=document.getElementById('playerPopBar'),pc=p?Math.min(100,Math.floor(p.xp/p.needed*100)):0;
    bar.firstElementChild.style.width=pc+'%';bar.setAttribute('aria-valuenow',String(pc));
    document.getElementById('playerPopCoins').textContent=p?p.coins.toLocaleString()+' '+tr('coins'):'—';
    document.getElementById('playerPopDraws').textContent=state?state.available+' / '+MAX+(state.bonus?' + '+state.bonus+' '+tr('bonus'):''):'—';
    let text=tr('Loading…');
    if(state){
      if(state.available>=MAX)text=tr('Reserve full')+' · '+tr('One draw every 12 min');
      else {const secs=Math.max(0,Math.ceil((state.nextAt-Date.now())/1000));text=tr('Next draw in')+' '+String(Math.floor(secs/60)).padStart(2,'0')+':'+String(secs%60).padStart(2,'0')+' · '+tr('One draw every 12 min');}
    }
    document.getElementById('playerPopTimer').textContent=text;
  }
  function close(restore) {const pop=document.getElementById('playerPopover'),btn=document.getElementById('usernameBtn');if(!pop)return;const open=!pop.hidden;pop.hidden=true;if(btn)btn.setAttribute('aria-expanded','false');if(open&&restore&&btn)btn.focus();}
  function toggle(){const pop=document.getElementById('playerPopover');if(!currentAccount||!pop)return;if(!pop.hidden){close(false);return;}refresh(true);pop.hidden=false;document.getElementById('usernameBtn').setAttribute('aria-expanded','true');render();position();}
  document.addEventListener('click',e=>{const pop=document.getElementById('playerPopover'),btn=document.getElementById('usernameBtn');if(pop&&!pop.hidden&&!pop.contains(e.target)&&btn&&!btn.contains(e.target))close(false);});
  document.addEventListener('keydown',e=>{const pop=document.getElementById('playerPopover');if(e.key==='Escape'&&pop&&!pop.hidden){e.preventDefault();close(true);}});
  window.addEventListener('resize',position);window.addEventListener('scroll',position,{passive:true});
  document.addEventListener('DOMContentLoaded',()=>{if(currentAccount)attach();});
  setInterval(()=>{if(!currentAccount){renderBar();return;}if(getUid()!==uid){uid=getUid();state=null;refresh(true);}else refresh(false);render();},1000);
  window.sakuPlayerToggle=toggle;window.sakuPlayerClose=()=>close(true);window.sakuPlayerAttach=attach;window.sakuPlayerDetach=detach;window.sakuPlayerRender=render;window.sakuPlayerRefreshDraws=()=>refresh(true);
})();
