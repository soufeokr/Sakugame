/* Noms officiels FR/EN vérifiés : les identifiants restent identiques. */
(function(){'use strict';
var names={
 '2473':['Sacha Ketchum','Ash Ketchum'],'3854':['Pierre','Brock'],'2909':['Ondine','Misty'],
 '3936':['James','James'],'3937':['Miaouss','Meowth'],'4848':['Régis Chen','Gary Oak'],
 '17783':['Professeur Chen','Professor Oak'],'6841':['Flora','May'],'3966':['Aurore','Dawn'],
 '17112':['Morgane','Sabrina'],'26545':['Agent Jenny','Officer Jenny'],
 '177038':['Bulbizarre','Bulbasaur'],'136296':['Psykokwak','Psyduck'],'180037':['Dracaufeu','Charizard'],
 '144635':['Qulbutoké','Wobbuffet'],'53521':['Togepi','Togepi'],'181415':['Carapuce','Squirtle'],
 '183414':['Smogogo','Weezing'],'177037':['Ronflex','Snorlax'],'149754':['Rondoudou','Jigglypuff'],'142475':['Dracolosse','Dragonite'],
 '16412':['Mark Evans','Mark Evans'],'16413':['Axel Blaze','Axel Blaze'],'22737':['Jude Sharp','Jude Sharp'],
 '26939':['Shawn Froste','Shawn Froste'],'31943':['Xavier Foster','Xavier Foster'],'31006':['Byron Love','Byron Love'],
 '29849':['Nathan Swift','Nathan Swift'],'31783':['Nelly Raimon','Nelly Raimon'],'32308':['Caleb Stonewall','Caleb Stonewall'],
 '32307':['Jordan Greenway','Jordan Greenway'],'32305':['Hurley Kane','Hurley Kane'],'32306':['David Samford','David Samford'],
 '32309':['Joseph King','Joseph King'],'38599':['Aiden Froste','Aiden Froste'],'36807':['Bellatrix','Bellatrix'],
 '31810':['Erik Eagle','Erik Eagle'],'34142':['Paolo Bianchi','Paolo Bianchi'],'31771':['Bryce Withingale','Bryce Withingale'],
 '31779':['Célia Hills','Celia Hills'],
 '15542':['Père','Father'],'33816':['La Vérité','The Truth'],
 '2150':['C-13','Android 13'],'2148':['C-15','Android 15'],'2149':['C-14','Android 14'],
 '2147':['C-17','Android 17'],'4318':['C-18','Android 18'],'2099':['C-16','Android 16'],
 '2159':['Krillin','Krillin'],'3694':['Freezer','Frieza'],'6122':['Bardock','Bardock']
};
function local(id,fallback){var pair=names[String(id)];if(!pair)return fallback;return (window.SAKU_I18N && window.SAKU_I18N.lang==='fr')?pair[0]:pair[1];}
function bind(obj,key,id){var pair=names[String(id)];if(!pair||!obj||!Object.prototype.hasOwnProperty.call(obj,key))return;var base=obj[key];
 var arr=obj.a||obj.al; if(!arr){arr=[];if(key==='m')obj.a=arr;else obj.al=arr;}
 [base,pair[0],pair[1]].forEach(function(x){if(x&&arr.indexOf(x)<0)arr.push(x);});
 Object.defineProperty(obj,key,{configurable:true,enumerable:true,get:function(){return local(id,base);},set:function(v){base=v;}});
}
window.sakuCharacterName=local;window.sakuBindCharacterName=bind;
if(typeof ENCYCLOPEDIA!=='undefined')ENCYCLOPEDIA.list.forEach(function(g){g.cards.forEach(function(c){bind(c,'m',c.i);});});
if(typeof CARD_EXTRA_CHARACTERS!=='undefined')CARD_EXTRA_CHARACTERS.forEach(function(c){bind(c,'name',c.id);});
if(window.sakuDataReady)window.sakuDataReady.then(function(){if(typeof GENERIC_CHARACTERS!=='undefined')GENERIC_CHARACTERS.forEach(function(c){bind(c,'name',c.id);});}).catch(function(){});
window.addEventListener('saku-lang-change',function(){
 try{var box=document.getElementById('encDetail'), button=box && box.classList.contains('show') && box.querySelector('[data-enc-num]'); var num=button && Number(button.getAttribute('data-enc-num')); if(typeof encData!=='undefined' && encData && typeof encRender==='function')encRender(true); if(num && typeof encOpenCard==='function')encOpenCard(num);}catch(e){}
 try{if(typeof cardPool!=='undefined' && cardPool && typeof cardsRenderAlbum==='function')cardsRenderAlbum();}catch(e){}
});
})();
