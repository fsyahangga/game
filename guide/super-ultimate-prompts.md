# Prompt Super Ultimate (gambar AI)

Prompt untuk membuat visual **Super Ultimate** (tombol U, terbuka saat energi sukma penuh 200) di generator gambar yang menerima gambar referensi, misalnya ChatGPT atau Gemini. Nama super dan legendanya ada di `SUPERS` dalam [ghosts.js](../ghosts.js); daftarnya juga ada di [ghost-roster.md](ghost-roster.md).

> **Sudah dipasang.** Gambar sumber (`.png`) diubah menjadi WebP yang dipakai game oleh [build_super_assets.py](tools/build_super_assets.py): latar dihapus, pose disamakan dengan tinggi karakter, efek dipotong 4 frame, dan cut-in dipotong 1400x600. Setelah mengganti atau menambah gambar, jalankan:
>
>     python guide/tools/build_super_assets.py [dedemit ...]
>     node guide/tools/update_precache.mjs
>
> Bagian yang gambarnya belum ada atau gagal dimuat kembali ke visual generik (cut-in ultimate biasa, pilar cahaya, pose ultimate).

## Tiga gambar per dedemit

| File | Isi | Dipakai untuk |
| --- | --- | --- |
| `assets/ghosts/super/<dedemit>-cutin.png` | Ilustrasi sinematik 21:9 | Banner cut-in 1 detik saat super dimulai |
| `assets/ghosts/strips/<dedemit>/super.png` | 4 pose karakter (sprite strip) | Gerakan karakter saat mengeluarkan super |
| `assets/ghosts/super/<dedemit>-fx.png` | 4 frame efek serangan | Efek yang menghantam lawan, diputar di tiap hantaman (5 kali) |

Nama `<dedemit>` sama dengan nama file base: `pocong`, `kuntilanak`, `sundelbolong`, `wewegombel`, `genderuwo`, `eyangsukmocapo`, `leyak`, `kuyang`, `palasik`, `tuyul`, `jenglot`, `beguganjang`.

**Ritme super di game:** cut-in 1 detik (arena berhenti), lalu 5 hantaman pada 0,15 / 0,40 / 0,65 / 0,90 / 1,25 detik. Hantaman terakhir yang paling besar dan menjatuhkan lawan. Efek 4 frame diputar cepat di setiap hantaman, dan yang terakhir digambar lebih besar.

## Cara membuat

1. Buka generator gambar yang bisa menerima gambar referensi.
2. Lampirkan **Referensi 1**: gambar base dedemitnya, `assets/ghosts/base/<dedemit>.webp`.
3. Untuk `super.png` dan `<dedemit>-fx.png`, lampirkan juga **Referensi 2**: panduan layout `assets/ghosts/guides/guide-4pose-magenta.png` atau `guide-4pose-green.png` (tertulis di tiap bagian). Cut-in tidak perlu panduan.
4. Tempel prompt-nya. Semua gambar rasio **21:9**.
5. Periksa hasilnya:
   - **Strip pose dan efek:** tepat 4 gambar terpisah, latar satu warna polos, tidak ada yang menempel atau terpotong.
   - **Cut-in:** wajah dan warna sama dengan base, tidak ada tulisan (game menulis nama super sendiri).
6. Simpan di lokasi tabel di atas. Kalau hasilnya kurang pas, ulangi saja; biasanya 2–3 kali sudah dapat yang bagus.

Mulai dari satu dedemit dulu, misalnya Pocong, supaya kita bisa memasang dan menilai hasilnya di game sebelum membuat sebelas lainnya.

## Prompt per dedemit

Setiap prompt sudah lengkap untuk satu gambar: salin, lampirkan referensinya, lalu kirim.

### Pocong · LIANG LAHAT

Referensi 1: `assets/ghosts/base/pocong.webp` · Referensi 2: `assets/ghosts/guides/guide-4pose-magenta.png` · latar magenta

*Pocong rises from the grave because the knots of his burial shroud were never untied; his super drags the enemy down into an open grave.*

<details><summary><code>pocong-cutin.png</code> · Cut-in super · simpan di `assets/ghosts/super/`</summary>

```text
Create a cinematic cut-in illustration for the super ultimate move "LIANG LAHAT" in a 2D Indonesian folklore horror fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions and art style).

Character: POCONG, a ghost wrapped head to toe in a knotted burial shroud.
Keep: off-white shroud with knots at head, neck and ankles, the two floppy knot ears, pale grey face with glowing cyan eyes, NO arms and NO legs visible.
Scene: Pocong rising out of an old Javanese village graveyard at midnight, wooden grave markers and a frangipani tree around him, full moon behind, mist on the ground, his cyan eyes glowing.
Legend: Pocong rises from the grave because the knots of his burial shroud were never untied; his super drags the enemy down into an open grave.

Composition: wide 21:9 banner. The character is large and dramatic, framed from the chest or waist up, placed in the RIGHT half of the image and facing RIGHT, leaning toward the viewer with an intense expression. The LEFT third of the image is darker and calmer (the game overlays the move name there). Strong cyan and bone white rim light, glowing eyes, high contrast, painterly anime fighting-game splash art with a slight pixel-art texture. Dark night palette.
No text, no letters, no logo, no watermark, no border, no UI.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>super.png</code> · Pose karakter · simpan di `assets/ghosts/strips/pocong/`</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game: the SUPER ULTIMATE move "LIANG LAHAT".
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: POCONG, a ghost wrapped head to toe in a knotted burial shroud.
Keep: off-white shroud with knots at head, neck and ankles, the two floppy knot ears, pale grey face with glowing cyan eyes, NO arms and NO legs visible.
Motion (super ultimate, 4 poses): (1) crouches low, the bound body squeezed down like a spring, knot ears flattened; (2) a huge hop straight up, shroud stretched tight, eyes blazing cyan (draw this pose higher in its slot); (3) lands with full weight, body tilted forward, loose rope ends whipping outward; (4) stands rigid and tall, head thrown back, every knot and loose cloth strip flaring upward as if pulled by wind from below.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. Make the poses big, dramatic and powerful, like a finishing move in a fighting game, but draw only the character: no motion lines, no speed lines, no energy effects, no projectiles (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character or the effect.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>pocong-fx.png</code> · Efek hantaman · simpan di `assets/ghosts/super/`</summary>

```text
Create a single horizontal effect sprite strip for a 2D side-view fighting game: the hit effect of the SUPER ULTIMATE move "LIANG LAHAT" used by POCONG, a ghost wrapped head to toe in a knotted burial shroud.
Reference 1 shows the character only for art style and colour; do NOT draw the character.
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Effect: an open grave tearing through the ground under the enemy. Frame 1: a jagged crack in dark earth with a thin cyan glow inside. Frame 2: the grave bursts open, clods of soil flying up, three glowing cyan burial-shroud ropes shooting upward. Frame 3 (peak): a tall column of cyan light and grave soil with the ropes spiralling around it and a small wooden grave marker tumbling out. Frame 4: the column collapses into dust, drifting frangipani (kamboja) petals and fading rope ends.
Colours: cyan and bone white.

