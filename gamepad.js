/* Game controllers (Bluetooth or USB pads that the browser reports with the "standard" mapping: Xbox, PlayStation and
   most generic pads). Polled every frame through the Gamepad API; works on desktop and inside the phone shell.

   Who a pad controls:
     - "Dua pemain" with two pads: the first pad is P1, the second is P2.
     - "Dua pemain" with one pad: the pad is P2 (P1 stays on the keyboard or touch buttons).
     - Every other mode (and an online fight): the pad is P1.
   In a fight:  D-pad / left stick = move, up = jump, down = crouch.  A / Cross = attack,  X / Square = skill 1,
                Y / Triangle = skill 2,  B / Circle = jump,  RB or LB (R1/L1) = ultimate,  RT or LT (R2/L2) = super,
                Start = pause (leave, online).
   In menus and dialogs: D-pad / stick = move the selection, A = confirm, B = back, Start = confirm.
   Fight input goes through window.__game.input (P1, the same path as the keyboard, so online and pause rules hold)
   and window.__game.p2 (P2). */
(() => {
  'use strict';
  if (!navigator.getGamepads) return;
  const game = () => window.__game;
  const P1_KEYS = { left: 'a', right: 'd', up: 'w', down: 's', attack: ' ', skill1: 'i', skill2: 'o', ultimate: 'p', super: 'u', pause: 'escape' };
  const BUTTONS = { 0: 'attack', 1: 'up', 2: 'skill1', 3: 'skill2', 4: 'ultimate', 5: 'ultimate', 6: 'super', 7: 'super', 9: 'pause' };
  const held = new Map();        // pad index -> { role, actions:Set }
  const menuHeld = new Map();    // pad index -> { dirs:Set, buttons:Set, repeatAt }

  function pads() { return [...navigator.getGamepads()].filter(p => p && p.connected); }
  function actionsOf(pad) {
    const out = new Set(), b = i => !!pad.buttons[i]?.pressed, ax = pad.axes[0] || 0, ay = pad.axes[1] || 0;
    if (b(14) || ax < -.5) out.add('left');
    if (b(15) || ax > .5) out.add('right');
    if (b(12) || ay < -.6) out.add('up');
    if (b(13) || ay > .6) out.add('down');
    for (const [i, a] of Object.entries(BUTTONS)) if (b(+i)) out.add(a);
    return out;
  }
  function roleOf(pad, list, state) {
    if (!state.localP2) return 'p1';
    const order = list.map(p => p.index).sort((a, b) => a - b);
    if (order.length < 2) return 'p2';
    const i = order.indexOf(pad.index);
    return i === 0 ? 'p1' : i === 1 ? 'p2' : null;
  }
  function send(role, action, down) {
    const g = game(); if (!g) return;
    if (role === 'p2') { if (action !== 'pause') g.p2(action, down); return; }
    const key = P1_KEYS[action]; if (key) g.input(key, down);
  }
  function releaseAll(index) {
    const h = held.get(index); if (!h) return;
    for (const a of h.actions) send(h.role, a, false);
    held.delete(index);
  }

  // Menus and dialogs: arrows / Enter / Escape as keyboard events on the focused element (the menu and the dialogs
  // listen for those), and A clicks the focused button.
  function key(name) {
    const target = document.activeElement && document.activeElement !== document.body ? document.activeElement : document;
    target.dispatchEvent(new KeyboardEvent('keydown', { key: name, code: name, bubbles: true, cancelable: true }));
  }
  function confirm() {
    const el = document.activeElement, screen = document.querySelector('#front-menu')?.dataset.screen;
    const menuOpen = !document.querySelector('#front-menu')?.hidden;
    if (el && el.tagName === 'BUTTON' && !(menuOpen && screen === 'select' && el.dataset.fighter)) el.click(); else key('Enter');
  }
  function menuPad(pad) {
    const b = i => !!pad.buttons[i]?.pressed, ax = pad.axes[0] || 0, ay = pad.axes[1] || 0;
    const dirs = new Set();
    if (b(12) || ay < -.6) dirs.add('ArrowUp'); if (b(13) || ay > .6) dirs.add('ArrowDown');
    if (b(14) || ax < -.6) dirs.add('ArrowLeft'); if (b(15) || ax > .6) dirs.add('ArrowRight');
    const buttons = new Set([0, 1, 9].filter(b));
    // Entering a menu with buttons still held (the attack button when a round ends) must not confirm or go back.
    const first = !menuHeld.has(pad.index);
    const prev = first ? { dirs, buttons, repeatAt: performance.now() + 380 } : menuHeld.get(pad.index), now = performance.now();
    for (const d of dirs) if (!prev.dirs.has(d)) { key(d); prev.repeatAt = now + 380; }
    if (dirs.size && now >= prev.repeatAt && [...dirs].every(d => prev.dirs.has(d))) { key([...dirs][0]); prev.repeatAt = now + 140; }
    if (buttons.has(0) && !prev.buttons.has(0)) confirm();
    if (buttons.has(9) && !prev.buttons.has(9)) confirm();
    if (buttons.has(1) && !prev.buttons.has(1)) key('Escape');
    menuHeld.set(pad.index, { dirs, buttons, repeatAt: prev.repeatAt });
  }

  function step() {
    const g = game(), list = pads();
    if (g && list.length) {
      const state = g.padState?.() || {}, inMenu = state.menuOpen || !!document.querySelector('dialog[open]');
      for (const pad of list) {
        if (inMenu) { releaseAll(pad.index); menuPad(pad); continue; }
        // Buttons still held from the menu (the A that started the fight) count as already pressed, so they do not
        // fire an attack; the same goes back the other way when a menu or dialog opens.
        const wasMenu = menuHeld.has(pad.index); menuHeld.delete(pad.index);
        const role = roleOf(pad, list, state), now = actionsOf(pad), prev = held.get(pad.index);
        if (wasMenu) { held.set(pad.index, { role, actions: now }); continue; }
        if (prev && prev.role !== role) releaseAll(pad.index);
        const before = held.get(pad.index)?.actions || new Set();
        if (role) {
          for (const a of before) if (!now.has(a)) send(role, a, false);
          for (const a of now) if (!before.has(a)) send(role, a, true);
          held.set(pad.index, { role, actions: now });
        }
      }
    }
  }
  function poll() { step(); requestAnimationFrame(poll); }

  // A small notice when a pad connects or leaves, and an event the menu uses to show "Dua pemain" on phones.
  let toast = null, toastTimer = 0;
  function notice(text) {
    if (!toast) { toast = document.createElement('div'); toast.className = 'pad-toast'; toast.setAttribute('role', 'status'); document.body.appendChild(toast); }
    toast.textContent = text; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }
  const short = id => String(id || 'Stik').replace(/\(.*?\)/g, '').replace(/\s+/g, ' ').trim().slice(0, 32) || 'Stik';
  window.addEventListener('gamepadconnected', e => { notice(`🎮 ${short(e.gamepad.id)} terhubung`); window.dispatchEvent(new Event('dedemit-pads')); });
  window.addEventListener('gamepaddisconnected', e => { releaseAll(e.gamepad.index); menuHeld.delete(e.gamepad.index); notice('🎮 Stik terputus'); window.dispatchEvent(new Event('dedemit-pads')); });
  window.DedemitPads = { count: () => pads().length, step };   // step: one poll, for tests
  requestAnimationFrame(poll);
})();
