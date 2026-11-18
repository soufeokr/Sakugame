/* Sakugame — grimoire d'invocation. Construit le grimoire de chaque portail et joue l'ouverture
   après un achat. L'animation ne fait qu'illustrer le résultat déjà fixé par le serveur :
   la gemme du fermoir et toute la lumière prennent la couleur de la meilleure carte obtenue. */
(function(){
  'use strict';
  const ORDER=['common','uncommon','rare','epic','legendary','mythic','special'];
  const COL=['#cfd6df','#3fd69a','#3fb8f0','#a07cf5','#f2a93b','#f28ab0','#e8c469'];
  const RGB=['207,214,223','63,214,154','63,184,240','160,124,245','242,169,59','242,138,176','232,196,105'];
  const THEMES=['basic','strongest','retro','cinema'];
  const NAMES={basic:'Basic',strongest:'The Strongest',retro:'Retro',cinema:'Cinéma'};
  const TITLES={basic:'BASIC',strongest:'STRONGEST',retro:'RETRO',cinema:'CINÉMA'};
  const T=7000, DONE=6150;
  const PETAL='M0 -6 C-15 -14 -16 -32 -6 -42 L0 -36 L6 -42 C16 -32 15 -14 0 -6 Z';
  const BIG='M0 -27 C-67.5 -63 -72 -144 -27 -189 L0 -162 L27 -189 C72 -144 67.5 -63 0 -27 Z';
  const rot=(d,extra)=>[0,72,144,216,288].map(a=>'<path '+(extra||'')+(a?' transform="rotate('+a+')"':'')+' d="'+d+'"/>').join('');
  const lang=()=>((window.SAKU_I18N||{}).lang||'en');
  const L={fr:{title:'GRIMOIRE D’INVOCATION',skip:'Clique pour passer'},en:{title:'SUMMONING GRIMOIRE',skip:'Tap to skip'},es:{title:'GRIMORIO DE INVOCACIÓN',skip:'Pulsa para saltar'}};
  const tx=k=>(L[lang()]||L.en)[k];
  let playing=null;

  function medal(theme){
    if(theme==='strongest')return '<b class="gm-kanji">最強</b>';
    if(theme==='retro')return '<svg viewBox="-50 -50 100 100" fill="none" stroke="var(--metal)" stroke-width="5" stroke-linejoin="round"><path d="M0 -40 L11 -12 L40 -12 L17 6 L26 36 L0 18 L-26 36 L-17 6 L-40 -12 L-11 -12 Z"/></svg>';
    return '<svg viewBox="-50 -50 100 100" fill="var(--metal)">'+rot(PETAL)+'<circle r="7" fill="#1a1206"/></svg>';
  }
  function markup(theme){
    const film=theme==='cinema'?'<i class="gm-film" style="top:1.8em"></i><i class="gm-film" style="bottom:1.8em"></i>':'';
    const legend=ORDER.map((r,i)=>'<i data-r="'+r+'" style="background:'+COL[i]+'"></i>').join('');
    return '<span class="gm" data-theme="'+theme+'" aria-hidden="true">'+
      '<span class="gm-fx"><i class="gm-halo"></i><i class="gm-rays"></i>'+
        '<span class="gm-circle"><svg viewBox="-310 -310 620 620" fill="none" stroke="var(--rar)">'+
          '<circle class="gm-outer2" r="305" stroke-width="3" stroke-dasharray="14 10"/><circle r="288" stroke-width="5"/><circle r="266" stroke-width="18" stroke-dasharray="3 22" opacity=".8"/>'+
          '<circle class="gm-adv" r="232" stroke-width="2"/><g class="gm-adv" stroke-width="3">'+rot(BIG)+
          '<circle cx="126.4" cy="-173.9" r="10"/><circle cx="204.5" cy="66.4" r="10"/><circle cx="0" cy="215" r="10"/><circle cx="-204.5" cy="66.4" r="10"/><circle cx="-126.4" cy="-173.9" r="10"/></g>'+
          '<circle class="gm-adv" r="40" stroke-width="3" stroke-dasharray="8 7"/></svg></span>'+
        '<i class="gm-beam"></i></span>'+
      '<i class="gm-floor"></i><span class="gm-fx"><i class="gm-bhalo"></i></span>'+
      '<span class="gm-stage"><span class="gm-shake"><span class="gm-book">'+
        '<i class="gm-spine"></i><i class="gm-back"></i><i class="gm-thick"></i><i class="gm-edges"></i>'+
        '<span class="gm-block gm-paper"><i class="gm-lines gm-write" style="top:1.4em"></i>'+
          '<span class="gm-seal"><svg class="gm-ink" viewBox="-60 -60 120 120" fill="none" stroke="#6b4a1e" stroke-width="1.6"><circle r="54" pathLength="1"/><circle r="47" pathLength="1"/>'+rot(PETAL,'pathLength="1"')+'</svg></span>'+
          '<span class="gm-seal gm-glowseal"><svg viewBox="-60 -60 120 120" fill="none" stroke="var(--rar)" stroke-width="2"><circle r="54"/><circle r="47"/>'+rot(PETAL)+'</svg></span>'+
          '<i class="gm-pglow"></i><i class="gm-lines gm-write" style="bottom:1.2em"></i></span>'+
        '<i class="gm-leak"></i>'+
        '<span class="gm-flip gm-paper k2"><i class="gm-lines" style="top:1.6em"></i><i class="gm-sketch" style="left:2.4em;top:7em"></i><i class="gm-sketch" style="left:7.2em;top:9.2em"></i><i class="gm-lines" style="bottom:1.6em"></i></span>'+
        '<span class="gm-flip gm-paper k1"><i class="gm-lines" style="top:1.6em"></i><i class="gm-sketch" style="left:4.8em;top:8em"></i><i class="gm-lines" style="top:14em"></i><i class="gm-lines" style="bottom:1.6em"></i></span>'+
        '<span class="gm-flip gm-paper k0"><i class="gm-lines" style="top:1.6em"></i><i class="gm-lines" style="top:5em"></i><i class="gm-sketch" style="left:6em;top:10em"></i><i class="gm-lines" style="bottom:1.6em"></i></span>'+
        '<span class="gm-cover">'+
          '<span class="gm-face gm-inside"><span class="gm-pg"><b class="gm-pg-title">'+tx('title')+'</b><b class="gm-pg-name">'+NAMES[theme]+'</b>'+
            '<svg class="gm-pg-medal" viewBox="-50 -50 100 100" fill="none" stroke="#6b4a1e" stroke-width="2"><circle r="46"/><circle r="38" stroke-dasharray="3 4"/>'+rot(PETAL)+'</svg>'+
            '<i class="gm-lines" style="top:11.2em"></i><i class="gm-lines" style="top:14em;right:4em"></i><span class="gm-legend">'+legend+'</span></span></span>'+
          '<span class="gm-face gm-front"><i class="gm-frame"></i><i class="gm-frame2"></i>'+film+
            '<i class="gm-corner gm-c1"></i><i class="gm-corner gm-c2"></i><i class="gm-corner gm-c3"></i><i class="gm-corner gm-c4"></i>'+
            '<b class="gm-ttl">'+TITLES[theme]+'</b><span class="gm-medal">'+medal(theme)+'</span></span>'+
        '</span>'+
        '<span class="gm-clasp"><i class="gm-gem" style="--g:'+COL[0]+'"></i><span class="gm-tiers"></span></span>'+
      '</span></span></span>'+
      '<span class="gm-fx gm-top"><i class="gm-flash"></i>'+
        '<span class="gm-holo"><svg viewBox="-60 -60 120 120" fill="none" stroke="var(--rar)" stroke-width="2"><circle r="54"/><circle r="47" stroke-dasharray="2 5"/>'+rot(PETAL)+'</svg></span>'+
        '<span class="gm-sparks"></span></span>'+
      '<span class="gm-card"></span><b class="gm-skip"></b>'+
    '</span>';
  }
  function build(){
    document.querySelectorAll('#summonScreen .summon-slide[data-index]').forEach(slide=>{
      const i=Number(slide.dataset.index),btn=slide.querySelector('.summon-machine-button');
      if(!btn||btn.querySelector('.gm'))return;
      btn.innerHTML=markup(THEMES[i]||'basic');
    });
  }
  function relabel(){
    document.querySelectorAll('#summonScreen .gm-pg-title').forEach(el=>{el.textContent=tx('title');});
  }

  function reset(gm){
    if(!gm)return;
    gm.classList.remove('is-playing');ORDER.forEach(r=>gm.classList.remove('r-'+r));
    gm.querySelector('.gm-tiers').innerHTML='';gm.querySelector('.gm-sparks').innerHTML='';gm.querySelector('.gm-card').innerHTML='';
    gm.querySelectorAll('.gm-legend i').forEach(d=>d.classList.remove('on'));
  }
  function stop(){
    if(!playing)return;const p=playing;playing=null;
    clearTimeout(p.timer);clearTimeout(p.sfx);document.removeEventListener('pointerdown',p.skip,true);document.removeEventListener('keydown',p.key,true);
    try{p.done&&p.done();}finally{setTimeout(()=>reset(p.gm),450);}
  }
  /* i : portail (0-3), tier : meilleure rareté du tirage, done : appelé à la fin (ou au clic pour passer). */
  function play(i,tier,done){
    build();
    const slide=document.querySelector('#summonScreen .summon-slide[data-index="'+i+'"]'),gm=slide&&slide.querySelector('.gm');
    const screen=document.getElementById('summonScreen');
    if(!gm||!screen||!screen.classList.contains('active')||matchMedia('(prefers-reduced-motion: reduce)').matches){done&&done();return;}
    if(playing)stop();
    reset(gm);
    const k=Math.max(0,ORDER.indexOf(tier));
    gm.classList.add('r-'+ORDER[k]);
    gm.querySelector('.gm-tiers').innerHTML=ORDER.slice(1,k+1).map((r,j)=>'<i class="gm-gem tier up'+(j+1)+'" style="--g:'+COL[j+1]+'"></i>').join('')+
      ORDER.slice(1,k+1).map((r,j)=>'<i class="gm-pulse f'+(j+1)+'" style="--prgb:'+RGB[j+1]+'"></i>').join('');
    const n=[0,2,4,8,10,14,22][k];
    gm.querySelector('.gm-sparks').innerHTML=Array.from({length:n},(_,j)=>{const a=(j/n)*Math.PI*2+.3,r=110+(j*41)%90;
      return '<i class="gm-spark" style="--sx:'+(Math.cos(a)*r*1.3-60)/10+'em;--sy:'+(Math.sin(a)*r*.8-60)/10+'em;animation-delay:'+((j%6)*.06).toFixed(2)+'s"></i>';}).join('');
    gm.querySelector('.gm-card').innerHTML=window.sakuRarityBack?window.sakuRarityBack(ORDER[k]):'';
    const dot=gm.querySelector('.gm-legend i[data-r="'+ORDER[k]+'"]');if(dot)dot.classList.add('on');
    gm.querySelector('.gm-skip').textContent=tx('skip');
    void gm.offsetWidth;
    gm.classList.add('is-playing');
    const p={gm,done,timer:0,sfx:0};
    p.skip=e=>{if(e.target.closest&&e.target.closest('.portal-tabs,.top-bar,header,nav'))return;e.preventDefault();e.stopPropagation();stop();};
    p.key=e=>{if(e.key==='Escape'||e.key===' '||e.key==='Enter'){e.preventDefault();stop();}};
    p.timer=setTimeout(stop,DONE);
    if(window.SakuSfx)p.sfx=setTimeout(()=>{try{SakuSfx.play('pack',ORDER[k],0)}catch(e){}},T*.2);
    playing=p;
    setTimeout(()=>{if(playing===p){document.addEventListener('pointerdown',p.skip,true);document.addEventListener('keydown',p.key,true);}},250);
  }
  window.sakuGrimoirePlay=play;
  window.sakuGrimoirePlaying=()=>!!playing;
  function init(){build();window.addEventListener('saku-lang-change',relabel);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