Rules: exactly 4 frames in one row, left to right in time order, one centred in each slot. The effect lands on an enemy standing on the ground line, so its base sits on the ground line and it rises upward; frames may be taller than wide. Keep a clear empty gap between frames; nothing touches, overlaps or leaves its slot. Draw ONLY the effect: no character, no enemy, no scenery, no text, no frame numbers. Bold readable shapes with a dark outline, glowing core and strong contrast so it reads at small size in a pixel-art-styled game; match the art style of Reference 1.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character or the effect.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

### Kuntilanak · KUNTILANAK MERAH

Referensi 1: `assets/ghosts/base/kuntilanak.webp` · Referensi 2: `assets/ghosts/guides/guide-4pose-magenta.png` · latar magenta

*The red kuntilanak is the most vicious form of the ghost; in her super her gown and eyes bleed into deep red.*

<details><summary><code>kuntilanak-cutin.png</code> · Cut-in super · simpan di `assets/ghosts/super/`</summary>

```text
Create a cinematic cut-in illustration for the super ultimate move "KUNTILANAK MERAH" in a 2D Indonesian folklore horror fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions and art style).

Character: KUNTILANAK, a laughing ghost woman in a white gown.
Keep: long tattered off-white gown hiding the feet, very long straight black hair, pale blue-grey skin, glowing white eyes, white waru flower in the hair, long dark nails.
Scene: close-up of Kuntilanak laughing, long black hair whipping around her face, gown stained deep red, perched in a waru tree under a red moon, glowing red eyes.
Legend: The red kuntilanak is the most vicious form of the ghost; in her super her gown and eyes bleed into deep red.

Composition: wide 21:9 banner. The character is large and dramatic, framed from the chest or waist up, placed in the RIGHT half of the image and facing RIGHT, leaning toward the viewer with an intense expression. The LEFT third of the image is darker and calmer (the game overlays the move name there). Strong blood red and white rim light, glowing eyes, high contrast, painterly anime fighting-game splash art with a slight pixel-art texture. Dark night palette.
No text, no letters, no logo, no watermark, no border, no UI.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>super.png</code> · Pose karakter · simpan di `assets/ghosts/strips/kuntilanak/`</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game: the SUPER ULTIMATE move "KUNTILANAK MERAH".
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: KUNTILANAK, a laughing ghost woman in a white gown.
Keep: long tattered off-white gown hiding the feet, very long straight black hair, pale blue-grey skin, glowing white eyes, white waru flower in the hair, long dark nails.
Motion (super ultimate, 4 poses): (1) floats upward laughing with her head thrown back, hair hanging straight down (draw higher in its slot); (2) arms spread wide, hair fanning out like a black halo, the hem of her gown turning deep blood red; (3) swoops forward almost horizontal, long nails stretched toward the enemy, hair streaming behind; (4) hovers in a scream, gown now red from hem to waist, eyes glowing red.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. Make the poses big, dramatic and powerful, like a finishing move in a fighting game, but draw only the character: no motion lines, no speed lines, no energy effects, no projectiles (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character or the effect.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>kuntilanak-fx.png</code> · Efek hantaman · simpan di `assets/ghosts/super/`</summary>

```text
Create a single horizontal effect sprite strip for a 2D side-view fighting game: the hit effect of the SUPER ULTIMATE move "KUNTILANAK MERAH" used by KUNTILANAK, a laughing ghost woman in a white gown.
Reference 1 shows the character only for art style and colour; do NOT draw the character.
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Effect: a red spectral kuntilanak diving onto the enemy. Frame 1: a red glow and falling white waru petals from above. Frame 2: a translucent blood-red ghost woman with long trailing black hair diving straight down, claws first. Frame 3 (peak): she strikes the ground in a burst of red spirit light shaped like a splash of long hair and torn gown. Frame 4: red mist and waru petals scattering and fading.
Colours: blood red and white.

Rules: exactly 4 frames in one row, left to right in time order, one centred in each slot. The effect lands on an enemy standing on the ground line, so its base sits on the ground line and it rises upward; frames may be taller than wide. Keep a clear empty gap between frames; nothing touches, overlaps or leaves its slot. Draw ONLY the effect: no character, no enemy, no scenery, no text, no frame numbers. Bold readable shapes with a dark outline, glowing core and strong contrast so it reads at small size in a pixel-art-styled game; match the art style of Reference 1.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character or the effect.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

### Sundel Bolong · LUBANG DENDAM

Referensi 1: `assets/ghosts/base/sundelbolong.webp` · Referensi 2: `assets/ghosts/guides/guide-4pose-magenta.png` · latar magenta

*The hole in her back holds a vengeance that has never been paid; her super releases it.*

<details><summary><code>sundelbolong-cutin.png</code> · Cut-in super · simpan di `assets/ghosts/super/`</summary>

