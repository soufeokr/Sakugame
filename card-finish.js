/* Sakugame — effets des cartes selon leur niveau. La carte elle-même ne change pas : ce sont uniquement
   des reflets de lumière posés par-dessus, plus des étoiles de niveau redessinées dans le cadre en haut à gauche.
   Niv. 1 : Brillante · Niv. 2 : Prismatique (cristal / diamant) · Niv. 3 : Prismatique arc-en-ciel.
   window.sakuCardFinish(svg, level, mini). Animations : style.css (classes .fin-*) ; vignettes animées au survol.
   La position de la lumière est la variable CSS --fin-p (0 → 1) : animée seule au repos, elle suit le pointeur
   quand la carte s'incline (classe .fin-tracking posée par card-tilt.js).
   Les facettes de cristal sont dessinées une seule fois (SVG caché #sakuFinishDefs) et réutilisées par <use>. */
(function(){'use strict';
var OUT='M16 3 H244 L257 16 V356 L244 369 H16 L3 356 V16 Z';
var serial=0;
var RAINBOW=['#ff4d6d','#ff9f45','#ffe45e','#5ee08a','#4dd8ff','#5b8cff','#b48cff','#ff6fd8'];
function stops(list){var n=list.length;return list.map(function(c,i){var col=Array.isArray(c)?c[0]:c,op=Array.isArray(c)?c[1]:null;return '<stop offset="'+(i/(n-1)).toFixed(3)+'" stop-color="'+col+'"'+(op!=null?' stop-opacity="'+op+'"':'')+'/>';}).join('');}
function band(colors,peak){var out=[['#fff',0],['#fff',0]];colors.forEach(function(c){out.push([c,peak]);});out.push(['#fff',0],['#fff',0]);return out;}

/* ---------- Facettes de cristal (géométrie commune, tirée une fois avec une graine fixe) ---------- */
var facets=[],edges='';
(function build(){
  var seed=20261121;function rnd(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;}
  var C=9,R=13,sx=260/(C-1),sy=372/(R-1),P=[];
  for(var r=0;r<R;r++){P.push([]);for(var c=0;c<C;c++){var x=c*sx,y=r*sy;
    if(c>0&&c<C-1)x+=(rnd()-.5)*sx*.8;if(r>0&&r<R-1)y+=(rnd()-.5)*sy*.8;P[r].push([+x.toFixed(1),+y.toFixed(1)]);}}
  for(r=0;r<R-1;r++)for(c=0;c<C-1;c++){var a=P[r][c],b=P[r][c+1],d=P[r+1][c],e=P[r+1][c+1],flip=(r+c)%2===0;
    var t1=flip?[a,b,e]:[a,b,d],t2=flip?[a,e,d]:[b,e,d];
    [t1,t2].forEach(function(t){var cx=(t[0][0]+t[1][0]+t[2][0])/3,cy=(t[0][1]+t[1][1]+t[2][1])/3;facets.push({pts:t.map(function(p){return p.join(',');}).join(' '),cx:cx,cy:cy,o:.1+rnd()*.6});});}
  facets.forEach(function(f){edges+='M'+f.pts.split(' ').join(' L')+' Z ';});
})();
function rainbowAt(x,y){var t=((x/260)*.55+(y/372)*.45)*RAINBOW.length;return RAINBOW[Math.floor(t)%RAINBOW.length];}
function ensureDefs(){
  if(typeof document==='undefined'||document.getElementById('sakuFinishDefs'))return;
  // Facettes claires (renvoient la lumière) et sombres (en retrait) : c'est le contraste qui donne l'aspect taillé.
  var white=facets.map(function(f,i){return i%2?'':'<polygon points="'+f.pts+'" fill="#ffffff" fill-opacity="'+(.25+f.o*.75).toFixed(2)+'"/>';}).join('');
  var dark=facets.map(function(f,i){return i%2?'<polygon points="'+f.pts+'" fill="#0a1430" fill-opacity="'+(.12+f.o*.35).toFixed(2)+'"/>':'';}).join('');
  var ice=facets.map(function(f,i){return '<polygon points="'+f.pts+'" fill="'+(i%3===0?'#d9f6ff':i%3===1?'#ffffff':'#e9e4ff')+'" fill-opacity="'+f.o.toFixed(2)+'"/>';}).join('');
  var rain=facets.map(function(f){return '<polygon points="'+f.pts+'" fill="'+rainbowAt(f.cx,f.cy)+'" fill-opacity="'+(.25+f.o).toFixed(2)+'"/>';}).join('');
  var s='<svg id="sakuFinishDefs" width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true" focusable="false"><defs>'+
    '<linearGradient id="sfPrismEdge" x1="0" y1="0" x2="1" y2="1">'+stops(['#7ff4ff','#ffffff','#ff9cf0','#ffffff','#fff59a','#ffffff','#7ff4ff'])+'</linearGradient>'+
    '<g id="sfIce">'+ice+'</g><g id="sfWhite">'+white+'</g><g id="sfDark">'+dark+'</g><g id="sfRain">'+rain+'</g>'+
    '<path id="sfEdges" d="'+edges.trim()+'" fill="none"/></defs></svg>';
  var host=document.createElement('div');host.innerHTML=s;document.body.appendChild(host.firstChild);
}
if(typeof document!=='undefined'){if(document.body)ensureDefs();else document.addEventListener('DOMContentLoaded',ensureDefs);}

/* ---------- Briques ---------- */
function sweep(u,grad,width,op,cls){return '<g clip-path="url(#fcl'+u+')" style="mix-blend-mode:screen" opacity="'+op+'" pointer-events="none"><g transform="rotate(22 130 186)"><g class="'+cls+'"><rect x="'+(-40-width)+'" y="-90" width="'+width+'" height="560" fill="url(#'+grad+u+')"/></g></g></g>';}
// Masque lumineux qui se déplace : seules les facettes sous la lumière s'allument.
function lightMask(u,width,cls){return '<mask id="fmk'+u+'" maskUnits="userSpaceOnUse" x="0" y="0" width="260" height="372"><g transform="rotate(22 130 186)"><g class="'+cls+'"><rect x="'+(-40-width)+'" y="-90" width="'+width+'" height="560" fill="url(#fmg'+u+')"/></g></g></mask>'+
  '<linearGradient id="fmg'+u+'" x1="0" y1="0" x2="1" y2="0">'+stops(['#000','#222','#888','#fff','#888','#222','#000'])+'</linearGradient>';}
function sparkle(x,y,r,delay,fill){var k=r*.16;return '<polygon class="fin-spark fin-anim" style="animation-delay:'+delay+'s;transform-origin:'+x+'px '+y+'px" fill="'+fill+'" points="'+
  [x+','+(y-r),(x+k)+','+(y-k),(x+r)+','+y,(x+k)+','+(y+k),x+','+(y+r),(x-k)+','+(y+k),(x-r)+','+y,(x-k)+','+(y-k)].join(' ')+'"/>';}
// Éclats de facettes : quelques facettes isolées qui « accrochent » la lumière à tour de rôle.
var GLINTS=[9,31,47,66,82,101,123,140,158,177];
function glints(color){return GLINTS.map(function(i,k){var f=facets[i];if(!f)return '';var c=typeof color==='function'?color(f):color;
  return '<polygon class="fin-glint fin-anim" style="animation-delay:'+(k*.47).toFixed(2)+'s" points="'+f.pts+'" fill="'+c+'"/>';}).join('');}
function starPts(cx,cy,R,r){var p=[];for(var i=0;i<10;i++){var a=-Math.PI/2+i*Math.PI/5,rad=i%2?r:R;p.push((cx+Math.cos(a)*rad).toFixed(2)+','+(cy+Math.sin(a)*rad).toFixed(2));}return p.join(' ');}

// Étoiles de niveau du cadre en haut à gauche (remplacent les étoiles en texte).
function levelStars(u,level){
  var fill=level===1?['#ffffff','#e3e9f1','#a9b5c5']:level===2?['#ffffff','#bff3ff','#ffffff','#e7d9ff','#ffffff']:RAINBOW;
  var d='<linearGradient id="fsg'+u+'" x1="0" y1="0" x2="1" y2="1">'+stops(fill)+'</linearGradient>'+
    '<filter id="fsf'+u+'" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur in="SourceAlpha" stdDeviation=".7" result="s"/><feOffset dy=".6" in="s" result="o"/><feFlood flood-color="#000" flood-opacity=".75"/><feComposite in2="o" operator="in" result="sh"/>'+
    (level>1?'<feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="gl"/><feMerge><feMergeNode in="gl"/><feMergeNode in="sh"/><feMergeNode in="SourceGraphic"/></feMerge>':'<feMerge><feMergeNode in="sh"/><feMergeNode in="SourceGraphic"/></feMerge>')+'</filter>';
  var g='<g class="fin-stars fin-stars-'+level+'" filter="url(#fsf'+u+')" pointer-events="none">';
  for(var i=0;i<level;i++){var cx=28.5+i*13.5,cy=19.6;
    g+='<g class="fin-star fin-anim" style="animation-delay:'+(i*.35)+'s;transform-origin:'+cx+'px '+cy+'px">'+
      '<polygon points="'+starPts(cx,cy,5.9,2.5)+'" fill="url(#fsg'+u+')" stroke="'+(level===3?'#fff6cf':'#ffffff')+'" stroke-opacity="'+(level===1?'.55':'.85')+'" stroke-width=".7" stroke-linejoin="round"/>'+
      // facette claire dans l'étoile (aspect taillé)
      '<polygon points="'+cx+','+(cy-5.9)+' '+(cx+1.6)+','+(cy-.4)+' '+cx+','+(cy+.9)+' '+(cx-1.6)+','+(cy-.4)+'" fill="#fff" opacity=".8"/></g>';}
  return {defs:d,body:g+'</g>'};
}

function finish(level){
  ensureDefs();
  var u='f'+(++serial),d='<defs><clipPath id="fcl'+u+'"><path d="'+OUT+'"/></clipPath>',b='';
  if(level===1){
    // Brillante : un éclat blanc balaie la carte, quelques étincelles.
    d+='<linearGradient id="fwb'+u+'" x1="0" y1="0" x2="1" y2="0">'+stops(band(['#ffffff','#ffffff'],.8))+'</linearGradient>';
    b=sweep(u,'fwb',120,1,'fin-sweep')+
      '<g pointer-events="none">'+sparkle(52,72,6.5,0,'#fff')+sparkle(206,116,5,1.4,'#fff')+sparkle(72,214,4.5,2.5,'#fff')+sparkle(198,228,5.5,.8,'#fff')+'</g>';
  }else if(level===2){
    // Prismatique (cristal) : la lumière traverse des facettes taillées ; leurs arêtes se teintent de reflets
    // de prisme, des facettes isolées scintillent et des éclats de diamant apparaissent.
    d+=lightMask(u,330,'fin-sweep')+'<linearGradient id="fwb'+u+'" x1="0" y1="0" x2="1" y2="0">'+stops(band(['#ffffff'],.7))+'</linearGradient>';
    b='<g clip-path="url(#fcl'+u+')" style="mix-blend-mode:multiply" pointer-events="none"><g mask="url(#fmk'+u+')"><use href="#sfDark"/></g></g>'+
      '<g clip-path="url(#fcl'+u+')" style="mix-blend-mode:screen" pointer-events="none"><g mask="url(#fmk'+u+')">'+
        '<use href="#sfWhite" opacity=".6"/><use href="#sfIce" opacity=".35"/><use href="#sfEdges" stroke="url(#sfPrismEdge)" stroke-width="1" opacity=".85"/></g>'+
        '<g opacity=".4">'+glints('#ffffff')+'</g>'+
        '<use href="#sfEdges" stroke="#ffffff" stroke-width=".5" opacity=".07"/></g>'+
      sweep(u,'fwb',50,.75,'fin-sweep fin-sweep-late')+
      '<g pointer-events="none">'+sparkle(48,66,7,0,'#ffffff')+sparkle(212,100,5.5,1.1,'#e9fdff')+sparkle(64,224,5,2,'#ffffff')+sparkle(202,214,6.5,.6,'#f1ecff')+sparkle(132,50,4.5,1.7,'#ffffff')+sparkle(228,320,4,2.6,'#e9fdff')+'</g>';
  }else{
    // Prismatique arc-en-ciel : le même cristal, mais chaque facette renvoie une couleur de l'arc-en-ciel ;
    // la lumière qui passe est plus large, paillettes et éclats colorés.
    d+=lightMask(u,360,'fin-sweep')+'<linearGradient id="fwb'+u+'" x1="0" y1="0" x2="1" y2="0">'+stops(band(['#ffffff'],.75))+'</linearGradient>'+
      '<pattern id="fgt'+u+'" width="23" height="19" patternUnits="userSpaceOnUse"><circle cx="3" cy="4" r=".9" fill="#fff"/><circle cx="15" cy="9" r=".7" fill="#fff"/><circle cx="9" cy="16" r="1.1" fill="#fff"/><circle cx="20" cy="2" r=".6" fill="#fff"/></pattern>';
    b='<g clip-path="url(#fcl'+u+')" style="mix-blend-mode:multiply" pointer-events="none"><g mask="url(#fmk'+u+')"><use href="#sfDark"/></g></g>'+
      '<g clip-path="url(#fcl'+u+')" style="mix-blend-mode:screen" pointer-events="none"><g mask="url(#fmk'+u+')">'+
        '<use href="#sfRain" opacity=".85"/><use href="#sfWhite" opacity=".25"/><use href="#sfEdges" stroke="#ffffff" stroke-width="1" opacity=".8"/></g>'+
        '<g opacity=".45">'+glints(function(f){return rainbowAt(f.cx,f.cy);})+'</g>'+
        '<use href="#sfEdges" stroke="#ffffff" stroke-width=".5" opacity=".08"/>'+
        '<g opacity=".5"><g class="fin-glitter fin-anim"><rect x="0" y="0" width="260" height="372" fill="url(#fgt'+u+')"/></g></g></g>'+
      sweep(u,'fwb',50,.8,'fin-sweep fin-sweep-late')+
      '<g pointer-events="none">'+sparkle(46,62,7,0,'#fff')+sparkle(216,92,5.5,.9,'#fff')+sparkle(58,228,5,1.8,'#fff')+sparkle(206,220,7,.4,'#fff')+sparkle(130,46,4.5,1.4,'#fff')+sparkle(232,300,4,2.2,'#fff')+sparkle(30,316,4,2.8,'#fff')+'</g>';
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
