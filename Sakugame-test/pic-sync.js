/* Photos publiques : pics/<nom du personnage>.jpg, .jpeg, .png ou .webp.
   Correspondance exacte normalisée, sans attribution en cas de conflit. */
(function () {
  'use strict';
  var API = 'https://api.github.com/repos/soufeokr/Sakugame-pics/git/trees/main?recursive=1';
  var BASE = 'https://raw.githubusercontent.com/soufeokr/Sakugame-pics/main/';
  var KEY = 'saku-pics-by-name-v3', TTL = 5 * 60 * 1000;
  var cached = null;
  try { cached = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (_) {}
  function normalize(name) {
    return String(name || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
  }
  // Correspondances déjà vérifiées, conservées même quand un nom est ambigu.
  var VERIFIED_PICS = {"Amagami Yae icons.jpg":"229666","Aqua hoshino.jpg":"183885","Arthur Leywin.jpg":"347710","Asahi Amagami.jpg":"229667","Atsuya Kusakabe.jpg":"205234","Aya Oosawa.jpg":"282093","Bulma.jpg":"678","Byakuya.jpg":"907","Charles zi britannia.png":"5610","Charon.jpg":"171898","Cid Kagenou.jpg":"136837","Dear Santa.jpg":"306959","Doraemon.jpg":"4304","Edward elric.jpg":"11","Emilia.jpg":"88572","Ener.jpg":"1541","Enkidu.jpg":"60059","Eren yaeger.jpg":"40882","Evangelist.webp":"327307","Frezeer.jpg":"3694","Gaara.jpg":"1662","Gojo Satoru.jpg":"127691","Harumi Taniguchi.jpg":"83387","Hashigen Ushoda.jpg":"2345","Hidan.jpg":"2792","Hinata Hyuga.jpg":"1555","Hino Yota.jpg":"354443","Ippo.jpg":"15","Itachi Uchiha.jpg":"14","Kamina.jpg":"2075","Kasane Teto.jpg":"24552","Kasumi Nomura.jpg":"126453","Kenma Kozume.jpg":"71267","Kirby.jpg":"5471","Kisuke pfp.jpg":"210","Knuckles.jpg":"6378","Kuro Nero.jpg":"126948","Luna.jpg":"238189","Maki Zenin.jpg":"134167","Makima.jpg":"137080","Maomao.jpg":"126824","Mayuri Kurotsuchi.jpg":"1168","Mewtwo.jpg":"5113","Minato Namikaze.jpg":"2535","Mitsuki Koga.jpg":"282094","Naruto Uzumaki.jpg":"17","Nice.jpg":"87930","Nico Robin.jpg":"61","Oikawa ‧₊˚✮.jpg":"71611","Olivia.jpg":"126451","Orihime pfp.jpg":"7","REZE.jpg":"148740","Regulus Corneas.jpg":"174098","Reinhard icon.jpg":"88577","Rocks Xebec.jpg":"146411","Rogue Cheney.jpg":"51153","Saimori Miyo.jpg":"181965","Saku Hagita Icon.jpg":"76832","Sakuta Azusagawa.jpg":"127221","Sanji.jpg":"305","Satella.jpg":"127242","Shampoo.jpg":"2421","Shaula (1).jpg":"184458","Shikamaru Nara.jpg":"2007","Shisio Makoto.jpg":"3683","Shunsui Kyoraku.jpg":"1088","Son Gohan.jpg":"2093","Sonic the Hedgehog.jpg":"2882","Stella Vermillion.jpg":"88264","Subaru natsuki.jpg":"88573","Tails miles prower.jpg":"6377","Tokiyuki Houjou.jpg":"215499","Tsukishima Ken.jpg":"67329","Unohana.jpg":"3845","Vegeta.jpg":"913","Xenovia Quarta.jpg":"51337","YUJI ITADORI.jpg":"127212","Yhwach.jpg":"68537","Yoruichi.jpg":"908","Yuna Amagami.jpg":"229665","Yuta Okkotsu.jpg":"129571","Zaraki kenpachi.jpg":"909","aizen sosuke.jpg":"1086","aki.jpg":"137081","asa.jpg":"282389","asuna.jpg":"36828","bakugo.jpg":"88892","black goku.jpg":"126199","bocchi.jpg":"257562","bokuto kotaro.jpg":"88937","buntarou mori.jpg":"35510","capella.jpg":"175581","crush.jpg":"90185","denji.jpg":"130102","echidna.jpg":"129330","frieren.jpg":"176754","fyodor dostoevsky.jpg":"138067","gon freecs.jpg":"30","greed.jpg":"351","hinata shoyo.jpg":"64769","hoshiumi.jpg":"139509","izuku.jpg":"89028","jeanne d'arc alter.jpg":"215691","kita.jpg":"266041","krul tepes.jpg":"88899","kuroo tetsuro.jpg":"71269","kurosaki.jpg":"5","l lawliet.jpg":"71","laboon.jpg":"5413","light yagami.jpg":"80","migi.jpg":"13773","nami.jpg":"723","nayuta.jpg":"199767","nelliel.jpg":"4730","nijika.jpg":"261674","ogun montgomery.jpg":"180505","okabe rintarou.jpg":"35252","petelgeuse romanée-conti.jpg":"90170","power.jpg":"137079","rem.jpg":"88575","rudeus.jpg":"88348","ryo.jpg":"264529","ryomen sukuna.jpg":"133701","sasuke uchiha.jpg":"13","shanks.jpg":"727","shinmon benimaru.jpg":"130848","shouko nishimiya.jpg":"80243","simon.jpg":"2257","son goku.jpg":"246","sylphiette.jpg":"88346","tobi.jpg":"3149","usopp.jpg":"724","veldora tempest.jpg":"128034","yachiru.jpg":"910","yoru.jpg":"282872","yoshida.jpg":"127924","zoro.jpg":"62","Gogeta.jpg":"manual-gogeta","vegeto.jpg":"manual-vegeto"};
  function unordered(name) {
    var tokens = normalize(name).split(' ').filter(Boolean);
    return tokens.length >= 2 && tokens.length <= 5 ? tokens.sort().join(' ') : '';
  }
  function romanized(name) {
    var tokens = normalize(name).split(' ').filter(Boolean);
    if (tokens.length < 2 || tokens.length > 5) return '';
    return tokens.map(function(t) { return t.length >= 3 ? t.replace(/ou/g, 'o').replace(/uu/g, 'u') : t; }).sort().join(' ');
  }
  function parse(tree) {
    if (!tree || tree.truncated || !Array.isArray(tree.tree)) throw new Error('Liste GitHub incomplète');
    var exact = {}, compact = {}, inverted = {}, roman = {}, singles = {}, candidates = {}, ids = {}, extraNames = {};
    function add(index,key,id) {
      if (!key) return; if (!index[key]) index[key] = {}; index[key][id] = true;
    }
    if (typeof GENERIC_CHARACTERS !== 'undefined' && Array.isArray(GENERIC_CHARACTERS)) {
      GENERIC_CHARACTERS.forEach(function(c) { if(c && c.id) extraNames[String(c.id)] = [c.name].concat(Array.isArray(c.al) ? c.al : []); });
    }
    if (typeof ENCYCLOPEDIA !== 'undefined' && ENCYCLOPEDIA && ENCYCLOPEDIA.list) {
      ENCYCLOPEDIA.list.forEach(function (group) { if (group.edition === 'strongest') return; group.cards.forEach(function (c) {
        var id = String(c.i); ids[id] = true;
        normalize(c.m).split(' ').forEach(function(t){ if(t.length >= 5) add(singles,t,id); });
        var names = [c.m].concat(Array.isArray(c.a) ? c.a : [], extraNames[id] || []);
        names.forEach(function (name) {
          if (!name) return;
          add(exact, normalize(name), id);
          var joined=normalize(name).replace(/ /g,''); if(joined.length>=5) add(compact,joined,id);
          add(exact, normalize(name + ' ' + group.label), id);
          add(inverted, unordered(name), id);
          add(roman, romanized(name), id);
          var backwards = normalize(name).split(' ').reverse().join(' ');
          if (unordered(name)) {
            add(exact, normalize(backwards + ' ' + group.label), id);
          }
        });
      }); });
    }
    // Ces quatre fichiers restent expressément mis de côté par le joueur.
    var reserved = { 'arslan.jpg':1, 'narsus.jpg':1, 'daryun.jpg':1, 'zeke yeager.jpg':1 };
    tree.tree.forEach(function (entry) {
      if (entry.type !== 'blob') return;
      var match = /^pics\/([^/]+)\.(jpg|jpeg|png|webp)$/i.exec(entry.path || '');
      if (!match || reserved[(match[1]+'.'+match[2]).toLowerCase()]) return;
      var filename = match[1] + '.' + match[2], key=normalize(match[1]);
      var matchedExact=exact[key] ? Object.keys(exact[key]) : [];
      var id = VERIFIED_PICS[filename], score = 4;
      if (id && ids[id] && key.indexOf(' ') >= 0 && matchedExact.length===1 && matchedExact[0]===id) score=6;
      if (!id || !ids[id]) {
        id = null;
        var joined=key.replace(/ /g,''), single=key.indexOf(' ') < 0 && key.length>=5 ? key : '';
        var layers = [[exact,key, key.indexOf(' ') >= 0 ? 5 : 3],
                      [compact,joined.length>=5 ? joined : '',3],
                      [inverted,unordered(match[1]),2], [roman,romanized(match[1]),1], [singles,single,0]];
        for (var j=0; j<layers.length; j++) {
          var layer=layers[j], hits=layer[1] && layer[0][layer[1]] ? Object.keys(layer[0][layer[1]]) : [];
          if (hits.length) { if (hits.length===1) {id=hits[0]; score=layer[2];} break; }
        }
      }
      if (!id) return;
      var url = BASE + entry.path.split('/').map(encodeURIComponent).join('/');
      if (/^[0-9a-f]{40}$/.test(entry.sha || '')) url += '?v=' + entry.sha.slice(0, 12);
      var old=candidates[id];
      if (!old || score > old.score) candidates[id]={url:url,score:score,tie:false};
      else if (score === old.score && old.url !== url) old.tie=true;
    });
    var result={}; Object.keys(candidates).forEach(function(id){ if(!candidates[id].tie) result[id]=candidates[id].url; });
    return result;
  }
  function apply(map) {
    var changes = {}, byId = {};
    if (typeof ENCYCLOPEDIA !== 'undefined' && ENCYCLOPEDIA && ENCYCLOPEDIA.list) {
      ENCYCLOPEDIA.list.forEach(function (g) { if (g.edition === 'strongest') return; g.cards.forEach(function (c) {
        var u = map[String(c.i)];
        if (u) { if (c.u && c.u !== u) changes[c.u] = u; c.u = u; }
        if (c.u && c.u.indexOf(BASE) === 0) byId[String(c.i)] = c.u;
      }); });
    }
    if (typeof GENERIC_CHARACTERS !== 'undefined') GENERIC_CHARACTERS.forEach(function (c) {
      var u = byId[String(c.id)] || map[String(c.id)];
      if (u) { if (c.image && c.image !== u) changes[c.image] = u; c.image = u; }
    });
    if (typeof CARD_EXTRA_CHARACTERS !== 'undefined' && Array.isArray(CARD_EXTRA_CHARACTERS)) CARD_EXTRA_CHARACTERS.forEach(function (c) {
      var u = byId[String(c.id)] || map[String(c.id)];
      if (u) { if (c.image && c.image !== u) changes[c.image] = u; c.image = u; }
    });
    if (typeof cardPool !== 'undefined' && cardPool) cardPool.forEach(function (c) {
      var u = byId[String(c.id)] || map[String(c.id)];
      if (u) { if (c.image && c.image !== u) changes[c.image] = u; c.image = u; }
    });
    if (typeof document !== 'undefined' && document.querySelectorAll) {
      document.querySelectorAll('img').forEach(function (img) {
        var old = img.getAttribute('src'); if (old && changes[old]) img.setAttribute('src', changes[old]);
      });
    }
  }
  function refresh(force) {
    var now = Date.now();
    if (!force && cached && cached.map && now - cached.at < TTL) {
      apply(cached.map); return Promise.resolve(cached.map);
    }
    if (typeof fetch !== 'function') { if (cached && cached.map) apply(cached.map); return Promise.resolve(null); }
    return fetch(API, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('GitHub ' + r.status);
      return r.json();
    }).then(function (tree) {
      try { if (typeof window.sakuStrongestAccept === 'function') window.sakuStrongestAccept(tree); } catch (_) {}
      var map = parse(tree); cached = { at: Date.now(), map: map };
      try { localStorage.setItem(KEY, JSON.stringify(cached)); } catch (_) {}
      apply(map); return map;
    }).catch(function () {
      if (cached && cached.map) apply(cached.map);
      else apply({});
      return null;
    });
  }
  window.sakuPicsRefresh = function () { return refresh(true); };
  window.sakuPicsParse = parse;
  var ready = window.sakuDataReady || Promise.resolve();
  Promise.resolve(ready).then(function () { refresh(false); }).catch(function () {});
  setInterval(function () { refresh(false); }, TTL);
})();
