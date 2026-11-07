/* =====================================================
   GAGKA BOT — Website script
   Firebase Realtime Database (data) + Firebase Auth (admin)
   ===================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";
import { getDatabase, ref, onValue, set, remove, update, push } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

/* ---------- Firebase ---------- */
const firebaseConfig = {
  apiKey: "AIzaSyB9YoVqAl4uCUUFZB8oEjNoUFfdMeOMFVU",
  authDomain: "web-gag.firebaseapp.com",
  databaseURL: "https://web-gag-default-rtdb.firebaseio.com",
  projectId: "web-gag",
  storageBucket: "web-gag.firebasestorage.app",
  messagingSenderId: "802735767299",
  appId: "1:802735767299:web:ac36489727bcb0efe37336",
  measurementId: "G-REZL0QVMG4"
};

const app = initializeApp(firebaseConfig);
isSupported().then(ok => { if (ok) getAnalytics(app); }).catch(() => {});
const db = getDatabase(app);
const auth = getAuth(app);

/* ---------- i18n ---------- */
const translations = {
  en: {
    nav_home:'Home',nav_features:'Features',nav_intel:'Intelligence',nav_updates:'Updates',nav_dev:'Developer',nav_invite:'Invite Bot',
    hero_subtitle:'Advanced Intelligence Security System',
    hero_desc:'An intelligent security system designed to monitor, analyze, and protect Discord communities through advanced behavioral intelligence and threat detection.',
    hero_explore:'Explore Features',hero_invite:'Invite Bot',
    feat_badge:'Security Systems',feat_title:'ADVANCED SECURITY SYSTEMS',feat_desc:'Comprehensive security technologies designed to protect and monitor Discord communities.',
    f1_name:'Advanced Intelligence',f1_desc:'Security data analysis and processing system to discover behavioral patterns and anomalies.',
    f2_name:'Intelligent Threat Detection',f2_desc:'Risk detection system for identifying suspicious behaviors and potential threats.',
    f3_name:'Anti-Spam Protection',f3_desc:'Protection against spam messages and abnormal mass messaging activities.',
    f4_name:'Invite Security',f4_desc:'Anomaly detection system for invite link-related activities.',
    f5_name:'Security Monitoring',f5_desc:'Real-time server security status and situation tracking system.',
    f6_name:'Advanced Logging',f6_desc:'Event recording system for administrator review and historical auditing.',
    f7_name:'Moderation System',f7_desc:'Member management and inappropriate behavior handling support system.',
    f8_name:'Media Security',f8_desc:'Image and media event monitoring system within the server.',
    intel_badge:'Intelligence Core',intel_title:'BEYOND TRADITIONAL SECURITY',
    intel_desc:'Gagka is designed to go beyond conventional moderation by focusing on behavioral analysis, security intelligence, and suspicious activity monitoring.',
    intel_detail:'Gagka is designed to go beyond conventional moderation by focusing on behavioral analysis, security intelligence, and suspicious activity monitoring.',
    upd_badge:'Changelog',upd_title:'LATEST UPDATES',upd_latest:'Latest Version',upd_prev:'Previous Version',
    dev_badge:'Developer',dev_title:'POWERED BY GAGKA STUDIO',
    dev_desc:'Gagka Studio is the developer behind Gagka Bot, dedicated to building intelligent security technologies and advanced protection systems for Discord communities.',
    dev_date:'Created on 25 February 2025',
    footer_sub:'Advanced Intelligence Security System — Developed by Gagka Studio',
    footer_invite:'Invite GAGKA BOT on Discord',
    pw_title:'Admin Login',pw_desc:'Please sign in to access the admin panel.',pw_error:'Incorrect email or password. Please try again.',pw_enter:'Login',
    btn_save:'Save',btn_cancel:'Cancel',btn_delete:'Delete',
    admin_badge:'Admin Panel',admin_title:'Manage Website Content',admin_logout:'Logout',
    admin_ann_title:'Manage Announcements',admin_ann_title_th:'Title (Thai)',admin_ann_title_en:'Title (English)',
    admin_ann_body_th:'Content (Thai)',admin_ann_body_en:'Content (English)',
    admin_font:'Font',admin_color:'Text Color',admin_image_url:'Image URL (optional)',
    admin_featured:'Show as featured announcement',admin_visible:'Show on Home page',
    admin_upd_title:'Manage Updates',admin_version:'Version',admin_label_type:'Type',
    admin_details_th:'Details (Thai) — one per line',admin_details_en:'Details (English) — one per line',
    admin_upd_featured:'Featured Version',
    confirm_delete:'Confirm delete?',btn_yes:'Yes',btn_no:'No',
    toast_saved:'Saved successfully!',toast_deleted:'Deleted successfully!',
    toast_denied:'Permission denied — please login as admin / check database rules.',
    toast_error:'Something went wrong. Please try again.',
    toast_loggedout:'Logged out',
    no_ann:'No announcements yet',no_upd:'No updates yet',no_upd_public:'No updates available',
    visible:'Visible',hidden:'Hidden',latest:'Latest',previous:'Previous',edit:'Edit',del:'Delete'
  },
  th: {
    nav_home:'หน้าแรก',nav_features:'ระบบ',nav_intel:'Intelligence',nav_updates:'อัปเดต',nav_dev:'ผู้พัฒนา',nav_invite:'เชิญบอท',
    hero_subtitle:'ระบบรักษาความปลอดภัยอัจฉริยะขั้นสูง',
    hero_desc:'ระบบรักษาความปลอดภัยอัจฉริยะที่ออกแบบมาเพื่อตรวจสอบ วิเคราะห์ และปกป้องชุมชน Discord ด้วยเทคโนโลยี Intelligence และการตรวจจับภัยคุกคาม',
    hero_explore:'สำรวจระบบ',hero_invite:'เชิญบอท',
    feat_badge:'ระบบรักษาความปลอดภัย',feat_title:'ระบบรักษาความปลอดภัยขั้นสูง',feat_desc:'เทคโนโลยีความปลอดภัยที่ครอบคลุม ออกแบบมาเพื่อปกป้องและตรวจสอบชุมชน Discord',
    f1_name:'Advanced Intelligence',f1_desc:'ระบบวิเคราะห์และประมวลผลข้อมูลด้านความปลอดภัย เพื่อค้นหารูปแบบพฤติกรรมและความผิดปกติ',
    f2_name:'Intelligent Threat Detection',f2_desc:'ระบบตรวจจับความเสี่ยงและพฤติกรรมที่น่าสงสัย',
    f3_name:'Anti-Spam Protection',f3_desc:'ระบบป้องกันข้อความรบกวนและการส่งข้อความจำนวนมากผิดปกติ',
    f4_name:'Invite Security',f4_desc:'ระบบตรวจสอบความผิดปกติที่เกี่ยวข้องกับลิงก์คำเชิญ',
    f5_name:'Security Monitoring',f5_desc:'ระบบติดตามสถานการณ์และสถานะความปลอดภัยของเซิร์ฟเวอร์',
    f6_name:'Advanced Logging',f6_desc:'ระบบบันทึกเหตุการณ์เพื่อให้ผู้ดูแลสามารถตรวจสอบย้อนหลังได้',
    f7_name:'Moderation System',f7_desc:'ระบบสนับสนุนการจัดการสมาชิกและพฤติกรรมที่ไม่เหมาะสม',
    f8_name:'Media Security',f8_desc:'ระบบตรวจสอบเหตุการณ์ที่เกี่ยวข้องกับรูปภาพและสื่อภายในเซิร์ฟเวอร์',
    intel_badge:'Intelligence Core',intel_title:'เหนือกว่าระบบรักษาความปลอดภัยทั่วไป',
    intel_desc:'Gagka ออกแบบมาเพื่อก้าวข้ามการดูแลแบบดั้งเดิม โดยมุ่งเน้นการวิเคราะห์พฤติกรรม ข่าวกรองด้านความปลอดภัย และการตรวจสอบกิจกรรมที่น่าสงสัย',
    intel_detail:'Gagka ออกแบบมาเพื่อก้าวข้ามการดูแลแบบดั้งเดิม โดยมุ่งเน้นการวิเคราะห์พฤติกรรม ข่าวกรองด้านความปลอดภัย และการตรวจสอบกิจกรรมที่น่าสงสัย',
    upd_badge:'บันทึกการเปลี่ยนแปลง',upd_title:'อัปเดตล่าสุด',upd_latest:'เวอร์ชันล่าสุด',upd_prev:'เวอร์ชันก่อนหน้า',
    dev_badge:'ผู้พัฒนา',dev_title:'พัฒนาโดย GAGKA STUDIO',
    dev_desc:'Gagka Studio คือผู้พัฒนา Gagka Bot ที่มุ่งมั่นสร้างเทคโนโลยีความปลอดภัยอัจฉริยะและระบบป้องกันขั้นสูงสำหรับชุมชน Discord',
    dev_date:'สร้างเมื่อ 25 กุมภาพันธ์ 2025',
    footer_sub:'ระบบรักษาความปลอดภัยอัจฉริยะขั้นสูง — พัฒนาโดย Gagka Studio',
    footer_invite:'เชิญ GAGKA BOT บน Discord',
    pw_title:'เข้าสู่ระบบ Admin',pw_desc:'กรุณาเข้าสู่ระบบเพื่อเข้าหน้าจัดการ',pw_error:'อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่',pw_enter:'เข้าสู่ระบบ',
    btn_save:'บันทึก',btn_cancel:'ยกเลิก',btn_delete:'ลบ',
    admin_badge:'แผงควบคุม Admin',admin_title:'จัดการเนื้อหาเว็บไซต์',admin_logout:'ออกจากระบบ',
    admin_ann_title:'จัดการประกาศ',admin_ann_title_th:'หัวข้อ (ไทย)',admin_ann_title_en:'หัวข้อ (English)',
    admin_ann_body_th:'เนื้อหา (ไทย)',admin_ann_body_en:'เนื้อหา (English)',
    admin_font:'ฟอนต์',admin_color:'สีข้อความ',admin_image_url:'URL รูปภาพ (ไม่บังคับ)',
    admin_featured:'แสดงเป็นประกาศเด่น',admin_visible:'แสดงบนหน้า Home',
    admin_upd_title:'จัดการอัปเดต',admin_version:'เวอร์ชัน',admin_label_type:'ประเภท',
    admin_details_th:'รายละเอียด (ไทย) — แยกบรรทัดละรายการ',admin_details_en:'รายละเอียด (English) — one per line',
    admin_upd_featured:'เวอร์ชันเด่น (Featured)',
    confirm_delete:'ยืนยันการลบ?',btn_yes:'ใช่',btn_no:'ไม่',
    toast_saved:'บันทึกสำเร็จ!',toast_deleted:'ลบสำเร็จ!',
    toast_denied:'ไม่มีสิทธิ์ — กรุณาเข้าสู่ระบบแอดมิน / ตรวจสอบ Rules ของฐานข้อมูล',
    toast_error:'เกิดข้อผิดพลาด กรุณาลองใหม่',
    toast_loggedout:'ออกจากระบบแล้ว',
    no_ann:'ยังไม่มีประกาศ',no_upd:'ยังไม่มีอัปเดต',no_upd_public:'ยังไม่มีข้อมูลอัปเดต',
    visible:'แสดง',hidden:'ซ่อน',latest:'เวอร์ชันล่าสุด',previous:'เวอร์ชันก่อนหน้า',edit:'แก้ไข',del:'ลบ'
  }
};