```text
Create a cinematic cut-in illustration for the super ultimate move "LUBANG DENDAM" in a 2D Indonesian folklore horror fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions and art style).

Character: SUNDEL BOLONG, a long-haired ghost woman with a hole in her back.
Keep: cream ragged dress, very long black hair, pale skin, glowing cyan ring around the dark hole in her back, cyan eyes.
Scene: Sundel Bolong seen from behind over her shoulder, her pale face turned back with glowing cyan eyes, hair parted to show the glowing cyan ring of the hole in her back, an old Javanese house at night behind her.
Legend: The hole in her back holds a vengeance that has never been paid; her super releases it.

Composition: wide 21:9 banner. The character is large and dramatic, framed from the chest or waist up, placed in the RIGHT half of the image and facing RIGHT, leaning toward the viewer with an intense expression. The LEFT third of the image is darker and calmer (the game overlays the move name there). Strong cyan and deep teal rim light, glowing eyes, high contrast, painterly anime fighting-game splash art with a slight pixel-art texture. Dark night palette.
No text, no letters, no logo, no watermark, no border, no UI.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>super.png</code> · Pose karakter · simpan di `assets/ghosts/strips/sundelbolong/`</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game: the SUPER ULTIMATE move "LUBANG DENDAM".
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: SUNDEL BOLONG, a long-haired ghost woman with a hole in her back.
Keep: cream ragged dress, very long black hair, pale skin, glowing cyan ring around the dark hole in her back, cyan eyes.
Motion (super ultimate, 4 poses): (1) turns her back to the viewer while still facing right, looking over her shoulder, hair parting to reveal the glowing hole; (2) arches her back, hair flying apart, the cyan ring blazing brighter; (3) spins forward with both arms outstretched toward the enemy, fingers clawed; (4) a vengeful scream, body leaning forward, hair and dress torn back by an invisible wind.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. Make the poses big, dramatic and powerful, like a finishing move in a fighting game, but draw only the character: no motion lines, no speed lines, no energy effects, no projectiles (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character or the effect.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>sundelbolong-fx.png</code> · Efek hantaman · simpan di `assets/ghosts/super/`</summary>

```text
Create a single horizontal effect sprite strip for a 2D side-view fighting game: the hit effect of the SUPER ULTIMATE move "LUBANG DENDAM" used by SUNDEL BOLONG, a long-haired ghost woman with a hole in her back.
Reference 1 shows the character only for art style and colour; do NOT draw the character.
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Effect: a vortex of vengeance opening under the enemy. Frame 1: a small glowing cyan ring on the ground. Frame 2: the ring widens into a dark round hole with a cyan rim, pale translucent spirit hands reaching out of it. Frame 3 (peak): a tall spiral of cyan spirit energy rising from the hole with many grasping pale hands. Frame 4: the hands sink back, the ring shrinks to a fading cyan spark and wisps.
Colours: cyan and deep teal.

Rules: exactly 4 frames in one row, left to right in time order, one centred in each slot. The effect lands on an enemy standing on the ground line, so its base sits on the ground line and it rises upward; frames may be taller than wide. Keep a clear empty gap between frames; nothing touches, overlaps or leaves its slot. Draw ONLY the effect: no character, no enemy, no scenery, no text, no frame numbers. Bold readable shapes with a dark outline, glowing core and strong contrast so it reads at small size in a pixel-art-styled game; match the art style of Reference 1.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character or the effect.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

### Wewe Gombel · PULANG KE BUKIT GOMBEL

Referensi 1: `assets/ghosts/base/wewegombel.webp` · Referensi 2: `assets/ghosts/guides/guide-4pose-green.png` · latar green

*Named after Bukit Gombel in Semarang, where she hides the children she takes; her super carries the enemy back to her nest in the sugar palms.*

<details><summary><code>wewegombel-cutin.png</code> · Cut-in super · simpan di `assets/ghosts/super/`</summary>

```text
Create a cinematic cut-in illustration for the super ultimate move "PULANG KE BUKIT GOMBEL" in a 2D Indonesian folklore horror fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions and art style).

Character: WEWE GOMBEL, a hunched old ghost woman.
Keep: wild grey-white curly hair, wrinkled grey-brown skin, brown batik sarong, cream torn shawl, very long dark claws, bare feet.
Scene: Wewe Gombel crouched on the dark hilltop of Bukit Gombel at dusk, sugar palm trees around her, the lights of Semarang city far below, orange and purple sky behind her, claws reaching toward the viewer.
Legend: Named after Bukit Gombel in Semarang, where she hides the children she takes; her super carries the enemy back to her nest in the sugar palms.

Composition: wide 21:9 banner. The character is large and dramatic, framed from the chest or waist up, placed in the RIGHT half of the image and facing RIGHT, leaning toward the viewer with an intense expression. The LEFT third of the image is darker and calmer (the game overlays the move name there). Strong dusk orange and dark brown rim light, glowing eyes, high contrast, painterly anime fighting-game splash art with a slight pixel-art texture. Dark night palette.
No text, no letters, no logo, no watermark, no border, no UI.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>super.png</code> · Pose karakter · simpan di `assets/ghosts/strips/wewegombel/`</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game: the SUPER ULTIMATE move "PULANG KE BUKIT GOMBEL".
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: WEWE GOMBEL, a hunched old ghost woman.
Keep: wild grey-white curly hair, wrinkled grey-brown skin, brown batik sarong, cream torn shawl, very long dark claws, bare feet.
Motion (super ultimate, 4 poses): (1) hunched and cackling, shoulders shaking, claws curled; (2) both arms stretching impossibly long straight up, shawl lifting; (3) sweeps the long arms forward and down in a huge grabbing arc toward the enemy; (4) pulls both arms back to her chest, clutching, grinning in triumph.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. Make the poses big, dramatic and powerful, like a finishing move in a fighting game, but draw only the character: no motion lines, no speed lines, no energy effects, no projectiles (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character or the effect.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>wewegombel-fx.png</code> · Efek hantaman · simpan di `assets/ghosts/super/`</summary>

```text
Create a single horizontal effect sprite strip for a 2D side-view fighting game: the hit effect of the SUPER ULTIMATE move "PULANG KE BUKIT GOMBEL" used by WEWE GOMBEL, a hunched old ghost woman.
Reference 1 shows the character only for art style and colour; do NOT draw the character.
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Effect: a sugar palm (aren) nest bursting from the ground. Frame 1: dusk-orange glow and a few dark palm fronds poking out of the earth. Frame 2: a twisted sugar palm trunk and fronds erupt upward with long grey arms winding out of them. Frame 3 (peak): a tall tangle of palm fronds, trunk and grasping long grey arms closing like a cage. Frame 4: the nest sinks back into the ground, leaves and dust scattering.
Colours: dusk orange and dark brown.

