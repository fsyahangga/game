# Prompt animasi kombo (gambar AI)

Prompt untuk visual **kombo jurus** (Rantai Jurus, Gempur Jurus, Sambung Jurus, Pamungkas; lihat Kitab Dedemit). Gayanya *combo cut-in* game fighting anime: kilatan potret dedemit yang menyerang di panel miring, garis kecepatan, layar sedikit membeku, lalu ledakan hantaman besar di lawan. Desainnya orisinal untuk Perang Dedemit (motif batik, wayang, dan aksara dibuat sebagai ornamen, bukan tulisan), tidak meniru karakter atau simbol game lain.

> **Belum dipasang di game.** Sekarang kombo hanya memunculkan tulisan "KOMBO!", cincin, dan partikel emas. Setelah gambar dari prompt ini jadi dan disimpan di lokasi di bawah, kirim kabar supaya saya pasang.

## Gambar yang dibutuhkan (14)

| File | Isi | Dipakai untuk |
| --- | --- | --- |
| `assets/ghosts/combo/<dedemit>-cutin.png` (12) | Close-up dedemit saat menyerang, latar polos | Kilatan cut-in 0,5 detik saat kombo terjadi; game menaruhnya di panel miring dengan garis kecepatan dan warna dedemit |
| `assets/ghosts/combo/fx-burst.png` | 4 frame ledakan hantaman | Diputar di lawan saat jurus kombo kena; diwarnai ulang oleh game per dedemit |
| `assets/ghosts/combo/fx-afterimage.png` | 4 frame jejak bayangan dan sabetan | Jejak di belakang dedemit saat kombo dimulai |

Nama `<dedemit>`: `pocong`, `kuntilanak`, `sundelbolong`, `wewegombel`, `genderuwo`, `eyangsukmocapo`, `leyak`, `kuyang`, `palasik`, `tuyul`, `jenglot`, `beguganjang`.

## Cara membuat

1. Buka generator gambar yang menerima gambar referensi (ChatGPT, Gemini, dan sejenisnya).
2. Untuk cut-in, lampirkan **Referensi 1**: `assets/ghosts/base/<dedemit>.webp`.
3. Untuk efek, lampirkan `assets/ghosts/guides/guide-4pose-magenta.png` sebagai panduan layout.
4. Tempel prompt-nya. Periksa: latar satu warna polos, tidak ada tulisan, desain dedemit sama dengan referensi.
5. Simpan di `assets/ghosts/combo/` dengan nama sesuai tabel.

Mulai dari satu dedemit plus dua efek bersama, supaya bisa dipasang dan dinilai dulu di game.

## Efek bersama


<details><summary><code>fx-burst.png</code> · Ledakan hantaman kombo · latar magenta</summary>

```text
Create a single horizontal effect sprite strip for a 2D side-view fighting game: the hit burst of a COMBO strike.
Reference 1 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Effect, 4 frames in time order: (1) a tight white-hot flash point with a few sharp radial spikes; (2) a big starburst impact with jagged sharp rays, a thick shockwave ring and flying shards; (3) peak: the largest burst, ink-brush style rays mixed with a ring of batik-like ornamental flame shapes, sparks flying outward; (4) the burst breaking apart into fading sparks, smoke wisps and small ornamental fragments.
Colours: pure white and pale gold core with a very bright yellow-orange edge, so the game can tint it; strong dark outline on the outer shapes.

Rules: exactly 4 frames in one row, one centred in each slot, the burst centred around the middle height of the slot (it happens on the target's body, not on the ground). Clear empty gap between frames; nothing touches, overlaps or leaves its slot. Draw ONLY the effect: no character, no text, no letters, no symbols, no frame numbers, no scenery. Bold readable shapes for a pixel-art-styled game.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere in the effect.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

<details><summary><code>fx-afterimage.png</code> · Jejak bayangan dan sabetan · latar magenta</summary>

```text
Create a single horizontal effect sprite strip for a 2D side-view fighting game: the speed afterimage of a COMBO dash-strike, moving to the RIGHT.
Reference 1 is only a layout guide (four equal slots and a ground line); do not draw the guide itself.

