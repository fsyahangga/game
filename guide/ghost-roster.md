# Roster PERANG DEDEMIT

PERANG DEDEMIT memakai engine Aether Clash. Dua belas slot kit lama (`arco`, `fenr`, `mira`, …) tetap menjadi ID internal, dan setiap slot dimainkan oleh satu dedemit Nusantara yang legendanya paling cocok dengan gerakan slot itu. Nama, golongan, julukan, nama jurus, teks cut-in, status HUD, dan teks legenda di Kitab Dedemit semuanya ada di [ghosts.js](../ghosts.js). Damage, jangkauan, cooldown, dan CPU tidak diubah; satu-satunya mekanik baru adalah tali Pocong yang mengikat lawan.

Arena ada di [ghost-stages.md](ghost-stages.md). Prompt animasi (sprite strip per gerakan) ada di [ghost-animation-prompts.md](ghost-animation-prompts.md). Prompt gambar lama ada di [ghost-prompts.md](ghost-prompts.md).

## Dua golongan

- **Makhluk Halus**: arwah penasaran dan penunggu tempat angker.
- **Ilmu Hitam**: manusia penganut ilmu hitam yang melepas kepalanya di malam hari, dan makhluk peliharaan yang dikirim untuk mencuri atau mencelakai.

## Pemetaan slot dan jurus

Urutan tabel sama dengan urutan grid pilih karakter dan Kitab Dedemit.

| Dedemit | Golongan | Slot | Spasi | I | O | P (ultimate) |
| --- | --- | --- | --- | --- | --- | --- |
| Pocong | Makhluk Halus | `isolde` | Sundulan Kafan: tiga sundulan berjangkauan panjang | Tali Pocong: tali dilempar naik, lawan terikat diam 0,7 s | Lompat Pocong: lompatan menerjang | Hujan Pocong: tiga pocong jatuh dari langit |
| Kuntilanak | Makhluk Halus | `arco` | Cakar Kuku | Tawa Melengking: gelombang tawa lurus | Jatuh dari Waru: hantaman area | Malam Pohon Waru: arwah menyambar dari udara |
| Sundel Bolong | Makhluk Halus | `edda` | Cakar Dendam | Arwah Memantul: bola arwah memantul dua kali | Balas Dendam: bertahan 0,55 s, serangan pertama dibalas | Dendam Kesumat: arwah raksasa menghentak tiga kali |
| Wewe Gombel | Makhluk Halus | `zanni` | Tangan Panjang | Selendang Melayang: terbang lalu kembali | Gondol!: lawan diseret mendekat | Sarang Aren: tiga pusaran selendang |
| Genderuwo | Makhluk Halus | `haldor` | Tinju Rimba: rantai paling berat | Lempar Batu Gaib: batu melambung | Seruduk Rimba | Amuk Beringin: tiga hantaman tanah |
| Eyang Sukmo Capo | Makhluk Halus | `solan` | Tongkat Pusaka | Gelombang Sukma: tenaga dalam setinggi dada | Hentak Bumi: lompat lalu menghentak | Sabda Keramat: tiga gelombang |
| Leyak | Ilmu Hitam | `fenr` | Cakar Bara | Api Leyak: bola api | Terjang Malam | Malam Pengleakan: wujud api 12 s (Cakar Geni, Terkam Geni, Pekik Malam) |
| Kuyang | Ilmu Hitam | `cora` | Cakar Malam | Pita Arwah: kipas tiga proyektil | Kibas Rambut | Pesta Kuyang: kawanan kepala terbang |
| Palasik | Ilmu Hitam | `rhea` | Gigit Melayang | Kepala Mengambang: proyektil lambat | Isap Sari: pusaran isap 230 px di depan | Tiga Kepala: tiga kepala mengorbit |
| Tuyul | Ilmu Hitam | `nib` | Gigit Kecil: rantai tercepat | Lempar Koin: koin kepeng tercepat | Copet Kilat: dash, menyelinap ke belakang lawan | Pesugihan Kilat: tiga karung koin pengejar |
| Jenglot | Ilmu Hitam | `mira` | Cakar Jenglot | Kuku Terbang | Terkam Jenglot: terkaman | Hujan Jenglot: dua belas jenglot berjatuhan |
| Begu Ganjang | Ilmu Hitam | `naja` | Tangan Ganjang: jangkauan terpanjang | Bayang Merayap: gelombang di tanah | Putaran Ganjang: depan dan belakang | Begu Menjulang: bayangan mengejar, menjulang tiga kali |

Angka umum: basic 6/8/12, Skill 1 16 dmg CD 3 s, Skill 2 24 dmg CD 6 s; ultimate sesuai `<slot>-reference.md`.

## Mana dan Super Ultimate (U)

Setiap serangan pemain yang kena mengisi bar mana di bawah HP: `4 + damage × 0,5 + panjang kombo (maks. 8)`. Saat mana 200, tombol **Super Ultimate** muncul di deretan jurus (tombol U, atau tombol SUPER di layar sentuh). Super membekukan arena dengan cut-in, lalu lima hantaman pilar warna dedemit (10/10/10/12/26 = 68 damage, hantaman terakhir menjatuhkan lawan). Hantamannya menembus kebal, jatuh, dan tangkisan; pemain kebal selama super. Angkanya di `BALANCE.mana` dan `BALANCE.superUlt` di game.js; mana direset tiap ronde. CPU belum punya mana.

