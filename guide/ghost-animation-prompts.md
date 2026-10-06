# Prompt animasi dedemit (sprite strip)

Gerakan terasa kaku karena setiap dedemit hanya punya **satu gambar base**. Semua animasinya (jalan, pukul, jurus, jatuh) dibuat dengan menekan, memiringkan, dan menggeser gambar yang sama, jadi tangan, kaki, rambut, dan kain tidak pernah benar-benar bergerak. Obatnya adalah gambar pose sungguhan: untuk setiap gerakan, satu gambar berisi **4 pose berurutan** (sprite strip). Builder memotong strip itu dan menaruh tiap pose di frame atlas yang tepat, sisanya tetap memakai animasi boneka seperti sekarang.

## Yang dibutuhkan

8 strip per dedemit, 4 pose per strip. Untuk 12 dedemit totalnya 96 gambar, tetapi tidak perlu sekaligus: dedemit yang belum punya strip tetap jalan dengan animasi lama, dan setiap strip yang ditambahkan langsung dipakai.

| File | Gerakan | Dipakai untuk |
| --- | --- | --- |
| `idle.png` | Diam | idle |
| `walk.png` | Jalan | walk, juga run kalau `run.png` tidak ada |
| `attack.png` | Serangan basic | attack1, attack2, attack3 (Spasi) |
| `skill1.png` | Jurus 1 | tombol I |
| `skill2.png` | Jurus 2 | tombol O |
| `ultimate.png` | Ultimate | tombol P |
| `hurt.png` | Terkena pukulan | hurt |
| `down.png` | Jatuh | down, dan diputar mundur untuk recover |

Urutan yang paling terasa hasilnya:

1. **Tahap 1** (paling sering terlihat): `idle`, `walk`, `attack`, `hurt`, `down`.
2. **Tahap 2** (saat jurus): `skill1`, `skill2`, `ultimate`.
3. **Opsional**, kalau ingin lebih halus lagi: `attack1.png`, `attack2.png`, `attack3.png` terpisah (tiga pukulan berbeda), `run.png`, `crouch.png`, `recover.png` (4 pose), `land.png` (4 pose: mendarat, menahan benturan, bangkit ke posisi diam), serta `jump.png` dan `doublejump.png` (1 pose, pakai panduan `guide-1pose-*.png`; pose doublejump digulung rapat karena game memutarnya 360° untuk salto). Untuk gerakan opsional ini pakai prompt mana pun di bawah dan ganti baris `Motion`.

Mulailah dari satu dedemit (misalnya Pocong, Tahap 1), lihat hasilnya di game, baru lanjut ke yang lain.

## Cara membuat

1. Buka generator gambar yang bisa menerima gambar referensi (misalnya ChatGPT, Gemini, atau sejenisnya).
2. Lampirkan **Referensi 1**: gambar base dedemitnya, `assets/ghosts/base/<dedemit>.webp`.
3. Lampirkan **Referensi 2**: panduan layout sesuai warna latar dedemit itu, `assets/ghosts/guides/guide-4pose-magenta.png` atau `guide-4pose-green.png` (tertulis di setiap bagian di bawah).
4. Tempel prompt-nya, rasio 21:9.
5. Periksa hasilnya: tepat 4 pose, tidak saling menempel, latar satu warna polos, wajah dan warna sama dengan base. Kalau ada pose yang menempel atau terpotong, ulangi saja.
6. Simpan sebagai PNG (atau WebP) di `assets/ghosts/strips/<dedemit>/<gerakan>.png`, misalnya `assets/ghosts/strips/pocong/idle.png`. Nama folder sama dengan nama file base.

Lalu bangun ulang aset dedemit itu dan precache, dan push:

    python guide/tools/build_ghost_assets.py pocong
    node guide/tools/update_precache.mjs
    git add -A && git commit -m "Animasi pocong" && git push

Builder menulis `strips used for <slot>: ...` untuk gerakan yang memakai strip. Builder memotong strip di celah kosong antar pose, menyamakan tinggi pose dengan tinggi base, menaruh kaki di garis tanah, dan mempertahankan pose yang digambar lebih tinggi (lompat, melayang naik).

**Ukuran.** Generator gambar biasanya menggambar tiap strip dengan ukuran sedikit berbeda. Builder menyamakannya lewat luas siluet: pose rata-rata tiap strip dibuat seluas pose diam, dan pose diam tertinggi setinggi tinggi berdiri dedemit di game. Jadi pose yang memang lebih tinggi (Begu Ganjang menjulang) atau lebih rendah (jongkok, terbaring) tetap begitu. Kalau satu strip masih terasa terlalu besar atau kecil, buat `assets/ghosts/strips/<dedemit>/scale.json` berisi pengali per gerakan, misalnya `{"attack": 0.95, "ultimate": 1.1}`.

**Leyak wujud api** (ultimate Malam Pengleakan) memakai atlas kedua. Tanpa strip khusus, atlas itu memakai strip Leyak biasa yang diwarnai bara. Kalau ingin gambar sendiri, buat strip dengan gerakan yang sama di folder `assets/ghosts/strips/leyak-api/` dan tambahkan ke prompt: "Leyak is in her fire form: her whole body is wreathed in orange and red flames".

## Prompt per dedemit

Setiap prompt sudah lengkap untuk satu gambar; cukup salin, lampirkan dua referensi, dan kirim.

### Pocong

Referensi 1: `assets/ghosts/base/pocong.webp` · Referensi 2: `assets/ghosts/guides/guide-4pose-magenta.png` · simpan di `assets/ghosts/strips/pocong/`