Rules: exactly 4 frames in one row, left to right in time order, one centred in each slot. The effect lands on an enemy standing on the ground line, so its base sits on the ground line and it rises upward; frames may be taller than wide. Keep a clear empty gap between frames; nothing touches, overlaps or leaves its slot. Draw ONLY the effect: no character, no enemy, no scenery, no text, no frame numbers. Bold readable shapes with a dark outline, glowing core and strong contrast so it reads at small size in a pixel-art-styled game; match the art style of Reference 1.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character or the effect.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

### Genderuwo · HUJAN BATU GENDERUWO

Referensi 1: `assets/ghosts/base/genderuwo.webp` · Referensi 2: `assets/ghosts/guides/guide-4pose-green.png` · latar green

*Houses pelted with stones when nobody is throwing them are said to be the work of a genderuwo; his super makes it rain rocks.*

<details><summary><code>genderuwo-cutin.png</code> · Cut-in super · simpan di `assets/ghosts/super/`</summary>

```text
Create a cinematic cut-in illustration for the super ultimate move "HUJAN BATU GENDERUWO" in a 2D Indonesian folklore horror fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions and art style).

Character: GENDERUWO, a giant hairy forest spirit.
Keep: huge build with shaggy dark brown fur, leaves and roots in the fur, tusks, ember-orange eyes, batik loincloth, grey boulder in the right hand.
Scene: giant Genderuwo under a huge banyan (beringin) tree in a dark forest at night, ember-orange eyes glowing, roaring with tusks bared, boulders floating in the air around him.
Legend: Houses pelted with stones when nobody is throwing them are said to be the work of a genderuwo; his super makes it rain rocks.

Composition: wide 21:9 banner. The character is large and dramatic, framed from the chest or waist up, placed in the RIGHT half of the image and facing RIGHT, leaning toward the viewer with an intense expression. The LEFT third of the image is darker and calmer (the game overlays the move name there). Strong ember orange and stone grey rim light, glowing eyes, high contrast, painterly anime fighting-game splash art with a slight pixel-art texture. Dark night palette.
No text, no letters, no logo, no watermark, no border, no UI.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>super.png</code> · Pose karakter · simpan di `assets/ghosts/strips/genderuwo/`</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game: the SUPER ULTIMATE move "HUJAN BATU GENDERUWO".
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: GENDERUWO, a giant hairy forest spirit.
Keep: huge build with shaggy dark brown fur, leaves and roots in the fur, tusks, ember-orange eyes, batik loincloth, grey boulder in the right hand.
Motion (super ultimate, 4 poses): (1) roaring, beating his chest with the free fist; (2) lifts the boulder high over his head with both hands, fur standing on end; (3) hurls the boulder up into the sky, body stretched, one foot lifted; (4) slams his fist into the ground, crouched, pointing at the enemy with the other hand.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. Make the poses big, dramatic and powerful, like a finishing move in a fighting game, but draw only the character: no motion lines, no speed lines, no energy effects, no projectiles (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character or the effect.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>genderuwo-fx.png</code> · Efek hantaman · simpan di `assets/ghosts/super/`</summary>

```text
Create a single horizontal effect sprite strip for a 2D side-view fighting game: the hit effect of the SUPER ULTIMATE move "HUJAN BATU GENDERUWO" used by GENDERUWO, a giant hairy forest spirit.
Reference 1 shows the character only for art style and colour; do NOT draw the character.
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Effect: a shower of stones smashing down. Frame 1: a mossy grey boulder falling diagonally with a short ember-orange trail. Frame 2: the boulder hits the ground and cracks. Frame 3 (peak): a big burst of rock chunks, sparks and embers, the ground split. Frame 4: a dust cloud with small pebbles and fading embers.
Colours: ember orange and stone grey.

Rules: exactly 4 frames in one row, left to right in time order, one centred in each slot. The effect lands on an enemy standing on the ground line, so its base sits on the ground line and it rises upward; frames may be taller than wide. Keep a clear empty gap between frames; nothing touches, overlaps or leaves its slot. Draw ONLY the effect: no character, no enemy, no scenery, no text, no frame numbers. Bold readable shapes with a dark outline, glowing core and strong contrast so it reads at small size in a pixel-art-styled game; match the art style of Reference 1.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character or the effect.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

### Eyang Sukmo Capo · AJI SUKMA SEJATI

Referensi 1: `assets/ghosts/base/eyangsukmocapo.webp` · Referensi 2: `assets/ghosts/guides/guide-4pose-magenta.png` · latar magenta

*The final ajian (spiritual art) of the guardian of sacred ground.*

<details><summary><code>eyangsukmocapo-cutin.png</code> · Cut-in super · simpan di `assets/ghosts/super/`</summary>