let currentLang = localStorage.getItem('gagka_lang') || 'th';
const t = key => (translations[currentLang] && translations[currentLang][key]) || key;
const $ = id => document.getElementById(id);

/* ---------- Helpers ---------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const FONTS = { 'Inter':"'Inter',sans-serif", 'JetBrains Mono':"'JetBrains Mono',monospace", 'serif':'serif' };
const safeColor = c => (c && window.CSS && CSS.supports('color', c)) ? c : '';
const safeUrl = u => /^https?:\/\//i.test(u || '') ? u : '';
function styleOf(font, color){
  let s = '';
  if (font && FONTS[font]) s += `font-family:${FONTS[font]};`;
  const col = safeColor(color);
  if (col) s += `color:${col};`;
  return s;
}
const pick = (th, en) => currentLang === 'th' ? (th || en || '') : (en || th || '');

let toastTimer;
function showToast(key, isError = false){
  const el = $('toast');
  el.textContent = t(key);
  el.classList.toggle('error', isError);
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}
function handleDbError(err){
  console.error(err);
  showToast(err && /permission/i.test(err.message || err.code || '') ? 'toast_denied' : 'toast_error', true);
}
const refreshIcons = () => { if (window.lucide) lucide.createIcons(); };

/* ---------- Data state ---------- */
const defaultUpdates = [
  { id:'default-v014', version:'V.014', labelType:'latest', featured:true,
    detailsTh:'แก้ไขข้อผิดพลาดของระบบ\nเพิ่มเขตเวลาประเทศไทย (UTC+7)\nเพิ่มเว็บไซต์อย่างเป็นทางการ',
    detailsEn:'Fixed system errors\nAdded Thailand Timezone (UTC+7)\nAdded official website',
    font:'', color:'', image:'', order:0 },
  { id:'default-v013', version:'V.013', labelType:'previous', featured:false,
    detailsTh:'แก้ไขข้อบกพร่อง\nปรับปรุงระบบ Intelligence\nปรับปรุง UI สำหรับผู้ดูแล',
    detailsEn:'Bug fixes\nIntelligence system improvements\nAdministrator UI improvements',
    font:'', color:'', image:'', order:1 }
];