<details><summary><code>idle.png</code> · Diam</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: POCONG, a ghost wrapped head to toe in a knotted burial shroud.
Keep: off-white shroud with knots at head, neck and ankles, the two floppy knot ears, pale grey face with glowing cyan eyes, NO arms and NO legs visible.
Motion (idle): subtle breathing: the bound body swells and settles, the knot ears and loose cloth strips sway; the base stays planted.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>walk.png</code> · Jalan (dipakai juga untuk lari)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: POCONG, a ghost wrapped head to toe in a knotted burial shroud.
Keep: off-white shroud with knots at head, neck and ankles, the two floppy knot ears, pale grey face with glowing cyan eyes, NO arms and NO legs visible.
Motion (walk): small hop cycle in place: 1 squash down, 2 spring up, 3 airborne with bound feet together, 4 land and squash.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>attack.png</code> · Serangan basic (dipakai untuk 3 pukulan)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: POCONG, a ghost wrapped head to toe in a knotted burial shroud.
Keep: off-white shroud with knots at head, neck and ankles, the two floppy knot ears, pale grey face with glowing cyan eyes, NO arms and NO legs visible.
Motion (attack): headbutt chain: 1 lean back, 2 lunge the head forward, 3 full forward headbutt with the body tilted 30 degrees, 4 back upright.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>skill1.png</code> · Jurus 1 (tombol I)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: POCONG, a ghost wrapped head to toe in a knotted burial shroud.
Keep: off-white shroud with knots at head, neck and ankles, the two floppy knot ears, pale grey face with glowing cyan eyes, NO arms and NO legs visible.
Motion (skill1): Tali Pocong: 1 tilt the head down and back, 2 whip the head up and forward as if flinging a rope from the neck knot, 3 body stretched forward and upward at the end of the throw, 4 back upright (do not draw the rope; the game adds it).

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>skill2.png</code> · Jurus 2 (tombol O)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: POCONG, a ghost wrapped head to toe in a knotted burial shroud.
Keep: off-white shroud with knots at head, neck and ankles, the two floppy knot ears, pale grey face with glowing cyan eyes, NO arms and NO legs visible.
Motion (skill2): Lompat Pocong: 1 deep squash, 2 launch forward low and long, 3 flying horizontally head first, 4 landing squash.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>ultimate.png</code> · Ultimate (tombol P)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: POCONG, a ghost wrapped head to toe in a knotted burial shroud.
Keep: off-white shroud with knots at head, neck and ankles, the two floppy knot ears, pale grey face with glowing cyan eyes, NO arms and NO legs visible.
Motion (ultimate): Hujan Pocong command: 1 upright, 2 lean back looking at the sky, 3 shroud strips flare upward as he calls, 4 back to upright.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>hurt.png</code> · Terkena pukulan</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: POCONG, a ghost wrapped head to toe in a knotted burial shroud.
Keep: off-white shroud with knots at head, neck and ankles, the two floppy knot ears, pale grey face with glowing cyan eyes, NO arms and NO legs visible.
Motion (hurt): recoil: 1 hit flash pose bending backward, 2 bend further back, 3 wobble forward, 4 upright again.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>down.png</code> · Jatuh (diputar mundur untuk bangkit)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: POCONG, a ghost wrapped head to toe in a knotted burial shroud.
Keep: off-white shroud with knots at head, neck and ankles, the two floppy knot ears, pale grey face with glowing cyan eyes, NO arms and NO legs visible.
Motion (down): falls like a bolster: 1 tipping backward, 2 falling at 45 degrees, 3 hitting the ground, 4 lying flat on the ground line, head to the LEFT.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. Every pose rests on the ground line; the last pose lies flat on it. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>


### Kuntilanak

Referensi 1: `assets/ghosts/base/kuntilanak.webp` · Referensi 2: `assets/ghosts/guides/guide-4pose-magenta.png` · simpan di `assets/ghosts/strips/kuntilanak/`

<details><summary><code>idle.png</code> · Diam</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: KUNTILANAK, a laughing ghost woman in a white gown.
Keep: long tattered off-white gown hiding the feet, very long straight black hair, pale blue-grey skin, glowing white eyes, white waru flower in the hair, long dark nails.
Motion (idle): hovering: the gown hem and hair drift gently, head tilts slightly, hands hang with clawed fingers.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>walk.png</code> · Jalan (dipakai juga untuk lari)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: KUNTILANAK, a laughing ghost woman in a white gown.
Keep: long tattered off-white gown hiding the feet, very long straight black hair, pale blue-grey skin, glowing white eyes, white waru flower in the hair, long dark nails.
Motion (walk): gliding without steps: 1 hem back, 2 body rises a little, 3 hem flows forward, 4 body sinks; hair streams behind.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>attack.png</code> · Serangan basic (dipakai untuk 3 pukulan)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: KUNTILANAK, a laughing ghost woman in a white gown.
Keep: long tattered off-white gown hiding the feet, very long straight black hair, pale blue-grey skin, glowing white eyes, white waru flower in the hair, long dark nails.
Motion (attack): claw chain: 1 claws pulled back, 2 slash forward high, 3 lunge with both claws low, 4 recover.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>skill1.png</code> · Jurus 1 (tombol I)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: KUNTILANAK, a laughing ghost woman in a white gown.
Keep: long tattered off-white gown hiding the feet, very long straight black hair, pale blue-grey skin, glowing white eyes, white waru flower in the hair, long dark nails.
Motion (skill1): Tawa Melengking: 1 hand to mouth giggling, 2 head thrown back laughing, 3 mouth wide open screaming forward, 4 settle.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>skill2.png</code> · Jurus 2 (tombol O)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: KUNTILANAK, a laughing ghost woman in a white gown.
Keep: long tattered off-white gown hiding the feet, very long straight black hair, pale blue-grey skin, glowing white eyes, white waru flower in the hair, long dark nails.
Motion (skill2): Jatuh dari Waru: 1 rise high, 2 hair spreads above, 3 drop with claws down, 4 crouched impact pose.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>ultimate.png</code> · Ultimate (tombol P)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: KUNTILANAK, a laughing ghost woman in a white gown.
Keep: long tattered off-white gown hiding the feet, very long straight black hair, pale blue-grey skin, glowing white eyes, white waru flower in the hair, long dark nails.
Motion (ultimate): Malam Pohon Waru command: 1 upright, 2 arms rise, 3 arms spread wide with hair flaring, 4 back to idle.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>hurt.png</code> · Terkena pukulan</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: KUNTILANAK, a laughing ghost woman in a white gown.
Keep: long tattered off-white gown hiding the feet, very long straight black hair, pale blue-grey skin, glowing white eyes, white waru flower in the hair, long dark nails.
Motion (hurt): recoil: 1 snap backward, 2 hair whips forward, 3 drift back, 4 upright.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>down.png</code> · Jatuh (diputar mundur untuk bangkit)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: KUNTILANAK, a laughing ghost woman in a white gown.
Keep: long tattered off-white gown hiding the feet, very long straight black hair, pale blue-grey skin, glowing white eyes, white waru flower in the hair, long dark nails.
Motion (down): collapse: 1 falling backward, 2 gown crumpling, 3 hitting the ground, 4 lying flat with hair spread, head to the LEFT.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>


