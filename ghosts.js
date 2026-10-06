/* PERANG DEDEMIT roster overlay.
   The engine still runs the twelve original kit slots (arco, fenr, mira ...). Each slot is played by a dedemit whose
   legend fits that slot's moves best. This file sets what the player sees and reads: names, faction, titles, skill
   names, cut-in text, status lines and the legend shown in the Kitab Dedemit. Damage, reach, cooldowns and the CPU
   stay as tuned; the one new mechanic is Pocong's binding rope (isolde.js piercer.bind, game.js bindHit).
   Load order: after every kit file and the announcer manifest, before announcer.js / game.js / menu.js.
   Art comes from assets/ghosts/base via guide/tools/build_ghost_assets.py. voice:true plays the slot's ultimate sound
   (synthesised by guide/tools/build_dedemit_audio.py). */
(() => {
  'use strict';
  const FACTIONS = {
    halus: { label: 'MAKHLUK HALUS', blurb: 'Arwah penasaran dan penunggu tempat angker: mereka yang mati tak tenang dan yang menjaga pohon, rumah tua, dan tanah keramat.' },
    hitam: { label: 'ILMU HITAM', blurb: 'Mereka yang lahir dari ilmu hitam: manusia yang melepas kepalanya di malam hari, dan makhluk peliharaan yang dikirim untuk mencuri dan mencelakai.' }
  };
  // Order = order in the select grid and the Kitab Dedemit.
  const GHOSTS = {
    isolde: {
      id: 'pocong', name: 'POCONG', tag: 'SI TERIKAT KAFAN', title: 'TERIKAT KAFAN', faction: 'halus', origin: 'Jawa',
      lore: 'Arwah yang terbungkus kain kafan lengkap dengan tali pengikatnya. Konon talinya lupa dilepas saat dikubur, jadi ia hanya bisa bergerak melompat atau melayang.',
      detail: 'Talinya belum dilepas. Lompatannya belum selesai.', style: 'Rushdown / lompatan kafan dan tali pengikat', color: '#e8e4d8',
      names: ['SUNDULAN KAFAN', 'TALI POCONG', 'LOMPAT POCONG', 'HUJAN POCONG'], status: 'TALI TERIKAT',
      moves: ['Tiga sundulan berjangkauan panjang', 'Tali dilempar naik; lawan yang kena terikat diam 0,7 detik', 'Lompatan menerjang secepat kilat', 'Tiga pocong jatuh dari langit ke arah lawan'],
      cutin: { top: 'HUJAN', bottom: 'POCONG', detail: 'TIGA POCONG JATUH DARI LANGIT' }, voice: true
    },
    arco: {
      id: 'kuntilanak', name: 'KUNTILANAK', tag: 'SI TAWA MELENGKING', title: 'TAWA MELENGKING', faction: 'halus', origin: 'Kalimantan / Melayu',
      lore: 'Hantu perempuan berambut panjang dan berbaju putih yang dikenali dari tawanya yang melengking. Dipercaya berasal dari perempuan yang meninggal saat hamil, dan suka bersarang di pohon waru.',
      detail: 'Kalau tawanya terdengar jauh, ia sudah di belakangmu.', style: 'Brawler / tawa melengking dan sambaran dari pohon', color: '#f1f1f6',
      names: ['CAKAR KUKU', 'TAWA MELENGKING', 'JATUH DARI WARU', 'MALAM POHON WARU'], status: 'HIHIHIHI...',
      moves: ['Tiga cakaran kuku panjang', 'Gelombang tawa melesat lurus', 'Terjun dari dahan, hantaman area ke tanah', 'Arwah dari pohon waru menyambar lawan dari udara'],
      cutin: { top: 'MALAM', bottom: 'POHON WARU', detail: 'ARWAH WARU MENYAMBAR DARI UDARA' }, voice: true
    },
    edda: {
      id: 'sundelbolong', name: 'SUNDEL BOLONG', tag: 'SI PUNGGUNG BOLONG', title: 'PUNGGUNG BOLONG', faction: 'halus', origin: 'Jawa',
      lore: 'Hantu perempuan berambut panjang dengan lubang besar di punggungnya yang tertutup rambut. Kisahnya selalu tentang dendam yang belum terbalas.',
      detail: 'Pukul ia sekali. Dendamnya yang akan membalas.', style: 'Counter / arwah memantul dan balas dendam', color: '#9fe3e6',
      names: ['CAKAR DENDAM', 'ARWAH MEMANTUL', 'BALAS DENDAM', 'DENDAM KESUMAT'], status: 'DENDAM MENUNGGU',
      moves: ['Tiga cakaran dendam', 'Bola arwah memantul dua kali di tanah', 'Sikap bertahan 0,55 detik; serangan pertama dibalas', 'Arwah dendam raksasa menghentak tanah tiga kali'],
      cutin: { top: 'DENDAM', bottom: 'KESUMAT', detail: 'TIGA HENTAKAN ARWAH DENDAM' }, voice: true
    },
    zanni: {
      id: 'wewegombel', name: 'WEWE GOMBEL', tag: 'SI PENCULIK SENJA', title: 'PENCULIK SENJA', faction: 'halus', origin: 'Semarang, Jawa Tengah',
      lore: 'Hantu perempuan tua berambut panjang yang menculik anak-anak yang ditelantarkan atau kurang diperhatikan orang tuanya, lalu menyembunyikannya di pohon aren.',
      detail: 'Pulanglah sebelum magrib. Tangannya lebih panjang dari bayanganmu.', style: 'Trickster / tangan panjang dan selendang bumerang', color: '#b9a27e',
      names: ['TANGAN PANJANG', 'SELENDANG MELAYANG', 'GONDOL!', 'SARANG AREN'], status: 'MENGINTAI ANAK',
      moves: ['Tiga cakaran tangan yang memanjang', 'Selendang terbang lalu kembali ke tangan', 'Tangan memanjang menyeret lawan mendekat', 'Tiga pusaran selendang raksasa pulang-pergi'],
      cutin: { top: 'SARANG', bottom: 'AREN', detail: 'TIGA PUSARAN SELENDANG' }, voice: true
    },
    haldor: {
      id: 'genderuwo', name: 'GENDERUWO', tag: 'SI PENUNGGU BERINGIN', title: 'PENUNGGU BERINGIN', faction: 'halus', origin: 'Jawa',
      lore: 'Makhluk raksasa berbulu lebat di sekujur tubuh yang tinggal di pohon besar atau bangunan tua. Suka melempar batu dan bisa menyamar menjadi orang yang dikenal.',
      detail: 'Batu pertamanya selalu peringatan.', style: 'Heavy tank / lempar batu dan serudukan', color: '#a8744a',
      names: ['TINJU RIMBA', 'LEMPAR BATU GAIB', 'SERUDUK RIMBA', 'AMUK BERINGIN'], status: 'RIMBA BANGUN',
      moves: ['Rantai pukulan paling berat', 'Batu melambung ke tempat lawan berdiri', 'Serudukan bahu', 'Tiga hantaman tanah di depannya'],
      cutin: { top: 'AMUK', bottom: 'BERINGIN', detail: 'TIGA HANTAMAN PENUNGGU BERINGIN' }, voice: true
    },
    solan: {
      id: 'eyangsukmocapo', name: 'EYANG SUKMO CAPO', tag: 'SANG PENJAGA KERAMAT', title: 'PENJAGA KERAMAT', faction: 'halus', origin: 'Jawa',
      lore: 'Jin atau arwah leluhur dalam tradisi Jawa yang dikaitkan dengan penjaga tempat-tempat keramat. Tenang dan sabar, tapi tak memaafkan yang mengusik wilayahnya.',
      detail: 'Yang muda boleh lewat. Yang lancang tidak.', style: 'Powerhouse / tongkat pusaka dan tenaga dalam', color: '#d8b56a',
      names: ['TONGKAT PUSAKA', 'GELOMBANG SUKMA', 'HENTAK BUMI', 'SABDA KERAMAT'], status: 'NAPAS TERATUR',
      moves: ['Tiga ayunan tongkat pusaka', 'Gelombang tenaga dalam setinggi dada', 'Melompat lalu menghentak tanah', 'Tiga gelombang sabda keramat'],
      cutin: { top: 'SABDA', bottom: 'KERAMAT', detail: 'TIGA GELOMBANG TENAGA DALAM' }, voice: true
    },
    fenr: {
      id: 'leyak', name: 'LEYAK', tag: 'SI API MALAM', title: 'API MALAM', faction: 'hitam', origin: 'Bali',
      lore: 'Penganut ilmu hitam dari Bali yang berubah wujud di malam hari. Dalam kisahnya ia bisa menjadi bola api atau kepala terbang dengan organ tergantung, mencari darah bayi atau perempuan hamil.',
      detail: 'Malam hari ia berganti rupa. Apinya tidak.', style: 'Shapeshifter / api leyak dan wujud api', color: '#f29b3a',
      names: ['CAKAR BARA', 'API LEYAK', 'TERJANG MALAM', 'MALAM PENGLEAKAN'],
      beast: { cls: 'WUJUD API', deck: 'LEYAK · API', names: ['CAKAR GENI', 'TERKAM GENI', 'PEKIK MALAM', 'MALAM PENGLEAKAN'], status: 'TERBAKAR', timer: 'GENI' },
      moves: ['Tiga cakaran bara', 'Bola api melesat lurus', 'Terjangan dua tangan', 'Berubah ke wujud api 12 detik: serangan lebih kuat dan cepat'],
      status: 'API MENYALA', cutin: { top: 'MALAM', bottom: 'PENGLEAKAN', detail: 'BERUBAH KE WUJUD API' }, voice: true
    },
    cora: {
      id: 'kuyang', name: 'KUYANG', tag: 'SI KEPALA TENGAH MALAM', title: 'KEPALA MALAM', faction: 'hitam', origin: 'Kalimantan',
      lore: 'Penganut ilmu hitam dari Kalimantan yang melepas kepalanya di malam hari. Kepala itu terbang dengan organ tergantung, mencari darah persalinan.',
      detail: 'Tengah malam, kepalanya pergi berburu sendiri.', style: 'Agile / pita arwah dan kepala terbang', color: '#d0505a',
      names: ['CAKAR MALAM', 'PITA ARWAH', 'KIBAS RAMBUT', 'PESTA KUYANG'], status: 'KEPALA LAPAR',
      moves: ['Tiga cakaran cepat', 'Kipas tiga pita arwah', 'Kibasan rambut yang menyapu', 'Kawanan kepala terbang menyapu arena tiga kali'],
      cutin: { top: 'PESTA', bottom: 'KUYANG', detail: 'TIGA SAPUAN KEPALA TERBANG' }, voice: true
    },
    rhea: {
      id: 'palasik', name: 'PALASIK', tag: 'SI KEPALA MELAYANG', title: 'KEPALA MELAYANG', faction: 'hitam', origin: 'Sumatra Barat',
      lore: 'Makhluk dari ilmu hitam Minangkabau berupa kepala tanpa badan yang melayang untuk mengisap sari bayi atau janin, bahkan dari jauh.',
      detail: 'Ia tak perlu menyentuh. Cukup dekat.', style: 'Zoner / kepala melayang dan isapan jarak jauh', color: '#e0503c',
      names: ['GIGIT MELAYANG', 'KEPALA MENGAMBANG', 'ISAP SARI', 'TIGA KEPALA'], status: 'MENCIUM BAU',
      moves: ['Tiga terjangan kepala', 'Kepala kecil melayang pelan melintasi arena', 'Pusaran isap 230 piksel di depan', 'Tiga kepala raksasa mengorbit'],
      cutin: { top: 'TIGA', bottom: 'KEPALA', detail: 'TIGA KEPALA MENGORBIT' }, voice: true
    },
    nib: {
      id: 'tuyul', name: 'TUYUL', tag: 'SI PENCURI KECIL', title: 'PENCURI KECIL', faction: 'hitam', origin: 'Jawa',
      lore: 'Makhluk halus berwujud anak kecil botak yang dipelihara manusia untuk mencuri uang secara gaib. Katanya mudah teralihkan oleh kacang hijau dan kepiting.',
      detail: 'Kecil, gundul, dan dompetmu sudah kosong.', style: 'Rushdown / koin lempar dan copet kilat', color: '#e6c25a',
      names: ['GIGIT KECIL', 'LEMPAR KOIN', 'COPET KILAT', 'PESUGIHAN KILAT'], status: 'KANTONG TERBUKA',
      moves: ['Rantai pukulan tercepat', 'Koin dilempar datar paling cepat', 'Dash; kalau kena menyelinap ke belakang lawan', 'Tiga karung koin mengejar lawan'],
      cutin: { top: 'PESUGIHAN', bottom: 'KILAT', detail: 'TIGA KARUNG KOIN PENGEJAR' }, voice: true
    },
    mira: {
      id: 'jenglot', name: 'JENGLOT', tag: 'SI BONEKA HAUS', title: 'BONEKA HAUS', faction: 'hitam', origin: 'Jawa',
      lore: 'Makhluk mistis sangat kecil mirip boneka manusia dengan rambut dan kuku panjang. Dipercaya hidup dan meminum darah pemeliharanya.',
      detail: 'Kecil di lemari. Besar di mimpi buruk.', style: 'Swarm / kuku terbang dan hujan jenglot', color: '#c0453a',
      names: ['CAKAR JENGLOT', 'KUKU TERBANG', 'TERKAM JENGLOT', 'HUJAN JENGLOT'], status: 'HAUS',
      moves: ['Tiga cakaran kuku panjang', 'Kuku dilempar lurus', 'Terkaman menerjang', 'Dua belas jenglot berjatuhan ke arena'],
      cutin: { top: 'HUJAN', bottom: 'JENGLOT', detail: 'DUA BELAS JENGLOT BERJATUHAN' }, voice: true
    },
    naja: {
      id: 'beguganjang', name: 'BEGU GANJANG', tag: 'SI TINGGI DARI TOBA', title: 'TINGGI MENJULANG', faction: 'hitam', origin: 'Batak, Sumatra Utara',
      lore: 'Makhluk halus bertubuh sangat tinggi dari mitologi Batak. Dipercaya dipelihara seseorang untuk mencelakai musuhnya, dan makin tinggi makin dilihat.',
      detail: 'Jangan menengadah. Ia tumbuh saat kau menatapnya.', style: 'Mid-range / jangkauan terpanjang dan bayang merayap', color: '#8a9aa8',
      names: ['TANGAN GANJANG', 'BAYANG MERAYAP', 'PUTARAN GANJANG', 'BEGU MENJULANG'], status: 'MENUNGGU DITATAP',
      moves: ['Jangkauan basic terpanjang di roster', 'Bayang merayap di tanah', 'Putaran lengan ke depan dan belakang', 'Bayangan mengejar lalu tubuhnya menjulang tiga kali'],
      cutin: { top: 'BEGU', bottom: 'MENJULANG', detail: 'MENJULANG TIGA KALI DARI TANAH' }, voice: true
    }
  };
  for (const g of Object.values(GHOSTS)) g.cls = FACTIONS[g.faction].label;

  // Skill names live in each kit; point them at the dedemit names so the HUD, touch buttons and logs all agree.
  const kits = { mira: window.Mira, cora: window.Cora, naja: window.Naja, haldor: window.Haldor, zanni: window.Zanni, isolde: window.Isolde, rhea: window.Rhea, solan: window.Solan, nib: window.Nib, edda: window.Edda };
  for (const [slot, kit] of Object.entries(kits)) if (kit && Array.isArray(kit.names)) kit.names = [...GHOSTS[slot].names];
  if (window.Fenr?.kits) { window.Fenr.kits.human.names = [...GHOSTS.fenr.names]; window.Fenr.kits.wolf.names = [...GHOSTS.fenr.beast.names]; }

  window.GHOST_FACTIONS = FACTIONS;
  window.GHOSTS = GHOSTS;
})();