```text
Create a cinematic cut-in illustration for the super ultimate move "AJI SUKMA SEJATI" in a 2D Indonesian folklore horror fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions and art style).

Character: EYANG SUKMO CAPO, an old Javanese guardian spirit.
Keep: brown batik blangkon headcloth, dark beskap jacket, white long beard and eyebrows, brown batik sarong, twisted wooden staff in the left hand, white smoke at the feet.
Scene: Eyang Sukmo Capo in front of an old Javanese sacred shrine (punden) with a banyan tree and burning incense, a golden aura around him, staff raised, white beard flowing, eyes glowing gold.
Legend: The final ajian (spiritual art) of the guardian of sacred ground.

Composition: wide 21:9 banner. The character is large and dramatic, framed from the chest or waist up, placed in the RIGHT half of the image and facing RIGHT, leaning toward the viewer with an intense expression. The LEFT third of the image is darker and calmer (the game overlays the move name there). Strong gold and warm white rim light, glowing eyes, high contrast, painterly anime fighting-game splash art with a slight pixel-art texture. Dark night palette.
No text, no letters, no logo, no watermark, no border, no UI.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>super.png</code> · Pose karakter · simpan di `assets/ghosts/strips/eyangsukmocapo/`</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game: the SUPER ULTIMATE move "AJI SUKMA SEJATI".
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: EYANG SUKMO CAPO, an old Javanese guardian spirit.
Keep: brown batik blangkon headcloth, dark beskap jacket, white long beard and eyebrows, brown batik sarong, twisted wooden staff in the left hand, white smoke at the feet.
Motion (super ultimate, 4 poses): (1) calm meditation stance, eyes closed, staff held upright, free hand in front of the chest; (2) raises the staff high, beard and sleeves lifting as if in an updraft; (3) thrusts the open free palm forward toward the enemy, staff behind; (4) strikes the staff down into the ground, knees bent, eyes wide open.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. Make the poses big, dramatic and powerful, like a finishing move in a fighting game, but draw only the character: no motion lines, no speed lines, no energy effects, no projectiles (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character or the effect.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>eyangsukmocapo-fx.png</code> · Efek hantaman · simpan di `assets/ghosts/super/`</summary>

```text
Create a single horizontal effect sprite strip for a 2D side-view fighting game: the hit effect of the SUPER ULTIMATE move "AJI SUKMA SEJATI" used by EYANG SUKMO CAPO, an old Javanese guardian spirit.
Reference 1 shows the character only for art style and colour; do NOT draw the character.
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Effect: a golden pillar of inner power. Frame 1: a small golden gunungan (Javanese wayang mountain-shaped) silhouette forming on the ground. Frame 2: the gunungan grows tall and glows bright gold with batik kawung patterns inside. Frame 3 (peak): a blazing golden pillar of light bursts upward with a ring-shaped shockwave on the ground. Frame 4: the light fades into curling incense smoke and gold sparks.
Colours: gold and warm white.

Rules: exactly 4 frames in one row, left to right in time order, one centred in each slot. The effect lands on an enemy standing on the ground line, so its base sits on the ground line and it rises upward; frames may be taller than wide. Keep a clear empty gap between frames; nothing touches, overlaps or leaves its slot. Draw ONLY the effect: no character, no enemy, no scenery, no text, no frame numbers. Bold readable shapes with a dark outline, glowing core and strong contrast so it reads at small size in a pixel-art-styled game; match the art style of Reference 1.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character or the effect.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

### Leyak · TITAH CALON ARANG

Referensi 1: `assets/ghosts/base/leyak.webp` · Referensi 2: `assets/ghosts/guides/guide-4pose-green.png` · latar green

*Calon Arang, queen of the leyak from Girah, spread curses and plague across the land; her super summons that fire.*

<details><summary><code>leyak-cutin.png</code> · Cut-in super · simpan di `assets/ghosts/super/`</summary>

```text
Create a cinematic cut-in illustration for the super ultimate move "TITAH CALON ARANG" in a 2D Indonesian folklore horror fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions and art style).

Character: LEYAK, a Balinese fire witch.
Keep: wild white-grey flame-like hair, bulging eyes, long red tongue, black wrap with gold flame pattern, gold cuffs and anklets, long claws, orange flame in the right palm.
Scene: Leyak dancing in front of a split Balinese temple gate (candi bentar) at night, surrounded by flames, a huge fanged demon mask made of fire looming behind her, tongue out, eyes bulging.
Legend: Calon Arang, queen of the leyak from Girah, spread curses and plague across the land; her super summons that fire.

Composition: wide 21:9 banner. The character is large and dramatic, framed from the chest or waist up, placed in the RIGHT half of the image and facing RIGHT, leaning toward the viewer with an intense expression. The LEFT third of the image is darker and calmer (the game overlays the move name there). Strong fire orange and red rim light, glowing eyes, high contrast, painterly anime fighting-game splash art with a slight pixel-art texture. Dark night palette.
No text, no letters, no logo, no watermark, no border, no UI.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>super.png</code> · Pose karakter · simpan di `assets/ghosts/strips/leyak/`</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game: the SUPER ULTIMATE move "TITAH CALON ARANG".
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: LEYAK, a Balinese fire witch.
Keep: wild white-grey flame-like hair, bulging eyes, long red tongue, black wrap with gold flame pattern, gold cuffs and anklets, long claws, orange flame in the right palm.
Motion (super ultimate, 4 poses): (1) a Balinese dance pose, knees bent, fingers spread wide, eyes bulging; (2) tongue lolling out, the flame in her palm swelling huge; (3) both hands raised to the sky summoning, hair rising like fire; (4) points forward at the enemy commanding, body leaning in.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. Make the poses big, dramatic and powerful, like a finishing move in a fighting game, but draw only the character: no motion lines, no speed lines, no energy effects, no projectiles (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character or the effect.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>leyak-fx.png</code> · Efek hantaman · simpan di `assets/ghosts/super/`</summary>

```text
Create a single horizontal effect sprite strip for a 2D side-view fighting game: the hit effect of the SUPER ULTIMATE move "TITAH CALON ARANG" used by LEYAK, a Balinese fire witch.
Reference 1 shows the character only for art style and colour; do NOT draw the character.
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Effect: a column of curse fire. Frame 1: orange embers swirling on the ground. Frame 2: flames roar upward with the shape of a fanged demon mask with a long tongue forming inside them. Frame 3 (peak): a tall pillar of orange and red fire with the demon-mask face at its top, mouth open. Frame 4: the flames break apart into floating embers and black smoke.
Colours: fire orange and red.

Rules: exactly 4 frames in one row, left to right in time order, one centred in each slot. The effect lands on an enemy standing on the ground line, so its base sits on the ground line and it rises upward; frames may be taller than wide. Keep a clear empty gap between frames; nothing touches, overlaps or leaves its slot. Draw ONLY the effect: no character, no enemy, no scenery, no text, no frame numbers. Bold readable shapes with a dark outline, glowing core and strong contrast so it reads at small size in a pixel-art-styled game; match the art style of Reference 1.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character or the effect.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

### Kuyang · TERBANG MENJELANG SUBUH

Referensi 1: `assets/ghosts/base/kuyang.webp` · Referensi 2: `assets/ghosts/guides/guide-4pose-green.png` · latar green

*The kuyang head must return to its body before dawn; her super is the last frantic hunt before sunrise.*