### Sundel Bolong

Referensi 1: `assets/ghosts/base/sundelbolong.webp` · Referensi 2: `assets/ghosts/guides/guide-4pose-magenta.png` · simpan di `assets/ghosts/strips/sundelbolong/`

<details><summary><code>idle.png</code> · Diam</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: SUNDEL BOLONG, a long-haired ghost woman with a hole in her back.
Keep: cream ragged dress, very long black hair, pale skin, glowing cyan ring around the dark hole in her back, cyan eyes.
Motion (idle): hovering, shoulders rise and fall, hair drifts, the cyan ring in the back pulses slightly.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>walk.png</code> · Jalan (dipakai juga untuk lari)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: SUNDEL BOLONG, a long-haired ghost woman with a hole in her back.
Keep: cream ragged dress, very long black hair, pale skin, glowing cyan ring around the dark hole in her back, cyan eyes.
Motion (walk): slow glide: 1 lean forward, 2 hem trails, 3 hair streams, 4 settle.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>attack.png</code> · Serangan basic (dipakai untuk 3 pukulan)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: SUNDEL BOLONG, a long-haired ghost woman with a hole in her back.
Keep: cream ragged dress, very long black hair, pale skin, glowing cyan ring around the dark hole in her back, cyan eyes.
Motion (attack): vengeful claws: 1 wind up, 2 slash, 3 double claw lunge, 4 recover.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>skill1.png</code> · Jurus 1 (tombol I)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: SUNDEL BOLONG, a long-haired ghost woman with a hole in her back.
Keep: cream ragged dress, very long black hair, pale skin, glowing cyan ring around the dark hole in her back, cyan eyes.
Motion (skill1): Arwah Memantul: 1 turns her back to show the glowing hole, 2 the cyan ring glows brighter, 3 she spins back forward flinging her arm out, 4 recover.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>skill2.png</code> · Jurus 2 (tombol O)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: SUNDEL BOLONG, a long-haired ghost woman with a hole in her back.
Keep: cream ragged dress, very long black hair, pale skin, glowing cyan ring around the dark hole in her back, cyan eyes.
Motion (skill2): Balas Dendam guard: 1 arms crossed in front, 2 hair wraps around her like a shield, 3 hold, 4 open again.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>ultimate.png</code> · Ultimate (tombol P)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: SUNDEL BOLONG, a long-haired ghost woman with a hole in her back.
Keep: cream ragged dress, very long black hair, pale skin, glowing cyan ring around the dark hole in her back, cyan eyes.
Motion (ultimate): Dendam Kesumat command: 1 head bowed, 2 rises with arms down and fists clenched, 3 head thrown back screaming, 4 back to idle.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>hurt.png</code> · Terkena pukulan</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: SUNDEL BOLONG, a long-haired ghost woman with a hole in her back.
Keep: cream ragged dress, very long black hair, pale skin, glowing cyan ring around the dark hole in her back, cyan eyes.
Motion (hurt): recoil: 1 snap back, 2 hair flies forward, 3 drift back, 4 upright.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>down.png</code> · Jatuh (diputar mundur untuk bangkit)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: SUNDEL BOLONG, a long-haired ghost woman with a hole in her back.
Keep: cream ragged dress, very long black hair, pale skin, glowing cyan ring around the dark hole in her back, cyan eyes.
Motion (down): collapse backward to lie flat, face up, hair spread, head to the LEFT.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>


### Wewe Gombel

Referensi 1: `assets/ghosts/base/wewegombel.webp` · Referensi 2: `assets/ghosts/guides/guide-4pose-green.png` · simpan di `assets/ghosts/strips/wewegombel/`

