# Announcer sistem — Ardi (Bahasa Indonesia)

Status: **announcer PERANG DEDEMIT berbahasa Indonesia**, menggantikan Grady (bahasa Inggris) dari Aether Clash, yang memanggil nama petarung lama ("Arco wins!"). Semua klip memanggil nama dedemit. Suara ultimate tiap dedemit tetap terpisah (`guide/tools/build_dedemit_audio.py`).

## Identitas dan sumber

- Suara: Microsoft neural **id-ID-ArdiNeural** (pria), lewat paket `edge-tts`. Prosodi: rate -6%, pitch -14 Hz.
- Olahan: hening di awal dan akhir dipotong, diberi gema gelap pendek (dua pantulan dan ekor redup), dinormalkan ke -1 dBFS, MP3 96 kbps mono.
- Pembuat: `guide/tools/build_announcer.py`. Naskah ada di `CUES` dan nama dedemit di `DEDEMIT` dalam skrip itu. Skrip menulis MP3 ke `assets/audio/announcer/` dan `manifest.js` (teks dan durasi asli tiap klip).
- Kunci cue tetap memakai id slot engine (`select_isolde` = "Pocong!"), jadi `game.js` dan `menu.js` tidak perlu diubah.

## Cue aktif

| Cue | Ucapan | Trigger |
| --- | --- | --- |
| select_&lt;slot&gt; | Pocong! · Kuntilanak! · Sundel Bolong! · Wewe Gombel! · Genderuwo! · Eyang Sukmo Capo! · Leyak! · Kuyang! · Palasik! · Tuyul! · Jenglot! · Begu Ganjang! | Konfirmasi pemain atau lawan, bukan hover panel |
| round_1 / round_2 / round_3 | Ronde satu! / Ronde dua! / Ronde penentuan! | Awal ronde VS Computer |
| fight | Tarung! | Setelah pengumuman nomor ronde |
| ko | Tumbang! | Salah satu petarung KO |
| &lt;slot&gt;_wins | &lt;Nama dedemit&gt; menang! | Setelah panggilan hasil ronde, sesuai pemenang |
| time_up | Waktu habis! | Waktu ronde habis |
| draw | Seri! | Hasil seri, nomor ronde diulang |
| double_ko | Sama-sama tumbang! | Kedua petarung KO bersamaan |

Teks di layar mengikuti ucapan: RONDE 1 / RONDE 2 / RONDE PENENTUAN, TARUNG!, TUMBANG, WAKTU HABIS, SAMA-SAMA TUMBANG, "&lt;NAMA&gt; MENANG RONDE INI" dan "SERI · RONDE DIULANG".

## Mengganti atau menambah suara

- Ubah naskah: edit `CUES` di skrip, lalu `python guide/tools/build_announcer.py` (semua cue) atau `python guide/tools/build_announcer.py fight ko` (cue tertentu), lalu `node guide/tools/update_precache.mjs`.
- Pakai rekaman sendiri atau ElevenLabs: timpa MP3-nya dengan nama file yang sama, lalu `python guide/tools/build_announcer.py --manifest-only` supaya durasi di manifest ikut benar. Durasi itu dipakai untuk timing intro dan hasil ronde.
- Dedemit baru: tambahkan slot dan namanya di `DEDEMIT`. Skrip membuat `select_<slot>` dan `<slot>_wins` sendiri.
- Butuh pip `numpy scipy edge-tts imageio-ffmpeg` dan internet (teks dikirim ke layanan suara Microsoft). ffmpeg diambil dari `imageio-ffmpeg`, tidak perlu dipasang terpisah.

## Playback dan timing

`announcer.js` menyediakan satu kanal dengan antrean. `game.js` menghubungkan event, `menu.js` memanggil nama saat konfirmasi, dan `match.js` menyesuaikan waktu intro dengan durasi manifest. Tidak ada autoplay sebelum interaksi pengguna. Training tidak memakai pengumuman ronde kompetitif.

TARUNG dimulai setelah `max(1.05, durasi round + 0.12)` detik; fase intro berakhir setelah `max(1.85, waktu TARUNG + durasi fight + 0.10)`. Jangan mengembalikan durasi tetap yang memotong klip. Fase hasil menunggu paling sedikit `max(2.2, jumlah durasi panggilan hasil + 0.5)` detik.

Announcer berprioritas di atas voice ultimate; voice karakter dihentikan saat pengumuman dimulai. SFX diturunkan selama ucapan. Master volume dan mute berlaku untuk semua klip. Pause dan Pengaturan menjeda lalu melanjutkan posisi suara. Reset, kembali menu, dan halaman tersembunyi membersihkan panggilan lama agar tidak terdengar terlambat. Penolakan playback, file gagal, dan event lama tidak boleh menghentikan pertandingan; watchdog membatasi antrean yang macet.

## Verifikasi

Di browser localhost: ke-32 klip termuat. Konfirmasi Pocong memutar `select_isolde` (readyState 4, playback berjalan). Intro ronde memutar Ronde satu lalu Tarung. KO pemain memutar Tumbang, lalu Sundel Bolong menang, lalu Ronde dua, tanpa error announcer. Pemeriksaan ini membuktikan integrasi dan playback, bukan penilaian timbre lewat speaker.