let announcements = [];
let updates = [];
let updatesLoaded = false;
let isAdmin = false;
let seeded = false;

/* ---------- Realtime listeners ---------- */
onValue(ref(db, 'announcements'), snap => {
  const v = snap.val() || {};
  announcements = Object.entries(v)
    .map(([id, o]) => ({ ...o, id }))
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  renderAnnouncements();
  renderAdminAnnList();
}, handleDbError);

onValue(ref(db, 'updates'), snap => {
  const v = snap.val() || {};
  updates = Object.entries(v)
    .map(([id, o]) => ({ ...o, id }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  updatesLoaded = true;
  renderUpdates();
  renderAdminUpdList();
  maybeSeedDefaults();
}, handleDbError);

// First admin login on an empty database: seed the two default versions
function maybeSeedDefaults(){
  if (!isAdmin || !updatesLoaded || updates.length || seeded) return;
  seeded = true;
  const payload = {};
  defaultUpdates.forEach(u => { const { id, ...rest } = u; payload[id] = rest; });
  set(ref(db, 'updates'), payload).catch(handleDbError);
}

/* ---------- Language & navigation ---------- */
function setLang(lang){
  currentLang = lang;
  localStorage.setItem('gagka_lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) el.textContent = translations[lang][key];
  });
  $('langEN').classList.toggle('active', lang === 'en');
  $('langTH').classList.toggle('active', lang === 'th');
  document.documentElement.lang = lang;
  renderAnnouncements();
  renderUpdates();
  renderAdminAnnList();
  renderAdminUpdList();
}

function showPage(name){
  if (name === 'admin' && !isAdmin) { openAdminLogin(); return; }
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = $('page-' + name);
  if (target) target.classList.add('active');
  window.scrollTo({ top: 0 });
  refreshIcons();
  if (name === 'home') renderAnnouncements();
  if (name === 'updates') renderUpdates();
  if (name === 'admin') { renderAdminAnnList(); renderAdminUpdList(); }
}

/* ---------- Admin auth (Firebase Auth, email + password) ---------- */
function openAdminLogin(){
  if (isAdmin) { showPage('admin'); return; }
  $('pwOverlay').classList.add('show');
  $('login-pass').value = '';
  $('pwError').classList.remove('show');
  setTimeout(() => ($('login-email').value ? $('login-pass') : $('login-email')).focus(), 100);
}
function closePwModal(){ $('pwOverlay').classList.remove('show'); }

async function submitLogin(){
  const email = $('login-email').value.trim();
  const pass = $('login-pass').value;
  const err = $('pwError');
  if (!email || !pass) { err.textContent = t('pw_error'); err.classList.add('show'); return; }
  const btn = $('pwSubmit');
  btn.disabled = true;
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    closePwModal();
    showPage('admin');
  } catch (e) {
    console.error(e);
    const credErr = ['auth/invalid-credential','auth/wrong-password','auth/user-not-found','auth/invalid-email'];
    err.textContent = credErr.includes(e.code) ? t('pw_error') : `${t('toast_error')} (${e.code || 'error'})`;
    err.classList.add('show');
  } finally {
    btn.disabled = false;
  }
}