<details><summary><code>idle.png</code> · Diam</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: WEWE GOMBEL, a hunched old ghost woman.
Keep: wild grey-white curly hair, wrinkled grey-brown skin, brown batik sarong, cream torn shawl, very long dark claws, bare feet.
Motion (idle): hunched breathing, claws twitching, hair swaying.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>walk.png</code> · Jalan (dipakai juga untuk lari)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: WEWE GOMBEL, a hunched old ghost woman.
Keep: wild grey-white curly hair, wrinkled grey-brown skin, brown batik sarong, cream torn shawl, very long dark claws, bare feet.
Motion (walk): creeping walk: legs alternate in a crouch, arms hanging forward.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>attack.png</code> · Serangan basic (dipakai untuk 3 pukulan)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: WEWE GOMBEL, a hunched old ghost woman.
Keep: wild grey-white curly hair, wrinkled grey-brown skin, brown batik sarong, cream torn shawl, very long dark claws, bare feet.
Motion (attack): long arms: 1 reach back, 2 arm stretched far forward, 3 both arms stretched long forward, 4 recover.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>skill1.png</code> · Jurus 1 (tombol I)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: WEWE GOMBEL, a hunched old ghost woman.
Keep: wild grey-white curly hair, wrinkled grey-brown skin, brown batik sarong, cream torn shawl, very long dark claws, bare feet.
Motion (skill1): Selendang Melayang: 1 pull the shawl off the shoulder, 2 swing it back, 3 hurl it forward spinning, 4 empty hand recover.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>skill2.png</code> · Jurus 2 (tombol O)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: WEWE GOMBEL, a hunched old ghost woman.
Keep: wild grey-white curly hair, wrinkled grey-brown skin, brown batik sarong, cream torn shawl, very long dark claws, bare feet.
Motion (skill2): Gondol!: 1 crouch, 2 one arm shoots forward impossibly long, 3 grab and pull back toward her, 4 cackling with hands close.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>ultimate.png</code> · Ultimate (tombol P)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: WEWE GOMBEL, a hunched old ghost woman.
Keep: wild grey-white curly hair, wrinkled grey-brown skin, brown batik sarong, cream torn shawl, very long dark claws, bare feet.
Motion (ultimate): Sarang Aren command: 1 hunched, 2 rises tall, 3 arms spread with shawl flaring, 4 back to idle.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>hurt.png</code> · Terkena pukulan</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: WEWE GOMBEL, a hunched old ghost woman.
Keep: wild grey-white curly hair, wrinkled grey-brown skin, brown batik sarong, cream torn shawl, very long dark claws, bare feet.
Motion (hurt): recoil: 1 jerk back, 2 stagger, 3 hunch, 4 upright.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>down.png</code> · Jatuh (diputar mundur untuk bangkit)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: WEWE GOMBEL, a hunched old ghost woman.
Keep: wild grey-white curly hair, wrinkled grey-brown skin, brown batik sarong, cream torn shawl, very long dark claws, bare feet.
Motion (down): falls backward and lies flat, hair spread, head to the LEFT.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. Every pose rests on the ground line; the last pose lies flat on it. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>


### Genderuwo

Referensi 1: `assets/ghosts/base/genderuwo.webp` · Referensi 2: `assets/ghosts/guides/guide-4pose-green.png` · simpan di `assets/ghosts/strips/genderuwo/`

<details><summary><code>idle.png</code> · Diam</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: GENDERUWO, a giant hairy forest spirit.
Keep: huge build with shaggy dark brown fur, leaves and roots in the fur, tusks, ember-orange eyes, batik loincloth, grey boulder in the right hand.
Motion (idle): heavy breathing, shoulders rise and fall, knuckles near the ground.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>walk.png</code> · Jalan (dipakai juga untuk lari)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: GENDERUWO, a giant hairy forest spirit.
Keep: huge build with shaggy dark brown fur, leaves and roots in the fur, tusks, ember-orange eyes, batik loincloth, grey boulder in the right hand.
Motion (walk): heavy ape walk: alternating legs, knuckles swinging.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>attack.png</code> · Serangan basic (dipakai untuk 3 pukulan)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: GENDERUWO, a giant hairy forest spirit.
Keep: huge build with shaggy dark brown fur, leaves and roots in the fur, tusks, ember-orange eyes, batik loincloth, grey boulder in the right hand.
Motion (attack): heavy punches: 1 wind up, 2 hook punch, 3 two-hand hammer smash to the ground, 4 recover.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>skill1.png</code> · Jurus 1 (tombol I)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: GENDERUWO, a giant hairy forest spirit.
Keep: huge build with shaggy dark brown fur, leaves and roots in the fur, tusks, ember-orange eyes, batik loincloth, grey boulder in the right hand.
Motion (skill1): Lempar Batu Gaib: 1 boulder raised behind the head, 2 swing forward, 3 release with arm extended, 4 recover.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>skill2.png</code> · Jurus 2 (tombol O)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: GENDERUWO, a giant hairy forest spirit.
Keep: huge build with shaggy dark brown fur, leaves and roots in the fur, tusks, ember-orange eyes, batik loincloth, grey boulder in the right hand.
Motion (skill2): Seruduk Rimba: 1 lower the shoulder, 2 charge forward, 3 full shoulder ram, 4 recover.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>ultimate.png</code> · Ultimate (tombol P)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: GENDERUWO, a giant hairy forest spirit.
Keep: huge build with shaggy dark brown fur, leaves and roots in the fur, tusks, ember-orange eyes, batik loincloth, grey boulder in the right hand.
Motion (ultimate): Amuk Beringin: 1 crouch, 2 rise roaring with fists up, 3 pound the chest, 4 fists down on the ground.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>hurt.png</code> · Terkena pukulan</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: GENDERUWO, a giant hairy forest spirit.
Keep: huge build with shaggy dark brown fur, leaves and roots in the fur, tusks, ember-orange eyes, batik loincloth, grey boulder in the right hand.
Motion (hurt): recoil: 1 head snaps back, 2 stagger back, 3 shake it off, 4 upright.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>down.png</code> · Jatuh (diputar mundur untuk bangkit)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: GENDERUWO, a giant hairy forest spirit.
Keep: huge build with shaggy dark brown fur, leaves and roots in the fur, tusks, ember-orange eyes, batik loincloth, grey boulder in the right hand.
Motion (down): falls backward like a tree, lies flat on its back, head to the LEFT.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. Every pose rests on the ground line; the last pose lies flat on it. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>


### Eyang Sukmo Capo

