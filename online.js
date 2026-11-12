/* PERANG DEDEMIT online, stage 1: Google sign-in (Firebase Auth), a profile with a friend code, and friends (Firestore).
   Fights between accounts come in the next stage. The data model and who may read/write what are in firestore.rules
   (paste it into Firebase console > Firestore Database > Rules). The web config below is public by design; the rules
   are what protect the data.

   Firestore:
     users/{uid}                  { uid, name, photo, code, createdAt, lastSeen }   readable by signed-in players
     users/{uid}/friends/{fid}    { uid, name, photo, code, since }                 written by both sides on accept
     codes/{DMT-XXXX}             { uid }                                           friend code -> account, unique
     friendRequests/{from_to}     { from, to, fromName, fromPhoto, fromCode, toName, toPhoto, toCode, createdAt }

   The menu (menu.js) reads window.DedemitOnline.state and re-renders on the 'dedemit-online' window event. */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut as fbSignOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc, setDoc, runTransaction, collection, query, where, onSnapshot, writeBatch, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyAZbXIMWG5vBz9U3zUHpBgLfmmPklrijhc',
  authDomain: 'wardedemit.firebaseapp.com',
  projectId: 'wardedemit',
  storageBucket: 'wardedemit.firebasestorage.app',
  messagingSenderId: '938391532132',
  appId: '1:938391532132:web:f3911cab27641f5d88a571'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'id';
const db = getFirestore(app);

const ONLINE_WINDOW = 150 * 1000;          // a friend whose lastSeen is newer than this counts as online
const PRESENCE_EVERY = 60 * 1000;
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   // no 0/O or 1/I
const state = { ready: false, user: null, profile: null, friends: [], incoming: [], outgoing: [], error: '', notice: '', busy: false };
let unsubs = [], presenceTimer = 0;
const friendWatch = new Map();             // fid -> { unsub, live }

