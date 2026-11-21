/* Sakugame — effets des cartes selon leur niveau. La carte elle-même ne change pas : ce sont uniquement
   des reflets de lumière posés par-dessus, plus des étoiles de niveau redessinées dans le cadre en haut à gauche.
   Niv. 1 : Brillante · Niv. 2 : Prismatique · Niv. 3 : Prismatique arc-en-ciel.
   window.sakuCardFinish(svg, level, mini). Animations : style.css (classes .fin-*) ; vignettes animées au survol. */
(function(){'use strict';
var OUT='M16 3 H244 L257 16 V356 L244 369 H16 L3 356 V16 Z';
var serial=0;
var RAINBOW=['#ff4d6d','#ff9f45','#ffe45e','#5ee08a','#4dd8ff','#5b8cff','#b48cff','#ff6fd8'];
function stops(list){var n=list.length;return list.map(function(c,i){var col=Array.isArray(c)?c[0]:c,op=Array.isArray(c)?c[1]:null;return '<stop offset="'+(i/(n-1)).toFixed(3)+'" stop-color="'+col+'"'+(op!=null?' stop-opacity="'+op+'"':'')+'/>';}).join('');}
// Bande de lumière : transparente sur les bords, colorée au centre.
function band(colors,peak){var out=[['#fff',0],['#fff',0]];colors.forEach(function(c){out.push([c,peak]);});out.push(['#fff',0],['#fff',0]);return out;}
function sweep(u,grad,width,op,cls,extra){return '<g clip-path="url(#fcl'+u+')" style="mix-blend-mode:screen" opacity="'+op+'" pointer-events="none"><g transform="rotate(22 130 186)"><g class="'+cls+' fin-anim"><rect x="'+(-40-width)+'" y="-90" width="'+width+'" height="560" fill="url(#'+grad+u+')"/>'+(extra||'')+'</g></g></g>';}
function sparkle(x,y,r,delay,fill){var k=r*.18;return '<polygon class="fin-spark fin-anim" style="animation-delay:'+delay+'s;transform-origin:'+x+'px '+y+'px" fill="'+fill+'" points="'+
  [x+','+(y-r),(x+k)+','+(y-k),(x+r)+','+y,(x+k)+','+(y+k),x+','+(y+r),(x-k)+','+(y+k),(x-r)+','+y,(x-k)+','+(y-k)].join(' ')+'"/>';}
function starPts(cx,cy,R,r){var p=[];for(var i=0;i<10;i++){var a=-Math.PI/2+i*Math.PI/5,rad=i%2?r:R;p.push((cx+Math.cos(a)*rad).toFixed(2)+','+(cy+Math.sin(a)*rad).toFixed(2));}return p.join(' ');}

// Étoiles de niveau du cadre en haut à gauche (remplacent les étoiles en texte).
function levelStars(u,level){
  var fill=level===1?['#ffffff','#e3e9f1','#a9b5c5']:level===2?['#a9f7ff','#ffb3f1','#fff3a3','#a9f7ff']:RAINBOW;
  var d='<linearGradient id="fsg'+u+'" x1="0" y1="0" x2="1" y2="1">'+stops(fill)+'</linearGradient>'+
    '<filter id="fsf'+u+'" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur in="SourceAlpha" stdDeviation=".7" result="s"/><feOffset dy=".6" in="s" result="o"/><feFlood flood-color="#000" flood-opacity=".75"/><feComposite in2="o" operator="in" result="sh"/>'+
    (level>1?'<feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="gl"/><feMerge><feMergeNode in="gl"/><feMergeNode in="sh"/><feMergeNode in="SourceGraphic"/></feMerge>':'<feMerge><feMergeNode in="sh"/><feMergeNode in="SourceGraphic"/></feMerge>')+'</filter>';
  var g='<g class="fin-stars fin-stars-'+level+'" filter="url(#fsf'+u+')" pointer-events="none">';
  for(var i=0;i<level;i++){var cx=28.5+i*13.5,cy=19.6;
    g+='<g class="fin-star fin-anim" style="animation-delay:'+(i*.35)+'s;transform-origin:'+cx+'px '+cy+'px">'+
      '<polygon points="'+starPts(cx,cy,5.9,2.5)+'" fill="url(#fsg'+u+')" stroke="'+(level===3?'#fff6cf':'#ffffff')+'" stroke-opacity="'+(level===1?'.55':'.85')+'" stroke-width=".7" stroke-linejoin="round"/>'+
      '<polygon points="'+starPts(cx-1,cy-1.2,2.2,.9)+'" fill="#fff" opacity=".75"/></g>';}
  return {defs:d,body:g+'</g>'};
}

function finish(level){
  var u='f'+(++serial),d='<defs><clipPath id="fcl'+u+'"><path d="'+OUT+'"/></clipPath>',b='';
  if(level===1){
    // Brillante : un éclat blanc balaie la carte, quelques étincelles.
    d+='<linearGradient id="fwb'+u+'" x1="0" y1="0" x2="1" y2="0">'+stops(band(['#ffffff','#ffffff'],.8))+'</linearGradient>';
    b=sweep(u,'fwb',120,1,'fin-sheen')+
      '<g pointer-events="none">'+sparkle(52,72,6.5,0,'#fff')+sparkle(206,116,5,1.4,'#fff')+sparkle(72,214,4.5,2.5,'#fff')+sparkle(198,228,5.5,.8,'#fff')+'</g>';
  }else if(level===2){
    // Prismatique : une bande holographique striée (cyan, rose, jaune) traverse la carte, suivie d'un éclat blanc.
    d+='<linearGradient id="fpb'+u+'" x1="0" y1="0" x2="1" y2="0">'+stops(band(['#7ff4ff','#ff9cf0','#fff59a','#7ff4ff'],.7))+'</linearGradient>'+
      '<linearGradient id="fwb'+u+'" x1="0" y1="0" x2="1" y2="0">'+stops(band(['#ffffff'],.7))+'</linearGradient>'+
      '<pattern id="fst'+u+'" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(70)"><rect width="1.1" height="5" fill="#fff" opacity=".45"/></pattern>';
    b=sweep(u,'fpb',190,.9,'fin-holo','<rect x="-230" y="-90" width="190" height="560" fill="url(#fst'+u+')" opacity=".5"/>')+
      sweep(u,'fwb',60,.8,'fin-sheen fin-sheen-late')+
      '<g pointer-events="none">'+sparkle(48,66,6,0,'#e9fdff')+sparkle(212,100,5,1.1,'#ffe6fb')+sparkle(64,224,4.5,2,'#fffbe0')+sparkle(202,214,6,.6,'#e9fdff')+sparkle(132,50,4,1.7,'#fff')+'</g>';
  }else{
    // Arc-en-ciel : léger miroitement irisé permanent, large bande arc-en-ciel qui traverse, paillettes ;
    // les couleurs de la carte restent visibles dessous.
    d+='<linearGradient id="frb'+u+'" x1="0" y1="0" x2="1" y2="0">'+stops(band(RAINBOW.concat([RAINBOW[0]]),.75))+'</linearGradient>'+
      '<linearGradient id="frs'+u+'" x1="0" y1="0" x2="1" y2="1">'+stops(RAINBOW.concat(RAINBOW,[RAINBOW[0]]))+'</linearGradient>'+
      '<linearGradient id="fwb'+u+'" x1="0" y1="0" x2="1" y2="0">'+stops(band(['#ffffff'],.75))+'</linearGradient>'+
      '<pattern id="fgt'+u+'" width="23" height="19" patternUnits="userSpaceOnUse"><circle cx="3" cy="4" r=".9" fill="#fff"/><circle cx="15" cy="9" r=".7" fill="#fff"/><circle cx="9" cy="16" r="1.1" fill="#fff"/><circle cx="20" cy="2" r=".6" fill="#fff"/></pattern>';
    b='<g clip-path="url(#fcl'+u+')" style="mix-blend-mode:soft-light" opacity=".3" pointer-events="none"><g class="fin-flow fin-anim"><rect x="-260" y="-372" width="780" height="1116" fill="url(#frs'+u+')"/></g></g>'+
      sweep(u,'frb',240,.9,'fin-holo')+
      sweep(u,'fwb',60,.85,'fin-sheen fin-sheen-late')+
      '<g clip-path="url(#fcl'+u+')" style="mix-blend-mode:screen" opacity=".5" pointer-events="none"><g class="fin-glitter fin-anim"><rect x="0" y="0" width="260" height="372" fill="url(#fgt'+u+')"/></g></g>'+
      '<g pointer-events="none">'+sparkle(46,62,6.5,0,'#fff')+sparkle(216,92,5.5,.9,'#fff')+sparkle(58,228,5,1.8,'#fff')+sparkle(206,220,6.5,.4,'#fff')+sparkle(130,46,4.5,1.4,'#fff')+sparkle(232,300,4,2.2,'#fff')+sparkle(30,316,4,2.8,'#fff')+'</g>';
  }
  var st=levelStars(u,level);
  return d+st.defs+'</defs>'+b+st.body;
}
window.sakuCardFinish=function(svg,level,mini){
  level=Math.max(0,Math.min(3,Number(level)||0));if(!level||typeof svg!=='string')return svg;
  svg=svg.replace('<svg class="card-svg','<svg class="card-svg card-finish finish-lv'+level+(mini?' finish-mini':''));
  svg=svg.replace(/(<text [^>]*class="chud"[^>]*>)★+(<\/text>)/,'$1$2');
  var i=svg.lastIndexOf('</svg>');if(i<0)return svg;
  return svg.slice(0,i)+finish(level)+svg.slice(i);
};
window.sakuCardFinishNames={1:'Brillante',2:'Prismatique',3:'Prismatique arc-en-ciel'};
})();