Referensi 1: `assets/ghosts/base/eyangsukmocapo.webp` · Referensi 2: `assets/ghosts/guides/guide-4pose-magenta.png` · simpan di `assets/ghosts/strips/eyangsukmocapo/`

<details><summary><code>idle.png</code> · Diam</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: EYANG SUKMO CAPO, an old Javanese guardian spirit.
Keep: brown batik blangkon headcloth, dark beskap jacket, white long beard and eyebrows, brown batik sarong, twisted wooden staff in the left hand, white smoke at the feet.
Motion (idle): calm floating, beard and sash sway, smoke curls at the feet.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>walk.png</code> · Jalan (dipakai juga untuk lari)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: EYANG SUKMO CAPO, an old Javanese guardian spirit.
Keep: brown batik blangkon headcloth, dark beskap jacket, white long beard and eyebrows, brown batik sarong, twisted wooden staff in the left hand, white smoke at the feet.
Motion (walk): floating forward with the staff swinging gently.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>attack.png</code> · Serangan basic (dipakai untuk 3 pukulan)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: EYANG SUKMO CAPO, an old Javanese guardian spirit.
Keep: brown batik blangkon headcloth, dark beskap jacket, white long beard and eyebrows, brown batik sarong, twisted wooden staff in the left hand, white smoke at the feet.
Motion (attack): staff forms: 1 staff back, 2 forward thrust, 3 overhead strike down, 4 recover.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>skill1.png</code> · Jurus 1 (tombol I)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: EYANG SUKMO CAPO, an old Javanese guardian spirit.
Keep: brown batik blangkon headcloth, dark beskap jacket, white long beard and eyebrows, brown batik sarong, twisted wooden staff in the left hand, white smoke at the feet.
Motion (skill1): Gelombang Sukma: 1 palm drawn back to the hip, 2 palm pushed forward, 3 palm fully extended, 4 recover.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>skill2.png</code> · Jurus 2 (tombol O)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: EYANG SUKMO CAPO, an old Javanese guardian spirit.
Keep: brown batik blangkon headcloth, dark beskap jacket, white long beard and eyebrows, brown batik sarong, twisted wooden staff in the left hand, white smoke at the feet.
Motion (skill2): Hentak Bumi: 1 staff raised high, 2 leap, 3 staff slammed into the ground, 4 recover.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>ultimate.png</code> · Ultimate (tombol P)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: EYANG SUKMO CAPO, an old Javanese guardian spirit.
Keep: brown batik blangkon headcloth, dark beskap jacket, white long beard and eyebrows, brown batik sarong, twisted wooden staff in the left hand, white smoke at the feet.
Motion (ultimate): Sabda Keramat: 1 eyes closed meditating, 2 staff raised overhead, 3 open palm forward with the beard blown back, 4 back to idle.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>hurt.png</code> · Terkena pukulan</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: EYANG SUKMO CAPO, an old Javanese guardian spirit.
Keep: brown batik blangkon headcloth, dark beskap jacket, white long beard and eyebrows, brown batik sarong, twisted wooden staff in the left hand, white smoke at the feet.
Motion (hurt): recoil: 1 lean back, 2 steady with the staff, 3 straighten, 4 upright.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>down.png</code> · Jatuh (diputar mundur untuk bangkit)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: EYANG SUKMO CAPO, an old Javanese guardian spirit.
Keep: brown batik blangkon headcloth, dark beskap jacket, white long beard and eyebrows, brown batik sarong, twisted wooden staff in the left hand, white smoke at the feet.
Motion (down): topples backward and lies flat holding the staff, head to the LEFT.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>


### Leyak

Referensi 1: `assets/ghosts/base/leyak.webp` · Referensi 2: `assets/ghosts/guides/guide-4pose-green.png` · simpan di `assets/ghosts/strips/leyak/`

<details><summary><code>idle.png</code> · Diam</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: LEYAK, a Balinese fire witch.
Keep: wild white-grey flame-like hair, bulging eyes, long red tongue, black wrap with gold flame pattern, gold cuffs and anklets, long claws, orange flame in the right palm.
Motion (idle): crouched witch stance, swaying, the flame flickers in the palm.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>walk.png</code> · Jalan (dipakai juga untuk lari)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: LEYAK, a Balinese fire witch.
Keep: wild white-grey flame-like hair, bulging eyes, long red tongue, black wrap with gold flame pattern, gold cuffs and anklets, long claws, orange flame in the right palm.
Motion (walk): crouched walk, legs alternating, hair flaring.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>attack.png</code> · Serangan basic (dipakai untuk 3 pukulan)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: LEYAK, a Balinese fire witch.
Keep: wild white-grey flame-like hair, bulging eyes, long red tongue, black wrap with gold flame pattern, gold cuffs and anklets, long claws, orange flame in the right palm.
Motion (attack): ember claws: 1 claw back, 2 slash, 3 double slash low, 4 recover.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>skill1.png</code> · Jurus 1 (tombol I)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: LEYAK, a Balinese fire witch.
Keep: wild white-grey flame-like hair, bulging eyes, long red tongue, black wrap with gold flame pattern, gold cuffs and anklets, long claws, orange flame in the right palm.
Motion (skill1): Api Leyak: 1 palm flame drawn back, 2 arm swinging forward, 3 arm fully extended with the palm open after the throw, 4 recover.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>skill2.png</code> · Jurus 2 (tombol O)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: LEYAK, a Balinese fire witch.
Keep: wild white-grey flame-like hair, bulging eyes, long red tongue, black wrap with gold flame pattern, gold cuffs and anklets, long claws, orange flame in the right palm.
Motion (skill2): Terjang Malam: 1 crouch low, 2 lunge forward, 3 full lunge with both claws out, 4 recover.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>ultimate.png</code> · Ultimate (tombol P)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: LEYAK, a Balinese fire witch.
Keep: wild white-grey flame-like hair, bulging eyes, long red tongue, black wrap with gold flame pattern, gold cuffs and anklets, long claws, orange flame in the right palm.
Motion (ultimate): Malam Pengleakan transformation: 1 hunched, 2 hair bursts into flame, 3 arms and head thrown back, 4 crouched glowing.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>hurt.png</code> · Terkena pukulan</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: LEYAK, a Balinese fire witch.
Keep: wild white-grey flame-like hair, bulging eyes, long red tongue, black wrap with gold flame pattern, gold cuffs and anklets, long claws, orange flame in the right palm.
Motion (hurt): recoil: 1 snap back, 2 tongue out, 3 stagger, 4 upright.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>down.png</code> · Jatuh (diputar mundur untuk bangkit)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: LEYAK, a Balinese fire witch.
Keep: wild white-grey flame-like hair, bulging eyes, long red tongue, black wrap with gold flame pattern, gold cuffs and anklets, long claws, orange flame in the right palm.
Motion (down): falls backward and lies flat, hair spread, head to the LEFT.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. Every pose rests on the ground line; the last pose lies flat on it. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>


