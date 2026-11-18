/* Sakugame — portails : panneau du portail actif (achat, jauge, tirages gratuits) et fenêtre d'infos
   (taux, garanties, cartes). Les achats passent toujours par window.sakuPortalBuy (fonctions serveur). */
(function(){
  'use strict';
  const words={
    en:{close:'Close',chars:'Characters',wish:'In your wishlist',owned:'Owned',gauge:'Guarantee gauge',shared:'Shared by all portals',
      nextLeg:'Legendary or better in',nextMyth:'Mythic in',boosters:'boosters',booster:'booster',signGauge:'Sign in to track your gauge.',
      one:'1 booster',five:'5 boosters',cards10:'10 cards',cards50:'50 cards',free:'Free',freeIncl:'{n} free included',freeIncl1:'1 free included',
      freeNote:'{n} free draws available, used first.',freeNote1:'1 free draw available, used first.',noFree:'No free draws left.',refill:'Next one in {t}',
      balance:'Balance',coins:'coins',short:'Not enough coins',details:'Contents and rates',quick:'Quick opening',pending:'An opening is waiting.',resume:'Resume',
      signBuy:'Sign in with Discord to summon.',
      tabRates:'Rates and guarantees',tabCards:'Cards',perCard:'Per card',perBooster:'Per booster',rarity:'Rarity',
      ratesNote:'Base rates, before guarantees. 10 cards per booster.',guarantees:'Guarantees',
      g50:'At least one Legendary every 50 boosters',g400:'A Mythic at the 400th booster',g1000:'A Special at the 1000th booster on this portal',
      gRule:'The gauge is shared by all portals. Any Mythic resets it; a Special alone does not.',yourGauge:'Your gauge: {n} / 400',
      search:'Search by character or series',all:'All',ownedF:'Owned',missing:'Missing',wishF:'Wishlist',more:'Show more',none:'No matching characters.',
      loading:'Character data is loading.',shownOf:'{a} of {b}',
      basic:'The classic portal brings together the eligible Basic collection.',strong:'The Strongest brings together its special cards and the characters from their universes.',retro:'Retro brings together characters from anime and manga released before 2000.',cinema:'Cinema celebrates films and anime with a film.',
      tags:['Classic','Special edition','Before 2000','Cinema'],
      names:['Common','Uncommon','Rare','Epic','Legendary','Mythic','Special']},
    fr:{close:'Fermer',chars:'Personnages',wish:'Dans ta wishlist',owned:'Possédés',gauge:'Jauge de garantie',shared:'Commune à tous les portails',
      nextLeg:'Légendaire ou mieux dans',nextMyth:'Mythique dans',boosters:'boosters',booster:'booster',signGauge:'Connecte-toi pour suivre ta jauge.',
      one:'1 booster',five:'5 boosters',cards10:'10 cartes',cards50:'50 cartes',free:'Gratuit',freeIncl:'{n} gratuits inclus',freeIncl1:'1 gratuit inclus',
      freeNote:'{n} tirages gratuits disponibles, utilisés en premier.',freeNote1:'1 tirage gratuit disponible, utilisé en premier.',noFree:'Plus de tirage gratuit.',refill:'Prochain dans {t}',
      balance:'Solde',coins:'pièces',short:'Pas assez de pièces',details:'Contenu et taux',quick:'Ouverture rapide',pending:'Une ouverture t’attend.',resume:'Reprendre',
      signBuy:'Connecte-toi avec Discord pour invoquer.',
      tabRates:'Taux et garanties',tabCards:'Cartes',perCard:'Par carte',perBooster:'Par booster',rarity:'Rareté',
      ratesNote:'Taux de base, avant garanties. 10 cartes par booster.',guarantees:'Garanties',
      g50:'Au moins une Légendaire tous les 50 boosters',g400:'Une Mythique au 400e booster',g1000:'Une Spéciale au 1000e booster de ce portail',
      gRule:'La jauge est commune à tous les portails. Toute Mythique la remet à zéro ; une Spéciale seule, non.',yourGauge:'Ta jauge : {n} / 400',
      search:'Rechercher un personnage ou un univers',all:'Toutes',ownedF:'Possédées',missing:'Manquantes',wishF:'Wishlist',more:'Afficher plus',none:'Aucun personnage trouvé.',
      loading:'Chargement des personnages.',shownOf:'{a} sur {b}',
      basic:'Le portail classique rassemble les cartes Basic éligibles.',strong:'The Strongest réunit les cartes spéciales et tous les personnages de leurs univers.',retro:'Retro réunit les personnages des animés et mangas parus avant 2000.',cinema:'Cinéma réunit les films et les animés ayant une partie film.',
      tags:['Classique','Édition spéciale','Avant 2000','Cinéma'],
      names:['Commune','Peu commune','Rare','Épique','Légendaire','Mythique','Spéciale']},
    es:{close:'Cerrar',chars:'Personajes',wish:'En tu wishlist',owned:'Obtenidos',gauge:'Medidor de garantía',shared:'Compartido por todos los portales',
      nextLeg:'Legendaria o mejor en',nextMyth:'Mítica en',boosters:'sobres',booster:'sobre',signGauge:'Inicia sesión para seguir tu medidor.',
      one:'1 sobre',five:'5 sobres',cards10:'10 cartas',cards50:'50 cartas',free:'Gratis',freeIncl:'{n} gratis incluidos',freeIncl1:'1 gratis incluido',
      freeNote:'{n} tiradas gratis disponibles, se usan primero.',freeNote1:'1 tirada gratis disponible, se usa primero.',noFree:'No quedan tiradas gratis.',refill:'Siguiente en {t}',
      balance:'Saldo',coins:'monedas',short:'No tienes suficientes monedas',details:'Contenido y probabilidades',quick:'Apertura rápida',pending:'Tienes una apertura pendiente.',resume:'Continuar',
      signBuy:'Inicia sesión con Discord para invocar.',
      tabRates:'Probabilidades y garantías',tabCards:'Cartas',perCard:'Por carta',perBooster:'Por sobre',rarity:'Rareza',
      ratesNote:'Probabilidades base, antes de garantías. 10 cartas por sobre.',guarantees:'Garantías',
      g50:'Al menos una Legendaria cada 50 sobres',g400:'Una Mítica en el sobre 400',g1000:'Una Especial en el sobre 1000 de este portal',
      gRule:'El medidor es compartido por todos los portales. Cualquier Mítica lo reinicia; una Especial sola, no.',yourGauge:'Tu medidor: {n} / 400',
      search:'Buscar personaje o serie',all:'Todas',ownedF:'Obtenidas',missing:'Faltan',wishF:'Wishlist',more:'Mostrar más',none:'No hay personajes coincidentes.',
      loading:'Cargando personajes.',shownOf:'{a} de {b}',
      basic:'El portal clásico reúne las cartas Basic elegibles.',strong:'The Strongest reúne sus cartas especiales y los personajes de sus universos.',retro:'Retro reúne personajes de animes y mangas anteriores al año 2000.',cinema:'Cine reúne películas y animes con una parte cinematográfica.',
      tags:['Clásico','Edición especial','Antes de 2000','Cine'],
      names:['Común','Poco común','Rara','Épica','Legendaria','Mítica','Especial']}};
  const L=()=>(window.SAKU_I18N||{}).lang||'en', get=()=>words[L()]||words.en;
  const names=['Basic','The Strongest','Retro','Cinéma'], keys=['basic','strongest','retro','cinema'], desc=['basic','strong','retro','cinema'];
  const RARITIES=['common','uncommon','rare','epic','legendary','mythic','special'];
  const PRIORITY={special:0,mythic:1,legendary:2,epic:3,rare:4,uncommon:5,common:6};
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num=n=>Number(n||0).toLocaleString(L());
  const pct=(x,d)=>x.toLocaleString(L(),{maximumFractionDigits:d==null?3:d,minimumFractionDigits:0})+' %';
  const ic=id=>'<svg class="ic" aria-hidden="true"><use href="#'+id+'"/></svg>';
  const coin='<img class="pp-coin" src="summon-machines/coin.svg" alt="">';
  const unit=i=>i===0||i===2?200:300;
  let all=[], filtered=[], shown=0, index=0, lastFocus=null, active=-1, tab='rates', rarityF='all', ownF='all', poolCache={};

  function pool(i){
    if(typeof ENCYCLOPEDIA==='undefined'||!ENCYCLOPEDIA.list)return null;
    const groups=ENCYCLOPEDIA.list, specials=groups.filter(g=>g.edition==='strongest');
    const norm=x=>String(x||'').normalize('NFKD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
    let strongNames=new Set();
    if(typeof CARD_STRONGEST!=='undefined') CARD_STRONGEST.forEach(c=>strongNames.add(norm(c.series)));
    if(strongNames.has(norm('Re:ZERO -Starting Life in Another World-')))strongNames.add(norm('Re:Zero'));
    const records=[];
    groups.forEach(g=>{
      if(g.edition==='strongest'||g.edition==='hoshi')return;
      if(i===3 && !(typeof SAKU_CINEMA_GROUPS!=='undefined' && SAKU_CINEMA_GROUPS[g.label]))return;
      if(i===2 && !(typeof SAKU_RETRO_GROUPS!=='undefined' && SAKU_RETRO_GROUPS[g.label]))return;
      if(i===1 && !strongNames.has(norm(g.label)))return;
      (g.cards||[]).forEach(c=>{
        const id=String(c.i),local=window.SAKU_LOCAL_RARITIES||{},remote=window.SAKU_REMOTE_RARITIES||{};
        const rarity=local[id]||remote[id]||c.r;
        records.push({id:id,name:c.m,series:g.label,image:c.u,rarity:rarity,aliases:(c.a||[]),card:Object.assign({},c,{r:rarity})});
      });
    });
    if(i===1)specials.forEach(g=>(g.cards||[]).filter(c=>window.sakuSpecialNumber&&window.sakuSpecialNumber(c)).forEach(c=>records.push({id:String(c.i),name:c.m,series:c.series||'The Strongest',image:c.u,rarity:'special',card:c})));
    if(i===3)groups.filter(g=>g.edition==='hoshi').forEach(g=>(g.cards||[]).forEach(c=>records.push({id:String(c.i),name:c.m,series:c.series||'Hoshi',image:c.u,rarity:'special',card:c})));
    return records;
  }
  window.sakuPortalPool=pool;
  function cachedPool(i){const k=i+':'+(typeof ENCYCLOPEDIA!=='undefined'&&ENCYCLOPEDIA.list?ENCYCLOPEDIA.list.length:0)+':'+Object.keys(window.SAKU_REMOTE_RARITIES||{}).length;if(!poolCache[k])poolCache[k]=pool(i);return poolCache[k];}
  const ownedCount=id=>typeof cardState!=='undefined'&&cardState&&cardState.cards?Number(cardState.cards[String(id)])||0:0;
  const wished=id=>typeof cardState!=='undefined'&&cardState&&!!((cardState.flags||{})[String(id)]||{}).wishlist;
  const signed=()=>!!window.sakuSecureUserId;
  function timeLeft(ms){const s=Math.max(0,Math.ceil(ms/1000)),m=Math.floor(s/60),r=s%60;return m+':'+String(r).padStart(2,'0');}
  function freeCount(){return window.sakuPortalFreeCount?window.sakuPortalFreeCount():0;}
  function balance(){const s=window.sakuProgressSnapshot&&window.sakuProgressSnapshot();return s?s.coins:null;}
  function quickOn(){try{return localStorage.getItem('saku-portal-quick')==='1'}catch(e){return false}}
  window.sakuPortalQuickToggle=function(on){try{localStorage.setItem('saku-portal-quick',on?'1':'0')}catch(e){}};

  // ---------- panneau du portail actif ----------
  function buyButton(i,n){
    const w=get(),fc=freeCount(),free=signed()?Math.min(n,fc):0,cost=(n-free)*unit(i),full=n*unit(i),bal=balance();
    const short=signed()&&bal!==null&&bal!==Infinity&&cost>bal;
    const price=cost===0?'<span class="pp-price is-free">'+esc(w.free)+'</span>'
      :'<span class="pp-price">'+(free?'<s>'+num(full)+'</s>':'')+coin+'<b>'+num(cost)+'</b></span>';
    const sub=free&&cost?'<small class="pp-buy-free">'+esc(free===1?w.freeIncl1:w.freeIncl.replace('{n}',free))+'</small>':short?'<small class="pp-buy-short">'+esc(w.short)+'</small>':'';
    return '<button type="button" class="pp-buy-btn'+(n===5?' is-five':'')+(short?' is-short':'')+(cost===0?' is-free':'')+'" onclick="sakuPortalBuy('+i+','+n+')">'+
      '<span class="pp-buy-n">×'+n+'</span><span class="pp-buy-main"><b>'+esc(n===1?w.one:w.five)+'</b><small>'+esc(n===1?w.cards10:w.cards50)+'</small></span>'+
      '<span class="pp-buy-side">'+price+sub+'</span></button>';
  }
  function gauge(){
    const w=get(),p=window.sakuPortalPity?window.sakuPortalPity(0):null;
    if(p===null||!signed())return '<div class="pp-gauge is-off"><div class="pp-gauge-head"><span>'+ic('i-hourglass')+esc(w.gauge)+'</span></div><p>'+esc(w.signGauge)+'</p></div>';
    const leg=50-(p%50), myth=400-p;
    let marks='';for(let k=50;k<400;k+=50)marks+='<i style="left:'+(k/4)+'%"></i>';
    return '<div class="pp-gauge"><div class="pp-gauge-head"><span>'+ic('i-hourglass')+esc(w.gauge)+'</span><b>'+num(p)+' / 400</b></div>'+
      '<div class="pp-gauge-bar"><span style="width:'+(p/4)+'%"></span>'+marks+'</div>'+
      '<div class="pp-gauge-next"><span class="pp-leg">'+ic('i-star')+esc(w.nextLeg)+' <b>'+leg+'</b> '+esc(leg>1?w.boosters:w.booster)+'</span>'+
      '<span class="pp-myth">'+ic('i-crown')+esc(w.nextMyth)+' <b>'+myth+'</b> '+esc(myth>1?w.boosters:w.booster)+'</span></div>'+
      '<small class="pp-gauge-shared">'+esc(w.shared)+'</small></div>';
  }
  function freeLine(){
    const w=get(),fc=freeCount();if(!signed())return '';
    const next=window.sakuPortalFreeNext?window.sakuPortalFreeNext():0,refill=next&&next>Date.now()&&fc<5?' · <span class="pp-refill" data-next="'+next+'">'+esc(w.refill.replace('{t}',timeLeft(next-Date.now())))+'</span>':'';
    return '<p class="pp-free'+(fc?' has-free':'')+'">'+ic('i-sparkle')+'<span>'+esc(fc?(fc===1?w.freeNote1:w.freeNote.replace('{n}',fc)):w.noFree)+refill+'</span></p>';
  }
  function renderPanel(i){
    const box=document.getElementById('portalPanel');if(!box)return;
    const w=get(),items=cachedPool(i),total=items?items.length:null;
    const ownedN=items?items.filter(c=>ownedCount(c.id)>0).length:0,wishN=items?items.filter(c=>wished(c.id)).length:0;
    const pending=window.sakuPortalPending&&window.sakuPortalPending(i),bal=balance();
    box.dataset.portal=keys[i];
    box.innerHTML=
      '<header class="pp-head"><span class="pp-kicker">'+String(i+1).padStart(2,'0')+' / 04 · '+esc(w.tags[i])+'</span><h2 data-noi18n>'+esc(names[i])+'</h2><p>'+esc(w[desc[i]])+'</p></header>'+
      '<div class="pp-stats"><div><b>'+(total===null?'—':num(total))+'</b><span>'+esc(w.chars)+'</span></div>'+
        '<div><b>'+(signed()?num(ownedN):'—')+'</b><span>'+esc(w.owned)+'</span></div>'+
        '<div><b>'+(signed()?num(wishN):'—')+'</b><span>'+esc(w.wish)+'</span></div></div>'+
      gauge()+
      (pending?'<div class="pp-pending">'+ic('i-restore')+'<span>'+esc(w.pending)+'</span><button type="button" onclick="sakuPortalResume()">'+esc(w.resume)+'</button></div>':'')+
      '<div class="pp-buy">'+buyButton(i,1)+buyButton(i,5)+'</div>'+
      freeLine()+
      (signed()?'':'<p class="pp-free">'+ic('i-discord')+'<span>'+esc(w.signBuy)+'</span></p>')+
      '<div class="pp-foot"><button type="button" class="pp-details" onclick="portalInfoOpen('+i+')">'+ic('i-info')+'<span>'+esc(w.details)+'</span></button>'+
        (signed()&&bal!==null?'<span class="pp-balance">'+esc(w.balance)+' '+coin+'<b>'+(bal===Infinity?'∞':num(bal))+'</b></span>':'')+
        '<label class="pp-quick"><input type="checkbox" '+(quickOn()?'checked':'')+' onchange="sakuPortalQuickToggle(this.checked)"><span>'+esc(w.quick)+'</span></label></div>';
  }
  function update(){
    // Les anciennes surcouches dessinées dans les machines ne sont plus utilisées : on les retire si elles existent.
    document.querySelectorAll('.portal-machine-layer').forEach(el=>el.remove());
    const note=document.getElementById('summonFreeNote');if(note)note.remove();
    const scr=document.getElementById('summonScreen');
    const cur=document.querySelector('.summon-slide.is-active'),i=cur?Number(cur.dataset.index):(active>=0?active:0);
    if(scr&&(scr.classList.contains('active')||active<0)){active=i;renderPanel(i);}
  }
  window.sakuPortalActive=function(i){if(i===active)return;active=i;const s=document.getElementById('summonScreen');if(s)s.dataset.portal=keys[i];renderPanel(i);};

  // ---------- fenêtre d'infos ----------
  function ratesHtml(i){
    const w=get(),rates=window.sakuPortalRates[i]||[],p=window.sakuPortalPity?window.sakuPortalPity(0):null,max=Math.max(...rates);
    let rows='';
    rates.forEach((r,j)=>{if(!r)return;const card=r/1000,booster=(1-Math.pow(1-r/100000,10))*100;
      rows+='<tr data-rarity="'+RARITIES[j]+'"><th scope="row"><i class="pi-dot"></i>'+esc(w.names[j])+'</th><td>'+pct(card)+'</td><td>'+pct(booster,booster<1?3:1)+'</td>'+
        '<td class="pi-bar-cell"><span class="pi-bar"><span style="width:'+Math.max(1.5,Math.log10(1+r)/Math.log10(1+max)*100)+'%"></span></span></td></tr>';});
    const special=i===1||i===3;
    const g=(n,text,icon,cls,progress)=>'<li class="'+cls+'"><span class="pi-g-n">'+n+'</span><span class="pi-g-ico">'+ic(icon)+'</span><div><b>'+esc(text)+'</b>'+(progress||'')+'</div></li>';
    const prog=p!==null&&signed()?'<small>'+esc(w.yourGauge.replace('{n}',p))+'</small>':'';
    return '<section class="pi-pane" data-pane="rates"'+(tab==='rates'?'':' hidden')+'>'+
      '<table class="pi-rates"><thead><tr><th>'+esc(w.rarity)+'</th><th>'+esc(w.perCard)+'</th><th>'+esc(w.perBooster)+'</th><th aria-hidden="true"></th></tr></thead><tbody>'+rows+'</tbody></table>'+
      '<p class="pi-note">'+esc(w.ratesNote)+'</p>'+
      '<h3>'+esc(w.guarantees)+'</h3><ul class="pi-guarantees">'+
        g(50,w.g50,'i-star','is-leg',prog)+g(400,w.g400,'i-crown','is-myth',prog)+(special?g(1000,w.g1000,'i-sparkle','is-special',''):'')+'</ul>'+
      '<p class="pi-note">'+esc(w.gRule)+'</p></section>';
  }
  function cardsShell(i,items){
    const w=get(),counts={};(items||[]).forEach(c=>{counts[c.rarity]=(counts[c.rarity]||0)+1;});
    const chip=(k,label,n)=>'<button type="button" class="pi-chip'+(rarityF===k?' is-on':'')+'" data-rarity="'+k+'" onclick="portalInfoRarity(\''+k+'\')">'+esc(label)+(n!=null?' <span>'+num(n)+'</span>':'')+'</button>';
    let chips=chip('all',w.all,items?items.length:0);
    RARITIES.slice().reverse().forEach(k=>{if(counts[k])chips+=chip(k,w.names[RARITIES.indexOf(k)],counts[k]);});
    const own=(k,label)=>'<button type="button" class="pi-seg'+(ownF===k?' is-on':'')+'" onclick="portalInfoOwned(\''+k+'\')">'+esc(label)+'</button>';
    return '<section class="pi-pane" data-pane="cards"'+(tab==='cards'?'':' hidden')+'>'+
      '<div class="pi-tools"><input type="search" id="portalInfoSearch" autocomplete="off" placeholder="'+esc(w.search)+'" aria-label="'+esc(w.search)+'"'+(items?'':' disabled')+'>'+
        (signed()?'<div class="pi-segs">'+own('all',w.all)+own('owned',w.ownedF)+own('missing',w.missing)+own('wish',w.wishF)+'</div>':'')+'</div>'+
      '<div class="pi-chips">'+chips+'</div><p class="pi-count" id="portalInfoCount"></p>'+
      '<div id="portalInfoList" class="portal-info-list" tabindex="0">'+(items?'':esc(w.loading))+'</div>'+
      '<button type="button" id="portalInfoMore" class="portal-info-more" hidden></button></section>';
  }
  function renderList(reset){
    const w=get(),list=document.getElementById('portalInfoList');if(!list)return;
    if(reset){if(window.sakuBasicRelease)window.sakuBasicRelease(list);list.textContent='';shown=0;list.scrollTop=0;}
    const end=Math.min(filtered.length,shown+36),frag=document.createDocumentFragment();
    for(;shown<end;shown++){
      const c=filtered[shown],tile=document.createElement('div');tile.className='portal-card-tile';tile.dataset.rarity=c.rarity;
      tile.setAttribute('title',c.name+' — '+c.series);tile.setAttribute('aria-label',c.name+' — '+c.series);
      if(signed()&&ownedCount(c.id)<=0)tile.classList.add('is-missing');
      if(c.rarity==='special'&&window.sakuStrongestCard)tile.innerHTML=window.sakuStrongestCard(c.card,true);
      else if(window.sakuBasicCard)tile.innerHTML=window.sakuBasicCard(c.card,true,{series:c.series,image:c.image});
      else{const img=document.createElement('img');img.src=c.image;img.alt=c.name;img.loading='lazy';tile.appendChild(img);}
      if(signed()&&ownedCount(c.id)>0){const b=document.createElement('span');b.className='pi-owned-badge';b.textContent='×'+ownedCount(c.id);tile.appendChild(b);}
      frag.appendChild(tile);
    }
    list.appendChild(frag);if(window.sakuBasicObserve)window.sakuBasicObserve(list);
    if(!filtered.length){const empty=document.createElement('p');empty.className='portal-info-empty';empty.textContent=w.none;list.appendChild(empty);}
    const more=document.getElementById('portalInfoMore');more.hidden=shown>=filtered.length;more.textContent=w.more+' ('+num(filtered.length-shown)+')';
    const count=document.getElementById('portalInfoCount');if(count)count.textContent=w.shownOf.replace('{a}',num(filtered.length)).replace('{b}',num(all.length));
  }
  function filter(){
    const input=document.getElementById('portalInfoSearch');const q=(input?input.value:'').trim().toLocaleLowerCase();
    filtered=all.filter(c=>(rarityF==='all'||c.rarity===rarityF)&&
      (ownF==='all'||(ownF==='owned'&&ownedCount(c.id)>0)||(ownF==='missing'&&ownedCount(c.id)<=0)||(ownF==='wish'&&wished(c.id)))&&
      (!q||(c.name+' '+c.series+' '+(c.aliases||[]).join(' ')).toLocaleLowerCase().includes(q)));
    renderList(true);
  }
  function build(){
    const i=index,w=get(),items=cachedPool(i),card=document.getElementById('portalInfoCard');
    all=(items||[]).slice().sort((a,b)=>(PRIORITY[a.rarity]??99)-(PRIORITY[b.rarity]??99)||a.name.localeCompare(b.name)||String(a.id).localeCompare(String(b.id)));
    const keepQ=document.getElementById('portalInfoSearch')?document.getElementById('portalInfoSearch').value:'';
    card.dataset.portal=keys[i];
    card.innerHTML='<header class="pi-hero"><div class="pi-hero-text"><span class="pi-kicker">'+String(i+1).padStart(2,'0')+' / 04 · '+esc(w.tags[i])+'</span>'+
        '<h2 id="portalInfoTitle" data-noi18n>'+esc(names[i])+'</h2><p>'+esc(w[desc[i]])+'</p></div>'+
        '<img class="pi-pack" src="summon-machines/pack-'+keys[i]+'.png" alt="" loading="lazy">'+
        '<button type="button" class="portal-info-close" aria-label="'+esc(w.close)+'" onclick="portalInfoClose()">'+ic('i-x')+'</button></header>'+
      '<nav class="pi-tabs" role="tablist">'+
        '<button type="button" role="tab" class="pi-tab'+(tab==='rates'?' is-on':'')+'" aria-selected="'+(tab==='rates')+'" onclick="portalInfoTab(\'rates\')">'+esc(w.tabRates)+'</button>'+
        '<button type="button" role="tab" class="pi-tab'+(tab==='cards'?' is-on':'')+'" aria-selected="'+(tab==='cards')+'" onclick="portalInfoTab(\'cards\')">'+esc(w.tabCards)+' <span>'+(items?num(items.length):'—')+'</span></button></nav>'+
      '<div class="pi-body">'+ratesHtml(i)+cardsShell(i,items)+'</div>';
    const input=document.getElementById('portalInfoSearch');if(input){input.value=keepQ;input.addEventListener('input',filter);}
    document.getElementById('portalInfoMore').addEventListener('click',()=>renderList(false));
    if(items)filter();
  }
  function open(i){
    index=i;lastFocus=document.activeElement;tab='rates';rarityF='all';ownF='all';
    const m=document.getElementById('portalInfoModal');const card=document.getElementById('portalInfoCard');if(card)card.innerHTML='';
    build();m.hidden=false;document.body.classList.add('portal-modal-open');
    const close=m.querySelector('.portal-info-close');if(close)close.focus();
  }
  window.portalInfoOpen=open;
  window.portalInfoTab=function(t){tab=t;const card=document.getElementById('portalInfoCard');if(!card)return;
    card.querySelectorAll('.pi-tab').forEach((b,k)=>{const on=(k===0?'rates':'cards')===t;b.classList.toggle('is-on',on);b.setAttribute('aria-selected',String(on));});
    card.querySelectorAll('.pi-pane').forEach(p=>{p.hidden=p.dataset.pane!==t;});const body=card.querySelector('.pi-body');if(body)body.scrollTop=0;};
  window.portalInfoRarity=function(k){rarityF=k;document.querySelectorAll('#portalInfoCard .pi-chip').forEach(b=>b.classList.toggle('is-on',b.dataset.rarity===k));filter();};
  window.portalInfoOwned=function(k){ownF=k;const map={all:0,owned:1,missing:2,wish:3};document.querySelectorAll('#portalInfoCard .pi-seg').forEach((b,j)=>b.classList.toggle('is-on',j===map[k]));filter();};
  window.portalDashboardRefresh=update;
  window.portalInfoClose=function(){const m=document.getElementById('portalInfoModal');m.hidden=true;document.body.classList.remove('portal-modal-open');if(lastFocus&&lastFocus.focus)lastFocus.focus();};
  function tick(){
    const s=document.getElementById('summonScreen');if(!s||!s.classList.contains('active')||document.hidden)return;
    const el=document.querySelector('#portalPanel .pp-refill');
    if(el){const next=Number(el.dataset.next);if(next<=Date.now()){update();return;}el.textContent=get().refill.replace('{t}',timeLeft(next-Date.now()));}
  }
  function init(){
    update();
    const modal=document.getElementById('portalInfoModal');
    modal.addEventListener('click',e=>{if(e.target===modal)portalInfoClose();});
    document.addEventListener('keydown',e=>{if(!modal.hidden&&e.key==='Escape')portalInfoClose();});
    window.addEventListener('saku-lang-change',()=>{update();if(!modal.hidden)build();});
    window.addEventListener('saku-rarity-change',()=>{poolCache={};update();});
    if(window.sakuDataReady)window.sakuDataReady.then(()=>{poolCache={};update();}).catch(()=>{});
    setInterval(tick,1000);
    // Le solde et la wishlist changent ailleurs (achat, marché, quêtes) : on rafraîchit le panneau à l'arrivée sur l'écran.
    new MutationObserver(()=>{const s=document.getElementById('summonScreen');if(s&&s.classList.contains('active'))update();}).observe(document.getElementById('summonScreen'),{attributes:true,attributeFilter:['class']});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
