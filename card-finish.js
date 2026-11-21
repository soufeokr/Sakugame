/* Sakugame — finitions des cartes selon leur niveau (ajoutées par-dessus le SVG de la carte).
   Niv. 1 : Brillante · Niv. 2 : Prismatique · Niv. 3 : Prismatique arc-en-ciel.
   window.sakuCardFinish(svg, level, mini) renvoie le SVG avec la finition. Les animations vivent dans style.css
   (classes .fin-*) ; sur les vignettes (mini) elles ne tournent qu'au survol. */
(function(){'use strict';
var OUT='M16 3 H244 L257 16 V356 L244 369 H16 L3 356 V16 Z';
var PORT='M26 32 H234 L244 42 V242 L234 252 H26 L16 242 V42 Z';
var serial=0;
function star(x,y,r,delay,fill){var k=r*.2;return '<polygon class="fin-spark fin-anim" style="animation-delay:'+delay+'s;transform-origin:'+x+'px '+y+'px" fill="'+fill+'" points="'+
  [x+','+(y-r),(x+k)+','+(y-k),(x+r)+','+y,(x+k)+','+(y+k),x+','+(y+r),(x-k)+','+(y+k),(x-r)+','+y,(x-k)+','+(y-k)].join(' ')+'"/>';}
// Chaque calque porte son propre clip et son mode de fusion : un groupe englobant isolerait la fusion.
function sheen(u,op){return '<g clip-path="url(#fcl'+u+')" style="mix-blend-mode:screen" opacity="'+(op||1)+'" pointer-events="none"><g transform="rotate(22 130 186)"><rect class="fin-sheen fin-anim" x="-140" y="-80" width="150" height="540" fill="url(#fsh'+u+')"/></g></g>';}
function moving(u,fill,blend,op,cls,clip){return '<g clip-path="url(#'+(clip||'fcl')+u+')" style="mix-blend-mode:'+blend+'" opacity="'+op+'" pointer-events="none"><g class="'+cls+' fin-anim"><rect '+(cls==='fin-flow'?BIG:FULL)+' fill="'+fill+'"/></g></g>';}
function layer(u,attrs,blend,op,clip){return '<rect '+attrs+' clip-path="url(#'+(clip||'fcl')+u+')" style="mix-blend-mode:'+blend+'" opacity="'+op+'" pointer-events="none"/>';}
var BIG='x="-260" y="-372" width="780" height="1116"',FULL='x="0" y="0" width="260" height="372"';
var RAINBOW=['#ff4d6d','#ff9f45','#ffe45e','#5ee08a','#4dd8ff','#5b8cff','#b48cff','#ff6fd8'];
function stops(colors,op){var n=colors.length;return colors.map(function(c,i){return '<stop offset="'+(i/(n-1)).toFixed(3)+'" stop-color="'+c+'"'+(op!=null?' stop-opacity="'+op+'"':'')+'/>';}).join('');}

function finish(level,mini){
  level=Math.max(0,Math.min(3,Number(level)||0));if(!level)return '';
  var u='f'+(++serial),d='<defs><clipPath id="fcl'+u+'"><path d="'+OUT+'"/></clipPath><clipPath id="fpc'+u+'"><path d="'+PORT+'"/></clipPath><clipPath id="ffr'+u+'"><path clip-rule="evenodd" d="'+OUT+' '+PORT+'"/></clipPath>'+
    '<linearGradient id="fsh'+u+'" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".42" stop-color="#fff" stop-opacity=".05"/><stop offset=".5" stop-color="#fff" stop-opacity="'+(level===1?'.75':'.55')+'"/><stop offset=".58" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>',
    b='';
  if(level===1){
    d+='<linearGradient id="fch'+u+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="#cfd8e6"/><stop offset=".5" stop-color="#ffffff"/><stop offset=".7" stop-color="#9aa8bd"/><stop offset="1" stop-color="#ffffff"/></linearGradient>'+
      '<radialGradient id="fgl'+u+'" cx="50%" cy="30%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>';
    b=layer(u,FULL+' fill="url(#fgl'+u+')"','screen',1)+sheen(u)+
      '<path d="'+OUT+'" fill="none" stroke="url(#fch'+u+')" stroke-width="2.4" opacity=".9" pointer-events="none"/>'+
      '<g pointer-events="none">'+star(52,70,7,0,'#fff')+star(210,112,5,1.3,'#fff')+star(70,214,4.5,2.4,'#fff')+star(196,226,6,.7,'#fff')+'</g>';
  }else if(level===2){
    var prism=['#00e5ff','#ff4dd8','#ffe45e','#7cffb2','#00e5ff','#ff4dd8','#ffe45e'];
    d+='<linearGradient id="fpr'+u+'" x1="0" y1="0" x2="1" y2="1">'+stops(prism)+'</linearGradient>'+
      '<linearGradient id="fpf'+u+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7ff4ff"/><stop offset=".33" stop-color="#ff9cf0"/><stop offset=".66" stop-color="#fff59a"/><stop offset="1" stop-color="#7ff4ff"/></linearGradient>'+
      '<pattern id="fst'+u+'" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><rect width="1.6" height="7" fill="#fff" opacity=".55"/></pattern>';
    // Prismatique : reflets holographiques sur le cadre, l'illustration garde ses couleurs (léger reflet).
    b=moving(u,'url(#fpr'+u+')','overlay',.75,'fin-flow','ffr')+
      layer(u,FULL+' fill="url(#fst'+u+')"','soft-light',.7,'ffr')+
      moving(u,'url(#fpr'+u+')','soft-light',.28,'fin-flow','fpc')+
      sheen(u,.9)+
      '<path d="'+OUT+'" fill="none" stroke="url(#fpf'+u+')" stroke-width="2.8" opacity=".95" pointer-events="none"/>'+
      '<g pointer-events="none">'+star(48,64,6,0,'#e9fdff')+star(214,96,5,1.1,'#ffe6fb')+star(62,226,5,2,'#fffbe0')+star(204,214,6.5,.6,'#e9fdff')+star(132,48,4,1.7,'#fff')+'</g>';
  }else{
    d+='<linearGradient id="frb'+u+'" x1="0" y1="0" x2="1" y2="1">'+stops(RAINBOW.concat(RAINBOW).concat([RAINBOW[0]]))+'</linearGradient>'+
      '<linearGradient id="frf'+u+'" x1="0" y1="0" x2="1" y2="1">'+stops(RAINBOW.concat([RAINBOW[0]]))+'</linearGradient>'+
      '<pattern id="fst'+u+'" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-32)"><rect width="1.4" height="6" fill="#fff" opacity=".6"/></pattern>'+
      '<pattern id="fgt'+u+'" width="23" height="19" patternUnits="userSpaceOnUse"><circle cx="3" cy="4" r=".9" fill="#fff"/><circle cx="15" cy="9" r=".7" fill="#fff"/><circle cx="9" cy="16" r="1.1" fill="#fff"/><circle cx="20" cy="2" r=".6" fill="#fff"/></pattern>'+
      '<filter id="frg'+u+'" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3"/></filter>';
    // Arc-en-ciel : tout le cadre irisé, l'illustration reçoit un voile arc-en-ciel et des paillettes.
    b=moving(u,'url(#frb'+u+')','soft-light',1,'fin-flow','ffr')+
      moving(u,'url(#frb'+u+')','color',.35,'fin-flow','ffr')+
      moving(u,'url(#frb'+u+')','soft-light',.5,'fin-flow','fpc')+
      layer(u,FULL+' fill="url(#fst'+u+')"','overlay',.5,'ffr')+
      moving(u,'url(#fgt'+u+')','screen',.7,'fin-glitter')+
      sheen(u,.9)+
      '<g class="fin-hue fin-anim" pointer-events="none"><path d="'+OUT+'" fill="none" stroke="url(#frf'+u+')" stroke-width="6" opacity=".55" filter="url(#frg'+u+')"/>'+
      '<path d="'+OUT+'" fill="none" stroke="url(#frf'+u+')" stroke-width="3.2"/></g>'+
      '<g pointer-events="none">'+star(46,62,7,0,'#fff')+star(216,92,5.5,.9,'#fff')+star(58,228,5,1.8,'#fff')+star(206,220,7,.4,'#fff')+star(130,46,4.5,1.4,'#fff')+star(232,300,4,2.2,'#fff')+star(30,316,4,2.8,'#fff')+'</g>';
  }
  return d+'</defs>'+b;
}
window.sakuCardFinish=function(svg,level,mini){
  level=Math.max(0,Math.min(3,Number(level)||0));if(!level||typeof svg!=='string')return svg;
  var i=svg.lastIndexOf('</svg>');if(i<0)return svg;
  svg=svg.replace('<svg class="card-svg','<svg class="card-svg card-finish finish-lv'+level+(mini?' finish-mini':''));
  i=svg.lastIndexOf('</svg>');
  return svg.slice(0,i)+finish(level,mini)+svg.slice(i);
};
window.sakuCardFinishNames={1:'Brillante',2:'Prismatique',3:'Prismatique arc-en-ciel'};
})();