### Kuyang

Referensi 1: `assets/ghosts/base/kuyang.webp` · Referensi 2: `assets/ghosts/guides/guide-4pose-green.png` · simpan di `assets/ghosts/strips/kuyang/`

<details><summary><code>idle.png</code> · Diam</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: KUYANG, a Borneo night witch whose head flies.
Keep: long wavy black hair with glowing red strands, pale skin, red eyes, small fangs, long-sleeved black top, purple patterned sarong, clay oil lamp with a red flame.
Motion (idle): standing, hair drifting upward, red strands glow.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>walk.png</code> · Jalan (dipakai juga untuk lari)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: KUYANG, a Borneo night witch whose head flies.
Keep: long wavy black hair with glowing red strands, pale skin, red eyes, small fangs, long-sleeved black top, purple patterned sarong, clay oil lamp with a red flame.
Motion (walk): barefoot walk, sarong swaying.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>attack.png</code> · Serangan basic (dipakai untuk 3 pukulan)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: KUYANG, a Borneo night witch whose head flies.
Keep: long wavy black hair with glowing red strands, pale skin, red eyes, small fangs, long-sleeved black top, purple patterned sarong, clay oil lamp with a red flame.
Motion (attack): night claws: 1 wind up, 2 slash, 3 spinning slash, 4 recover.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>skill1.png</code> · Jurus 1 (tombol I)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: KUYANG, a Borneo night witch whose head flies.
Keep: long wavy black hair with glowing red strands, pale skin, red eyes, small fangs, long-sleeved black top, purple patterned sarong, clay oil lamp with a red flame.
Motion (skill1): Pita Arwah: 1 lamp raised, 2 hair whips forward, 3 red hair strands shoot forward like ribbons, 4 recover.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>skill2.png</code> · Jurus 2 (tombol O)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: KUYANG, a Borneo night witch whose head flies.
Keep: long wavy black hair with glowing red strands, pale skin, red eyes, small fangs, long-sleeved black top, purple patterned sarong, clay oil lamp with a red flame.
Motion (skill2): Kibas Rambut: 1 head turned back, 2 hair swung, 3 hair sweeps forward wide, 4 recover.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>ultimate.png</code> · Ultimate (tombol P)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: KUYANG, a Borneo night witch whose head flies.
Keep: long wavy black hair with glowing red strands, pale skin, red eyes, small fangs, long-sleeved black top, purple patterned sarong, clay oil lamp with a red flame.
Motion (ultimate): Pesta Kuyang: 1 upright, 2 head rises off the shoulders a little, 3 head floats above the body with red glow below it, 4 head returns.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>hurt.png</code> · Terkena pukulan</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: KUYANG, a Borneo night witch whose head flies.
Keep: long wavy black hair with glowing red strands, pale skin, red eyes, small fangs, long-sleeved black top, purple patterned sarong, clay oil lamp with a red flame.
Motion (hurt): recoil: 1 snap back, 2 hair forward, 3 stagger, 4 upright.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>down.png</code> · Jatuh (diputar mundur untuk bangkit)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: KUYANG, a Borneo night witch whose head flies.
Keep: long wavy black hair with glowing red strands, pale skin, red eyes, small fangs, long-sleeved black top, purple patterned sarong, clay oil lamp with a red flame.
Motion (down): falls backward and lies flat, hair spread, head to the LEFT.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. Every pose rests on the ground line; the last pose lies flat on it. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>


### Palasik

Referensi 1: `assets/ghosts/base/palasik.webp` · Referensi 2: `assets/ghosts/guides/guide-4pose-green.png` · simpan di `assets/ghosts/strips/palasik/`

