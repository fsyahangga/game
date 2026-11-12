# Main online: akun dan teman

Tahap 1 dari main antar akun: login Google, profil dengan kode teman, dan daftar teman. Tarung online antar akun menyusul di tahap berikutnya (tombol **Tantang** sudah ada tapi belum aktif).

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

Email tidak disimpan di Firestore. Status online: `lastSeen` diperbarui tiap 60 detik selama game terbuka; teman dianggap online kalau `lastSeen` kurang dari 150 detik lalu.

## Kuota gratis

Paket Spark: 50.000 baca dan 20.000 tulis per hari. Satu pemain yang membuka game menulis `lastSeen` sekitar 60 kali per jam, ditambah baca untuk daftar teman. Untuk ratusan pemain per hari ini masih jauh di bawah kuota.

## Mode dua pemain lokal

Menu **Dua pemain** (hanya di keyboard): P2 menggantikan CPU dan memakai jalur jurus yang sama.

| | Gerak / lompat / jongkok | Serang | Jurus 1 | Jurus 2 | Ultimate | Super |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | W A S D | Spasi atau F | I atau G | O atau H | P atau T | U atau Y |
| P2 | panah | `/` atau Numpad 0 | `.` atau Numpad 1 | `,` atau Numpad 2 | M atau Numpad 3 | N atau Numpad 4 |

P2 punya energi sukma dan super sendiri (bar di bawah HP kanan). Di mode ini kedua pemain sama-sama kaku 0,5 detik setelah terkena pukulan.