Effect, 4 frames in time order: (1) a few thin horizontal speed streaks appearing; (2) a long curved slash arc with sharp speed lines trailing to the left; (3) peak: a wide crescent slash with a blurred ghostly afterimage silhouette shape (no face, no details, just a soft human-like smear) and dense speed lines; (4) the streaks thinning out and fading to the left.
Colours: pure white and pale cyan-white, semi-bright, so the game can tint it; thin dark outline on the slash edges.

Rules: exactly 4 frames in one row, one centred in each slot, the slash at chest height in the slot. Clear empty gap between frames; nothing touches, overlaps or leaves its slot. Draw ONLY the effect: no character details, no text, no letters, no symbols, no frame numbers, no scenery.
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere in the effect.
Aspect ratio 21:9 (for example 1680x720).
```

</details>

## Cut-in per dedemit

### Pocong

Referensi 1: `assets/ghosts/base/pocong.webp` · latar magenta · simpan sebagai `assets/ghosts/combo/pocong-cutin.png`

```text
Create a COMBO cut-in portrait for a 2D Indonesian folklore horror fighting game: a split-second dramatic close-up shown when the fighter lands a combo.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions and art style).

Character: POCONG, a ghost wrapped head to toe in a knotted burial shroud.
Keep: off-white shroud with knots at head, neck and ankles, the two floppy knot ears, pale grey face with glowing cyan eyes, NO arms and NO legs visible.
Moment: mid-hop slamming forward head-first, shroud knots and loose rope ends whipping back, cyan eyes blazing.

Composition: dynamic diagonal close-up, framed from the chest or shoulders up (the whole head for a head-only character), the character facing RIGHT and leaning hard into the strike toward the right edge, strong foreshortening so the striking hand, claws or head come at the viewer. Intense glowing eyes, extreme expression, dramatic rim light in cyan and bone white, high contrast, clean bold outlines, painterly anime fighting-game style with a slight pixel-art texture. Fill about 85% of the image height.
Draw ONLY the character: no speed lines, no effects, no panel, no frame, no text, no letters, no symbols, no scenery (the game adds the panel and speed lines).
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 16:9 (for example 1600x900).
```

### Kuntilanak

Referensi 1: `assets/ghosts/base/kuntilanak.webp` · latar magenta · simpan sebagai `assets/ghosts/combo/kuntilanak-cutin.png`

```text
Create a COMBO cut-in portrait for a 2D Indonesian folklore horror fighting game: a split-second dramatic close-up shown when the fighter lands a combo.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions and art style).

Character: KUNTILANAK, a laughing ghost woman in a white gown.
Keep: long tattered off-white gown hiding the feet, very long straight black hair, pale blue-grey skin, glowing white eyes, white waru flower in the hair, long dark nails.
Moment: lunging forward with long dark nails slashing across the frame, hair streaming back, mouth open in a shrill laugh.

Composition: dynamic diagonal close-up, framed from the chest or shoulders up (the whole head for a head-only character), the character facing RIGHT and leaning hard into the strike toward the right edge, strong foreshortening so the striking hand, claws or head come at the viewer. Intense glowing eyes, extreme expression, dramatic rim light in blood red and white, high contrast, clean bold outlines, painterly anime fighting-game style with a slight pixel-art texture. Fill about 85% of the image height.
Draw ONLY the character: no speed lines, no effects, no panel, no frame, no text, no letters, no symbols, no scenery (the game adds the panel and speed lines).
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 16:9 (for example 1600x900).
```

### Sundel Bolong

Referensi 1: `assets/ghosts/base/sundelbolong.webp` · latar magenta · simpan sebagai `assets/ghosts/combo/sundelbolong-cutin.png`

```text
Create a COMBO cut-in portrait for a 2D Indonesian folklore horror fighting game: a split-second dramatic close-up shown when the fighter lands a combo.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions and art style).

Character: SUNDEL BOLONG, a long-haired ghost woman with a hole in her back.
Keep: cream ragged dress, very long black hair, pale skin, glowing cyan ring around the dark hole in her back, cyan eyes.
Moment: twisting to strike with a clawed hand, hair flying apart to show the glowing cyan ring in her back.