<details><summary><code>kuyang-cutin.png</code> · Cut-in super · simpan di `assets/ghosts/super/`</summary>

```text
Create a cinematic cut-in illustration for the super ultimate move "TERBANG MENJELANG SUBUH" in a 2D Indonesian folklore horror fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions and art style).

Character: KUYANG, a Borneo night witch whose head flies.
Keep: long wavy black hair with glowing red strands, pale skin, red eyes, small fangs, long-sleeved black top, purple patterned sarong, clay oil lamp with a red flame.
Scene: Kuyang over a dark Borneo river before dawn, the horizon just turning pale blue, wooden stilt houses below, her long hair with glowing red strands spreading across the sky, red eyes, oil lamp burning.
Legend: The kuyang head must return to its body before dawn; her super is the last frantic hunt before sunrise.

Composition: wide 21:9 banner. The character is large and dramatic, framed from the chest or waist up, placed in the RIGHT half of the image and facing RIGHT, leaning toward the viewer with an intense expression. The LEFT third of the image is darker and calmer (the game overlays the move name there). Strong crimson red and pale dawn blue rim light, glowing eyes, high contrast, painterly anime fighting-game splash art with a slight pixel-art texture. Dark night palette.
No text, no letters, no logo, no watermark, no border, no UI.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>super.png</code> · Pose karakter · simpan di `assets/ghosts/strips/kuyang/`</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game: the SUPER ULTIMATE move "TERBANG MENJELANG SUBUH".
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: KUYANG, a Borneo night witch whose head flies.
Keep: long wavy black hair with glowing red strands, pale skin, red eyes, small fangs, long-sleeved black top, purple patterned sarong, clay oil lamp with a red flame.
Motion (super ultimate, 4 poses): (1) lifts the clay oil lamp high, the red flame flaring; (2) her hair rises upward as if weightless, eyes blazing red; (3) leaps into the air and dives forward, hair streaming behind like red-lit ribbons (draw higher in its slot); (4) swoops low toward the enemy, fangs bared, lamp held behind.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. Make the poses big, dramatic and powerful, like a finishing move in a fighting game, but draw only the character: no motion lines, no speed lines, no energy effects, no projectiles (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character or the effect.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>kuyang-fx.png</code> · Efek hantaman · simpan di `assets/ghosts/super/`</summary>

```text
Create a single horizontal effect sprite strip for a 2D side-view fighting game: the hit effect of the SUPER ULTIMATE move "TERBANG MENJELANG SUBUH" used by KUYANG, a Borneo night witch whose head flies.
Reference 1 shows the character only for art style and colour; do NOT draw the character.
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Effect: a flying head strike. Frame 1: a red light streak appearing high on the left. Frame 2: a pale flying head with long hair and glowing red light ribbons trailing below it diving down. Frame 3 (peak): it crashes onto the target in a burst of crimson light and hair. Frame 4: crimson sparks and a faint pale-blue dawn glow fading.
Colours: crimson red and pale dawn blue.

Rules: exactly 4 frames in one row, left to right in time order, one centred in each slot. The effect lands on an enemy standing on the ground line, so its base sits on the ground line and it rises upward; frames may be taller than wide. Keep a clear empty gap between frames; nothing touches, overlaps or leaves its slot. Draw ONLY the effect: no character, no enemy, no scenery, no text, no frame numbers. Bold readable shapes with a dark outline, glowing core and strong contrast so it reads at small size in a pixel-art-styled game; match the art style of Reference 1.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character or the effect.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

### Palasik · PALASIK KUDUANG

Referensi 1: `assets/ghosts/base/palasik.webp` · Referensi 2: `assets/ghosts/guides/guide-4pose-green.png` · latar green

*A palasik kuduang is a palasik whose head comes off its body to hunt; it drains the life of its prey from afar.*

<details><summary><code>palasik-cutin.png</code> · Cut-in super · simpan di `assets/ghosts/super/`</summary>

```text
Create a cinematic cut-in illustration for the super ultimate move "PALASIK KUDUANG" in a 2D Indonesian folklore horror fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions and art style).

Character: PALASIK, a floating bodiless head from West Sumatra.
Keep: only a head: old wrinkled face, bald top, long grey hair, glowing red eyes, fangs, dark red smoke ribbons trailing below; NO body.
Scene: Palasik floating above the curved horn roof of a Minangkabau rumah gadang at night, long grey hair flowing, glowing red eyes, dark red smoke ribbons spreading behind, fog below.
Legend: A palasik kuduang is a palasik whose head comes off its body to hunt; it drains the life of its prey from afar.

Composition: wide 21:9 banner. The character is large and dramatic, framed from the chest or waist up, placed in the RIGHT half of the image and facing RIGHT, leaning toward the viewer with an intense expression. The LEFT third of the image is darker and calmer (the game overlays the move name there). Strong dark red and black rim light, glowing eyes, high contrast, painterly anime fighting-game splash art with a slight pixel-art texture. Dark night palette.
No text, no letters, no logo, no watermark, no border, no UI.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>super.png</code> · Pose karakter · simpan di `assets/ghosts/strips/palasik/`</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game: the SUPER ULTIMATE move "PALASIK KUDUANG".
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: PALASIK, a floating bodiless head from West Sumatra.
Keep: only a head: old wrinkled face, bald top, long grey hair, glowing red eyes, fangs, dark red smoke ribbons trailing below; NO body.
Motion (super ultimate, 4 poses): (1) hovers still, eyes starting to glow; (2) rises higher, the dark red smoke ribbons spreading wide (draw higher in its slot); (3) mouth opened very wide, inhaling, hair blown forward; (4) lunges forward fangs first.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. Make the poses big, dramatic and powerful, like a finishing move in a fighting game, but draw only the character: no motion lines, no speed lines, no energy effects, no projectiles (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character or the effect.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>palasik-fx.png</code> · Efek hantaman · simpan di `assets/ghosts/super/`</summary>

```text
Create a single horizontal effect sprite strip for a 2D side-view fighting game: the hit effect of the SUPER ULTIMATE move "PALASIK KUDUANG" used by PALASIK, a floating bodiless head from West Sumatra.
Reference 1 shows the character only for art style and colour; do NOT draw the character.
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Effect: a draining whirlpool. Frame 1: thin dark red mist curling on the ground. Frame 2: the mist spins into a whirlpool lifting upward. Frame 3 (peak): a tall spiralling funnel of dark red mist with faint glowing wisps being sucked upward. Frame 4: the funnel thins into drifting red smoke.
Colours: dark red and black.