async function doLogout(){
  try { await signOut(auth); showToast('toast_loggedout'); } catch (e) { handleDbError(e); }
}

onAuthStateChanged(auth, user => {
  isAdmin = !!user;
  const btn = $('adminBtn');
  btn.innerHTML = `<i data-lucide="${isAdmin ? 'unlock' : 'lock'}" style="width:13px;height:13px"></i> Admin`;
  refreshIcons();
  if (!isAdmin && $('page-admin').classList.contains('active')) showPage('home');
  maybeSeedDefaults();
});

/* ---------- Announcements (admin) ---------- */
async function saveAnnouncement(){
  const titleTh = $('ann-title-th').value.trim();
  const titleEn = $('ann-title-en').value.trim();
  if (!titleTh && !titleEn) return;
  const editId = $('ann-edit-id').value;
  const existing = announcements.find(a => a.id === editId);
  const id = editId || push(ref(db, 'announcements')).key;
  const obj = {
    titleTh, titleEn,
    bodyTh: $('ann-body-th').value.trim(),
    bodyEn: $('ann-body-en').value.trim(),
    font: $('ann-font').value,
    color: $('ann-color').value.trim(),
    image: $('ann-image').value.trim(),
    featured: $('ann-featured').checked,
    visible: $('ann-visible').checked,
    createdAt: existing?.createdAt || Date.now(),
    updatedAt: Date.now()
  };
  const btn = $('annSaveBtn');
  btn.disabled = true;
  try {
    await set(ref(db, `announcements/${id}`), obj);
    clearAnnForm();
    showToast('toast_saved');
  } catch (e) { handleDbError(e); }
  finally { btn.disabled = false; }
}
function clearAnnForm(){
  ['ann-title-th','ann-title-en','ann-body-th','ann-body-en','ann-image','ann-color'].forEach(id => $(id).value = '');
  $('ann-font').selectedIndex = 0;
  $('ann-featured').checked = true;
  $('ann-visible').checked = true;
  $('ann-edit-id').value = '';
  $('annColorPreview').style.background = 'var(--text)';
}
function editAnn(id){
  const a = announcements.find(x => x.id === id); if (!a) return;
  $('ann-title-th').value = a.titleTh || '';
  $('ann-title-en').value = a.titleEn || '';
  $('ann-body-th').value = a.bodyTh || '';
  $('ann-body-en').value = a.bodyEn || '';
  $('ann-font').value = a.font || 'Inter';
  $('ann-color').value = a.color || '';
  $('ann-image').value = a.image || '';
  $('ann-featured').checked = !!a.featured;
  $('ann-visible').checked = !!a.visible;
  $('ann-edit-id').value = a.id;
  $('annColorPreview').style.background = safeColor(a.color) || 'var(--text)';
  $('adminAnnounceSection').scrollIntoView({ behavior: 'smooth' });
}
async function deleteAnn(id){
  try { await remove(ref(db, `announcements/${id}`)); showToast('toast_deleted'); }
  catch (e) { handleDbError(e); }
}
function renderAdminAnnList(){
  const c = $('annList');
  if (!announcements.length) { c.innerHTML = `<p class="empty-note">${esc(t('no_ann'))}</p>`; return; }
  c.innerHTML = announcements.map(a => {
    const title = pick(a.titleTh, a.titleEn);
    return `<div class="admin-item">
      <div class="admin-item-info">
        <div class="admin-item-title">${a.featured ? '⭐ ' : ''}${esc(title)}</div>
        <div class="admin-item-meta">${a.visible ? '✅' : '❌'} ${esc(a.visible ? t('visible') : t('hidden'))}</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-edit" data-act="ann-edit" data-id="${esc(a.id)}">✏️</button>
        <button class="btn-del" data-act="ann-ask" data-id="${esc(a.id)}">🗑️</button>
      </div>
      <div class="confirm-bar" id="confirm-ann-${esc(a.id)}">
        ${esc(t('confirm_delete'))}
        <button class="confirm-yes" data-act="ann-del" data-id="${esc(a.id)}">${esc(t('btn_yes'))}</button>
        <button class="confirm-no" data-act="ann-cancel" data-id="${esc(a.id)}">${esc(t('btn_no'))}</button>
      </div>
    </div>`;
  }).join('');
}