<details><summary><code>idle.png</code> · Diam</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: PALASIK, a floating bodiless head from West Sumatra.
Keep: only a head: old wrinkled face, bald top, long grey hair, glowing red eyes, fangs, dark red smoke ribbons trailing below; NO body.
Motion (idle): floating head bobbing, smoke ribbons swirling below.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>walk.png</code> · Jalan (dipakai juga untuk lari)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: PALASIK, a floating bodiless head from West Sumatra.
Keep: only a head: old wrinkled face, bald top, long grey hair, glowing red eyes, fangs, dark red smoke ribbons trailing below; NO body.
Motion (walk): floating forward, ribbons trail behind.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>attack.png</code> · Serangan basic (dipakai untuk 3 pukulan)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: PALASIK, a floating bodiless head from West Sumatra.
Keep: only a head: old wrinkled face, bald top, long grey hair, glowing red eyes, fangs, dark red smoke ribbons trailing below; NO body.
Motion (attack): bites: 1 pull back, 2 dart forward jaws open, 3 bite with head tilted, 4 recover.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>skill1.png</code> · Jurus 1 (tombol I)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: PALASIK, a floating bodiless head from West Sumatra.
Keep: only a head: old wrinkled face, bald top, long grey hair, glowing red eyes, fangs, dark red smoke ribbons trailing below; NO body.
Motion (skill1): Kepala Mengambang: 1 head lowers, 2 mouth opens, 3 head jerks forward spitting with the mouth wide open, 4 recover.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>skill2.png</code> · Jurus 2 (tombol O)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: PALASIK, a floating bodiless head from West Sumatra.
Keep: only a head: old wrinkled face, bald top, long grey hair, glowing red eyes, fangs, dark red smoke ribbons trailing below; NO body.
Motion (skill2): Isap Sari: 1 head tilts back, 2 mouth wide, 3 inhaling with ribbons pulled forward, 4 recover.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>ultimate.png</code> · Ultimate (tombol P)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: PALASIK, a floating bodiless head from West Sumatra.
Keep: only a head: old wrinkled face, bald top, long grey hair, glowing red eyes, fangs, dark red smoke ribbons trailing below; NO body.
Motion (ultimate): Tiga Kepala: 1 still, 2 rises, 3 eyes blaze with ribbons spread in a circle, 4 back down.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>hurt.png</code> · Terkena pukulan</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: PALASIK, a floating bodiless head from West Sumatra.
Keep: only a head: old wrinkled face, bald top, long grey hair, glowing red eyes, fangs, dark red smoke ribbons trailing below; NO body.
Motion (hurt): recoil: 1 spun back, 2 tilted, 3 wobble, 4 upright.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>down.png</code> · Jatuh (diputar mundur untuk bangkit)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: PALASIK, a floating bodiless head from West Sumatra.
Keep: only a head: old wrinkled face, bald top, long grey hair, glowing red eyes, fangs, dark red smoke ribbons trailing below; NO body.
Motion (down): drops and rolls on the ground: 1 drop, 2 hit ground, 3 roll, 4 resting on its side on the ground line.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The character hovers: its lowest point (hem, smoke or trailing tail) stays at the same small height above the ground line in every pose, except where the motion says to rise, leap or drop. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>


### Tuyul

Referensi 1: `assets/ghosts/base/tuyul.webp` · Referensi 2: `assets/ghosts/guides/guide-4pose-magenta.png` · simpan di `assets/ghosts/strips/tuyul/`

<details><summary><code>idle.png</code> · Diam</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: TUYUL, a small bald thief spirit.
Keep: bald grey child body, big round head and ears, big brown eyes, buck teeth grin, brown patched shirt and shorts, coin sack on the back.
Motion (idle): sneaky tiptoe bounce, sack bobbing.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>walk.png</code> · Jalan (dipakai juga untuk lari)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: TUYUL, a small bald thief spirit.
Keep: bald grey child body, big round head and ears, big brown eyes, buck teeth grin, brown patched shirt and shorts, coin sack on the back.
Motion (walk): tiptoe sprint, arms pumping, head bobbing.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>attack.png</code> · Serangan basic (dipakai untuk 3 pukulan)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: TUYUL, a small bald thief spirit.
Keep: bald grey child body, big round head and ears, big brown eyes, buck teeth grin, brown patched shirt and shorts, coin sack on the back.
Motion (attack): quick jabs: 1 small punch, 2 other hand, 3 jumping bite, 4 recover.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>skill1.png</code> · Jurus 1 (tombol I)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: TUYUL, a small bald thief spirit.
Keep: bald grey child body, big round head and ears, big brown eyes, buck teeth grin, brown patched shirt and shorts, coin sack on the back.
Motion (skill1): Lempar Koin: 1 hand in the sack, 2 arm back holding a coin, 3 throw forward, 4 recover.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>skill2.png</code> · Jurus 2 (tombol O)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: TUYUL, a small bald thief spirit.
Keep: bald grey child body, big round head and ears, big brown eyes, buck teeth grin, brown patched shirt and shorts, coin sack on the back.
Motion (skill2): Copet Kilat: 1 crouch, 2 dash forward low, 3 grabbing hand out, 4 holding a stolen coin pouch grinning.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>ultimate.png</code> · Ultimate (tombol P)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: TUYUL, a small bald thief spirit.
Keep: bald grey child body, big round head and ears, big brown eyes, buck teeth grin, brown patched shirt and shorts, coin sack on the back.
Motion (ultimate): Pesugihan Kilat: 1 hug the sack, 2 lift it overhead, 3 coins spilling as he laughs, 4 back to idle.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>hurt.png</code> · Terkena pukulan</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: TUYUL, a small bald thief spirit.
Keep: bald grey child body, big round head and ears, big brown eyes, buck teeth grin, brown patched shirt and shorts, coin sack on the back.
Motion (hurt): recoil: 1 jerk back, 2 sack bounces, 3 stagger, 4 upright.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>down.png</code> · Jatuh (diputar mundur untuk bangkit)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: TUYUL, a small bald thief spirit.
Keep: bald grey child body, big round head and ears, big brown eyes, buck teeth grin, brown patched shirt and shorts, coin sack on the back.
Motion (down): tumbles backward and lies on his back with the sack beside him, head to the LEFT.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. Every pose rests on the ground line; the last pose lies flat on it. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>


### Jenglot

Referensi 1: `assets/ghosts/base/jenglot.webp` · Referensi 2: `assets/ghosts/guides/guide-4pose-green.png` · simpan di `assets/ghosts/strips/jenglot/`