Rules: exactly 4 frames in one row, left to right in time order, one centred in each slot. The effect lands on an enemy standing on the ground line, so its base sits on the ground line and it rises upward; frames may be taller than wide. Keep a clear empty gap between frames; nothing touches, overlaps or leaves its slot. Draw ONLY the effect: no character, no enemy, no scenery, no text, no frame numbers. Bold readable shapes with a dark outline, glowing core and strong contrast so it reads at small size in a pixel-art-styled game; match the art style of Reference 1.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character or the effect.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

### Tuyul · PASUKAN TUYUL GUNDUL

Referensi 1: `assets/ghosts/base/tuyul.webp` · Referensi 2: `assets/ghosts/guides/guide-4pose-magenta.png` · latar magenta

*Owners of a pesugihan never keep just one tuyul; his super sends the whole gang.*

<details><summary><code>tuyul-cutin.png</code> · Cut-in super · simpan di `assets/ghosts/super/`</summary>

```text
Create a cinematic cut-in illustration for the super ultimate move "PASUKAN TUYUL GUNDUL" in a 2D Indonesian folklore horror fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions and art style).

Character: TUYUL, a small bald thief spirit.
Keep: bald grey child body, big round head and ears, big brown eyes, buck teeth grin, brown patched shirt and shorts, coin sack on the back.
Scene: Tuyul grinning on top of piles of old holed coins and money sacks in a dark room, dozens of other small tuyul eyes glinting in the darkness behind him, gold light from the coins on his face.
Legend: Owners of a pesugihan never keep just one tuyul; his super sends the whole gang.

Composition: wide 21:9 banner. The character is large and dramatic, framed from the chest or waist up, placed in the RIGHT half of the image and facing RIGHT, leaning toward the viewer with an intense expression. The LEFT third of the image is darker and calmer (the game overlays the move name there). Strong gold coin and brown rim light, glowing eyes, high contrast, painterly anime fighting-game splash art with a slight pixel-art texture. Dark night palette.
No text, no letters, no logo, no watermark, no border, no UI.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>super.png</code> · Pose karakter · simpan di `assets/ghosts/strips/tuyul/`</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game: the SUPER ULTIMATE move "PASUKAN TUYUL GUNDUL".
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: TUYUL, a small bald thief spirit.
Keep: bald grey child body, big round head and ears, big brown eyes, buck teeth grin, brown patched shirt and shorts, coin sack on the back.
Motion (super ultimate, 4 poses): (1) crouched and giggling, hands over his mouth; (2) whistles with two fingers in his mouth, cheeks puffed; (3) swings the coin sack open in front of him; (4) points forward at the enemy, shouting a command, one foot raised.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. Make the poses big, dramatic and powerful, like a finishing move in a fighting game, but draw only the character: no motion lines, no speed lines, no energy effects, no projectiles (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character or the effect.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>tuyul-fx.png</code> · Efek hantaman · simpan di `assets/ghosts/super/`</summary>

```text
Create a single horizontal effect sprite strip for a 2D side-view fighting game: the hit effect of the SUPER ULTIMATE move "PASUKAN TUYUL GUNDUL" used by TUYUL, a small bald thief spirit.
Reference 1 shows the character only for art style and colour; do NOT draw the character.
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Effect: a tuyul gang pile-on. Frame 1: old holed coins (uang kepeng) raining down. Frame 2: four small bald grey tuyul silhouettes leaping in from both sides. Frame 3 (peak): a pile of tuyul tumbling on the target in a burst of coins and dust. Frame 4: the tuyul scatter away, coins spinning and dust settling.
Colours: gold coin and brown.

Rules: exactly 4 frames in one row, left to right in time order, one centred in each slot. The effect lands on an enemy standing on the ground line, so its base sits on the ground line and it rises upward; frames may be taller than wide. Keep a clear empty gap between frames; nothing touches, overlaps or leaves its slot. Draw ONLY the effect: no character, no enemy, no scenery, no text, no frame numbers. Bold readable shapes with a dark outline, glowing core and strong contrast so it reads at small size in a pixel-art-styled game; match the art style of Reference 1.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character or the effect.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

### Jenglot · ILMU BATARA KARANG

Referensi 1: `assets/ghosts/base/jenglot.webp` · Referensi 2: `assets/ghosts/guides/guide-4pose-green.png` · latar green

*Jenglot are said to come from followers of the Batara Karang black magic whose bodies shrank; his super calls on that ritual.*

<details><summary><code>jenglot-cutin.png</code> · Cut-in super · simpan di `assets/ghosts/super/`</summary>

