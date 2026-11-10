/* Portal catalogue, live pity and probability information. */
(function(){
  const words={en:{chars:'CHARACTERS',wish:'WISHLIST',soon:'COMING SOON',info:'INFO',pity:'PITY CHARGE',unavailable:'— / 400',leg:'LEGENDARY',myth:'MYTHIC',close:'Close',odds:'Base rates per card',list:'Characters in this portal',search:'Search by character or series',more:'Show more',none:'No matching characters.',unconfigured:'Not defined yet',loading:'Character data is loading.',basic:'The classic portal brings together the eligible Basic collection.',strong:'The Strongest brings together its special cards and the characters from their universes.',retro:'Retro brings together characters from anime and manga released before 2000.',cinema:'Cinema celebrates films and anime with a film.',rule:'Preview only: summoning and pity tracking are not active. Planned guarantee: a Legendary every 50 draws, a Mythic at 400. Any Mythic resets the pity.',unset:'The eligible pool and rates for this portal have not been configured yet.',special:'Special cards are not available in boosters; no draw rates apply.',strongOdds:'The rate for special cards has not been set yet.',ratesNote:'Indicative base rates from the existing Basic booster, before guarantees. Portal draws are not active.',names:['Common','Uncommon','Rare','Epic','Legendary','Mythic']},
  fr:{chars:'PERSONNAGES',wish:'WISHLIST',soon:'À VENIR',info:'INFOS',pity:'CHARGE DE PITY',unavailable:'— / 400',leg:'LÉGENDAIRE',myth:'MYTHIQUE',close:'Fermer',odds:'Taux de base par carte',list:'Personnages de ce portail',search:'Rechercher un personnage ou un univers',more:'Afficher plus',none:'Aucun personnage trouvé.',unconfigured:'Non défini',loading:'Chargement des personnages.',basic:'Le portail classique rassemble les cartes Basic éligibles.',strong:'The Strongest réunit les cartes spéciales et tous les personnages de leurs univers.',retro:'Retro réunit les personnages des animés et mangas parus avant 2000.',cinema:'Cinéma réunit les films et les animés ayant une partie film.',rule:'Aperçu : les invocations et le suivi de pity ne sont pas encore actifs. Garantie prévue : un légendaire tous les 50 tirages et un mythique à 400. Tout mythique remet la pity à zéro.',unset:'La liste des cartes éligibles et les taux de ce portail ne sont pas encore définis.',special:'Les cartes spéciales ne sont pas disponibles dans les boosters : aucun taux de tirage ne s’applique.',strongOdds:'Le taux des cartes spéciales reste à définir.',ratesNote:'Taux indicatifs issus du booster Basic existant, avant garantie. Les tirages des portails ne sont pas actifs.',names:['Commune','Peu commune','Rare','Épique','Légendaire','Mythique']},
  es:{chars:'PERSONAJES',wish:'WISHLIST',soon:'PRÓXIMAMENTE',info:'INFO',pity:'CARGA DE PITY',unavailable:'— / 400',leg:'LEGENDARIO',myth:'MÍTICO',close:'Cerrar',odds:'Probabilidades base por carta',list:'Personajes del portal',search:'Buscar personaje o serie',more:'Mostrar más',none:'No hay personajes coincidentes.',unconfigured:'Aún sin definir',loading:'Cargando personajes.',basic:'El portal clásico reúne las cartas Basic elegibles.',strong:'The Strongest reúne sus cartas especiales y los personajes de sus universos.',retro:'Retro reúne personajes de animes y mangas anteriores al año 2000.',cinema:'Cine reúne películas y animes con una parte cinematográfica.',rule:'Vista previa: las invocaciones y el contador pity aún no están activos. Garantía prevista: un legendario cada 50 tiradas y un mítico a las 400. Cualquier mítico reinicia el pity.',unset:'La lista de cartas elegibles y las probabilidades de este portal aún no están definidas.',special:'Las cartas especiales no están disponibles en sobres; no hay probabilidades de tirada.',strongOdds:'La probabilidad de cartas especiales aún no está definida.',ratesNote:'Probabilidades indicativas del sobre Basic existente, antes de garantías. Las tiradas del portal aún no están activas.',names:['Común','Poco común','Rara','Épica','Legendaria','Mítica']}};
  const get=()=>words[(window.SAKU_I18N||{}).lang]||words.en;
  const names=['Basic','The Strongest','Retro','Cinéma'], desc=['basic','strong','retro','cinema'];
  let all=[], filtered=[], shown=0, index=0, lastFocus=null;
  function pool(i){
    if(typeof ENCYCLOPEDIA==='undefined'||!ENCYCLOPEDIA.list)return null;
    const groups=ENCYCLOPEDIA.list, specials=groups.filter(g=>g.edition==='strongest');
    const norm=x=>String(x||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
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
  function update(){let w=get();document.querySelectorAll('.summon-slide').forEach((slide,i)=>{
    let layer=slide.querySelector('.portal-machine-layer');if(!layer){layer=document.createElement('div');layer.className='portal-machine-layer';layer.innerHTML='<svg viewBox="0 0 300 510" aria-hidden="true"></svg><button class="portal-machine-info" type="button"></button><button class="portal-machine-buy buy-one" type="button"></button><button class="portal-machine-buy buy-five" type="button"></button><button class="portal-machine-resume" type="button" hidden></button>';slide.appendChild(layer);layer.querySelector('.portal-machine-info').addEventListener('click',e=>{e.stopPropagation();open(i);});layer.querySelector('.buy-one').addEventListener('click',e=>{e.stopPropagation();window.sakuPortalBuy(i,1);});layer.querySelector('.buy-five').addEventListener('click',e=>{e.stopPropagation();window.sakuPortalBuy(i,5);});layer.querySelector('.portal-machine-resume').addEventListener('click',e=>{e.stopPropagation();window.sakuPortalResume();});}
    let items=pool(i),num=items?String(items.length):'—';let charge=window.sakuPortalPity?window.sakuPortalPity(i):null;let wishCount=items&&typeof cardState!=='undefined'&&cardState?items.filter(c=>((cardState.flags||{})[String(c.id)]||{}).wishlist).length:0;let color=['#efd28a','#f0b48f','#9fc5ff','#efd5a1'][i];
    layer.querySelector('svg').innerHTML=`<g font-family="Arial,sans-serif" text-anchor="middle" fill="${color}"><text x="69" y="263" font-size="7" letter-spacing=".5">${w.chars}</text><text x="69" y="283" font-size="14" font-weight="bold">${num}</text><text x="150" y="263" font-size="7" letter-spacing=".5">${w.wish}</text><text x="150" y="282" font-size="12" font-weight="bold">${wishCount}</text><circle cx="231" cy="263" r="8" fill="none" stroke="${color}" stroke-width="1"/><text x="231" y="266" font-size="10" font-weight="bold">i</text><text x="231" y="283" font-size="8" font-weight="bold">${w.info}</text><text x="41" y="314" text-anchor="start" font-size="8" font-weight="bold" letter-spacing=".5">${w.pity}</text><text x="259" y="314" text-anchor="end" font-size="9" font-weight="bold">${charge===null?w.unavailable:charge+' / 400'}</text><text x="41" y="330" text-anchor="start" font-size="6.3">50 · ${w.leg}</text><text x="259" y="330" text-anchor="end" font-size="6.3">400 · ${w.myth}</text><rect x="41" y="336" width="${charge===null?0:Math.max(0,216*charge/400)}" height="6" rx="3" fill="${color}" opacity=".8"/><path d="M84 335v8 M128 335v8 M172 335v8 M216 335v8" stroke="${color}" opacity=".55"/></g>`;
    let b=layer.querySelector('button');b.setAttribute('aria-label',w.info+' — '+names[i]);b.disabled=!slide.classList.contains('is-active');b.tabIndex=b.disabled?-1:0;
    layer.querySelectorAll('.portal-machine-buy').forEach((button,j)=>{button.disabled=!slide.classList.contains('is-active');button.tabIndex=button.disabled?-1:0;const isCheap=i===0||i===2;button.setAttribute('aria-label',(j===0?(isCheap?'×1 · 200':'×1 · 300'):(isCheap?'×5 · 1 000':'×5 · 1 500'))+' — '+names[i]);});let resume=layer.querySelector('.portal-machine-resume');resume.hidden=!(window.sakuPortalPending&&window.sakuPortalPending(i));resume.disabled=!slide.classList.contains('is-active');resume.textContent=({fr:'Reprendre',es:'Continuar',en:'Resume'})[(window.SAKU_I18N||{}).lang]||'Resume';
  });}
  function renderList(reset){
    let w=get(),list=document.getElementById('portalInfoList');
    if(reset){if(window.sakuBasicRelease)window.sakuBasicRelease(list);list.textContent='';shown=0;list.scrollTop=0;}
    let end=Math.min(filtered.length,shown+36),frag=document.createDocumentFragment();
    for(;shown<end;shown++){
      let c=filtered[shown],tile=document.createElement('div');tile.className='portal-card-tile';tile.setAttribute('title',c.name+' — '+c.series);tile.setAttribute('aria-label',c.name+' — '+c.series);
      if(c.rarity==='special'&&window.sakuStrongestCard)tile.innerHTML=window.sakuStrongestCard(c.card,true);
      else if(window.sakuBasicCard)tile.innerHTML=window.sakuBasicCard(c.card,true,{series:c.series,image:c.image});
      else {let img=document.createElement('img');img.src=c.image;img.alt=c.name;img.loading='lazy';tile.appendChild(img);}
      frag.appendChild(tile);
    }
    list.appendChild(frag);if(window.sakuBasicObserve)window.sakuBasicObserve(list);
    if(!filtered.length){let empty=document.createElement('p');empty.className='portal-info-empty';empty.textContent=w.none;list.appendChild(empty);}
    let more=document.getElementById('portalInfoMore');more.hidden=shown>=filtered.length;more.textContent=w.more+' ('+(filtered.length-shown)+')';
  }
  function filter(){let q=document.getElementById('portalInfoSearch').value.trim().toLocaleLowerCase();filtered=all.filter(c=>(c.name+' '+c.series+' '+(c.aliases||[]).join(' ')).toLocaleLowerCase().includes(q));renderList(true);}
  function open(i){
    index=i;lastFocus=document.activeElement;let w=get(),m=document.getElementById('portalInfoModal'),items=pool(i);
    document.getElementById('portalInfoTitle').textContent=names[i];document.getElementById('portalInfoDescription').textContent=w[desc[i]];
    let lang=(window.SAKU_I18N||{}).lang||'en';let rules={fr:'10 cartes par booster. Taux de base par carte, avant garantie. Une garantie légendaire ou supérieure tous les 50 boosters et une mythique au 400e, tous portails confondus. Toute mythique remet la jauge commune à zéro. Une Spéciale seule ne la remet pas à zéro.',en:'10 cards per booster. Base rates per card, before guarantees. At least a Legendary every 50 boosters and a Mythic at 400, across all portals. Any Mythic resets the shared gauge. A Special alone does not reset it.',es:'10 cartas por sobre. Probabilidades por carta, antes de garantías. Al menos una Legendaria cada 50 sobres y una Mítica en el 400, entre todos los portales. Cualquier Mítica reinicia el contador compartido; una Especial por sí sola no.'}; document.getElementById('portalInfoStatus').textContent=(rules[lang]||rules.en);
    document.getElementById('portalInfoOddsTitle').textContent=w.odds;let odds=document.getElementById('portalInfoOdds');odds.textContent='';
    {window.sakuPortalRates[i].forEach((rate,j)=>{if(!rate)return;let box=document.createElement('div'),label=document.createElement('span'),n=document.createElement('b');box.className='portal-info-rate';box.dataset.rarity=['common','uncommon','rare','epic','legendary','mythic','special'][j];label.textContent=j===6?({fr:'Spéciale',es:'Especial',en:'Special'}[(window.SAKU_I18N||{}).lang]||'Special'):w.names[j];n.textContent=(rate/1000).toLocaleString(lang,{maximumFractionDigits:3})+' %';box.append(label,n);odds.appendChild(box);});}
    document.getElementById('portalInfoListTitle').textContent=w.list+(items?' · '+items.length:'');let input=document.getElementById('portalInfoSearch');input.value='';input.placeholder=w.search;input.setAttribute('aria-label',w.search);input.disabled=!items;
    const priority={special:0,mythic:1,legendary:2,epic:3,rare:4,uncommon:5,common:6};
    all=(items||[]).slice().sort((a,b)=>(priority[a.rarity]??99)-(priority[b.rarity]??99)||a.name.localeCompare(b.name)||String(a.id).localeCompare(String(b.id))); 
    if(items)filter();else{document.getElementById('portalInfoList').textContent=i===3?w.unconfigured:w.loading;document.getElementById('portalInfoMore').hidden=true;}
    let close=m.querySelector('.portal-info-close');close.setAttribute('aria-label',w.close);m.hidden=false;close.focus();
  }
  window.portalDashboardRefresh=update;
  window.portalInfoClose=function(){let m=document.getElementById('portalInfoModal');m.hidden=true;if(lastFocus)lastFocus.focus();};
  function init(){update();document.getElementById('portalInfoSearch').addEventListener('input',filter);document.getElementById('portalInfoMore').addEventListener('click',()=>renderList(false));let modal=document.getElementById('portalInfoModal');modal.addEventListener('click',e=>{if(e.target===modal)portalInfoClose();});document.addEventListener('keydown',e=>{if(!modal.hidden&&e.key==='Escape')portalInfoClose();});window.addEventListener('saku-lang-change',()=>{update();if(!modal.hidden)open(index);});if(window.sakuDataReady)window.sakuDataReady.then(update).catch(()=>{});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
