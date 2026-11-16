/* First-fight tutorial: three guided actions in the arena against a passive CPU (training rules, CPU off), then the
   fight the player picked. 1) move and jump, 2) basic attack, 3) one skill. Each step names the keys for the device the
   player is using right now (keyboard, the touch buttons, or a pad) and moves on when the game reports the action
   (window.__game.onAction). "Lewati" (or Enter / the pad's Select) ends it at once. Runs once per browser; Pengaturan >
   Ulangi tutorial plays it again. Combos and the other moves stay in the Kitab Dedemit and the controls card. */
(() => {
  'use strict';
  const game = () => window.__game, KEY = 'dedemit.tutorialDone';
  const box = document.querySelector('#tutorial');
  if (!box) return;
  const kicker = box.querySelector('.tut-kicker'), prompt = box.querySelector('.tut-prompt'), chips = box.querySelector('.tut-chips');
  const skipBtn = box.querySelector('.tut-skip'), skipKey = box.querySelector('.tut-skip-key');
  const touchShell = document.documentElement.classList.contains('touch');
  const k = (...keys) => keys.map(x => `<kbd>${x}</kbd>`).join('');

  // Each chip is one action the step needs; it ticks when the player does it.
  const STEPS = [
    { title: 'Gerak dan lompat', needs: ['move', 'jump'], targets: '.dbtn-left,.dbtn-right,.dbtn-up',
      chips: { keyboard: { move: `Jalan ${k('A', 'D')}`, jump: `Lompat ${k('W')}` },
               touch: { move: `Jalan ${k('◀', '▶')}`, jump: `Lompat ${k('▲')}` },
               pad: { move: `Jalan ${k('D-pad')}`, jump: `Lompat ${k('B')}` } } },
    { title: 'Pukul lawanmu', needs: ['attack'], targets: '.tbtn-attack',
      chips: { keyboard: { attack: `Serang ${k('Spasi')}` }, touch: { attack: 'Serang: tombol besar' }, pad: { attack: `Serang ${k('A')}` } } },
    { title: 'Keluarkan jurus', needs: ['skill'], targets: '.tbtn-s1,.tbtn-s2',
      chips: { keyboard: { skill: `Jurus ${k('I')} atau ${k('O')}` }, touch: { skill: 'Jurus: tombol kecil yang menyala' }, pad: { skill: `Jurus ${k('X')} atau ${k('Y')}` } } }
  ];

  let run = null;   // { step, did:Set, then, replay, started, wait }
  let device = 'keyboard';

  function done() { try { return localStorage.getItem(KEY) === '1'; } catch (_) { return false; } }
  function markDone() { try { localStorage.setItem(KEY, '1'); } catch (_) {} }
  function firstDevice() { return window.DedemitPads?.count() > 0 ? 'pad' : touchShell ? 'touch' : 'keyboard'; }

  function render() {
    if (!run) return;
    for (const el of document.querySelectorAll('.tutorial-target')) el.classList.remove('tutorial-target');
    box.dataset.device = device;
    skipKey.textContent = device === 'keyboard' ? 'Enter' : device === 'pad' ? 'Select' : '';
    skipKey.hidden = device === 'touch';
    if (run.step >= STEPS.length) {
      kicker.textContent = 'Tutorial selesai';
      prompt.textContent = run.replay ? 'Bagus!' : 'Siap bertarung!';
      chips.innerHTML = '<span class="tut-chip tut-more">Kombo dan jurus lain ada di Kitab Dedemit.</span>';
      skipBtn.hidden = true; return;
    }
    const s = STEPS[run.step], text = s.chips[device];
    kicker.textContent = `Tutorial · ${run.step + 1} / ${STEPS.length}`;
    prompt.textContent = s.title;
    chips.innerHTML = s.needs.map(n => `<span class="tut-chip${run.did.has(n) ? ' done' : ''}" data-need="${n}"><i aria-hidden="true">✓</i>${text[n]}</span>`).join('');
    skipBtn.hidden = false;
    if (device === 'touch') for (const el of document.querySelectorAll(s.targets)) el.classList.add('tutorial-target');
  }
  function setDevice(d) { if (d === device) return; device = d; render(); }

  function onAction(kind) {
    if (!run || run.wait || run.step >= STEPS.length) return;
    const s = STEPS[run.step];
    if (!s.needs.includes(kind) || run.did.has(kind)) return;
    run.did.add(kind);
    chips.querySelector(`[data-need="${kind}"]`)?.classList.add('done');
    if (!s.needs.every(n => run.did.has(n))) return;
    // A short beat so the last tick is seen, then the next step (or the closing line before the real fight).
    run.wait = true; game()?.menuSound?.('confirm');
    setTimeout(() => {
      if (!run) return;
      run.step++; run.did.clear(); run.wait = false; render(); flash();
      if (run.step >= STEPS.length) { run.wait = true; setTimeout(() => finish(true), 1500); }
    }, 650);
  }
  function flash() { box.classList.remove('tut-next'); void box.offsetWidth; box.classList.add('tut-next'); }

  function stop() {
    run = null; box.hidden = true;
    for (const el of document.querySelectorAll('.tutorial-target')) el.classList.remove('tutorial-target');
    game()?.onAction?.(null);
  }
  function finish(completed) {
    if (!run) return;
    const then = run.then;
    markDone(); stop();
    if (!completed) game()?.menuSound?.('confirm');
    then?.();
  }

  // run: start the tutorial match with the player's picks; if the arena cannot start yet, go straight on.
  function start(picks, then, replay = false) {
    const g = game();
    if (run) stop();
    if (!g?.startMatch?.({ ...picks, level: 'easy', mode: 'training', tutorial: true })) { then?.(); return; }
    run = { step: 0, did: new Set(), then, replay, started: performance.now(), wait: false };
    device = firstDevice();
    g.onAction(onAction);
    box.hidden = false; render(); flash();
    document.querySelector('#arena')?.focus({ preventScroll: true });
  }

  skipBtn.addEventListener('click', () => finish(false));
  // Clicking Lewati must not leave focus on the button (the game ignores Space on a focused button).
  skipBtn.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; e.preventDefault(); });

  // Input device of the moment: a real key press, a touch on the touch buttons, or any pad button or stick.
  addEventListener('keydown', e => {
    if (!run || !e.isTrusted) return;
    if (e.key === 'Enter' && !e.repeat && !box.hidden && !skipBtn.hidden && performance.now() - run.started > 400
        && !document.querySelector('dialog[open]') && !(document.activeElement?.tagName === 'BUTTON' && document.activeElement !== skipBtn)) {
      e.preventDefault(); finish(false); return;
    }
    if (e.key.length === 1 || e.key.startsWith('Arrow')) setDevice('keyboard');
  }, true);
  addEventListener('pointerdown', e => { if (run && touchShell && e.pointerType !== 'mouse') setDevice('touch'); }, true);
  let padSelect = false;
  function poll() {
    if (run) {
      // The tutorial ends quietly when the player leaves for the menu (pause > Kembali ke main menu).
      if (document.body.classList.contains('in-menu') || !document.body.classList.contains('in-tutorial')) stop();
      else if (navigator.getGamepads) {
        let select = false;
        for (const p of navigator.getGamepads()) {
          if (!p || !p.connected) continue;
          if (p.buttons.some(b => b?.pressed) || p.axes.some(a => Math.abs(a) > .5)) setDevice('pad');
          if (p.buttons[8]?.pressed) select = true;
        }
        if (select && !padSelect && !skipBtn.hidden && !document.querySelector('dialog[open]')) finish(false);
        padSelect = select;
      }
    }
    requestAnimationFrame(poll);
  }
  requestAnimationFrame(poll);

  window.Tutorial = { pending: () => !done(), run: start, active: () => !!run, step: () => run?.step ?? null, skip: () => finish(false) };
})();