/* ---------- Updates (admin) ---------- */
async function saveUpdate(){
  const version = $('upd-version').value.trim();
  if (!version) return;
  const editId = $('upd-edit-id').value;
  const existing = updates.find(u => u.id === editId);
  const id = editId || push(ref(db, 'updates')).key;
  // New versions go to the top of the list
  const order = existing ? (existing.order ?? 0) : (updates.length ? Math.min(...updates.map(u => u.order ?? 0)) - 1 : 0);
  const obj = {
    version,
    labelType: $('upd-label-type').value,
    detailsTh: $('upd-details-th').value.trim(),
    detailsEn: $('upd-details-en').value.trim(),
    font: $('upd-font').value,
    color: $('upd-color').value.trim(),
    image: $('upd-image').value.trim(),
    featured: $('upd-featured').checked,
    order
  };
  const btn = $('updSaveBtn');
  btn.disabled = true;
  try {
    await set(ref(db, `updates/${id}`), obj);
    clearUpdForm();
    showToast('toast_saved');
  } catch (e) { handleDbError(e); }
  finally { btn.disabled = false; }
}
function clearUpdForm(){
  ['upd-version','upd-details-th','upd-details-en','upd-image','upd-color'].forEach(id => $(id).value = '');
  $('upd-font').selectedIndex = 0;
  $('upd-label-type').selectedIndex = 0;
  $('upd-featured').checked = false;
  $('upd-edit-id').value = '';
  $('updColorPreview').style.background = 'var(--text)';
}
function editUpd(id){
  const u = updates.find(x => x.id === id); if (!u) return;
  $('upd-version').value = u.version || '';
  $('upd-label-type').value = u.labelType || 'latest';
  $('upd-details-th').value = u.detailsTh || '';
  $('upd-details-en').value = u.detailsEn || '';
  $('upd-font').value = u.font || 'Inter';
  $('upd-color').value = u.color || '';
  $('upd-image').value = u.image || '';
  $('upd-featured').checked = !!u.featured;
  $('upd-edit-id').value = u.id;
  $('updColorPreview').style.background = safeColor(u.color) || 'var(--text)';
  $('adminUpdateSection').scrollIntoView({ behavior: 'smooth' });
}
async function deleteUpd(id){
  try { await remove(ref(db, `updates/${id}`)); showToast('toast_deleted'); }
  catch (e) { handleDbError(e); }
}
async function moveUpd(index, dir){
  const j = index + dir;
  if (j < 0 || j >= updates.length) return;
  const list = [...updates];
  [list[index], list[j]] = [list[j], list[index]];
  const patch = {};
  list.forEach((u, i) => { patch[`updates/${u.id}/order`] = i; });
  try { await update(ref(db), patch); } catch (e) { handleDbError(e); }
}
function renderAdminUpdList(){
  const c = $('updList');
  if (!updates.length) { c.innerHTML = `<p class="empty-note">${esc(t('no_upd'))}</p>`; return; }
  c.innerHTML = updates.map((u, i) => {
    const details = pick(u.detailsTh, u.detailsEn);
    const preview = details.split('\n').filter(l => l.trim()).slice(0, 2).join(', ');
    return `<div class="admin-item">
      <div class="admin-item-info">
        <div class="admin-item-title">${u.featured ? '⭐ ' : ''}${esc(u.version)}</div>
        <div class="admin-item-meta">${esc(u.labelType === 'latest' ? t('latest') : t('previous'))} — ${esc(preview)}</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-edit" data-act="upd-up" data-index="${i}" ${i === 0 ? 'disabled' : ''}>▲</button>
        <button class="btn-edit" data-act="upd-down" data-index="${i}" ${i === updates.length - 1 ? 'disabled' : ''}>▼</button>
        <button class="btn-edit" data-act="upd-edit" data-id="${esc(u.id)}">${esc(t('edit'))}</button>
        <button class="btn-del" data-act="upd-ask" data-id="${esc(u.id)}">${esc(t('del'))}</button>
      </div>
      <div class="confirm-bar" id="confirm-upd-${esc(u.id)}">
        ${esc(t('confirm_delete'))}
        <button class="confirm-yes" data-act="upd-del" data-id="${esc(u.id)}">${esc(t('btn_yes'))}</button>
        <button class="confirm-no" data-act="upd-cancel" data-id="${esc(u.id)}">${esc(t('btn_no'))}</button>
      </div>
    </div>`;
  }).join('');
}