Composition: dynamic diagonal close-up, framed from the chest or shoulders up (the whole head for a head-only character), the character facing RIGHT and leaning hard into the strike toward the right edge, strong foreshortening so the striking hand, claws or head come at the viewer. Intense glowing eyes, extreme expression, dramatic rim light in cyan and deep teal, high contrast, clean bold outlines, painterly anime fighting-game style with a slight pixel-art texture. Fill about 85% of the image height.
Draw ONLY the character: no speed lines, no effects, no panel, no frame, no text, no letters, no symbols, no scenery (the game adds the panel and speed lines).
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 16:9 (for example 1600x900).
```

### Wewe Gombel

Referensi 1: `assets/ghosts/base/wewegombel.webp` · latar green · simpan sebagai `assets/ghosts/combo/wewegombel-cutin.png`

```text
Create a COMBO cut-in portrait for a 2D Indonesian folklore horror fighting game: a split-second dramatic close-up shown when the fighter lands a combo.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions and art style).

Character: WEWE GOMBEL, a hunched old ghost woman.
Keep: wild grey-white curly hair, wrinkled grey-brown skin, brown batik sarong, cream torn shawl, very long dark claws, bare feet.
Moment: both impossibly long arms whipping forward to grab, shawl flaring, wild grey hair swirling.

Composition: dynamic diagonal close-up, framed from the chest or shoulders up (the whole head for a head-only character), the character facing RIGHT and leaning hard into the strike toward the right edge, strong foreshortening so the striking hand, claws or head come at the viewer. Intense glowing eyes, extreme expression, dramatic rim light in dusk orange and dark brown, high contrast, clean bold outlines, painterly anime fighting-game style with a slight pixel-art texture. Fill about 85% of the image height.
Draw ONLY the character: no speed lines, no effects, no panel, no frame, no text, no letters, no symbols, no scenery (the game adds the panel and speed lines).
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 16:9 (for example 1600x900).
```

### Genderuwo

Referensi 1: `assets/ghosts/base/genderuwo.webp` · latar green · simpan sebagai `assets/ghosts/combo/genderuwo-cutin.png`

```text
Create a COMBO cut-in portrait for a 2D Indonesian folklore horror fighting game: a split-second dramatic close-up shown when the fighter lands a combo.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions and art style).

Character: GENDERUWO, a giant hairy forest spirit.
Keep: huge build with shaggy dark brown fur, leaves and roots in the fur, tusks, ember-orange eyes, batik loincloth, grey boulder in the right hand.
Moment: mid-punch with a huge fist and the boulder, fur bristling, tusks bared in a roar.

Composition: dynamic diagonal close-up, framed from the chest or shoulders up (the whole head for a head-only character), the character facing RIGHT and leaning hard into the strike toward the right edge, strong foreshortening so the striking hand, claws or head come at the viewer. Intense glowing eyes, extreme expression, dramatic rim light in ember orange and stone grey, high contrast, clean bold outlines, painterly anime fighting-game style with a slight pixel-art texture. Fill about 85% of the image height.
Draw ONLY the character: no speed lines, no effects, no panel, no frame, no text, no letters, no symbols, no scenery (the game adds the panel and speed lines).
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 16:9 (for example 1600x900).
```

### Eyang Sukmo Capo

Referensi 1: `assets/ghosts/base/eyangsukmocapo.webp` · latar magenta · simpan sebagai `assets/ghosts/combo/eyangsukmocapo-cutin.png`

```text
Create a COMBO cut-in portrait for a 2D Indonesian folklore horror fighting game: a split-second dramatic close-up shown when the fighter lands a combo.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions and art style).

Character: EYANG SUKMO CAPO, an old Javanese guardian spirit.
Keep: brown batik blangkon headcloth, dark beskap jacket, white long beard and eyebrows, brown batik sarong, twisted wooden staff in the left hand, white smoke at the feet.
Moment: thrusting the open palm forward with the twisted staff behind, beard and sleeves blown back by inner power.