| Dedemit | Super Ultimate | Dasar legenda |
| --- | --- | --- |
| Pocong | Liang Lahat | bangkit dari kubur karena tali kafan tak dilepas |
| Kuntilanak | Kuntilanak Merah | wujud kuntilanak paling ganas |
| Sundel Bolong | Lubang Dendam | lubang di punggung, dendam yang belum terbalas |
| Wewe Gombel | Pulang ke Bukit Gombel | sarangnya di Bukit Gombel, Semarang |
| Genderuwo | Hujan Batu Genderuwo | rumah dihujani batu tanpa pelempar |
| Eyang Sukmo Capo | Aji Sukma Sejati | ajian pamungkas penjaga keramat |
| Leyak | Titah Calon Arang | Calon Arang, ratu leyak dari Girah |
| Kuyang | Terbang Menjelang Subuh | kepala harus kembali sebelum fajar |
| Palasik | Palasik Kuduang | palasik yang kepalanya lepas dari badan |
| Tuyul | Pasukan Tuyul Gundul | pesugihan dengan banyak tuyul |
| Jenglot | Ilmu Batara Karang | ilmu hitam asal-muasal jenglot |
| Begu Ganjang | Jangan Menengadah | makin ditatap makin tinggi |

Nama, teks cut-in, dan legenda super ada di `SUPERS` dalam [ghosts.js](../ghosts.js).

## Tali Pocong (mekanik baru)

Proyektil yang punya properti `bind` (detik) mengikat targetnya: pemain mendapat tambahan `hurtTime`, CPU ditahan oleh `bindTime`, keduanya berhenti bergeser, dan tiga lilitan tali digambar mengikuti target. Nilainya `piercer.bind` di [isolde.js](../isolde.js) (0,7 s); kodenya `bindHit` di game.js. Jurus lain bisa memakai mekanik yang sama dengan menambahkan `bind` pada proyektilnya.

## Gambar base dan aset sementara

Gambar base tiap dedemit (satu pose penuh, hadap kanan, latar magenta atau hijau polos) ada di `assets/ghosts/base/<dedemit>.webp`. Gambar hantu mancanegara yang tidak dipakai lagi disimpan di `assets/ghosts/base/_arsip/`. Dari gambar base, [build_ghost_assets.py](tools/build_ghost_assets.py) membuat untuk slotnya:

- atlas sprite dengan tata letak slot lama; setiap state adalah pose base yang ditekan, dicondongkan, digeser, atau diputar;
- metrics bounds/tinggi dari frame baru (emitter dan playback tetap);
- portrait HUD, art pilih karakter, cut-in ultimate, dan empat ikon jurus;
- efek: bentuk generik diwarnai ulang dengan warna dedemit (dari salinan asli di `assets/ghosts/fx-src`), objek khas diganti dengan sosok dedemit itu sendiri, koin kepeng, tali pocong, atau bola arwah.

Kalau ada sprite strip di `assets/ghosts/strips/<dedemit>/` (misalnya `idle.png`, `attack.png`, `ultimate.png`, masing-masing 4 pose), builder memakai pose sungguhan itu untuk gerakan tersebut, bukan pose boneka. Prompt dan daftar file ada di [ghost-animation-prompts.md](ghost-animation-prompts.md).

Ukuran tiap dedemit diatur dengan `scale` (Jenglot kecil, Begu Ganjang menjulang) dan `lift` (Palasik melayang) di tabel `GHOSTS` dalam skrip itu; crop portrait dengan `portrait=[cx, cy, ukuran]`.

Membangun ulang satu dedemit (butuh Python dengan Pillow dan numpy, serta Node.js):

    python guide/tools/build_ghost_assets.py pocong
    node guide/tools/update_precache.mjs

## Suara

Semua suara baru disintesis dengan kode, bukan rekaman, oleh [build_dedemit_audio.py](tools/build_dedemit_audio.py) (butuh numpy, scipy, dan ffmpeg):

- Musik latar **Malam Dedemit** (`assets/audio/music/malam-dedemit.mp3`): loop gamelan pelog sekitar 58 detik dengan gong ageng, kempul, kenong, slenthem, saron, dengung rendah, dan angin.
- Suara ultimate tiap dedemit, ditulis ke file voice slot masing-masing (mis. `assets/isolde/audio/isolde-ultimate.mp3`): Pocong lompatan dan tali berderit, Kuntilanak cekikik melengking, Sundel Bolong ratapan, Wewe Gombel tawa nenek, Genderuwo geraman dan hentakan, Eyang Sukmo Capo gong dan dengung, Leyak kobaran api dan jeritan, Kuyang jeritan dan kepakan, Palasik isapan dan tawa rendah, Tuyul koin dan cekikik anak, Jenglot desis dan ketukan kuku, Begu Ganjang dengung yang meninggi.

Rekaman suara asli bisa menggantikan file mana pun dengan path yang sama. Announcer (Round, Fight, K.O.) masih suara bahasa Inggris bawaan; klip yang menyebut nama karakter lama dimatikan (`announce: true` di ghosts.js menyalakannya lagi setelah klipnya diganti).

## Cache browser

Service worker dan loading screen memakai cache `dedemit-assets`. Unduhan ulang dari loading screen selalu ke jaringan, jadi gambar yang diganti langsung tampil setelah satu kali reload. Cache lama Aether Clash (`aether-assets`) dihapus otomatis.
