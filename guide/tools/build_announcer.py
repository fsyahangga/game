"""Generate the PERANG DEDEMIT announcer in Bahasa Indonesia.

Every cue is spoken by Microsoft's neural voice id-ID-ArdiNeural (through the edge-tts package), pitched down a little,
then given a short dark room echo so it sits with the gamelan music. The cue keys stay the engine's slot ids
(select_isolde is "Pocong!"), so game.js and menu.js need no changes. Writes the MP3s into assets/audio/announcer/ and
rewrites assets/audio/announcer/manifest.js with each clip's text and real duration.

Run from the project root:  python guide/tools/build_announcer.py [cue ...]
Needs Python 3 with numpy, scipy, edge-tts and imageio-ffmpeg (pip install numpy scipy edge-tts imageio-ffmpeg) and an
internet connection (edge-tts sends the text to Microsoft's speech service). Afterwards run:
node guide/tools/update_precache.mjs
To use a recorded or ElevenLabs take instead, drop it over the MP3 and rerun with --manifest-only.
"""
import asyncio, json, subprocess, sys, tempfile
from pathlib import Path
import numpy as np
from scipy import signal
from scipy.io import wavfile
import edge_tts, imageio_ffmpeg

ROOT = Path.cwd()
OUT = ROOT / 'assets/audio/announcer'
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
VOICE = dict(voice='id-ID-ArdiNeural', rate='-6%', pitch='-14Hz', volume='+0%')
SR = 44100

# engine slot -> how the announcer calls the dedemit that plays it
DEDEMIT = {
    'isolde': 'Pocong', 'arco': 'Kuntilanak', 'edda': 'Sundel Bolong', 'zanni': 'Wewe Gombel',
    'haldor': 'Genderuwo', 'solan': 'Eyang Sukmo Capo', 'fenr': 'Leyak', 'cora': 'Kuyang',
    'rhea': 'Palasik', 'nib': 'Tuyul', 'mira': 'Jenglot', 'naja': 'Begu Ganjang',
}
CUES = {
    'round_1': 'Ronde satu!', 'round_2': 'Ronde dua!', 'round_3': 'Ronde penentuan!',
    'fight': 'Tarung!', 'ko': 'Tumbang!', 'double_ko': 'Sama-sama tumbang!',
    'time_up': 'Waktu habis!', 'draw': 'Seri!',
    **{f'select_{slot}': f'{name}!' for slot, name in DEDEMIT.items()},
    **{f'{slot}_wins': f'{name} menang!' for slot, name in DEDEMIT.items()},
}

def ffmpeg(*args):
    subprocess.run([FFMPEG, '-y', '-loglevel', 'error', *args], check=True)

async def speak(text, path):
    await edge_tts.Communicate(text, **VOICE).save(str(path))

def haunt(x):
    """Trim the silence, add a short dark echo (two taps plus a dim, low-passed tail) and normalise to -1 dBFS."""
    loud = np.flatnonzero(np.abs(x) > .02)
    x = x[max(0, loud[0] - int(SR * .02)):loud[-1] + int(SR * .05)]
    n = int(SR * .9); t = np.arange(n) / SR
    rng = np.random.default_rng(13)
    tail = rng.standard_normal(n) * np.exp(-t * 7.5)
    tail = signal.lfilter(*signal.butter(2, 2600 / (SR / 2)), tail)
    ir = np.zeros(n); ir[0] = 1.0; ir[int(SR * .085)] += .22; ir[int(SR * .17)] += .11
    ir += tail / np.abs(tail).max() * .07
    y = signal.fftconvolve(x, ir)
    y = y[:len(x) + int(SR * .35)]
    y[-int(SR * .15):] *= np.linspace(1, 0, int(SR * .15))
    return (y / np.abs(y).max() * .89).astype(np.float32)

def duration(path):
    r = subprocess.run([FFMPEG, '-i', str(path)], capture_output=True, text=True)
    hms = r.stderr.split('Duration: ')[1].split(',')[0]
    h, m, s = hms.split(':'); return round(int(h) * 3600 + int(m) * 60 + float(s), 6)

def build(cue, text, tmp):
    raw, wav = tmp / f'{cue}.mp3', tmp / f'{cue}.wav'
    asyncio.run(speak(text, raw))
    ffmpeg('-i', str(raw), '-ac', '1', '-ar', str(SR), str(wav))
    rate, x = wavfile.read(wav); x = x.astype(np.float32) / 32768
    wavfile.write(wav, SR, (haunt(x) * 32767).astype(np.int16))
    ffmpeg('-i', str(wav), '-codec:a', 'libmp3lame', '-b:a', '96k', str(OUT / f'{cue}.mp3'))

def write_manifest():
    clips = {cue: {'file': f'assets/audio/announcer/{cue}.mp3', 'duration': duration(OUT / f'{cue}.mp3'), 'text': text}
             for cue, text in CUES.items()}
    man = {'voice': {'name': 'Ardi', 'voice_id': VOICE['voice'], 'provider': 'Microsoft Edge TTS (edge-tts)',
                     'language': 'Bahasa Indonesia', 'prosody': {k: v for k, v in VOICE.items() if k != 'voice'},
                     'post': 'trimmed, short dark echo, -1 dBFS (guide/tools/build_announcer.py)', 'locked': True},
           'clips': clips}
    (OUT / 'manifest.js').write_text('window.ANNOUNCER_MANIFEST = ' + json.dumps(man, ensure_ascii=False) + ';\n', encoding='utf-8')

if __name__ == '__main__':
    args = sys.argv[1:]
    if '--manifest-only' not in args:
        todo = [a for a in args if a in CUES] or list(CUES)
        with tempfile.TemporaryDirectory() as d:
            for cue in todo:
                build(cue, CUES[cue], Path(d)); print(f'{cue}: {CUES[cue]}')
    write_manifest(); print(f'manifest: {len(CUES)} clips')