/* ---------- Public rendering ---------- */
function renderAnnouncements(){
  const c = $('homeAnnouncements');
  const visible = announcements.filter(a => a.visible);
  if (!visible.length) { c.innerHTML = ''; return; }
  c.innerHTML = visible.map(a => {
    const title = pick(a.titleTh, a.titleEn);
    const body = pick(a.bodyTh, a.bodyEn);
    const st = styleOf(a.font || 'Inter', a.color);
    const img = safeUrl(a.image);
    return `<div class="announce-banner${a.featured ? ' featured' : ''}">
      <div class="announce-title" style="${st}">${a.featured ? '⭐ ' : ''}${esc(title)}</div>
      <div class="announce-body" style="${st}">${esc(body)}</div>
      ${img ? `<img src="${esc(img)}" alt="${esc(title)}" loading="lazy">` : ''}
    </div>`;
  }).join('');
}

function renderUpdates(){
  const container = $('updateCardsContainer');
  // Until the database has content, show the built-in defaults so the page is never empty
  const list = updates.length ? updates : (updatesLoaded ? [] : defaultUpdates);
  const shown = updates.length ? updates : defaultUpdates;
  if (!list.length && !shown.length) {
    container.innerHTML = `<p class="empty-note" style="text-align:center;padding:2rem">${esc(t('no_upd_public'))}</p>`;
    return;
  }
  container.innerHTML = shown.map(u => {
    const lines = pick(u.detailsTh, u.detailsEn).split('\n').filter(l => l.trim());
    const st = styleOf(u.font, u.color);
    const img = safeUrl(u.image);
    return `<div class="update-card${u.featured ? ' featured' : ''}">
      <div class="update-label">${esc(u.labelType === 'latest' ? t('upd_latest') : t('upd_prev'))}</div>
      <div class="update-version" style="${st}">${esc(u.version)}</div>
      <ul class="update-list" style="${st}">${lines.map(l => `<li>${esc(l)}</li>`).join('')}</ul>
      ${img ? `<img src="${esc(img)}" alt="${esc(u.version)}" loading="lazy">` : ''}
    </div>`;
  }).join('');
}

