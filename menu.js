/* Front door: player -> rival -> arena/difficulty, with future locked roster slots. */
(() => {
  'use strict';
  const root=document.querySelector('#front-menu'),game=window.__game;
  const fighters={
    arco:{name:'ARCO',tag:'THE AETHER ARM',race:'MECHA',portrait:'assets/ui/arco-avatar.webp',art:'assets/menu/arco-select.webp',detail:'Steel resolve. Unbreakable spirit.',basic:'IRON CHAIN',ultimate:'HELIOS SQUADRON',style:'Brawler / drone summon',color:'#8ae3d3'},
    fenr:{name:'FENR',tag:'THE WOLF RANGER',race:'DEMI-HUMAN',portrait:'assets/fenr/ui/portrait-human.webp',art:'assets/menu/fenr-select.webp',detail:'The wild never bows.',basic:'RANGER CHAIN',ultimate:'FERAL AWAKENING',style:'Agile / werewolf transformation',color:'#eab27a'},
    ...(window.Mira&&window.MIRA_MANIFEST?{mira:{name:'MIRA',tag:'THE CANDY PILOT',race:'MECHA',portrait:'assets/mira/ui/portrait.webp',art:'assets/menu/mira-select.webp',detail:'Small pilot. Big robot. Bigger fireworks.',basic:'MITTEN CHAIN',ultimate:'ROCKET PARADE',style:'Heavy mech / rocket barrage',color:'#d9b4ff'}}:{}),
    ...(window.Cora&&window.CORA_MANIFEST?{cora:{name:'CORA',tag:'THE RAVEN DANCER',race:'DEMI-HUMAN',portrait:'assets/cora/ui/portrait.webp',art:'assets/menu/cora-select.webp',detail:'Every feather is a blade.',basic:'FEATHER WALTZ',ultimate:'NIGHT MURMURATION',style:'Agile / raven swarm',color:'#c4a6ff'}}:{}),
    ...(window.Naja&&window.NAJA_MANIFEST?{naja:{name:'NAJA',tag:'THE DUNE COBRA',race:'DEMI-HUMAN',portrait:'assets/naja/ui/portrait.webp',art:'assets/menu/naja-select.webp',detail:'Sways like sand. Strikes like venom.',basic:'VIPER LASH',ultimate:'DUNE SERPENT',style:'Mid-range / urumi whip & sand serpent',color:'#d9b77a'}}:{}),
    ...(window.Haldor&&window.HALDOR_MANIFEST?{haldor:{name:'HALDOR',tag:'THE WALKING FORGE',race:'MECHA',portrait:'assets/haldor/ui/portrait.webp',art:'assets/menu/haldor-select.webp',detail:'Old forge master. Walking furnace. Heavy hammer.',basic:'FORGE CHAIN',ultimate:'FORGE QUAKE',style:'Heavy tank / steam forge hammer',color:'#d9803f'}}:{}),
    ...(window.Zanni&&window.ZANNI_MANIFEST?{zanni:{name:'ZANNI',tag:'THE CLOCKWORK JESTER',race:'MECHA',portrait:'assets/zanni/ui/portrait.webp',art:'assets/menu/zanni-select.webp',detail:'Arms that stretch. Jokes that sting.',basic:'SCISSOR JAB',ultimate:'GRAND FINALE',style:'Trickster / extending scissor-arm strikes and bladed rings',color:'#c9d64a'}}:{}),
    ...(window.Isolde&&window.ISOLDE_MANIFEST?{isolde:{name:'ISOLDE',tag:'THE WHITE STRIDER',race:'MECHA',portrait:'assets/isolde/ui/portrait.webp',art:'assets/menu/isolde-select.webp',detail:'Long legs, longer lance, zero mercy.',basic:'LANCE LINE',ultimate:'SKYFALL LANCES',style:'Long-range lancer / stilt-leg charges',color:'#9fd4ff'}}:{}),
    ...(window.Rhea&&window.RHEA_MANIFEST?{rhea:{name:'RHEA',tag:'THE LITTLE ORRERY',race:'MECHA',portrait:'assets/rhea/ui/portrait.webp',art:'assets/menu/rhea-select.webp',detail:'Homework done. Planets armed. Class dismissed.',basic:'ORBIT STRIKE',ultimate:'GRAND ORRERY',style:'Zoner / orbiting orrery spheres',color:'#c7485e'}}:{}),
    ...(window.Solan&&window.SOLAN_MANIFEST?{solan:{name:'SOLAN',tag:'THE SUNMANE',race:'DEMI-HUMAN',portrait:'assets/solan/ui/portrait.webp',art:'assets/menu/solan-select.webp',detail:'Golden mane, heavy blade, louder roar.',basic:'SUNBLADE',ultimate:'SUNMANE ROAR',style:'Powerhouse / greatsword and roar',color:'#f2b632'}}:{}),
    ...(window.Nib&&window.NIB_MANIFEST?{nib:{name:'NIB',tag:'THE ROOFTOP POST',race:'DEMI-HUMAN',portrait:'assets/nib/ui/portrait.webp',art:'assets/menu/nib-select.webp',detail:'Every letter delivered. Every punch, too.',basic:'BATON FLURRY',ultimate:'SPECIAL DELIVERY',style:'Rushdown / twin courier batons',color:'#8fd4ff'}}:{}),
    ...(window.Edda&&window.EDDA_MANIFEST?{edda:{name:'EDDA',tag:'THE SHELL SAGE',race:'DEMI-HUMAN',portrait:'assets/edda/ui/portrait.webp',art:'assets/menu/edda-select.webp',detail:'Slow to anger, impossible to knock down.',basic:'STAFF FORMS',ultimate:'ELDER TORTOISE',style:'Counter defender / staff and shell guard',color:'#8fe3b4'}}:{})
  };
  // GHOST CLASH: each slot shows its ghost (ghosts.js); art paths stay on the slot until new pictures replace them.
  const GHOSTS=window.GHOSTS||{};
  for(const id of Object.keys(fighters)){const g=GHOSTS[id];if(g)Object.assign(fighters[id],{name:g.name,tag:g.tag,race:g.cls,detail:g.detail,basic:g.names[0],ultimate:g.names[3],style:g.style,color:g.color});}
  // Showcase fighters (assets/showcase/showcase.js) fill roster slots with avatar and art; they cannot be confirmed yet.
  const showcase=Object.fromEntries(Object.entries(window.SHOWCASE_FIGHTERS||{}).filter(([id])=>!fighters[id]));
  const info=id=>fighters[id]||showcase[id],soon=id=>!!showcase[id];
  const ghostOrder=Object.keys(GHOSTS),opened=[...Object.keys(fighters).sort((a,b)=>(ghostOrder.indexOf(a)+99*(ghostOrder.indexOf(a)<0))-(ghostOrder.indexOf(b)+99*(ghostOrder.indexOf(b)<0))),...Object.keys(showcase)];
  // Touch screens have no hover: a tap only previews a fighter; the yellow CONFIRM button picks it.
  const touch=document.documentElement.classList.contains('touch');
  // Phones get a fullscreen button on the home screen (no trip to Settings). Hidden where the page cannot go fullscreen
  // (iPhone Safari); inside the mobile shell the shell's document is the one that goes fullscreen.
  const canFullscreen=touch&&(()=>{try{const d=window.parent!==window?window.parent.document:document;return !!(d.fullscreenEnabled||d.webkitFullscreenEnabled);}catch(_){return false;}})();
  // Until the phone has been fullscreen once (button or the shell's first-touch fullscreen), the button glows.
  const hintKey='aether.fullscreenHint';
  let fullscreenHint=canFullscreen&&(()=>{try{return localStorage.getItem(hintKey)!=='seen';}catch(_){return true;}})();
  function dismissFullscreenHint(){if(!fullscreenHint)return;fullscreenHint=false;try{localStorage.setItem(hintKey,'seen');}catch(_){}root.querySelector('.menu-fullscreen')?.classList.remove('hinted');}
  if(fullscreenHint)try{const d=window.parent!==window?window.parent.document:document;d.addEventListener('fullscreenchange',()=>{if(d.fullscreenElement)dismissFullscreenHint();});}catch(_){}
  // Warm the small roster portraits so the grid appears at once. The large select art and arena pictures are fetched when
  // shown and then come from the browser cache; holding all of them decoded would waste a phone's image memory.
  const warm=opened.map(id=>info(id).portrait).filter(Boolean).map(src=>{const im=new Image();im.decoding='async';im.src=src;return im;});
  const roster=[...opened,...Array.from({length:Math.max(0,12-opened.length)},(_,i)=>'locked-'+i)];
  // lockIn: the pending step change while a confirmed fighter flashes 3 times (PICK_FLASH s each); input waits for it.
  const PICK_FLASH=.3;let lockIn=null,lockTicks=[];
  let onlineTarget=null,onlineInvite=null;
  let screen='home',step=0,mode='versus',player='isolde',enemy='edda',hover='isolde',stage='bellora',level='medium',result=null,interacted=false,lastSound=0;
  const reducedMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)');
  let backgroundEnabled=false,backgroundVideo=null,videoPlayToken=0;
  const backgroundToggle=document.querySelector('#menu-video-toggle');
  function shouldAnimate(){return backgroundEnabled && screen==='home' && !root.hidden && !document.hidden && !game.snapshot().settingsOpen;}
  function syncBackground(){
    if(!backgroundVideo)return;const token=++videoPlayToken;
    if(!shouldAnimate()){backgroundVideo.pause();return;}
    if(backgroundVideo.paused){const p=backgroundVideo.play();p?.catch(()=>{if(token===videoPlayToken)backgroundVideo.dataset.state='autoplay-blocked';});}
  }
  function attachBackground(){
    if(screen!=='home')return;
    if(!backgroundVideo && backgroundEnabled){
      backgroundVideo=document.createElement('video');backgroundVideo.id='menu-background-video';backgroundVideo.className='menu-background-video';
      backgroundVideo.muted=true;backgroundVideo.defaultMuted=true;backgroundVideo.autoplay=true;backgroundVideo.loop=true;backgroundVideo.playsInline=true;backgroundVideo.preload='auto';
      backgroundVideo.setAttribute('muted','');backgroundVideo.setAttribute('playsinline','');backgroundVideo.setAttribute('aria-hidden','true');backgroundVideo.tabIndex=-1;backgroundVideo.disablePictureInPicture=true;
      backgroundVideo.poster='assets/menu/home-factions.webp';backgroundVideo.dataset.state='loading';
      backgroundVideo.addEventListener('playing',()=>{if(!shouldAnimate()){backgroundVideo.pause();return;}backgroundVideo.classList.add('is-playing');backgroundVideo.dataset.state='playing';});
      backgroundVideo.addEventListener('error',()=>{backgroundVideo.classList.remove('is-playing');backgroundVideo.dataset.state='poster-fallback';});
      backgroundVideo.src='assets/menu/home-factions-loop.mp4';
    }
    if(backgroundVideo)root.querySelector('.home-art')?.prepend(backgroundVideo);
    syncBackground();
  }
  if(backgroundToggle){backgroundToggle.checked=backgroundEnabled;backgroundToggle.onchange=e=>{backgroundEnabled=e.target.checked;attachBackground();syncBackground();};}
  document.addEventListener('visibilitychange',syncBackground);
  function sfx(kind='move',explicit=false){if(!interacted&&!explicit)return;interacted=true;const now=performance.now();if(kind==='move'&&now-lastSound<75)return;lastSound=now;game.menuSound(kind);}
  root.addEventListener('pointerdown',()=>{interacted=true;},true);
  const brand='<span class="wordmark dedemit-wordmark">Perang<span>Dedemit</span></span>';
  const footer=()=>'<footer class="menu-footer"><span><kbd>W A S D</kbd> / <kbd>↑ ↓ ← →</kbd> pilih &nbsp; <kbd>ENTER</kbd> konfirmasi &nbsp; <kbd>ESC</kbd> kembali</span><span>Main lokal</span></footer>';
  function navHeader(title,subtitle){return `<header class="select-header"><button class="menu-back" data-cmd="back" aria-label="Kembali">← <span>Kembali</span></button><div><span class="eyebrow">${subtitle}</span><h1>${title}</h1></div>${brand}</header>`;}
  function fighterPanel(id,side){const f=info(id);return `<div class="fighter-plinth ${side} ${f?'':'unknown'} ${soon(id)?'soon':''}"><div class="plinth-light"></div><span class="side-tag">${side==='player'?'P1 / dedemitmu':mode==='local2p'?'P2 / dedemit lawan':'CPU / lawanmu'}</span><img class="selection-art" src="${f?.art||'assets/menu/locked.svg'}" alt="${f?.name||'Karakter belum dipilih'}"><div class="fighter-copy"><span>${f?.tag||'Menunggu lawan'}</span><h2>${f?.name||'???'}</h2><p>${f?.race||'Belum dipilih'}</p><small>${f?.detail||'Pilih dedemit di tengah layar.'}</small></div></div>`;}
  // Kitab Dedemit: one page per faction, an entry per dedemit with its legend, its four moves and its super ultimate
  // (ghosts.js SUPERS, art from assets/ghosts/super/manifest.js).
  const titleCase=t=>t.toLowerCase().replace(/(^|[\s-])(\S)/g,(m,a,b)=>a+b.toUpperCase()).replace(/ (Ke|Di|Dari|Dan) /g,(m,w)=>' '+w.toLowerCase()+' ');
  function kitabPages(){
    const keys=['Spasi','I','O','P'];
    return Object.entries(window.GHOST_FACTIONS||{}).map(([fid,fac])=>`<section class="kitab-faction" data-faction="${fid}"><header><h2>${titleCase(fac.label)}</h2><p>${fac.blurb}</p></header><div class="kitab-grid">${Object.entries(GHOSTS).filter(([id,g])=>g.faction===fid&&fighters[id]).map(([id,g])=>`<article class="kitab-entry" style="--ghost:${g.color}"><img src="${fighters[id].portrait}" alt="Portrait ${titleCase(g.name)}"><div><h3>${titleCase(g.name)}</h3><p class="kitab-asal">${g.origin}</p><p class="kitab-lore">${g.lore}</p><dl class="kitab-jurus">${g.names.map((n,k)=>`<div><dt><kbd>${keys[k]}</kbd>${titleCase(n)}</dt><dd>${g.moves?.[k]||''}</dd></div>`).join('')}${g.super?`<div class="kitab-super"><dt><kbd>U</kbd>${titleCase(g.super.name)}</dt><dd>${g.super.lore} <em>Super ultimate, terbuka saat energi sukma penuh.</em></dd></div>`:''}</dl></div>${g.super&&window.SUPER_ASSETS?.[id]?.cutin?`<figure class="kitab-super-art"><img loading="lazy" src="${window.SUPER_ASSETS[id].cutin}" alt="${titleCase(g.name)}: ${titleCase(g.super.name)}"><figcaption><small>Super Ultimate</small>${titleCase(g.super.name)}</figcaption></figure>`:''}</article>`).join('')}</div></section>`).join('');
  }
  // ---- Online (online.js, stage 1): Google sign-in, friend code, friends. window.DedemitOnline appears once the module
  // has loaded; until then (or offline) the page says so instead of failing.
  const O=()=>window.DedemitOnline;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const avatar=(photo,name)=>photo?`<img class="ol-avatar" src="${esc(photo)}" alt="" referrerpolicy="no-referrer">`:`<span class="ol-avatar ol-initial">${esc((name||'?').trim()[0]||'?')}</span>`;
  const googleMark='<svg class="ol-g" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.2l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 2.9-2.2 5.4-4.7 7.1l7.6 5.9c4.4-4.1 6.9-10.1 6.9-17.5z"/><path fill="#FBBC05" d="M10.6 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.8l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.2 0-11.5-4.1-13.4-9.8l-7.9 6.1C6.6 42.6 14.6 48 24 48z"/></svg>';
  function accountChip(){
    const st=O()?.state;if(!st?.ready)return '';
    return st.user?`<button class="ol-chip" data-cmd="friends" title="Akun dan teman">${avatar(st.profile?.photo||st.user.photo,st.profile?.name||st.user.name)}<span>${esc(st.profile?.name||st.user.name)}</span></button>`:`<button class="ol-chip" data-cmd="friends">${googleMark}<span>Masuk</span></button>`;
  }
  // A challenge from a friend shows on every menu screen until it is answered or expires.
  function inviteBanner(){
    const st=O()?.state,inv=st?.invites?.[0];
    if(!inv||st.net.status==='connecting'||st.net.status==='playing'||st.net.status==='waiting'||(mode==='online-guest'&&onlineInvite?.id===inv.id))return '';
    return `<aside class="ol-invite" role="alertdialog" aria-label="Tantangan dari ${esc(inv.hostName)}">${avatar(inv.hostPhoto,inv.hostName)}<span><b>${esc(inv.hostName)}</b> menantangmu bertarung!<small>${esc(MatchRules.stages[inv.stage]?.name||'')}</small></span><button class="ol-btn ol-primary" data-cmd="invite-accept" data-id="${esc(inv.id)}">Terima</button><button class="ol-btn" data-cmd="invite-decline" data-id="${esc(inv.id)}">Tolak</button></aside>`;
  }
  function onlinePage(){
    const n=O()?.state.net||{status:'failed',message:'Layanan online belum tersedia.'};
    const text=n.status==='waiting'?`Menunggu <b>${esc(n.peer)}</b> menerima tantangan…`:n.status==='connecting'?`Menyambungkan ke <b>${esc(n.peer)}</b>…`:n.status==='playing'?'Memulai pertarungan…':esc(n.message||'Tantangan selesai.');
    const busy=n.status==='waiting'||n.status==='connecting';
    return `<div class="ol-layout"><section class="ol-panel ol-wait"><div class="ol-spinner ${busy?'':'done'}" aria-hidden="true"></div><p role="status">${text}</p>${busy?'<small class="ol-hint">Tantangan berlaku 90 detik. Kalau koneksi gagal, coba jaringan lain.</small><button class="ol-btn" data-cmd="online-cancel">Batalkan</button>':'<button class="ol-btn ol-primary" data-cmd="friends">Kembali ke Teman</button>'}</section></div>`;
  }
  function friendsPage(){
    const o=O(),st=o?.state;
    if(!o||!st.ready)return `<div class="ol-layout"><section class="ol-panel"><p>${o?'Memeriksa akun…':'Layanan online sedang dimuat. Kalau tidak muncul, periksa koneksi internet lalu muat ulang.'}</p></section></div>`;
    const status=st.error?`<p class="ol-status error" role="alert">${esc(st.error)}</p>`:st.notice?`<p class="ol-status" role="status">${esc(st.notice)}</p>`:'';
    if(!st.user)return `<div class="ol-layout"><section class="ol-panel ol-signin"><h2>Main bersama teman</h2><p>Masuk dengan akun Google untuk mendapat kode teman, menambah teman, dan menantang mereka bertarung online.</p>${status}<button class="ol-google" data-cmd="signin" ${st.busy?'disabled':''}>${googleMark}<span>Masuk dengan Google</span></button><small class="ol-privacy">Yang disimpan hanya nama, foto profil Google, dan kode temanmu, supaya teman bisa menemukanmu. Email tidak ditampilkan ke pemain lain.</small></section></div>`;
    const p=st.profile||{};
    const item=(photo,name,sub,buttons,cls='')=>`<li class="${cls}">${avatar(photo,name)}<span class="ol-who">${esc(name)}<small>${sub}</small></span><span class="ol-actions">${buttons}</span></li>`;
    return `<div class="ol-layout">
      <section class="ol-panel ol-me">${avatar(p.photo||st.user.photo,p.name)}<div class="ol-me-fields">
        <label for="ol-name">Nama tampilan</label><div class="ol-row"><input id="ol-name" maxlength="24" autocomplete="nickname" value="${esc(p.name)}"><button class="ol-btn" data-cmd="save-name" ${st.busy?'disabled':''}>Simpan</button></div>
        <span class="ol-label">Kode temanmu</span><div class="ol-row"><strong class="ol-code">${esc(p.code||'…')}</strong><button class="ol-btn" data-cmd="copy-code">Salin</button></div>
        <small class="ol-hint">Bagikan kode ini ke temanmu, atau masukkan kode mereka di sebelah.</small>
      </div><button class="ol-btn ol-signout" data-cmd="signout">Keluar</button></section>
      <section class="ol-panel"><h2>Tambah teman</h2><div class="ol-row"><input id="ol-add" placeholder="DMT-XXXX" maxlength="9" autocomplete="off" spellcheck="false" aria-label="Kode teman"><button class="ol-btn ol-primary" data-cmd="add-friend" ${st.busy?'disabled':''}>Tambah</button></div>${status}${st.net.message&&st.net.status!=='playing'?`<p class="ol-status ${st.net.status==='idle'?'':'error'}" role="status">${esc(st.net.message)}</p>`:''}
        ${st.incoming.length?`<h3>Permintaan masuk</h3><ul class="ol-list">${st.incoming.map(r=>item(r.fromPhoto,r.fromName,esc(r.fromCode),`<button class="ol-btn ol-primary" data-cmd="accept" data-uid="${esc(r.from)}">Terima</button><button class="ol-btn" data-cmd="decline" data-uid="${esc(r.from)}">Tolak</button>`)).join('')}</ul>`:''}
        ${st.outgoing.length?`<h3>Menunggu jawaban</h3><ul class="ol-list">${st.outgoing.map(r=>item(r.toPhoto,r.toName,esc(r.toCode),`<button class="ol-btn" data-cmd="cancel" data-uid="${esc(r.to)}">Batalkan</button>`)).join('')}</ul>`:''}
      </section>
      <section class="ol-panel ol-friends"><h2>Teman <small>${st.friends.length}</small></h2>${st.friends.length?`<ul class="ol-list">${st.friends.map(f=>item(f.photo,f.name,`<i class="ol-dot"></i>${f.online?'Online':'Offline'} · ${esc(f.code)}`,`<button class="ol-btn ol-primary" data-cmd="challenge" data-uid="${esc(f.uid)}" data-name="${esc(f.name)}" ${f.online&&(st.net.status==='idle'||st.net.status==='failed'||st.net.status==='declined')?'':'disabled'} title="${f.online?'Tantang bertarung online':'Teman sedang offline'}">Tantang</button><button class="ol-btn ol-remove" data-cmd="remove-friend" data-uid="${esc(f.uid)}" data-name="${esc(f.name)}" aria-label="Hapus ${esc(f.name)} dari teman">✕</button>`,f.online?'online':'')).join('')}</ul>`:'<p class="ol-empty">Belum ada teman. Bagikan kode temanmu, atau masukkan kode teman di panel Tambah teman.</p>'}</section>
    </div>`;
  }
  function render(){
    if(lockIn){clearTimeout(lockIn);lockIn=null;}for(const t of lockTicks)clearTimeout(t);lockTicks=[];
    if(backgroundVideo){videoPlayToken++;backgroundVideo.pause();backgroundVideo.remove();}
    root.dataset.screen=screen;root.dataset.step=String(step);root.dataset.mode=mode;
    if(screen==='home'){
      root.innerHTML=`<div class="home-art"></div><div class="menu-grain"></div><header class="home-top"><span></span><span class="home-top-right"><span class="ol-chip-slot">${accountChip()}</span>${installButton()}<span class="build-tag">Versi demo</span>${canFullscreen?`<button class="menu-fullscreen${fullscreenHint?' hinted':''}" data-cmd="fullscreen" aria-label="Layar penuh" title="Layar penuh"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button>`:''}</span></header><div class="home-content"><div class="home-title dedemit-title"><h1>Perang<br>Dedemit</h1><p>Dua belas dedemit Nusantara bertarung di tempat paling angker. Yang masih berdiri saat ayam berkokok, dialah yang menang.</p></div><nav class="home-nav" aria-label="Menu utama"><button data-cmd="versus"><span class="nav-index"></span><span>Lawan komputer<small>Pilih dedemitmu, lalu tantang yang lain.</small></span><b>↗</b></button>${touch?'':'<button data-cmd="local2p"><span class="nav-index"></span><span>Dua pemain<small>Dua orang, satu keyboard. Siapa yang lebih sakti?</small></span><b>↗</b></button>'}<button data-cmd="training"><span class="nav-index"></span><span>Latihan<small>Pelajari jurus tanpa batas waktu.</small></span><b>↗</b></button><button data-cmd="friends"><span class="nav-index"></span><span>Teman<small>Masuk dengan Google, tambah teman lewat kode.</small></span><b>↗</b></button><button data-cmd="about"><span class="nav-index"></span><span>Kitab Dedemit<small>Asal-usul dan jurus dua belas dedemit.</small></span><b>↗</b></button><button data-cmd="settings"><span class="nav-index"></span><span>Pengaturan</span><b>↗</b></button></nav></div><div class="home-caption"><span>Makhluk Halus</span><i>lawan</i><span>Ilmu Hitam</span></div><footer class="home-footer"><span></span><span id="menu-ready">${game.snapshot().ready?'Siap bertarung':'Menyiapkan arena…'}</span></footer>`;
    } else if(screen==='select'){
      root.innerHTML=`<div class="selection-backdrop"></div>${navHeader(step===0?'Pilih dedemitmu':'Pilih lawanmu',mode==='versus'?'Lawan komputer':mode==='local2p'?'Dua pemain':mode==='online'?'Tantang '+(onlineTarget?.name||'teman'):mode==='online-guest'?'Tantangan dari '+(onlineInvite?.hostName||'teman'):'Latihan')}<div class="selection-steps"><span class="${step===0?'current':'done'}">01 <b>Pemain</b></span><i></i><span class="${step===1?'current':''}">02 <b>Lawan</b></span><i></i><span>03 <b>Arena</b></span></div><div class="select-stage"><div id="player-preview">${fighterPanel(step===0?hover:player,'player')}</div><div class="roster-center"><div class="roster-caption"><strong>${step===0?'Pemain 1':mode==='local2p'?'Pemain 2':'Komputer'}</strong><span>Dua belas dedemit</span></div><div class="roster-grid" role="group" aria-label="Roster karakter">${roster.map((id,i)=>{const f=info(id);return `<button class="roster-tile ${id===hover?'highlight':''} ${!f?'locked':''} ${soon(id)?'soon':''}" data-fighter="${id}" aria-label="${f?f.name+' — '+f.race+(soon(id)?', belum bisa dimainkan':''):'Slot '+(i+1)+' terkunci'}" aria-disabled="${!fighters[id]}"><img class="${f?'portrait-image':''}" data-portrait-side="${step===1?'enemy':'player'}" src="${f?.portrait||'assets/menu/locked.svg'}" alt=""><span>${f?.name||'LOCKED'}</span><b>${step===1&&id===player?'P1':''}</b></button>`;}).join('')}</div><div id="fighter-moves" class="fighter-moves"></div><button class="menu-primary confirm-fighter" data-cmd="confirm">${step===0?'Pilih dedemit ini':'Pilih lawan ini'} <b>→</b></button><p id="roster-notice" class="roster-notice" aria-live="polite">${roster.length>opened.length?(roster.length-opened.length)+' slot masih kosong.':''}</p></div><div id="enemy-preview">${fighterPanel(step===1?hover:null,'enemy')}</div></div>${footer()}`;
      updatePreview(false);
    } else if(screen==='arena'){
      const st=MatchRules.stages[stage];root.innerHTML=`<div class="arena-screen-bg" style="background-image:url('${st.image}')"></div>${navHeader('Pilih arena',mode==='versus'?'Lawan komputer':mode==='local2p'?'Dua pemain':mode==='online'?'Tantang '+(onlineTarget?.name||'teman'):mode==='online-guest'?'Tantangan dari '+(onlineInvite?.hostName||'teman'):'Latihan')}<div class="arena-content"><div class="versus-strip"><div><img class="portrait-image" data-portrait-side="player" src="${fighters[player].portrait}" alt=""><span>P1<strong>${fighters[player].name}</strong></span></div><b>VS</b>${mode==='online'?`<div><span>Teman<strong>${esc(onlineTarget?.name||'')}</strong></span><img class="portrait-image" data-portrait-side="enemy" src="assets/menu/locked.svg" alt=""></div>`:`<div><span>${mode==='local2p'?'P2':'CPU'}<strong>${fighters[enemy].name}</strong></span><img class="portrait-image" data-portrait-side="enemy" src="${fighters[enemy].portrait}" alt=""></div>`}</div><div class="arena-window"><span class="arena-number">${String(Object.keys(MatchRules.stages).indexOf(stage)+1).padStart(2,'0')} / ${String(Object.keys(MatchRules.stages).length).padStart(2,'0')}</span><div><small>${st.tag}</small><h2>${st.name}</h2></div><span class="arena-day">✦ ${st.time||'MALAM'}</span></div><div class="arena-tiles" role="group" aria-label="Pilih arena">${Object.entries(MatchRules.stages).map(([id,a])=>`<button class="arena-tile ${id===stage?'selected':''}" data-stage="${id}" aria-pressed="${id===stage}"><img src="${a.image}" alt=""><span>${a.name}</span></button>`).join('')}</div><div class="match-options"><div class="difficulty-area"><span class="eyebrow">${mode==='versus'?'Tingkat kesulitan':mode==='local2p'?'Dua pemain':mode==='online'?'Tarung online':'Mode latihan'}</span>${mode==='versus'?`<div class="difficulty-buttons" role="group" aria-label="Tingkat kesulitan">${Object.entries(MatchRules.difficulties).map(([id,d],i)=>`<button data-level="${id}" class="${id===level?'selected':''}" aria-pressed="${id===level}"><i>${'▰'.repeat(i+1)}</i>${d.label}</button>`).join('')}</div>`:mode==='online'?'<p class="training-note">Temanmu memilih dedemitnya setelah menerima tantangan. Kamu memilih arenanya.</p>':mode==='local2p'?'<p class="training-note">P1: <b>W A S D</b> + <b>F G H T Y</b> (atau Spasi I O P U). P2: <b>panah</b> + <b>/ . , M N</b> (atau Numpad 0–4).</p>':'<p class="training-note">Tanpa batas waktu. Lawan diam kecuali diaktifkan di Pengaturan. Tekan R untuk mengulang.</p>'}</div><div class="match-rules">${mode==='versus'||mode==='local2p'||mode==='online'?'<b>Dua kali menang</b><span>Tiga ronde, masing-masing 90 detik</span>':'<b>Asah kombomu</b><span>Penghitung kombo dan semua jurus</span>'}</div></div><button class="controls-link" data-cmd="controls" type="button">Lihat kontrol</button><button class="menu-primary start-battle" data-cmd="start" ${game.snapshot().ready?'':'disabled'}>${game.snapshot().ready?(mode==='online'?'Kirim tantangan':mode==='versus'||mode==='local2p'?'Mulai bertarung':'Mulai latihan'):'Menyiapkan arena…'} <b>↗</b></button><p id="setup-error" role="status"></p></div>${footer()}`;
    } else if(screen==='online'){
      root.innerHTML=`<div class="home-art dim"></div>${navHeader('Tarung online',mode==='online-guest'?'Menerima tantangan':'Menantang teman')}${onlinePage()}`;
    } else if(screen==='friends'){
      root.innerHTML=`<div class="home-art dim"></div>${navHeader('Teman','Akun dan pertemanan')}${friendsPage()}`;
    } else if(screen==='about'){
      root.innerHTML=`<div class="home-art dim"></div>${navHeader('Kitab Dedemit','Asal-usul dan jurus')}<article class="kitab">${kitabPages()}<footer class="kitab-foot"><small>Engine dan aset awal: Aether Clash oleh Bang Tutorial (CC BY-NC 4.0). Huruf: Rajdhani dan IM Fell English (SIL OFL).</small><button class="menu-primary" data-cmd="home">Kembali ke menu utama <b>↗</b></button></footer></article>`;
    } else if(screen==='result'){
      const won=result.online?(result.online.role==='host')===(result.winner==='player'):result.winner==='player',winner=result.winner==='player'?result.player:result.enemy;root.innerHTML=`<div class="result-bg"></div>${navHeader('Pertarungan selesai',MatchRules.stages[result.stage].name.toUpperCase())}<div class="result-layout"><img class="result-fighter" src="${fighters[winner].art}" alt="${fighters[winner].name}"><div class="result-copy"><span class="eyebrow">${result.online?(won?'Kamu':esc(result.online.peer||'Lawan')):won?'Pemain 1':result.local2p?'Pemain 2':'Komputer'} memenangkan pertarungan</span><h1>${result.local2p?(won?'P1 Menang':'P2 Menang'):won?'Menang':'Kalah'}</h1><p>${fighters[winner].name} menang</p><div class="final-score"><span>${result.playerWins}</span><i>—</i><span>${result.enemyWins}</span></div><small>${fighters[result.player].name} vs ${fighters[result.enemy].name} · ${result.online?'Tarung online':result.local2p?'Dua pemain':MatchRules.difficulties[result.level].label}</small>${result.online?'<button class="menu-primary" data-cmd="friends">Kembali ke Teman <b>↗</b></button>':'<button class="menu-primary" data-cmd="rematch">Tanding ulang <b>↗</b></button><button class="result-secondary" data-cmd="reselect">Pilih dedemit</button>'}<button class="result-secondary" data-cmd="home">Menu utama</button></div></div>`;
    }
    root.insertAdjacentHTML('beforeend',`<div class="ol-invite-slot">${inviteBanner()}</div>`);
    bind();attachBackground();
  }
  function updatePreview(play=true){
    root.querySelectorAll('[data-fighter]').forEach(b=>b.classList.toggle('highlight',b.dataset.fighter===hover));
    const panel=root.querySelector(step===0?'#player-preview':'#enemy-preview');if(panel)panel.innerHTML=fighterPanel(hover,step===0?'player':'enemy');
    const f=info(hover),moves=root.querySelector('#fighter-moves');if(moves)moves.innerHTML=f?`<span>${f.style}</span>${soon(hover)?'':`<b>${f.ultimate}</b>`}`:'<span>Slot kosong</span><b>Menyusul</b>';
    const confirm=root.querySelector('.confirm-fighter');if(confirm)confirm.setAttribute('aria-disabled',String(!fighters[hover]));if(play)sfx('move');
  }
  function focusFighter(id){if(hover===id||lockIn)return;hover=id;updatePreview();}
  function confirm(){if(lockIn)return;if(!fighters[hover]){sfx('locked',true);root.querySelector('#roster-notice').textContent=soon(hover)?showcase[hover].name+' belum bisa dimainkan.':'Karakter ini belum terbuka.';return;}
    // The pick flashes 3 times (tile and big art) with a lock-in chime before the next step, so the screen does not jump.
    sfx('pick',true);game.announceSelection(hover);root.dataset.picking='true';
    root.querySelector(`[data-fighter="${hover}"]`)?.classList.add('picked');root.querySelector(step===0?'#player-preview':'#enemy-preview')?.classList.add('picked');
    lockTicks=[1,2].map(i=>setTimeout(()=>sfx('blink',true),i*PICK_FLASH*1000));
    lockIn=setTimeout(()=>{lockIn=null;delete root.dataset.picking;if(step===0&&mode==='online'){player=hover;screen='arena';step=2;render();return;}if(step===0&&mode==='online-guest'){player=hover;O()?.acceptChallenge(onlineInvite?.id,player);screen='online';render();return;}if(step===0){player=hover;step=1;hover=player==='edda'?'isolde':'edda';}else{enemy=hover;screen='arena';step=2;}render();},3*PICK_FLASH*1000);
  }
  function back(){if(lockIn)return;game.stopAnnouncer();sfx('back',true);if(screen==='online'){O()?.cancelChallenge();screen='friends';render();return;}if(screen==='select'&&step===0&&(mode==='online'||mode==='online-guest')){if(mode==='online-guest')O()?.declineChallenge(onlineInvite?.id);screen='friends';render();return;}if(screen==='arena'){screen='select';step=1;hover=enemy;}else if(screen==='select'&&step===1){step=0;hover=player;}else screen='home';render();}
  // First fight: the controls card opens before the match starts (once; 'Lihat kontrol' on the arena screen reopens it).
  const controlsDialog=document.querySelector('#controls-intro'),seenKey='dedemit.controlsSeen';let seenHere=false;
  function controlsSeen(){if(seenHere)return true;try{return localStorage.getItem(seenKey)==='1';}catch(_){return false;}}
  // The game's own Esc (pause) handling swallows the dialog's native cancel, so Esc closes it here.
  controlsDialog?.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();controlsDialog.close('');}});
  function showControls(then){
    if(!controlsDialog?.showModal){then?.();return;}
    const go=controlsDialog.querySelector('#controls-go');
    go.innerHTML=then?'Siap bertarung <b>↗</b>':'Mengerti <b>↗</b>';
    go.onclick=()=>{seenHere=true;try{localStorage.setItem(seenKey,'1');}catch(_){}controlsDialog.close('go');};
    controlsDialog.onclose=()=>{const ok=controlsDialog.returnValue==='go';controlsDialog.returnValue='';if(ok&&then)then();else root.querySelector('[data-cmd="start"]')?.focus();};
    sfx('confirm',true);controlsDialog.showModal();go.focus();
  }
  // Install (PWA). The offer belongs to the top page (mobile.html on phones); see pwa.js.
  const host=(()=>{try{return window.parent!==window&&window.parent.document?window.parent:window;}catch(_){return window;}})();
  const ios=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  function installState(){
    try{if(host.matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches||host.navigator.standalone||host.__dedemitInstalled)return 'installed';}catch(_){}
    if(host.__dedemitInstall)return 'prompt';
    return ios?'ios':'none';
  }
  function installButton(){const st=installState();return st==='prompt'||st==='ios'?'<button class="install-pill" data-cmd="install" type="button"><img src="assets/brand/favicon-64.png" alt="">Pasang game</button>':'';}
  async function install(){
    const st=installState();
    if(st==='prompt'){const ev=host.__dedemitInstall;host.__dedemitInstall=null;try{await ev.prompt();await ev.userChoice;}catch(_){}if(screen==='home')render();return;}
    if(st==='ios'){const d=document.querySelector('#install-help');if(d?.showModal){sfx('confirm',true);d.showModal();d.querySelector('#install-ok').focus();}}
  }
  {const d=document.querySelector('#install-help');if(d){d.querySelector('#install-ok').onclick=()=>d.close();d.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();d.close();}});}}
  try{host.addEventListener('dedemit-installable',()=>{if(screen==='home'&&!lockIn)render();});}catch(_){}
  function start(){if(mode==='online'){O()?.challenge(onlineTarget,{char:player,stage});screen='online';render();return;}if(game.startMatch({player,enemy,stage,level,mode:mode==='local2p'?'versus':mode,local2p:mode==='local2p'})){document.querySelector('#arena').focus();}else {const error=root.querySelector('#setup-error');if(error)error.textContent='Aset belum siap. Tunggu sebentar lalu coba lagi.';sfx('locked',true);}}
  function command(cmd,el){
    if(lockIn)return;
    const o=O();
    if(cmd==='friends'){sfx('confirm',true);o?.clearStatus?.();screen='friends';render();return;}
    if(cmd==='signin'){sfx('confirm',true);o?.signIn();return;}
    if(cmd==='signout'){sfx('back',true);o?.signOut();return;}
    if(cmd==='save-name'){sfx('confirm',true);o?.setName(root.querySelector('#ol-name')?.value||'');return;}
    if(cmd==='add-friend'){sfx('confirm',true);o?.addFriend(root.querySelector('#ol-add')?.value||'');return;}
    if(cmd==='copy-code'){const code=o?.state.profile?.code;if(code){navigator.clipboard?.writeText(code).then(()=>{if(el)el.textContent='Tersalin';}).catch(()=>{});sfx('confirm',true);}return;}
    if(cmd==='accept'||cmd==='decline'||cmd==='cancel'){sfx(cmd==='accept'?'confirm':'back',true);o?.[cmd](el?.dataset.uid);return;}
    if(cmd==='challenge'){sfx('confirm',true);o?.clearNet?.();onlineTarget={uid:el?.dataset.uid,name:el?.dataset.name||'teman'};mode='online';screen='select';step=0;hover=player;render();return;}
    if(cmd==='invite-accept'){sfx('confirm',true);onlineInvite=o?.state.invites.find(m=>m.id===el?.dataset.id)||null;if(!onlineInvite)return;if(!game.snapshot().menuOpen)return;mode='online-guest';screen='select';step=0;hover=player;render();return;}
    if(cmd==='invite-decline'){sfx('back',true);o?.declineChallenge(el?.dataset.id);return;}
    if(cmd==='online-cancel'){sfx('back',true);o?.cancelChallenge();screen='friends';render();return;}
    if((cmd==='rematch'||cmd==='reselect')&&result?.online){sfx('confirm',true);screen='friends';render();return;}
    if(cmd==='remove-friend'){if(window.confirm(`Hapus ${el?.dataset.name||'teman ini'} dari daftar teman? Kalian bisa berteman lagi lewat kode.`))o?.removeFriend(el?.dataset.uid);return;}
    if(cmd==='controls'){showControls(null);return;}
    if(cmd==='install'){install();return;}
    if(cmd==='fullscreen'){sfx('move',true);dismissFullscreenHint();game.toggleFullscreen?.();return;}
    if(cmd==='confirm'){confirm();return;}if(cmd==='back'){back();return;}sfx('confirm',true);
    if(cmd==='versus'||cmd==='training'||cmd==='local2p'){mode=cmd;screen='select';step=0;hover=player;render();}
    if(cmd==='settings')game.openSettings();if(cmd==='about'){screen='about';render();}
    if(cmd==='home'){game.stopAnnouncer();screen='home';render();}if(cmd==='start'){if(mode==='online'||controlsSeen())start();else showControls(start);}
    if(cmd==='rematch'){({player,enemy,stage,level,mode}=result);if(result.local2p)mode='local2p';start();}
    if(cmd==='reselect'){screen='select';step=0;hover=player;render();}
  }
  function bind(){
    root.querySelector('#ol-add')?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();command('add-friend');}});
    root.querySelector('#ol-name')?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();command('save-name');}});
    root.querySelectorAll('[data-cmd]').forEach(b=>{b.onclick=()=>command(b.dataset.cmd,b);b.onpointerenter=()=>sfx('move');b.onfocus=()=>sfx('move');});
    root.querySelectorAll('[data-fighter]').forEach(b=>{b.onpointerenter=()=>focusFighter(b.dataset.fighter);b.onfocus=()=>focusFighter(b.dataset.fighter);b.onclick=()=>{focusFighter(b.dataset.fighter);if(!touch)confirm();};});
    root.querySelectorAll('[data-stage]').forEach(b=>b.onclick=()=>{stage=b.dataset.stage;sfx('move',true);render();root.querySelector(`[data-stage="${stage}"]`).focus();});
    root.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{level=b.dataset.level;sfx('move',true);render();root.querySelector(`[data-level="${level}"]`).focus();});
  }
  document.addEventListener('keydown',e=>{
    if(root.hidden||document.querySelector('dialog[open]')||e.repeat)return;interacted=true;
    if(lockIn){e.preventDefault();return;}
    if(e.key==='Escape'){e.preventDefault();back();return;}
    if(screen==='select'&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','a','d','w','s'].includes(e.key)){e.preventDefault();const offset={ArrowLeft:-1,a:-1,ArrowRight:1,d:1,ArrowUp:-4,w:-4,ArrowDown:4,s:4}[e.key],i=(roster.indexOf(hover)+offset+roster.length)%roster.length;focusFighter(roster[i]);root.querySelector(`[data-fighter="${hover}"]`).focus();return;}
    if(screen==='select'&&(e.key==='Enter'||e.key===' ')){const cmd=e.target.closest?.('[data-cmd]')?.dataset.cmd;if(cmd&&cmd!=='confirm')return;e.preventDefault();confirm();return;}
    if(screen==='arena'&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','a','d','w','s'].includes(e.key)){
      e.preventDefault();const levels=Object.keys(MatchRules.difficulties),stages=Object.keys(MatchRules.stages),vertical=['ArrowUp','ArrowDown','w','s'].includes(e.key),backward=['ArrowLeft','ArrowUp','a','w'].includes(e.key);
      if(vertical&&mode==='versus'){level=levels[(levels.indexOf(level)+(backward?-1:1)+levels.length)%levels.length];}else{stage=stages[(stages.indexOf(stage)+(backward?-1:1)+stages.length)%stages.length];}sfx('move');render();return;
    }
    if(screen==='arena'&&e.key==='Enter'&&!e.target.closest?.('button')){e.preventDefault();command('start');return;}
    if(screen==='home'&&e.key==='Enter'&&!e.target.closest?.('button')){e.preventDefault();command('versus');return;}
    if(screen==='home'&&['ArrowUp','ArrowDown','w','s'].includes(e.key)){e.preventDefault();const list=[...root.querySelectorAll('.home-nav button')],current=list.indexOf(document.activeElement),next=(current+(['ArrowUp','w'].includes(e.key)?-1:1)+list.length)%list.length;list[next].focus();}
  });
  // Account changes: refresh the friends page (keeping what is typed and the focus) or just the chip on the home screen.
  window.addEventListener('dedemit-online',()=>{
    if(root.hidden||lockIn)return;
    const islot=root.querySelector('.ol-invite-slot');if(islot&&screen!=='friends'){islot.innerHTML=inviteBanner();islot.querySelectorAll('[data-cmd]').forEach(b=>b.onclick=()=>command(b.dataset.cmd,b));}
    if(screen==='online'){render();return;}
    if(screen==='home'){const slot=root.querySelector('.ol-chip-slot');if(slot){slot.innerHTML=accountChip();slot.querySelectorAll('[data-cmd]').forEach(b=>b.onclick=()=>command(b.dataset.cmd,b));}return;}
    if(screen!=='friends')return;
    const st=O()?.state,add=root.querySelector('#ol-add'),name=root.querySelector('#ol-name'),focus=document.activeElement?.id;
    const keepAdd=add&&!st?.notice?add.value:'',keepName=name&&focus==='ol-name'?name.value:null;
    render();
    const add2=root.querySelector('#ol-add');if(add2)add2.value=keepAdd;
    if(keepName!=null&&root.querySelector('#ol-name'))root.querySelector('#ol-name').value=keepName;
    if(focus)root.querySelector('#'+focus)?.focus();
  });
  window.FrontEnd={syncBackground,home(){screen='home';game.setMenuOpen(true);render();},onlineEnded(reason){screen='friends';render();},showResult(data){result=data;({player,enemy,stage,level,mode}=data);if(data.local2p)mode='local2p';if(data.online){mode=data.online.role==='host'?'online':'online-guest';player=data.online.role==='host'?data.player:data.enemy;}screen='result';game.setMenuOpen(true);render();},assetsReady(ok=true){if(game.snapshot().menuOpen){render();if(!ok){const status=root.querySelector('#menu-ready');if(status)status.textContent='Aset gagal dimuat. Muat ulang halaman.';}}}};
  // First paint after the loading screen's download, so menu pictures come straight from the cache.
  Promise.resolve(window.AETHER_PRELOAD).then(render);
})();
