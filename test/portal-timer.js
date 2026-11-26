/* Sakugame — portails temporaires : date de fin de chaque portail (serveur, portal_schedule_get) et compte à rebours.
   Basic et le grimoire spécial n'ont pas de fin. Après la fin, le serveur refuse les achats ; ici on l'affiche. */
(function(){'use strict';
const KEYS=['basic','strongest','retro','cinema','gem'];
// Repli si le serveur ne répond pas (mêmes dates que la migration 308, fin de journée heure de Paris).
let ends={cinema:Date.parse('2026-12-07T22:59:59Z'),strongest:Date.parse('2026-12-14T22:59:59Z'),retro:Date.parse('2026-12-21T22:59:59Z')};
let skew=0;
const L3=(fr,en,es)=>{const l=(window.SAKU_I18N||{}).lang;return l==='fr'?fr:l==='es'?es:en;};
const now=()=>Date.now()+skew;
function endOf(i){const k=typeof i==='number'?KEYS[i]:i;return ends[k]||0;}
function left(i){const e=endOf(i);return e?e-now():Infinity;}
function closed(i){return left(i)<=0;}
function fmt(ms){
 if(!isFinite(ms))return '';
 const s=Math.max(0,Math.floor(ms/1000)),d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60),sec=s%60;
 if(d>=1)return L3(d+' j '+h+' h',d+'d '+h+'h',d+' d '+h+' h');
 return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0');
}
function short(ms){if(!isFinite(ms))return '';const s=Math.max(0,Math.floor(ms/1000)),d=Math.floor(s/86400),h=Math.floor(s/3600);return d>=1?L3(d+' j',d+'d',d+' d'):h>=1?h+' h':Math.max(1,Math.ceil(s/60))+' min';}
function dateLabel(i){const e=endOf(i);if(!e)return '';try{return new Date(e).toLocaleDateString((window.SAKU_I18N||{}).lang||undefined,{day:'numeric',month:'long',timeZone:'Europe/Paris'});}catch(x){return '';}}
/* Texte du compte à rebours d'un portail ; '' pour un portail permanent. */
function label(i){
 const ms=left(i);if(!isFinite(ms))return '';
 if(ms<=0)return L3('Portail terminé','Portal ended','Portal terminado');
 return L3('Disparaît dans ','Leaves in ','Se va en ')+fmt(ms);
}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* Bandeau du panneau d'achat : permanent, temps restant ou terminé. */
function chip(i){
 const k=KEYS[i],ms=left(i);
 if(k==='basic')return '<p class="pp-timer is-permanent">'+esc(L3('Portail permanent','Permanent portal','Portal permanente'))+'</p>';
 if(!isFinite(ms))return '';
 if(ms<=0)return '<p class="pp-timer is-over" data-portal-timer="'+k+'">'+esc(L3('Ce portail est terminé : il n’est plus possible d’y invoquer.','This portal has ended: summoning is no longer possible.','Este portal ha terminado: ya no se puede invocar.'))+'</p>';
 return '<p class="pp-timer'+(ms<86400000*2?' is-soon':'')+'" data-portal-timer="'+k+'"><span>'+esc(L3('Disparaît dans','Leaves in','Se va en'))+'</span> <b>'+esc(fmt(ms))+'</b><small>'+esc(L3('dernier jour : ','last day: ','último día: ')+dateLabel(i))+'</small></p>';
}
window.sakuPortalTimer={endOf,left,closed,fmt,label,dateLabel,chip,keys:KEYS,reload:()=>load()};
/* Badges sur les onglets des portails. */
function paintTabs(){
 document.querySelectorAll('#portalTabs .portal-tab[data-portal]').forEach(tab=>{
  const k=tab.dataset.portal,ms=left(k);let b=tab.querySelector('.portal-tab-timer');
  if(!isFinite(ms)){if(b)b.remove();return;}
  if(!b){b=document.createElement('em');b.className='portal-tab-timer';b.setAttribute('aria-hidden','true');(tab.querySelector('.portal-tab-text')||tab).appendChild(b);}
  b.textContent=ms<=0?L3('Terminé','Ended','Terminado'):short(ms);b.classList.toggle('is-soon',ms>0&&ms<86400000*2);b.classList.toggle('is-over',ms<=0);
  tab.classList.toggle('is-closed',ms<=0);
 });
}
/* Compte à rebours du panneau du portail actif (rendu par portal-info.js). */
function paintPanel(){
 document.querySelectorAll('[data-portal-timer]').forEach(el=>{const ms=left(el.dataset.portalTimer);
  if(ms<=0&&!el.classList.contains('is-over')){if(window.portalDashboardRefresh)window.portalDashboardRefresh();return;}
  const v=el.querySelector('b');if(v)v.textContent=ms<=0?'':fmt(ms);});
}
async function load(){
 lastLoad=Date.now();
 try{const b=window.sakuBackend;if(!b||!b.portalSchedule)return;const r=await b.portalSchedule();
  if(r&&r.ends){const next={};Object.keys(r.ends).forEach(k=>{const t=Date.parse(r.ends[k]);if(t)next[k]=t;});ends=next;}
  if(r&&r.now){const t=Date.parse(r.now);if(t)skew=t-Date.now();}
  paintTabs();if(window.portalDashboardRefresh)window.portalDashboardRefresh();
 }catch(e){}
}
function tick(){const s=document.getElementById('summonScreen');if(!s||!s.classList.contains('active')||document.hidden)return;paintTabs();paintPanel();}
let lastLoad=0;
function init(){paintTabs();setInterval(tick,1000);
 // Recharge les dates en arrivant sur l'écran des portails (au plus une fois par minute).
 try{const scr=document.getElementById('summonScreen');if(scr)new MutationObserver(()=>{if(scr.classList.contains('active')&&Date.now()-lastLoad>60000)load();}).observe(scr,{attributes:true,attributeFilter:['class']});}catch(e){}
if(window.sakuDataReady)window.sakuDataReady.then(load).catch(load);else setTimeout(load,800);
 window.addEventListener('saku-lang-change',()=>{paintTabs();});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
