# Main online: akun dan teman

Main antar akun: login Google, profil dengan kode teman, daftar teman, dan tarung online antar teman.

- Kode: [online.js](../online.js) (modul Firebase, dimuat dari `index.html`), layar **Teman** di [menu.js](../menu.js), gaya `.ol-*` di [dedemit.css](../dedemit.css).
- Project Firebase: `wardedemit` (paket gratis Spark). Config web di `online.js` memang publik; yang menjaga data adalah **Security Rules**.

## Setup sekali saja (Firebase console)

1. **Authentication → Sign-in method:** Google aktif.
2. **Authentication → Settings → Authorized domains:** `fsyahangga.web.id` dan `localhost`.
3. **Firestore Database → Rules:** salin seluruh isi [firestore.rules](../firestore.rules), tempel, lalu klik **Publish**. Tanpa langkah ini login tetap berhasil, tapi profil dan teman gagal dengan pesan "Akses database ditolak".

Kalau `firestore.rules` diubah, ulangi langkah 3.

## Data di Firestore

| Koleksi | Isi | Siapa yang boleh |
| --- | --- | --- |
| `users/{uid}` | nama tampilan, foto Google, kode teman, waktu terakhir online | dibaca semua pemain yang login; ditulis pemiliknya; kode tidak bisa diganti |
| `users/{uid}/friends/{fid}` | teman (nama, foto, kode) | dibaca pemiliknya; dibuat dua sisi saat permintaan diterima; dihapus salah satu |
| `codes/{DMT-XXXX}` | pemilik kode teman | dibuat sekali oleh pemiliknya, unik |
| `friendRequests/{dari}_{ke}` | permintaan pertemanan | hanya dua pemain itu |
| `users/{uid}/history/{matchId}` | hasil tarung online milik pemain itu (lawan, dedemit, skor ronde, menang/kalah) | dibaca dan dibuat pemiliknya, sekali per pertandingan |
| `matches/{id}` | tantangan: dedemit, arena, status, offer/answer WebRTC | hanya penantang dan temannya; dibuat hanya untuk teman; dihapus setelah selesai |

Email tidak disimpan di Firestore. Status online: `lastSeen` diperbarui tiap 60 detik selama game terbuka; teman dianggap online kalau `lastSeen` kurang dari 150 detik lalu.

## Tarung online

1. Di **Teman**, tombol **Tantang** aktif untuk teman yang sedang online. Penantang (host) memilih dedemit dan arena, lalu **Kirim tantangan**.
2. Teman melihat banner "menantangmu bertarung!" di layar menu mana pun. **Terima**, pilih dedemit. Tantangan berlaku 90 detik.
3. Kedua browser tersambung langsung lewat WebRTC (alamatnya ditukar lewat dokumen `matches/{id}`, server STUN Google). Kalau dalam 25 detik belum tersambung, muncul "Koneksi gagal".
4. Host menjalankan pertarungan sebagai P1. Tamu adalah P2 dan mengirim tombolnya (WASD/Spasi/I O P U atau tombol sentuh) ke host. Host mengirim keadaan game sekitar 30 kali per detik; di antaranya layar tamu terus menyimulasikan dengan input yang sama supaya gerakan mulus. Tombol tamu terasa telat sebesar ping (biasanya 30–80 ms).
5. Esc atau tombol Ⅱ = keluar dari pertarungan (lawan melihat "LAWAN KELUAR"). Jeda dan pengaturan tidak bisa dipakai selama tarung online.

Kode: `netStart`, `netExport`/`netImport`, `netMessage` di [game.js](../game.js); koneksi di bagian "online fight" [online.js](../online.js).

**Batasan:** tanpa server TURN, sebagian jaringan ketat (beberapa jaringan seluler atau kantor) tidak bisa tersambung langsung. Server TURN biasanya berbayar; bisa ditambahkan ke `ICE` di online.js nanti.

## Rekor, riwayat, dan tanding ulang

- Setelah tarung online selesai, tiap pemain mencatat hasilnya sendiri: `users/{uid}/history/{matchId}` dan `wins`/`losses` di profil (naik satu). Rules hanya mengizinkan rekor naik paling banyak 1 per simpan dan satu riwayat per pertandingan.
- Layar Teman menampilkan rekor (menang/kalah), 10 pertarungan terakhir, dan skor head-to-head per teman ("kamu 2–1").
- Layar hasil tarung online punya tombol **Tantang lagi**: tantangan baru ke lawan yang sama dengan dedemit dan arena yang sama.
- Catatan: hasil dicatat oleh browser pemain sendiri, jadi pemain yang sengaja mengutak-atik kode bisa memalsukan rekornya. Untuk main santai antar teman ini cukup.

## Kuota gratis

Paket Spark: 50.000 baca dan 20.000 tulis per hari. Satu pemain yang membuka game menulis `lastSeen` sekitar 60 kali per jam, ditambah baca untuk daftar teman. Untuk ratusan pemain per hari ini masih jauh di bawah kuota.

## Mode dua pemain lokal

Menu **Dua pemain** (hanya di keyboard): P2 menggantikan CPU dan memakai jalur jurus yang sama.

| | Gerak / lompat / jongkok | Serang | Jurus 1 | Jurus 2 | Ultimate | Super |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | W A S D | Spasi atau F | I atau G | O atau H | P atau T | U atau Y |
| P2 | panah | `/` atau Numpad 0 | `.` atau Numpad 1 | `,` atau Numpad 2 | M atau Numpad 3 | N atau Numpad 4 |

**Stik (gamepad):** stik Bluetooth/USB yang dibaca browser sebagai gamepad standar (Xbox, PlayStation, stik generik) langsung bisa dipakai lewat [gamepad.js](../gamepad.js). Dua stik: stik 1 = P1, stik 2 = P2. Satu stik: stik = P2, P1 pakai keyboard atau tombol sentuh. Di mode lain dan tarung online stik mengendalikan P1. Tombol: D-pad/analog kiri gerak (atas lompat, bawah jongkok), A/Cross serang, X/Square jurus 1, Y/Triangle jurus 2, B/Circle lompat, RB/LB ultimate, RT/LT super, Start jeda. Di menu: D-pad pilih, A konfirmasi, B kembali. Di HP, menu Dua pemain muncul kalau ada stik terhubung.

P2 punya energi sukma dan super sendiri (bar di bawah HP kanan). Di mode ini kedua pemain sama-sama kaku 0,5 detik setelah terkena pukulan.
