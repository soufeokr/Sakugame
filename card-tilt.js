/* Subtle pointer-driven depth on enlarged cards only. No motion on touch or when reduced motion is requested. */
(function(){'use strict';
  const selector='#cardsDetail.show .ac-detail-card, #encDetail.show .enc-detail-card';
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let active=null, frame=0, point=null;
  function reset(card){if(!card)return;card.classList.remove('card-tilting');card.style.removeProperty('--tilt-x');card.style.removeProperty('--tilt-y');card.style.removeProperty('--glare-x');card.style.removeProperty('--glare-y');}
  function stop(){if(frame)cancelAnimationFrame(frame);frame=0;point=null;reset(active);active=null;}
  document.addEventListener('pointermove',function(e){
    if(e.pointerType==='touch'||reduced.matches||document.documentElement.classList.contains('gfx-low')){if(active)stop();return;}
    const card=e.target.closest&&e.target.closest(selector);
    if(!card){if(active)stop();return;}
    if(active!==card){stop();active=card;}
    point={x:e.clientX,y:e.clientY};
    if(frame)return;
    frame=requestAnimationFrame(function(){frame=0;if(!active||!point||!active.isConnected)return stop();
      const r=active.getBoundingClientRect();if(!r.width||!r.height)return;
      const x=Math.max(-1,Math.min(1,(point.x-r.left)/r.width*2-1));
      const y=Math.max(-1,Math.min(1,(point.y-r.top)/r.height*2-1));
      active.style.setProperty('--tilt-x',(-y*8).toFixed(2)+'deg');
      active.style.setProperty('--tilt-y',(x*10).toFixed(2)+'deg');
      active.style.setProperty('--glare-x',((x+1)*50).toFixed(1)+'%');
      active.style.setProperty('--glare-y',((y+1)*50).toFixed(1)+'%');
      active.classList.add('card-tilting');
    });
  },{passive:true});
  document.addEventListener('pointerout',function(e){if(active&&active.contains(e.target)&&!active.contains(e.relatedTarget))stop();},{passive:true});
  document.addEventListener('pointercancel',stop,{passive:true});
  document.addEventListener('visibilitychange',function(){if(document.hidden)stop();});
  if(reduced.addEventListener)reduced.addEventListener('change',()=>{if(reduced.matches)stop();});
})();
