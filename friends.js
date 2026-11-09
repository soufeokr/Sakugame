/* Friends drawer: public display-name directory and account-scoped relationships.
   Invitations require acceptance; favorites and blocks are private to the owner. */
(function(){
  'use strict';
  const tr=s=>typeof t==='function'?t(s):s;
  let uid=null, socialRef=null, socialListener=null, directoryRef=null, directoryListener=null;
  let social={}, directory={}, loaded=false, lastPublished='', busy=new Set();
  const $=id=>document.getElementById(id);
  function safeId(id){ return /^\d{1,30}$/.test(String(id)); }
  function setText(el,text){el.textContent=text;return el;}
  function node(tag,cls,text){const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)setText(el,text);return el;}
  function status(text){ const el=$('friendStatus');if(el)el.textContent=text?tr(text):''; }
  function publish(){
    if(!currentAccount)return;const id=sakuMyDcId();if(!safeId(id))return;
    const name=String(currentAccount.username||'').trim().slice(0,60);if(!name)return;
    const avatar=String(myAvatar()||'');const validAvatar=/^https:\/\//i.test(avatar)?avatar.slice(0,1200):'';
    const data={name,avatar:validAvatar}, stamp=id+JSON.stringify(data);if(stamp===lastPublished)return;
    lastPublished=stamp;database.ref('publicPlayers/'+id).set(data).catch(()=>{if(lastPublished===stamp)lastPublished='';});
  }
  function detach(){
    if(socialRef&&socialListener)socialRef.off('value',socialListener);
    if(directoryRef&&directoryListener)directoryRef.off('value',directoryListener);
    uid=null; socialRef=null;socialListener=null;directoryRef=null;directoryListener=null;social={};directory={};loaded=false;lastPublished='';busy.clear(); render();
  }
  function attach(){
    if(!currentAccount){detach();return;}const id=sakuMyDcId();if(!safeId(id))return;
    if(uid===id && socialRef){publish();render();return;}detach();uid=id;
    publish(); socialRef=sakuAcctRef(id).child('social');
    socialListener=s=>{if(uid!==id)return;social=s.val()||{};render();};
    socialRef.on('value',socialListener,()=>{if(uid===id)status('Could not load friends.');});
    directoryRef=database.ref('publicPlayers');
    directoryListener=s=>{if(uid!==id)return;directory=s.val()||{};loaded=true;render();};
    directoryRef.on('value',directoryListener,()=>{if(uid===id){loaded=false;status('Could not load players.');render();}});
    render();
  }
  function has(group,id){return !!((social[group]||{})[id]);}
  function nameOf(id){const p=directory[id];return p&&p.name?String(p.name):tr('Player unavailable');}
  function getIds(group){return Object.keys(social[group]||{}).filter(safeId).filter(id=>id!==uid);}
  function button(label,action,id,variant){const b=node('button','friend-action '+(variant||''),tr(label));b.type='button';b.dataset.action=action;b.dataset.id=id;return b;}
  function row(id,mode){
    const item=node('div','friend-row');const avatar=node('div','friend-avatar');const p=directory[id]||{};
    if(p.avatar && /^https:\/\//i.test(String(p.avatar))){const img=document.createElement('img');img.alt='';img.src=String(p.avatar);img.onerror=()=>img.remove();avatar.appendChild(img);}else avatar.textContent='✦';
    const content=node('div','friend-row-content'), head=node('div','friend-row-head');head.appendChild(node('strong','friend-name',nameOf(id)));head.appendChild(node('span','friend-id','#'+id.slice(-4)));content.appendChild(head);
    const actions=node('div','friend-actions');
    if(mode!=='blocked') actions.appendChild(button('View showcase','showcase',id));
    if(mode==='blocked') actions.appendChild(button('Unblock','unblock',id));
    else if(mode==='incoming'){actions.appendChild(button('Accept','accept',id,'primary'));actions.appendChild(button('Decline','decline',id));actions.appendChild(button('Block','block',id));}
    else if(mode==='outgoing'){actions.appendChild(button('Cancel request','cancel',id));actions.appendChild(button('Block','block',id));}
    else if(mode==='friend'){actions.appendChild(button(has('favorites',id)?'Remove favorite':'Favorite',has('favorites',id)?'unfavorite':'favorite',id));actions.appendChild(button('Remove','remove',id));actions.appendChild(button('Block','block',id));}
    else {actions.appendChild(button('Add','request',id,'primary'));actions.appendChild(button('Block','block',id));}
    content.appendChild(actions);item.append(avatar,content);return item;
  }
  function list(container,ids,mode,empty){container.replaceChildren(); if(!ids.length)container.appendChild(node('p','friend-empty',tr(empty)));else ids.sort((a,b)=>nameOf(a).localeCompare(nameOf(b))).forEach(id=>container.appendChild(row(id,mode)));}
  function render(){
    if(!$('friendsGuest'))return;const signed=!!currentAccount; $('friendsGuest').hidden=signed;$('friendsSigned').hidden=!signed;
    const incoming=getIds('incoming').filter(id=>!has('blocked',id)),badge=$('friendRequestBadge');badge.hidden=!signed||!incoming.length;badge.textContent=String(incoming.length);
    if(!signed)return;
    const friends=getIds('friends').filter(id=>!has('blocked',id)), fav=getIds('favorites').filter(id=>friends.includes(id)),blocked=getIds('blocked');
    $('favoritesCount').textContent=String(fav.length);$('friendsCount').textContent=String(friends.length);$('blockedCount').textContent=String(blocked.length);
    list($('favoritesList'),fav,'friend','No favorites yet.');list($('friendsList'),friends,'friend','No friends yet.');list($('blockedList'),blocked,'blocked','No blocked players.');
    const requests=$('friendRequests');requests.replaceChildren();const outgoing=getIds('outgoing').filter(id=>!has('blocked',id));
    if(incoming.length || outgoing.length){requests.appendChild(node('p','friend-subtitle',tr('Friend requests')));incoming.forEach(id=>requests.appendChild(row(id,'incoming')));outgoing.forEach(id=>requests.appendChild(row(id,'outgoing')));}
    const query=$('friendsSearch').value.trim().toLocaleLowerCase();const results=$('friendSearchResults');results.hidden=!query;results.replaceChildren();
    if(!query)return;
    if(query.length<2){results.appendChild(node('p','friend-empty',tr('Type at least 2 characters.')));return;}
    if(!loaded){results.appendChild(node('p','friend-empty',tr('Loading players…')));return;}
    const found=Object.keys(directory).filter(safeId).filter(id=>id!==uid&&!has('blocked',id)&&String((directory[id]||{}).name||'').toLocaleLowerCase().includes(query)).sort((a,b)=>nameOf(a).localeCompare(nameOf(b))).slice(0,20);
    results.appendChild(node('p','friend-subtitle',tr('Search results')));
    if(!found.length)results.appendChild(node('p','friend-empty',tr('No players found.')));
    found.forEach(id=>results.appendChild(row(id,has('friends',id)?'friend':has('incoming',id)?'incoming':has('outgoing',id)?'outgoing':'search')));
  }
  async function action(action,id){
    if(!uid||!safeId(id)||id===uid||busy.has(id))return;
    if(action==='showcase'){sakuNavClose(false);if(window.showShowcase)window.showShowcase(id);return;}
    const me=uid;busy.add(id);status('');
    try {
      const root=database.ref(), updates={};const mine='accounts/'+me+'/social/', theirs='accounts/'+id+'/social/';
      if(action==='favorite'||action==='unfavorite'){
        if(!has('friends',id)||has('blocked',id))return;
        updates[mine+'favorites/'+id]=action==='favorite'?true:null;
      }else if(action==='unblock') updates[mine+'blocked/'+id]=null;
      else if(action==='block'){
        if(!window.confirm(tr('Block this player? They will be removed from your friends.')))return;
        updates[mine+'blocked/'+id]=true;
        for(const g of ['friends','favorites','incoming','outgoing']) updates[mine+g+'/'+id]=null;
        for(const g of ['friends','favorites','incoming','outgoing']) updates[theirs+g+'/'+me]=null;
      }else if(action==='remove'){
        for(const g of ['friends','favorites','incoming','outgoing']){updates[mine+g+'/'+id]=null;updates[theirs+g+'/'+me]=null;}
      }else if(action==='cancel'||action==='decline'){
        updates[mine+(action==='cancel'?'outgoing':'incoming')+'/'+id]=null;
        updates[theirs+(action==='cancel'?'incoming':'outgoing')+'/'+me]=null;
      }else if(action==='request'||action==='accept'){
        if(has('blocked',id))return;
        const target=(await sakuAcctRef(id).child('social').once('value')).val()||{};
        if(uid!==me)return;
        if((target.blocked||{})[me]){status('Unable to add this player.');return;}
        if(action==='request'){
          if(has('friends',id)||has('outgoing',id)||has('incoming',id))return;
          updates[mine+'outgoing/'+id]=true;updates[theirs+'incoming/'+me]=true;
        }else{
          if(!has('incoming',id)||!(target.outgoing||{})[me]){status('This request is no longer available.');return;}
          updates[mine+'friends/'+id]=true;updates[theirs+'friends/'+me]=true;
          updates[mine+'incoming/'+id]=null;updates[theirs+'outgoing/'+me]=null;
        }
      }else return;
      await root.update(updates);
    } catch(e){if(uid===me)status('Action could not be saved. Please try again.');}
    finally{busy.delete(id);}
  }
  function tab(which){const friends=which==='friends';$('sideMenuView').hidden=friends;$('sideFriendsView').hidden=!friends;$('sideMenuTab').classList.toggle('active',!friends);$('sideFriendsTab').classList.toggle('active',friends);$('sideMenuTab').setAttribute('aria-selected',String(!friends));$('sideFriendsTab').setAttribute('aria-selected',String(friends));if(friends){if(currentAccount&&!uid)attach();render();} }
  document.addEventListener('DOMContentLoaded',()=>{
    $('friendsSearch').addEventListener('input',render);
    $('sideFriendsView').addEventListener('click',e=>{const b=e.target.closest('button[data-action]');if(b)action(b.dataset.action,b.dataset.id);});
    // Trackpads emit many small horizontal wheel events (and momentum). A
    // single gesture switches once; ordinary vertical scrolling stays native.
    let swipeAmount=0, swipeLocked=false, swipeIdle=null;
    $('sideNavigation').addEventListener('wheel',event=>{
      if(event.ctrlKey || !event.deltaX || Math.abs(event.deltaX)<=Math.abs(event.deltaY)*1.15) return;
      event.preventDefault();
      clearTimeout(swipeIdle);
      swipeIdle=setTimeout(()=>{ swipeAmount=0; swipeLocked=false; },180);
      if(swipeLocked)return;
      const delta=event.deltaX*(event.deltaMode===1?16:event.deltaMode===2?window.innerWidth:1);
      if(swipeAmount && Math.sign(swipeAmount)!==Math.sign(delta))swipeAmount=0;
      swipeAmount+=delta;
      if(Math.abs(swipeAmount)<45)return;
      const destination=swipeAmount>0?'friends':'menu';
      swipeAmount=0;swipeLocked=true;
      if((destination==='friends')!==!$('sideFriendsView').hidden){ tab(destination); $('sideNavigation').scrollTop=0; }
    },{passive:false});
    if(currentAccount)attach();else render();
  });
  window.sakuSocialTab=tab;window.sakuFriendsAttach=attach;window.sakuFriendsDetach=detach;window.sakuFriendsPublish=publish;
})();