Composition: dynamic diagonal close-up, framed from the chest or shoulders up (the whole head for a head-only character), the character facing RIGHT and leaning hard into the strike toward the right edge, strong foreshortening so the striking hand, claws or head come at the viewer. Intense glowing eyes, extreme expression, dramatic rim light in gold and warm white, high contrast, clean bold outlines, painterly anime fighting-game style with a slight pixel-art texture. Fill about 85% of the image height.
Draw ONLY the character: no speed lines, no effects, no panel, no frame, no text, no letters, no symbols, no scenery (the game adds the panel and speed lines).
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 16:9 (for example 1600x900).
```

### Leyak

Referensi 1: `assets/ghosts/base/leyak.webp` · latar green · simpan sebagai `assets/ghosts/combo/leyak-cutin.png`

```text
Create a COMBO cut-in portrait for a 2D Indonesian folklore horror fighting game: a split-second dramatic close-up shown when the fighter lands a combo.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions and art style).

Character: LEYAK, a Balinese fire witch.
Keep: wild white-grey flame-like hair, bulging eyes, long red tongue, black wrap with gold flame pattern, gold cuffs and anklets, long claws, orange flame in the right palm.
Moment: lunging with the burning palm thrust forward, tongue out, flame-like hair exploding outward.

Composition: dynamic diagonal close-up, framed from the chest or shoulders up (the whole head for a head-only character), the character facing RIGHT and leaning hard into the strike toward the right edge, strong foreshortening so the striking hand, claws or head come at the viewer. Intense glowing eyes, extreme expression, dramatic rim light in fire orange and red, high contrast, clean bold outlines, painterly anime fighting-game style with a slight pixel-art texture. Fill about 85% of the image height.
Draw ONLY the character: no speed lines, no effects, no panel, no frame, no text, no letters, no symbols, no scenery (the game adds the panel and speed lines).
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 16:9 (for example 1600x900).
```

### Kuyang

Referensi 1: `assets/ghosts/base/kuyang.webp` · latar green · simpan sebagai `assets/ghosts/combo/kuyang-cutin.png`

```text
Create a COMBO cut-in portrait for a 2D Indonesian folklore horror fighting game: a split-second dramatic close-up shown when the fighter lands a combo.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions and art style).

Character: KUYANG, a Borneo night witch whose head flies.
Keep: long wavy black hair with glowing red strands, pale skin, red eyes, small fangs, long-sleeved black top, purple patterned sarong, clay oil lamp with a red flame.
Moment: swooping forward with fangs bared, hair with glowing red strands streaming like ribbons, oil lamp flaring.

Composition: dynamic diagonal close-up, framed from the chest or shoulders up (the whole head for a head-only character), the character facing RIGHT and leaning hard into the strike toward the right edge, strong foreshortening so the striking hand, claws or head come at the viewer. Intense glowing eyes, extreme expression, dramatic rim light in crimson red and pale dawn blue, high contrast, clean bold outlines, painterly anime fighting-game style with a slight pixel-art texture. Fill about 85% of the image height.
Draw ONLY the character: no speed lines, no effects, no panel, no frame, no text, no letters, no symbols, no scenery (the game adds the panel and speed lines).
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 16:9 (for example 1600x900).
```

### Palasik

Referensi 1: `assets/ghosts/base/palasik.webp` · latar green · simpan sebagai `assets/ghosts/combo/palasik-cutin.png`

```text
Create a COMBO cut-in portrait for a 2D Indonesian folklore horror fighting game: a split-second dramatic close-up shown when the fighter lands a combo.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions and art style).

Character: PALASIK, a floating bodiless head from West Sumatra.
Keep: only a head: old wrinkled face, bald top, long grey hair, glowing red eyes, fangs, dark red smoke ribbons trailing below; NO body.
Moment: the floating head diving forward fangs first, dark red smoke ribbons stretched behind it.

Composition: dynamic diagonal close-up, framed from the chest or shoulders up (the whole head for a head-only character), the character facing RIGHT and leaning hard into the strike toward the right edge, strong foreshortening so the striking hand, claws or head come at the viewer. Intense glowing eyes, extreme expression, dramatic rim light in dark red and black, high contrast, clean bold outlines, painterly anime fighting-game style with a slight pixel-art texture. Fill about 85% of the image height.
Draw ONLY the character: no speed lines, no effects, no panel, no frame, no text, no letters, no symbols, no scenery (the game adds the panel and speed lines).
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 16:9 (for example 1600x900).
```

### Tuyul

Referensi 1: `assets/ghosts/base/tuyul.webp` · latar magenta · simpan sebagai `assets/ghosts/combo/tuyul-cutin.png`

```text
Create a COMBO cut-in portrait for a 2D Indonesian folklore horror fighting game: a split-second dramatic close-up shown when the fighter lands a combo.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions and art style).