/* ---------- Event wiring ---------- */
document.addEventListener('click', e => {
  const nav = e.target.closest('[data-nav]');
  if (nav) { showPage(nav.dataset.nav); return; }

  const lang = e.target.closest('[data-lang]');
  if (lang) { setLang(lang.dataset.lang); return; }

  const act = e.target.closest('[data-act]');
  if (!act) return;
  const { act: a, id } = act.dataset;
  switch (a) {
    case 'ann-edit':   editAnn(id); break;
    case 'ann-ask':    $('confirm-ann-' + id)?.classList.add('show'); break;
    case 'ann-cancel': $('confirm-ann-' + id)?.classList.remove('show'); break;
    case 'ann-del':    deleteAnn(id); break;
    case 'upd-edit':   editUpd(id); break;
    case 'upd-ask':    $('confirm-upd-' + id)?.classList.add('show'); break;
    case 'upd-cancel': $('confirm-upd-' + id)?.classList.remove('show'); break;
    case 'upd-del':    deleteUpd(id); break;
    case 'upd-up':     moveUpd(Number(act.dataset.index), -1); break;
    case 'upd-down':   moveUpd(Number(act.dataset.index), 1); break;
  }
});

$('adminBtn').addEventListener('click', openAdminLogin);
$('logoutBtn').addEventListener('click', async () => { await doLogout(); showPage('home'); });
$('pwCancel').addEventListener('click', closePwModal);
$('pwSubmit').addEventListener('click', submitLogin);
$('pwOverlay').addEventListener('click', e => { if (e.target === $('pwOverlay')) closePwModal(); });
document.addEventListener('keydown', e => {
  const open = $('pwOverlay').classList.contains('show');
  if (e.key === 'Enter' && open) submitLogin();
  if (e.key === 'Escape' && open) closePwModal();
});

$('annSaveBtn').addEventListener('click', saveAnnouncement);
$('annClearBtn').addEventListener('click', clearAnnForm);
$('updSaveBtn').addEventListener('click', saveUpdate);
$('updClearBtn').addEventListener('click', clearUpdForm);

$('ann-color').addEventListener('input', e => { $('annColorPreview').style.background = safeColor(e.target.value) || 'var(--text)'; });
$('upd-color').addEventListener('input', e => { $('updColorPreview').style.background = safeColor(e.target.value) || 'var(--text)'; });

/* ---------- Init ---------- */
refreshIcons();
setLang(currentLang);