function emit() { window.dispatchEvent(new CustomEvent('dedemit-online', { detail: state })); }
function setStatus(error = '', notice = '') { state.error = error; state.notice = notice; emit(); }
const cleanName = n => String(n || '').replace(/\s+/g, ' ').trim().slice(0, 24) || 'Pemain';
function newCode() { const v = crypto.getRandomValues(new Uint32Array(4)); return 'DMT-' + [...v].map(x => CODE_CHARS[x % CODE_CHARS.length]).join(''); }
function normalizeCode(input) {
  let c = String(input || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (c.startsWith('DMT')) c = c.slice(3);
  return c.length === 4 ? 'DMT-' + c : null;
}
function message(e) {
  const code = e?.code || '';
  if (code === 'permission-denied') return 'Akses database ditolak. Pastikan Firestore Rules dari file firestore.rules sudah dipasang.';
  if (code === 'unavailable' || code === 'auth/network-request-failed') return 'Tidak ada koneksi internet. Coba lagi sebentar.';
  if (code === 'auth/unauthorized-domain') return 'Domain ini belum diizinkan di Firebase Authentication (Authorized domains).';
  if (code === 'auth/popup-blocked') return 'Popup login diblokir browser. Izinkan popup lalu coba lagi.';
  return typeof e === 'string' ? e : (e?.message || 'Terjadi kesalahan.');
}
async function run(task, notice = '') {
  if (state.busy) return false;
  state.busy = true; setStatus('', '');
  try { await task(); state.busy = false; setStatus('', notice); return true; }
  catch (e) { state.busy = false; setStatus(message(e)); return false; }
}

// ---------------------------------------------------------------- profile
async function ensureProfile(user) {
  const ref = doc(db, 'users', user.uid), snap = await getDoc(ref);
  if (snap.exists()) { await updateDoc(ref, { lastSeen: serverTimestamp(), photo: (user.photoURL || '').slice(0, 500) }); return; }
  for (let i = 0; i < 6; i++) {
    const code = newCode();
    try {
      await runTransaction(db, async tx => {
        const cref = doc(db, 'codes', code);
        if ((await tx.get(cref)).exists()) throw new Error('taken');
        tx.set(cref, { uid: user.uid });
        tx.set(ref, { uid: user.uid, name: cleanName(user.displayName), photo: (user.photoURL || '').slice(0, 500), code, createdAt: serverTimestamp(), lastSeen: serverTimestamp() });
      });
      return;
    } catch (e) { if (e.message !== 'taken') throw e; }
  }
  throw new Error('Gagal membuat kode teman. Coba lagi.');
}

// ---------------------------------------------------------------- live data
function stopListening() {
  for (const u of unsubs) u(); unsubs = [];
  for (const w of friendWatch.values()) w.unsub(); friendWatch.clear();
  clearInterval(presenceTimer); presenceTimer = 0;
  Object.assign(state, { profile: null, friends: [], incoming: [], outgoing: [] });
}
function friendList(docs) {
  const seen = new Set();
  for (const d of docs) {
    const f = d.data(); seen.add(f.uid);
    if (!friendWatch.has(f.uid)) {
      const w = { live: null, unsub: () => {} };
      w.unsub = onSnapshot(doc(db, 'users', f.uid), s => { w.live = s.exists() ? s.data() : null; refreshFriends(); }, () => {});
      friendWatch.set(f.uid, w);
    }
  }
  for (const [uid, w] of friendWatch) if (!seen.has(uid)) { w.unsub(); friendWatch.delete(uid); }
  state.friendDocs = docs.map(d => d.data());
  refreshFriends();
}
function refreshFriends() {
  const now = Date.now();
  state.friends = (state.friendDocs || []).map(f => {
    const live = friendWatch.get(f.uid)?.live, seen = live?.lastSeen?.toMillis?.() || 0;
    return { uid: f.uid, name: live?.name || f.name, photo: live?.photo || f.photo, code: live?.code || f.code, online: now - seen < ONLINE_WINDOW, lastSeen: seen };
  }).sort((a, b) => (b.online - a.online) || a.name.localeCompare(b.name));
  emit();
}
function startListening(uid) {
  unsubs.push(onSnapshot(doc(db, 'users', uid), s => { state.profile = s.exists() ? s.data() : null; emit(); }, e => setStatus(message(e))));
  unsubs.push(onSnapshot(collection(db, 'users', uid, 'friends'), q => friendList(q.docs), e => setStatus(message(e))));
  unsubs.push(onSnapshot(query(collection(db, 'friendRequests'), where('to', '==', uid)), q => { state.incoming = q.docs.map(d => d.data()); emit(); }, e => setStatus(message(e))));
  unsubs.push(onSnapshot(query(collection(db, 'friendRequests'), where('from', '==', uid)), q => { state.outgoing = q.docs.map(d => d.data()); emit(); }, e => setStatus(message(e))));
  const beat = () => { if (document.visibilityState === 'visible' && auth.currentUser) updateDoc(doc(db, 'users', uid), { lastSeen: serverTimestamp() }).catch(() => {}); refreshFriends(); };
  presenceTimer = setInterval(beat, PRESENCE_EVERY);
  document.addEventListener('visibilitychange', beat);
  unsubs.push(() => document.removeEventListener('visibilitychange', beat));
}

onAuthStateChanged(auth, async user => {
  stopListening();
  state.user = user ? { uid: user.uid, name: user.displayName || '', photo: user.photoURL || '', email: user.email || '' } : null;
  if (user) {
    try { await ensureProfile(user); startListening(user.uid); state.error = ''; }
    catch (e) { state.error = message(e); }
  }
  state.ready = true; emit();
});
getRedirectResult(auth).catch(e => setStatus(message(e)));

// ---------------------------------------------------------------- actions
const me = () => auth.currentUser?.uid;
const api = {
  state,
  async signIn() {
    const provider = new GoogleAuthProvider(); provider.setCustomParameters({ prompt: 'select_account' });
    state.busy = true; setStatus();
    try { await signInWithPopup(auth, provider); }
    catch (e) {
      if (e?.code === 'auth/popup-blocked' || e?.code === 'auth/operation-not-supported-in-this-environment') { try { await signInWithRedirect(auth, provider); return; } catch (e2) { e = e2; } }
      if (e?.code !== 'auth/popup-closed-by-user' && e?.code !== 'auth/cancelled-popup-request') state.error = message(e);
    }
    state.busy = false; emit();
  },
  signOut: () => run(() => fbSignOut(auth)),
  setName: name => run(() => updateDoc(doc(db, 'users', me()), { name: cleanName(name) }), 'Nama tersimpan.'),
  addFriend: input => run(async () => {
    const code = normalizeCode(input);
    if (!code) throw 'Kode teman tidak valid. Contoh: DMT-4K9Q.';
    if (code === state.profile?.code) throw 'Itu kode temanmu sendiri.';
    const c = await getDoc(doc(db, 'codes', code));
    if (!c.exists()) throw 'Kode teman tidak ditemukan.';
    const to = c.data().uid;
    if (state.friends.some(f => f.uid === to)) throw 'Kalian sudah berteman.';
    if (state.outgoing.some(r => r.to === to)) throw 'Permintaan sudah terkirim. Tunggu temanmu menerimanya.';
    if (state.incoming.some(r => r.from === to)) { await acceptRequest(to); return; }
    const target = (await getDoc(doc(db, 'users', to))).data() || {}, p = state.profile;
    await setDoc(doc(db, 'friendRequests', me() + '_' + to), {
      from: me(), to, fromName: p.name, fromPhoto: p.photo || '', fromCode: p.code,
      toName: cleanName(target.name), toPhoto: target.photo || '', toCode: code, createdAt: serverTimestamp()
    });
  }, 'Permintaan pertemanan terkirim.'),
  accept: from => run(() => acceptRequest(from), 'Sekarang kalian berteman.'),
  decline: from => run(() => deleteDoc(doc(db, 'friendRequests', from + '_' + me()))),
  cancel: to => run(() => deleteDoc(doc(db, 'friendRequests', me() + '_' + to))),
  removeFriend: uid => run(async () => {
    const b = writeBatch(db);
    b.delete(doc(db, 'users', me(), 'friends', uid)); b.delete(doc(db, 'users', uid, 'friends', me()));
    await b.commit();
  }, 'Teman dihapus.'),
  clearStatus() { setStatus(); }
};
async function acceptRequest(from) {
  const r = state.incoming.find(x => x.from === from), p = state.profile;
  if (!r || !p) throw 'Permintaan tidak ditemukan.';
  const b = writeBatch(db);
  b.set(doc(db, 'users', me(), 'friends', from), { uid: from, name: cleanName(r.fromName), photo: r.fromPhoto || '', code: r.fromCode, since: serverTimestamp() });
  b.set(doc(db, 'users', from, 'friends', me()), { uid: me(), name: p.name, photo: p.photo || '', code: p.code, since: serverTimestamp() });
  b.delete(doc(db, 'friendRequests', from + '_' + me()));
  await b.commit();
}

window.DedemitOnline = api;
emit();