Character: TUYUL, a small bald thief spirit.
Keep: bald grey child body, big round head and ears, big brown eyes, buck teeth grin, brown patched shirt and shorts, coin sack on the back.
Moment: diving forward with a grin, swinging the coin sack like a club, coins flying out of it.

Composition: dynamic diagonal close-up, framed from the chest or shoulders up (the whole head for a head-only character), the character facing RIGHT and leaning hard into the strike toward the right edge, strong foreshortening so the striking hand, claws or head come at the viewer. Intense glowing eyes, extreme expression, dramatic rim light in gold coin and brown, high contrast, clean bold outlines, painterly anime fighting-game style with a slight pixel-art texture. Fill about 85% of the image height.
Draw ONLY the character: no speed lines, no effects, no panel, no frame, no text, no letters, no symbols, no scenery (the game adds the panel and speed lines).
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 16:9 (for example 1600x900).
```

### Jenglot

Referensi 1: `assets/ghosts/base/jenglot.webp` · latar green · simpan sebagai `assets/ghosts/combo/jenglot-cutin.png`

```text
Create a COMBO cut-in portrait for a 2D Indonesian folklore horror fighting game: a split-second dramatic close-up shown when the fighter lands a combo.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions and art style).

Character: JENGLOT, a tiny shrivelled doll-like creature.
Keep: very small hunched brown body, very long tangled black hair, red eyes, fangs, long white claws, torn brown loincloth.
Moment: leaping forward claws first, very long tangled hair fanning out behind.

Composition: dynamic diagonal close-up, framed from the chest or shoulders up (the whole head for a head-only character), the character facing RIGHT and leaning hard into the strike toward the right edge, strong foreshortening so the striking hand, claws or head come at the viewer. Intense glowing eyes, extreme expression, dramatic rim light in blood red and black, high contrast, clean bold outlines, painterly anime fighting-game style with a slight pixel-art texture. Fill about 85% of the image height.
Draw ONLY the character: no speed lines, no effects, no panel, no frame, no text, no letters, no symbols, no scenery (the game adds the panel and speed lines).
Background: perfectly flat pure green #00FF00 everywhere, one single colour. Do not use green anywhere on the character.
Aspect ratio 16:9 (for example 1600x900).
```

### Begu Ganjang

Referensi 1: `assets/ghosts/base/beguganjang.webp` · latar magenta · simpan sebagai `assets/ghosts/combo/beguganjang-cutin.png`

```text
Create a COMBO cut-in portrait for a 2D Indonesian folklore horror fighting game: a split-second dramatic close-up shown when the fighter lands a combo.
Reference 1 is the character design: copy it EXACTLY (same face, colours, outfit, proportions and art style).

Character: BEGU GANJANG, a very tall thin spirit from Batak legend.
Keep: very tall skeletal dark grey body, long black hair over the face, glowing white eyes, long arms and fingers, ragged loincloth.
Moment: one very long skeletal arm whipping down and forward, long black hair swinging off the glowing white eyes.

Composition: dynamic diagonal close-up, framed from the chest or shoulders up (the whole head for a head-only character), the character facing RIGHT and leaning hard into the strike toward the right edge, strong foreshortening so the striking hand, claws or head come at the viewer. Intense glowing eyes, extreme expression, dramatic rim light in shadow black and pale white, high contrast, clean bold outlines, painterly anime fighting-game style with a slight pixel-art texture. Fill about 85% of the image height.
Draw ONLY the character: no speed lines, no effects, no panel, no frame, no text, no letters, no symbols, no scenery (the game adds the panel and speed lines).
Background: perfectly flat pure magenta #FF00FF everywhere, one single colour. Do not use pink, magenta or purple anywhere on the character.
Aspect ratio 16:9 (for example 1600x900).
```
