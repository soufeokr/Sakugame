/* Sakugame — Classement : Jeux (top 50 des victoires par jeu), Collection (mythiques, spéciales, cartes), Arena (en pause).
   Les données viennent du serveur (leaderboard_games / leaderboard_collection), comptes bannis exclus. */
(function(){'use strict';
const L3=(fr,en,es)=>{const l=(window.SAKU_I18N||{}).lang;return l==='fr'?fr:l==='es'?es:en;};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nf=n=>Number(n||0).toLocaleString((window.SAKU_I18N||{}).lang||undefined);
const $=id=>document.getElementById(id);
const GAMES=[['classic','Detective Showdown','guesswho'],['undercover','Undercover','undercover'],['battle','Detective Royale','battle'],['race','Wanted!','race'],['blur','Blur Guess','blur'],['hotcold','Cold Case','hotcold'],['codenames','Ninja','codenames'],['snapshot','Snapshot!','snapshot']];
const COLL=()=>[['mythic',L3('Mythiques','Mythics','Míticas'),'#ff7ad9'],['special',L3('Spéciales','Specials','Especiales'),'#ffd36e'],['cards',L3('Cartes','Cards','Cartas'),'#a7dbf7']];
let section='games',game='classic',coll='mythic',seq=0;
const cache={};
function key(){return section==='games'?'g:'+game:'c:'+coll;}
async function load(force){
 const k=key(),c=cache[k];
 if(!force&&c&&Date.now()-c.at<60000){render();return;}
 const my=++seq;cache[k]=Object.assign({},c||{},{loading:true});render();
 try{const b=window.sakuBackend;if(!b||!b.leaderboardGames)throw new Error('backend');
  const r=section==='games'?await b.leaderboardGames(game):await b.leaderboardCollection(coll);
  cache[k]={at:Date.now(),data:r};}
 catch(e){cache[k]={at:0,error:true};}
 if(my===seq||key()===k)render();
}
function unit(n){if(section==='games')return L3(n>1?'victoires':'victoire',n===1?'win':'wins',n===1?'victoria':'victorias');
 return coll==='cards'?L3(n>1?'cartes':'carte',n===1?'card':'cards',n===1?'carta':'cartas'):coll==='mythic'?L3(n>1?'mythiques':'mythique',n===1?'mythic':'mythics',n===1?'mítica':'míticas'):L3(n>1?'spéciales':'spéciale',n===1?'special':'specials',n===1?'especial':'especiales');}
function sub(r){return section==='games'&&r.games!=null?nf(r.games)+' '+L3(r.games>1?'parties':'partie',r.games===1?'game':'games',r.games===1?'partida':'partidas'):'';}
function initial(n){const s=String(n||'?').trim();return esc((s[0]||'?').toUpperCase());}
// Photo de profil (https uniquement) par-dessus l'initiale ; si l'image ne charge pas, l'initiale reste visible.
function face(r){const u=String(r&&r.avatar||'');return initial(r&&r.name)+(/^https:\/\/[^\s"'<>]+$/i.test(u)?'<img src="'+esc(u)+'" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.remove()">':'');}
function nameBtn(r,cls){return '<button type="button" class="lb-name '+(cls||'')+'" data-id="'+esc(r.id)+'" title="'+esc(L3('Voir la vitrine','View showcase','Ver la vitrina'))+'" data-noi18n>'+esc(r.name)+'</button>';}
function podium(top){
 const order=[top[1],top[0],top[2]];
 return '<div class="lb-podium">'+order.map((r,i)=>{if(!r)return '<div class="lb-pod lb-pod-empty" aria-hidden="true"></div>';const place=[2,1,3][i];
  return '<div class="lb-pod lb-pod-'+place+(r.me?' is-me':'')+'"><span class="lb-medal">'+r.rank+'</span><span class="lb-avatar">'+face(r)+'</span>'+nameBtn(r)+'<b class="lb-val">'+nf(r.value)+'</b><small>'+esc(unit(r.value))+'</small></div>';}).join('')+'</div>';
}
function row(r){return '<li class="lb-row'+(r.me?' is-me':'')+'"><span class="lb-rank">'+r.rank+'</span><span class="lb-avatar sm">'+face(r)+'</span>'+nameBtn(r)+'<span class="lb-score"><span><b>'+nf(r.value)+'</b> '+esc(unit(r.value))+'</span>'+(sub(r)?'<small>'+esc(sub(r))+'</small>':'')+'</span></li>';}
function board(){
 const c=cache[key()];
 if(!c||c.loading&&!c.data)return '<div class="lb-state">'+esc(L3('Chargement du classement…','Loading leaderboard…','Cargando clasificación…'))+'</div>';
 if(c.error)return '<div class="lb-state">'+esc(L3('Le classement n\'a pas pu être chargé.','The leaderboard could not be loaded.','No se pudo cargar la clasificación.'))+' <button type="button" class="lb-retry" data-act="retry">'+esc(L3('Réessayer','Retry','Reintentar'))+'</button></div>';
 const d=c.data||{},top=Array.isArray(d.top)?d.top:[],me=d.me;
 if(!top.length)return '<div class="lb-state">'+esc(section==='games'?L3('Personne n\'a encore gagné de partie à ce jeu. La première place est à prendre !','Nobody has won a game here yet. First place is up for grabs!','Nadie ha ganado aún aquí. ¡El primer puesto está libre!'):L3('Aucun joueur dans ce classement pour l\'instant.','No players in this ranking yet.','Aún no hay jugadores en esta clasificación.'))+'</div>';
 const inTop=top.some(r=>r.me);
 let mine='';
 if(window.sakuSecureUserId&&!inTop)mine=me?'<div class="lb-mine">'+esc(L3('Ta place','Your rank','Tu puesto'))+' <b>#'+nf(me.rank)+'</b> · '+nf(me.value)+' '+esc(unit(me.value))+'</div>':'<div class="lb-mine">'+esc(section==='games'?L3('Gagne une partie pour entrer dans ce classement.','Win a game to enter this ranking.','Gana una partida para entrar en esta clasificación.'):L3('Tu n\'es pas encore classé ici.','You are not ranked here yet.','Aún no estás clasificado aquí.'))+'</div>';
 return mine+podium(top)+(top.length>3?'<ol class="lb-list">'+top.slice(3).map(row).join('')+'</ol>':'');
}
function render(){
 const root=$('leaderboardContent');if(!root)return;
 const segs=[['games',L3('Jeux','Games','Juegos')],['collection',L3('Collection','Collection','Colección')],['arena','Arena']];
 let picker='',body='';
 if(section==='arena'){
  body='<div class="lb-arena"><span class="lb-arena-ico" aria-hidden="true">⚔</span><h2>'+esc(L3('Arena est en pause','Arena is on hold','Arena está en pausa'))+'</h2><p>'+esc(L3('Le mode Arena est suspendu pour le moment. Son classement reviendra avec lui.','Arena mode is suspended for now. Its leaderboard will come back with it.','El modo Arena está suspendido por ahora. Su clasificación volverá con él.'))+'</p></div>';
 }else if(section==='games'){
  picker='<div class="lb-picks" role="group" aria-label="'+esc(L3('Choisir un jeu','Choose a game','Elegir un juego'))+'">'+GAMES.map(g=>'<button type="button" class="lb-pick" data-game="'+g[0]+'" aria-pressed="'+(g[0]===game)+'"><svg class="ic" aria-hidden="true"><use href="#i-game-'+g[2]+'"/></svg><span data-noi18n>'+esc(g[1])+'</span></button>').join('')+'</div>';
  body=board();
 }else{
  picker='<div class="lb-picks lb-picks-3" role="group" aria-label="'+esc(L3('Choisir un critère','Choose a criterion','Elegir un criterio'))+'">'+COLL().map(c=>'<button type="button" class="lb-pick" data-coll="'+c[0]+'" aria-pressed="'+(c[0]===coll)+'" style="--c:'+c[2]+'"><i aria-hidden="true"></i><span>'+esc(c[1])+'</span></button>').join('')+'</div>';
  body=board();
 }
 const title=section==='games'?(GAMES.find(g=>g[0]===game)||[])[1]:section==='collection'?L3({mythic:'Plus de cartes mythiques',special:'Plus de cartes spéciales',cards:'Plus de cartes différentes'}[coll],{mythic:'Most mythic cards',special:'Most special cards',cards:'Most different cards'}[coll],{mythic:'Más cartas míticas',special:'Más cartas especiales',cards:'Más cartas distintas'}[coll]):'';
 root.innerHTML='<div class="lb-seg" role="tablist" aria-label="'+esc(L3('Classements','Leaderboards','Clasificaciones'))+'">'+segs.map(s=>'<button type="button" role="tab" data-sec="'+s[0]+'" aria-selected="'+(s[0]===section)+'"'+(s[0]==='arena'?' class="lb-seg-off"':'')+'>'+esc(s[1])+(s[0]==='arena'?'<small>'+esc(L3('en pause','on hold','en pausa'))+'</small>':'')+'</button>').join('')+'</div>'+
  picker+(title?'<div class="lb-head"><h2 data-noi18n>'+esc(title)+'</h2><span>'+esc(section==='games'?L3('Top 50 · victoires','Top 50 · wins','Top 50 · victorias'):L3('Top 50','Top 50','Top 50'))+'</span></div>':'')+'<div class="lb-board" aria-live="polite">'+body+'</div>';
}
document.addEventListener('click',e=>{
 const root=$('leaderboardContent');if(!root||!root.contains(e.target))return;
 const s=e.target.closest('[data-sec]');if(s){section=s.dataset.sec;if(section==='arena')render();else load();return;}
 const g=e.target.closest('[data-game]');if(g){game=g.dataset.game;load();return;}
 const c=e.target.closest('[data-coll]');if(c){coll=c.dataset.coll;load();return;}
 const n=e.target.closest('.lb-name[data-id]');if(n&&window.showShowcase){window.showShowcase(n.dataset.id);return;}
 if(e.target.closest('[data-act="retry"]'))load(true);
});
window.showLeaderboard=function(){if(typeof showScreen==='function')showScreen('leaderboardScreen');try{window.scrollTo(0,0);}catch(e){}render();if(section!=='arena')load();};
})();