```text
Create a cinematic cut-in illustration for the super ultimate move "ILMU BATARA KARANG" in a 2D Indonesian folklore horror fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions and art style).

Character: JENGLOT, a tiny shrivelled doll-like creature.
Keep: very small hunched brown body, very long tangled black hair, red eyes, fangs, long white claws, torn brown loincloth.
Scene: Jenglot crawling out of an old carved wooden heirloom box surrounded by candles and flower offerings (sesajen) in a dark room, very long tangled hair spilling out, red eyes glowing, fangs bared.
Legend: Jenglot are said to come from followers of the Batara Karang black magic whose bodies shrank; his super calls on that ritual.

Composition: wide 21:9 banner. The character is large and dramatic, framed from the chest or waist up, placed in the RIGHT half of the image and facing RIGHT, leaning toward the viewer with an intense expression. The LEFT third of the image is darker and calmer (the game overlays the move name there). Strong blood red and black rim light, glowing eyes, high contrast, painterly anime fighting-game splash art with a slight pixel-art texture. Dark night palette.
No text, no letters, no logo, no watermark, no border, no UI.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>super.png</code> · Pose karakter · simpan di `assets/ghosts/strips/jenglot/`</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game: the SUPER ULTIMATE move "ILMU BATARA KARANG".
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: JENGLOT, a tiny shrivelled doll-like creature.
Keep: very small hunched brown body, very long tangled black hair, red eyes, fangs, long white claws, torn brown loincloth.
Motion (super ultimate, 4 poses): (1) crouched in a ritual pose, claws pressed to the ground, hair pooled around him; (2) rises up, hair spreading out like a web; (3) arms flung wide, head back, eyes blazing red; (4) lunges forward claws first, hair streaming behind.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. Make the poses big, dramatic and powerful, like a finishing move in a fighting game, but draw only the character: no motion lines, no speed lines, no energy effects, no projectiles (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character or the effect.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>jenglot-fx.png</code> · Efek hantaman · simpan di `assets/ghosts/super/`</summary>

```text
Create a single horizontal effect sprite strip for a 2D side-view fighting game: the hit effect of the SUPER ULTIMATE move "ILMU BATARA KARANG" used by JENGLOT, a tiny shrivelled doll-like creature.
Reference 1 shows the character only for art style and colour; do NOT draw the character.
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Effect: a black magic ritual circle. Frame 1: a dark red ritual circle with simple angular glyphs drawn on the ground. Frame 2: the circle glows and red energy rises from it. Frame 3 (peak): a pillar of blood-red energy with many tiny jenglot silhouettes clawing upward inside it. Frame 4: the pillar collapses into red sparks and the circle fades.
Colours: blood red and black.

Rules: exactly 4 frames in one row, left to right in time order, one centred in each slot. The effect lands on an enemy standing on the ground line, so its base sits on the ground line and it rises upward; frames may be taller than wide. Keep a clear empty gap between frames; nothing touches, overlaps or leaves its slot. Draw ONLY the effect: no character, no enemy, no scenery, no text, no frame numbers. Bold readable shapes with a dark outline, glowing core and strong contrast so it reads at small size in a pixel-art-styled game; match the art style of Reference 1.
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character or the effect.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

### Begu Ganjang · JANGAN MENENGADAH

Referensi 1: `assets/ghosts/base/beguganjang.webp` · Referensi 2: `assets/ghosts/guides/guide-4pose-magenta.png` · latar magenta

*Begu Ganjang keeps growing taller the longer someone looks at him; his super is a strike from far above.*

<details><summary><code>beguganjang-cutin.png</code> · Cut-in super · simpan di `assets/ghosts/super/`</summary>

```text
Create a cinematic cut-in illustration for the super ultimate move "JANGAN MENENGADAH" in a 2D Indonesian folklore horror fighting game.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions and art style).

Character: BEGU GANJANG, a very tall thin spirit from Batak legend.
Keep: very tall skeletal dark grey body, long black hair over the face, glowing white eyes, long arms and fingers, ragged loincloth.
Scene: Begu Ganjang towering above the pine trees on the shore of Lake Toba at night, seen from below looking up, his long black hair hanging over his face, glowing white eyes staring down, mist over the lake.
Legend: Begu Ganjang keeps growing taller the longer someone looks at him; his super is a strike from far above.

Composition: wide 21:9 banner. The character is large and dramatic, framed from the chest or waist up, placed in the RIGHT half of the image and facing RIGHT, leaning toward the viewer with an intense expression. The LEFT third of the image is darker and calmer (the game overlays the move name there). Strong shadow black and pale white rim light, glowing eyes, high contrast, painterly anime fighting-game splash art with a slight pixel-art texture. Dark night palette.
No text, no letters, no logo, no watermark, no border, no UI.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>super.png</code> · Pose karakter · simpan di `assets/ghosts/strips/beguganjang/`</summary>

```text
Create a single horizontal sprite strip for a 2D side-view fighting game: the SUPER ULTIMATE move "JANGAN MENENGADAH".
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions, art style and outline).
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Character: BEGU GANJANG, a very tall thin spirit from Batak legend.
Keep: very tall skeletal dark grey body, long black hair over the face, glowing white eyes, long arms and fingers, ragged loincloth.
Motion (super ultimate, 4 poses): (1) hunched over, head hanging down, hair covering the face; (2) begins to straighten, body stretching taller; (3) stands at full towering height, head tilted down to stare at the enemy, white eyes glowing (this pose is taller than the others); (4) reaches down with one impossibly long arm toward the enemy, fingers spread.

Rules: exactly 4 complete full-body poses in one row, left to right in time order, one centred in each slot, all facing RIGHT. The character is the same size in every pose; a standing pose fills about three quarters of the slot height. The feet (or lowest point) touch the ground line in every pose, except where the motion says to leap or rise; draw those poses higher in their slot. Leave a clear empty gap between poses; nothing touches, overlaps or leaves its slot. Make the poses big, dramatic and powerful, like a finishing move in a fighting game, but draw only the character: no motion lines, no speed lines, no energy effects, no projectiles (the game draws those), no shadows, no text, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character or the effect.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>beguganjang-fx.png</code> · Efek hantaman · simpan di `assets/ghosts/super/`</summary>

```text
Create a single horizontal effect sprite strip for a 2D side-view fighting game: the hit effect of the SUPER ULTIMATE move "JANGAN MENENGADAH" used by BEGU GANJANG, a very tall thin spirit from Batak legend.
Reference 1 shows the character only for art style and colour; do NOT draw the character.
Reference 2 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Effect: a giant shadow hand from above. Frame 1: a dark shadow pooling on the ground. Frame 2: a very long skeletal shadow arm descending from the top of the frame. Frame 3 (peak): the huge long-fingered hand slams down onto the ground with a pale shockwave ring. Frame 4: the arm withdraws upward and the shadow dissolves into wisps.
Colours: shadow black and pale white.

Rules: exactly 4 frames in one row, left to right in time order, one centred in each slot. The effect lands on an enemy standing on the ground line, so its base sits on the ground line and it rises upward; frames may be taller than wide. Keep a clear empty gap between frames; nothing touches, overlaps or leaves its slot. Draw ONLY the effect: no character, no enemy, no scenery, no text, no frame numbers. Bold readable shapes with a dark outline, glowing core and strong contrast so it reads at small size in a pixel-art-styled game; match the art style of Reference 1.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character or the effect.
Aspect ratio 21:9 (for example 1680x720).
```

</details>
