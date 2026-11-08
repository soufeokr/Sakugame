/* The images in the glass are the same card renderers used by the collection.
   Samples are drawn from each configured portal's catalogue, including Cinema. */
(function(){'use strict';
  const selected=[['127691','40882','80243','40'],[],['17','246','27','14'],['2727','121514','80243','384']];
  const special=['Son Goku','Satoru Gojo','Zaraki Kenpachi','Frieren'];
  function render(){
    if(!window.sakuPortalPool||!window.sakuBasicCard)return;
    const basic=window.sakuPortalPool(0)||[],strong=window.sakuPortalPool(1)||[],retro=window.sakuPortalPool(2)||[],cinema=window.sakuPortalPool(3)||[];
    [basic,strong,retro,cinema].forEach(function(pool,i){
      let slide=document.querySelector('.summon-slide[data-index="'+i+'"]');if(!slide)return;
      let box=slide.querySelector('.machine-showcase');if(!box){box=document.createElement('div');box.className='machine-showcase';box.setAttribute('aria-hidden','true');slide.appendChild(box);}
      let cards=i===3?['hoshi_reze','hoshi_yuta_okkotsu','hoshi_miles_morales','hoshi_san'].map(id=>pool.find(c=>c.id===id)):i===1?special.map(n=>pool.find(c=>c.rarity==='special'&&c.name.toLowerCase()===n.toLowerCase())):selected[i].map(id=>pool.find(c=>String(c.id)===id));
      if(cards.some(c=>!c)) cards=cards.map((c,k)=>c||pool[k]).filter(Boolean);
      box.innerHTML='';cards.forEach(function(c){
        let el=document.createElement('div');el.className='machine-showcase-card';el.dataset.cardId=String(c.id);el.dataset.rarity=c.rarity;
        el.innerHTML=c.rarity==='special'&&window.sakuStrongestCard?window.sakuStrongestCard(c.card,true):window.sakuBasicCard(c.card,true,{series:c.series,image:c.image});
        el.querySelectorAll('image[data-saku-src]').forEach(im=>{im.setAttribute('href',im.getAttribute('data-saku-src'));im.removeAttribute('data-saku-src');});
        box.appendChild(el);
      });
    });
  }
  window.sakuPortalShowcaseRefresh=render;
  function start(){render();if(window.sakuDataReady)window.sakuDataReady.then(render).catch(()=>{});window.addEventListener('saku-rarity-change',render);window.addEventListener('saku-lang-change',render);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