<details><summary><code>idle.png</code> · Diam</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: JENGLOT, a tiny shrivelled doll-like creature.
Keep: very small hunched brown body, very long tangled black hair, red eyes, fangs, long white claws, torn brown loincloth.
Motion (idle): hunched twitching, hair swaying, claws flexing.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>walk.png</code> · Jalan (dipakai juga untuk lari)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: JENGLOT, a tiny shrivelled doll-like creature.
Keep: very small hunched brown body, very long tangled black hair, red eyes, fangs, long white claws, torn brown loincloth.
Motion (walk): scuttling crouched walk.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>attack.png</code> · Serangan basic (dipakai untuk 3 pukulan)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: JENGLOT, a tiny shrivelled doll-like creature.
Keep: very small hunched brown body, very long tangled black hair, red eyes, fangs, long white claws, torn brown loincloth.
Motion (attack): claws: 1 wind up, 2 slash, 3 leaping slash, 4 recover.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>skill1.png</code> · Jurus 1 (tombol I)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: JENGLOT, a tiny shrivelled doll-like creature.
Keep: very small hunched brown body, very long tangled black hair, red eyes, fangs, long white claws, torn brown loincloth.
Motion (skill1): Kuku Terbang: 1 arm back, 2 flick forward, 3 arm extended with claws spread, 4 recover.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>skill2.png</code> · Jurus 2 (tombol O)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: JENGLOT, a tiny shrivelled doll-like creature.
Keep: very small hunched brown body, very long tangled black hair, red eyes, fangs, long white claws, torn brown loincloth.
Motion (skill2): Terkam Jenglot: 1 crouch, 2 pounce, 3 flying with claws forward, 4 landing.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>ultimate.png</code> · Ultimate (tombol P)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: JENGLOT, a tiny shrivelled doll-like creature.
Keep: very small hunched brown body, very long tangled black hair, red eyes, fangs, long white claws, torn brown loincloth.
Motion (ultimate): Hujan Jenglot: 1 hunched, 2 rises with arms up, 3 shrieking with hair flying up, 4 back to idle.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>hurt.png</code> · Terkena pukulan</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: JENGLOT, a tiny shrivelled doll-like creature.
Keep: very small hunched brown body, very long tangled black hair, red eyes, fangs, long white claws, torn brown loincloth.
Motion (hurt): recoil: 1 snap back, 2 stagger, 3 hunch, 4 upright.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>down.png</code> · Jatuh (diputar mundur untuk bangkit)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: JENGLOT, a tiny shrivelled doll-like creature.
Keep: very small hunched brown body, very long tangled black hair, red eyes, fangs, long white claws, torn brown loincloth.
Motion (down): falls backward and lies flat, hair spread, head to the LEFT.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. Every pose rests on the ground line; the last pose lies flat on it. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>


### Begu Ganjang

Referensi 1: `assets/ghosts/base/beguganjang.webp` · Referensi 2: `assets/ghosts/guides/guide-4pose-magenta.png` · simpan di `assets/ghosts/strips/beguganjang/`

<details><summary><code>idle.png</code> · Diam</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: BEGU GANJANG, a very tall thin spirit from Batak legend.
Keep: very tall skeletal dark grey body, long black hair over the face, glowing white eyes, long arms and fingers, ragged loincloth.
Motion (idle): swaying slowly, long fingers twitching.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>walk.png</code> · Jalan (dipakai juga untuk lari)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: BEGU GANJANG, a very tall thin spirit from Batak legend.
Keep: very tall skeletal dark grey body, long black hair over the face, glowing white eyes, long arms and fingers, ragged loincloth.
Motion (walk): long slow strides, arms dangling.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>attack.png</code> · Serangan basic (dipakai untuk 3 pukulan)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: BEGU GANJANG, a very tall thin spirit from Batak legend.
Keep: very tall skeletal dark grey body, long black hair over the face, glowing white eyes, long arms and fingers, ragged loincloth.
Motion (attack): long reach: 1 arm drawn back, 2 long sweeping arm, 3 both arms stretched far forward, 4 recover.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>skill1.png</code> · Jurus 1 (tombol I)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: BEGU GANJANG, a very tall thin spirit from Batak legend.
Keep: very tall skeletal dark grey body, long black hair over the face, glowing white eyes, long arms and fingers, ragged loincloth.
Motion (skill1): Bayang Merayap: 1 bend down, 2 hand on the ground, 3 hand pushes a shadow forward along the ground, 4 rise.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>skill2.png</code> · Jurus 2 (tombol O)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: BEGU GANJANG, a very tall thin spirit from Batak legend.
Keep: very tall skeletal dark grey body, long black hair over the face, glowing white eyes, long arms and fingers, ragged loincloth.
Motion (skill2): Putaran Ganjang: 1 arms out, 2 spinning, 3 arms sweeping behind, 4 recover.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>ultimate.png</code> · Ultimate (tombol P)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: BEGU GANJANG, a very tall thin spirit from Batak legend.
Keep: very tall skeletal dark grey body, long black hair over the face, glowing white eyes, long arms and fingers, ragged loincloth.
Motion (ultimate): Begu Menjulang: 1 hunched, 2 straightening, 3 stretched even taller with arms up, 4 back to idle.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>hurt.png</code> · Terkena pukulan</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: BEGU GANJANG, a very tall thin spirit from Batak legend.
Keep: very tall skeletal dark grey body, long black hair over the face, glowing white eyes, long arms and fingers, ragged loincloth.
Motion (hurt): recoil: 1 bends back, 2 stagger, 3 sway, 4 upright.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to hop, leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>down.png</code> · Jatuh (diputar mundur untuk bangkit)</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: BEGU GANJANG, a very tall thin spirit from Batak legend.
Keep: very tall skeletal dark grey body, long black hair over the face, glowing white eyes, long arms and fingers, ragged loincloth.
Motion (down): falls backward like a long pole and lies flat, head to the LEFT.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. Every pose rests on the ground line; the last pose lies flat on it. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. No motion lines, no speed lines, no effects, no thrown objects in flight (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

