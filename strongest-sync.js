/* The Strongest : une fiche séparée par nom de fichier, sans toucher au Basic.
   Les fiches sont visibles uniquement en collection, jamais dans les tirages. */
(function(){ 'use strict';
  var BASE='https://raw.githubusercontent.com/soufeokr/Sakugame-pics/main/';
  var CACHE='saku-strongest-index-v1', known={};
  // Published special numbers are permanent. Add new names here before publication.
  var specialRegistry={'Acnologia':1,'All Might':2,'Anti spiral':3,'Benimaru Shinmon':4,'Broly':5,'Daryun':6,'Escanor':7,'Frieren':8,'Gilgamesh':9,'Guy Maito':10,'Kisho Arima':11,'Madara Uchiha':12,'Reinhard van Astrea':13,'Ryomen Sukuna':14,'Saitama':15,'Satoru Gojo':16,'Sinbad':17,'Son Goku':18,'Zaraki Kenpachi':19,'julius novachrono':20,'Edward Newgate':21,'Madoka Kaname':22};
  var specialById={}; Object.keys(specialRegistry).forEach(function(name){specialById[idFor(name)]=specialRegistry[name];});
  window.sakuSpecialNumber=function(card){var id=String(card&&(card.id!=null?card.id:card.i)||''); var n=specialById[id];return Number.isInteger(n)&&n>=1&&n<=999?'#S-'+String(n).padStart(3,'0'):'';};
  function idFor(name) {
    var key=String(name).normalize('NFKC').trim().toLowerCase().replace(/\s+/g,' ');
    return 'strongest_'+encodeURIComponent(key).replace(/[.!~*'()]/g,function(c){return '%'+c.charCodeAt(0).toString(16).toUpperCase();});
  }
  function normal(s) { return String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' '); }
  function urlOf(item) {
    var url=BASE+item.path.split('/').map(encodeURIComponent).join('/');
    return url+(/^[0-9a-f]{40}$/.test(item.sha||'')?'?v='+item.sha.slice(0,12):'');
  }
  function insert(item) {
    if(!item || typeof item.name!=='string' || !/^The strongest\/[^/]+\.(?:jpe?g|png|webp)$/i.test(item.path||'')) return;
    var id=idFor(item.name), old=known[id];
    known[id]={id:id,name:item.name,series:item.series || (old && old.series) || 'The Strongest',path:item.path,sha:item.sha||''};
  }
  SAKU_STRONGEST_INITIAL.forEach(insert);
  try { var old=JSON.parse(localStorage.getItem(CACHE)||'[]'); if(Array.isArray(old)) old.forEach(insert); } catch(e){}
  function seriesFor(name) {
    var matches={}, key=normal(name);
    ENCYCLOPEDIA.list.forEach(function(g){ if(g.edition==='strongest')return; g.cards.forEach(function(c){
      [c.m].concat(c.a||[]).forEach(function(n){if(normal(n)===key) matches[String(c.i)]=g.label;});
    }); });
    var keys=Object.keys(matches);return keys.length===1 ? matches[keys[0]] : 'The Strongest';
  }
  function sync() {
    if(typeof ENCYCLOPEDIA==='undefined' || !ENCYCLOPEDIA.list) return;
    var group=ENCYCLOPEDIA.list.find(function(g){return g.edition==='strongest';});
    if(!group) { group={label:'The Strongest',edition:'strongest',count:0,from:0,to:0,rar:{},cards:[]};ENCYCLOPEDIA.list.push(group); }
    var by={};group.cards.forEach(function(c){by[String(c.i)]=c;});
    var pby={};CARD_STRONGEST.forEach(function(c){pby[String(c.id)]=c;});
    Object.keys(known).sort().forEach(function(id){
      var item=known[id], url=urlOf(item), c=by[id];
      if(!c){ c={i:id,m:item.name,u:url,r:'special',k:99999,n:0,n0:null,edition:'strongest',series:item.series};group.cards.push(c); }
      else {c.u=url;c.m=item.name;c.series=item.series;c.r='special';} c.specialNumber=specialById[id];
      var p=pby[id];
      if(!p){p={id:id,name:item.name,image:url,series:item.series,rarity:'special',edition:'strongest',collectibleOnly:true};CARD_STRONGEST.push(p);}
      else {p.image=url;p.name=item.name;p.series=item.series;p.rarity='special';} p.specialNumber=specialById[id];

    });
    group.count=group.cards.length;
    // Comptes corrects même si l'encyclopédie n'a pas encore été ouverte.
    var n=0;ENCYCLOPEDIA.list.forEach(function(g){g.from=n+1;g.count=g.cards.length;g.cards.forEach(function(c){c.n=++n;});g.to=n;});
    ENCYCLOPEDIA.total=n;ENCYCLOPEDIA.groups=ENCYCLOPEDIA.list.length;
    if(typeof sakuStrongestRefreshEnc==='function')sakuStrongestRefreshEnc();
    if(typeof sakuStrongestSyncPool==='function')sakuStrongestSyncPool();
  }
  window.sakuStrongestAccept=function(tree){
    if(!tree || tree.truncated || !Array.isArray(tree.tree))return;
    var seen={},duplicates={};
    tree.tree.forEach(function(item){
      if(item.type!=='blob')return;
      var m=/^The strongest\/([^/]+)\.(jpe?g|png|webp)$/i.exec(item.path||'');if(!m)return;
      var id=idFor(m[1]);if(seen[id]){duplicates[id]=true;return;}
      seen[id]={name:m[1],path:item.path,sha:item.sha||''};
    });
    Object.keys(seen).forEach(function(id){
      if(duplicates[id])return;
      var item=seen[id];item.series=(known[id] && known[id].series) || seriesFor(item.name);insert(item);
    });
    try{localStorage.setItem(CACHE,JSON.stringify(Object.keys(known).map(function(k){return known[k];})));}catch(e){}
    sync();
  };
  sync();
})();
