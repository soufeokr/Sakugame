/* Effets sonores synthétisés localement — aucune ressource externe, réglage propre à cet appareil. */
(function(){'use strict';
let ctx=null,lastFlip=0;const seen=new Set(),key='saku_sfx_volume_v1';let volume=.35;
try{let saved=localStorage.getItem(key);if(saved!==null){let n=Number(saved);if(Number.isFinite(n)&&n>=0&&n<=1)volume=n}}catch(e){}
function context(){try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;if(!ctx)ctx=new AC();return ctx}catch(e){return null}}
function unlock(){const a=context();if(a&&a.state==='suspended')a.resume().catch(()=>{})}
['pointerdown','touchstart','keydown'].forEach(e=>document.addEventListener(e,unlock,{once:true,passive:true}));
function tone(a,start,freq,duration,amp,type='sine',end){let o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(freq,start);if(end)o.frequency.exponentialRampToValueAtTime(end,start+duration);g.gain.setValueAtTime(.0001,start);g.gain.exponentialRampToValueAtTime(Math.max(.0002,amp*volume),start+.012);g.gain.exponentialRampToValueAtTime(.0001,start+duration);o.connect(g);g.connect(a.destination);o.start(start);o.stop(start+duration+.02)}
function play(kind,rarity,extra){try{if(volume<=0||document.hidden)return;const a=context();if(!a||a.state!=='running')return;const t=a.currentTime+.01;
 if(kind==='card'){if(t-lastFlip<.16)return;lastFlip=t;tone(a,t,420,.10,.12,'triangle',650);if(['legendary','mythic','special'].includes(rarity)){tone(a,t+.09,760,.19,.09,'sine');if(rarity==='mythic'||rarity==='special')tone(a,t+.18,1040,.25,.08,'sine')}}
 else if(kind==='pack'){const r=rarity||'common',b=t+(Number(extra)||0);
  if(r==='rare'){tone(a,t,300,.12,.08,'triangle',360);tone(a,t+.18,320,.12,.08,'triangle',380)}
  else if(r==='epic'){tone(a,t,160,(Number(extra)||.7),.10,'sawtooth',620)}
  else if(r==='legendary'){tone(a,t,70,(Number(extra)||1)+.1,.16,'triangle',95);tone(a,t+.35,240,(Number(extra)||1)-.3,.06,'sine',520)}
  else if(r==='mythic'){[1320,1760,1480,1980,1660].forEach((n,i)=>tone(a,t+.15+i*.22,n,.5,.035,'sine'));tone(a,t+.4,110,(Number(extra)||1.4)-.3,.08,'sine',220)}
  else if(r==='special'){tone(a,t,55,(Number(extra)||1.7)+.1,.18,'triangle',48);[392,523].forEach((n,i)=>tone(a,t+.4+i*.5,n,.5,.05,'sine'))}
  tone(a,b,170,.20,.16,'triangle',400);tone(a,b+.08,620,.24,.09,'sine',820);
  const chord={rare:[784,988],epic:[659,831,988],legendary:[523,659,784,1046],mythic:[880,1109,1319,1760],special:[392,523,659,784,1046]}[r];
  if(chord)chord.forEach((n,i)=>tone(a,b+.05+i*.06,n,r==='special'||r==='mythic'?.9:.5,.07,i%2?'sine':'triangle'));
  if(r==='mythic'||r==='special'||r==='legendary')tone(a,b,60,.6,.2,'sine',35)}
 else if(kind==='drop'){tone(a,t,290,.12,.12,'sine',180)}
 else if(kind==='level'){[523,659,784,1046].forEach((n,i)=>tone(a,t+i*.075,n,.24,.08,'sine'))}
 else if(kind==='victory'){[523,659,784,1046].forEach((n,i)=>tone(a,t+i*.11,n,i===3?.38:.23,.09,'triangle'))}
 }catch(e){/* Un bruitage ne doit jamais bloquer une action. */}}
function winOnce(key){if(!key||seen.has(key))return;seen.add(key);play('victory');if(seen.size>300)seen.delete(seen.values().next().value)}
function init(){const controls=document.querySelectorAll('[data-saku-sfx-volume]');controls.forEach(el=>{el.value=Math.round(volume*100);el.addEventListener('input',()=>{volume=Number(el.value)/100;try{localStorage.setItem(key,String(volume))}catch(e){};controls.forEach(other=>{if(other!==el)other.value=el.value})})});}
window.SakuSfx={play,winOnce};document.addEventListener('saku:level-up',()=>play('level'));if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
