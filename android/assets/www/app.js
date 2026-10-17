/* Arise — telefon arayüzü */
(function () {
  "use strict";

  // ------------------------------------------------------------------
  // Simgeler
  // ------------------------------------------------------------------
  const I = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.6v14.8c0 .8.9 1.3 1.6.9l12-7.4c.6-.4.6-1.4 0-1.8l-12-7.4C7.9 3.3 7 3.8 7 4.6z"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    power: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18.4 6.6a9 9 0 1 1-12.8 0"/><path d="M12 2v10"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    restart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.6-6.4"/><path d="M21 3v6h-6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>',
    image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    radar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.1 4.9A10 10 0 1 0 22 12"/><path d="M16.2 7.8A6 6 0 1 0 18 12"/><circle cx="12" cy="12" r="2"/><path d="m13.4 10.6 6-6"/></svg>',
    wifi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M2 9a15 15 0 0 1 20 0"/><circle cx="12" cy="19.5" r="1" fill="currentColor"/></svg>',
  };

  // ------------------------------------------------------------------
  // Yerel köprü (Android) — tarayıcıda test için yedek davranış
  // ------------------------------------------------------------------
  const DEMO = /[?&]demo\b/.test(location.search);
  const hasNative = !!(window.Android && window.Android.isNative);
  const pending = {};
  let seq = 0;
  window.NativeBridge = {
    resolve(id, status, body) {
      const p = pending[id];
      if (p) { delete pending[id]; p({ status, body }); }
    },
  };
  const demoPc = { on: false, bootAt: 0 };

  const Native = {
    request(method, url, opts) {
      opts = opts || {};
      const headers = opts.headers || {};
      const body = opts.body ? JSON.stringify(opts.body) : "";
      const timeout = opts.timeout || 3000;
      if (DEMO) return demoRequest(method, url);
      if (hasNative) {
        return new Promise((res) => {
          const id = "r" + ++seq;
          pending[id] = res;
          window.Android.request(id, method, url, JSON.stringify(headers), body, timeout);
        });
      }
      const ctl = new AbortController();
      const t = setTimeout(() => ctl.abort(), timeout);
      return fetch(url, { method, headers: Object.assign({ "Content-Type": "application/json" }, headers), body: body || undefined, signal: ctl.signal })
        .then(async (r) => ({ status: r.status, body: await r.text() }))
        .catch((e) => ({ status: 0, body: String(e) }))
        .finally(() => clearTimeout(t));
    },
    wake(mac, ip, broadcast) {
      if (DEMO) { if (!demoPc.on && !demoPc.bootAt) demoPc.bootAt = Date.now() + 7000; return Promise.resolve({ status: 200, body: "ok" }); }
      if (!hasNative) return Promise.resolve({ status: 0, body: "Wake-on-LAN sadece Android uygulamasında çalışır" });
      return new Promise((res) => {
        const id = "w" + ++seq;
        pending[id] = res;
        window.Android.wake(id, mac, ip || "", broadcast || "");
      });
    },
    haptic() { try { hasNative && window.Android.haptic(); } catch (e) { /* yok */ } },
  };

  function demoRequest(method, url) {
    return new Promise((res) => setTimeout(() => {
      if (demoPc.bootAt && Date.now() > demoPc.bootAt) { demoPc.on = true; demoPc.bootAt = 0; }
      if (url.includes("storesearch")) {
        const items = [[1245620, "ELDEN RING"], [2622380, "ELDEN RING NIGHTREIGN"], [1888160, "ARMORED CORE VI"]].map(([id, name]) => ({ id, name }));
        return res({ status: 200, body: JSON.stringify({ items }) });
      }
      if (!demoPc.on) return res({ status: 0, body: "timeout" });
      if (url.endsWith("/status")) return res({ status: 200, body: JSON.stringify({ ok: true, hostname: "OYUN-PC", authorized: true, uptime: 42 }) });
      if (url.endsWith("/games")) {
        const games = [
          { name: "Counter-Strike 2", type: "steam", value: "730", source: "Steam" },
          { name: "Baldur's Gate 3", type: "steam", value: "1086940", source: "Steam" },
          { name: "Hollow Knight", type: "steam", value: "367520", source: "Steam" },
          { name: "Fortnite", type: "epic", value: "fn%3Aabc%3AFortnite", source: "Epic Games" },
          { name: "VALORANT", type: "exe", value: "C:/Riot Games/Riot Client/RiotClientServices.exe", args: "--launch-product=valorant --launch-patchline=live", source: "Riot Games" },
          { name: "Minecraft Launcher", type: "shortcut", value: "C:\\Users\\Ben\\Desktop\\Minecraft Launcher.lnk", source: "Masaüstü" },
        ];
        return res({ status: 200, body: JSON.stringify({ ok: true, games }) });
      }
      if (url.endsWith("/power")) { demoPc.on = false; return res({ status: 200, body: '{"ok":true}' }); }
      res({ status: 200, body: '{"ok":true}' });
    }, 350));
  }

  // ------------------------------------------------------------------
  // Veri
  // ------------------------------------------------------------------
  const KEY = "pcsu.v1";
  const DEFAULT_GAMES = [
    { name: "Counter-Strike 2", type: "steam", value: "730" },
    { name: "Grand Theft Auto V", type: "steam", value: "271590" },
    { name: "ELDEN RING", type: "steam", value: "1245620" },
    { name: "Cyberpunk 2077", type: "steam", value: "1091500" },
    { name: "Red Dead Redemption 2", type: "steam", value: "1174180" },
    { name: "Euro Truck Simulator 2", type: "steam", value: "227300" },
    { name: "PUBG: BATTLEGROUNDS", type: "steam", value: "578080" },
    { name: "Dota 2", type: "steam", value: "570" },
  ];
  const PLATFORMS = {
    steam: { label: "Steam", hint: "Steam AppID" },
    epic: { label: "Epic", hint: "Epic uygulama adı" },
    riot: { label: "Riot", hint: "" },
    exe: { label: ".exe", hint: "Dosya yolu" },
    uri: { label: "Bağlantı", hint: "URI" },
    shortcut: { label: "Kısayol", hint: "Kısayol yolu" },
  };
  const RIOT = {
    valorant: { name: "VALORANT", args: "--launch-product=valorant --launch-patchline=live" },
    lol: { name: "League of Legends", args: "--launch-product=league_of_legends --launch-patchline=live" },
  };
  const RIOT_EXE = "C:\\Riot Games\\Riot Client\\RiotClientServices.exe";

  function uid() { return Math.random().toString(36).slice(2, 10); }

  function load() {
    let d = null;
    try { d = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* bozuk veri */ }
    if (!d) {
      d = {
        settings: { ip: "", mac: "", port: 5757, token: "", broadcast: "", bootTimeout: 180, settleDelay: 12 },
        games: DEFAULT_GAMES.map((g) => Object.assign({ id: uid() }, g)),
        stats: {},
        featured: null,
      };
    }
    return d;
  }
  const db = load();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(db)); }
    catch (e) { toast("Kaydedilemedi: depolama dolu olabilir (büyük kapak resimleri)", "bad"); }
  }
  const S = () => db.settings;
  const configured = () => !!(S().ip && S().mac && S().token);
  const agentUrl = (p) => "http://" + S().ip.trim() + ":" + (S().port || 5757) + p;

  // ------------------------------------------------------------------
  // Görseller (Steam CDN + yedekler)
  // ------------------------------------------------------------------
  const STEAM_HOSTS = [
    "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/",
    "https://cdn.cloudflare.steamstatic.com/steam/apps/",
    "https://steamcdn-a.akamaihd.net/steam/apps/",
  ];
  const steamImgs = (id, files) => files.flatMap((f) => STEAM_HOSTS.map((h) => h + id + "/" + f));
  // Resimler için kullanılan Steam AppID: Steam oyunlarında kendisi, diğerlerinde isimle eşleşen oyun
  const artId = (g) => (g.type === "steam" ? g.value : g.art);
  function coverSources(g) {
    if (g.cover) return [g.cover];
    if (artId(g)) return steamImgs(artId(g), ["library_600x900_2x.jpg", "library_600x900.jpg"]);
    return [];
  }
  function heroSources(g) {
    if (g.hero) return [g.hero];
    if (artId(g)) return steamImgs(artId(g), ["library_hero.jpg", "header.jpg"]);
    return g.cover ? [g.cover] : [];
  }
  function logoSources(g) {
    if (artId(g) && !g.hero) return steamImgs(artId(g), ["logo.png"]);
    return [];
  }

  // ------------------------------------------------------------------
  // İsimle Steam'de kapak bulma
  // ------------------------------------------------------------------
  const normName = (s) => String(s || "").toLowerCase().replace(/[™®©]/g, "").replace(/[^0-9a-zçğıöşü]+/g, "");
  async function steamSearch(term) {
    const r = await Native.request("GET", "https://store.steampowered.com/api/storesearch/?l=turkish&cc=TR&term=" + encodeURIComponent(term), { timeout: 8000 });
    try { return { ok: true, items: JSON.parse(r.body).items || [] }; } catch (e) { return { ok: !!r.status, items: [] }; }
  }
  /** Oyun adına en iyi uyan Steam AppID'yi bulur (bulamazsa null). Sonuçlar önbelleğe alınır. */
  async function matchArt(name) {
    const key = normName(name);
    if (!key) return null;
    db.artCache = db.artCache || {};
    if (key in db.artCache) return db.artCache[key];
    const res = await steamSearch(name.replace(/launcher$/i, "").trim());
    if (!res.ok) return null; // internet yoksa önbelleğe yazma, sonra tekrar dene
    let best = null;
    for (const it of res.items) {
      const n = normName(it.name);
      if (n === key) { best = it; break; }
      if (!best && n && (n.startsWith(key) || key.startsWith(n)) && Math.min(n.length, key.length) / Math.max(n.length, key.length) > 0.6) best = it;
    }
    db.artCache[key] = best ? String(best.id) : null;
    save();
    return db.artCache[key];
  }
  /** Kapağı olmayan Steam dışı oyunlara sırayla kapak bulur. */
  let artQueueBusy = false;
  async function fillMissingArt() {
    if (artQueueBusy) return;
    artQueueBusy = true;
    try {
      for (const g of db.games.slice()) {
        if (g.type === "steam" || g.cover || g.art !== undefined) continue;
        const id = await matchArt(g.name);
        if (id === undefined) continue;
        const live = db.games.find((x) => x.id === g.id);
        if (!live) continue;
        live.art = id;
        save();
        if (id) { renderGrid(); renderHero(); }
      }
    } finally { artQueueBusy = false; }
  }

  function hue(str) { let h = 0; for (const c of str) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h % 360; }
  function placeholder(name) {
    const h = hue(name || "?");
    const initials = (name || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
    const el = document.createElement("div");
    el.className = "placeholder";
    el.style.background = `radial-gradient(120% 90% at 100% 0%, hsla(${(h + 50) % 360},90%,60%,.55), transparent 60%), linear-gradient(160deg, hsl(${h},55%,28%), hsl(${(h + 30) % 360},60%,12%))`;
    el.innerHTML = `<span class="initials"></span><span class="pn"></span>`;
    el.querySelector(".initials").textContent = name ? initials : "";
    el.querySelector(".pn").textContent = name;
    return el;
  }

  /** Sırayla dener; hiçbiri yüklenmezse onFail çağrılır. */
  function smartImg(sources, onFail, cls) {
    const img = document.createElement("img");
    img.alt = "";
    img.decoding = "async";
    if (cls) img.className = cls;
    let i = 0;
    const next = () => {
      if (i >= sources.length) { img.remove(); onFail && onFail(); return; }
      img.src = sources[i++];
    };
    img.onerror = next;
    img.onload = () => img.classList.add("loaded");
    next();
    return img;
  }

  function coverEl(g, extraCls) {
    const wrap = document.createElement("div");
    wrap.className = "cover" + (extraCls ? " " + extraCls : "");
    const src = coverSources(g);
    if (!src.length) wrap.appendChild(placeholder(g.name));
    else wrap.appendChild(smartImg(src, () => wrap.prepend(placeholder(g.name))));
    return wrap;
  }

  // ------------------------------------------------------------------
  // Yardımcılar
  // ------------------------------------------------------------------
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let toastTimer;
  function toast(msg, kind) {
    const t = $("#toast");
    t.textContent = msg;
    t.className = "toast show " + (kind || "");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (t.className = "toast"), 2800);
  }
  function platformLabel(g) {
    if (g.type === "exe" && /Riot/i.test(g.value)) return "Riot";
    if (g.type === "shortcut" && g.source) return g.source;
    return (PLATFORMS[g.type] || {}).label || g.type;
  }
  function relTime(ts) {
    if (!ts) return "Hiç oynanmadı";
    const m = Math.round((Date.now() - ts) / 60000);
    if (m < 1) return "Az önce";
    if (m < 60) return m + " dk önce";
    const h = Math.round(m / 60);
    if (h < 24) return h + " saat önce";
    const d = Math.round(h / 24);
    return d === 1 ? "Dün" : d + " gün önce";
  }
  function fmtUptime(s) {
    if (s == null) return "";
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
    return h ? `${h} sa ${m} dk` : `${m} dk`;
  }

  // ------------------------------------------------------------------
  // Bilgisayar durumu
  // ------------------------------------------------------------------
  const pc = { state: "unknown", info: null };

  async function checkStatus(timeout) {
    if (!configured()) return { state: "unset" };
    const r = await Native.request("GET", agentUrl("/status"), { headers: { "X-Agent-Token": S().token }, timeout: timeout || 1800 });
    if (r.status !== 200) return { state: "offline" };
    let info = {};
    try { info = JSON.parse(r.body); } catch (e) { /* yok */ }
    return { state: info.authorized === false ? "denied" : "online", info };
  }

  async function refreshStatus() {
    const res = await checkStatus();
    const wasOnline = pc.state === "online";
    pc.state = res.state;
    if (res.info) pc.info = res.info;
    renderStatus();
    if (pc.state === "online" && (!wasOnline || Date.now() - (db.lastScan || 0) > 30 * 60000)) autoDetect();
  }

  function renderStatus() {
    const chip = $("#statusChip");
    const map = {
      unset: ["unknown", "Kurulum gerekli"],
      unknown: ["unknown", "Kontrol ediliyor"],
      online: ["online", "Açık"],
      offline: ["offline", "Kapalı"],
      denied: ["denied", "Anahtar hatalı"],
    };
    const [st, label] = map[pc.state] || map.unknown;
    chip.dataset.state = st;
    $(".label", chip).textContent = label;
    $("#pcName").textContent = pc.info && pc.info.hostname && pc.state === "online"
      ? pc.info.hostname + " · açık " + fmtUptime(pc.info.uptime)
      : (S().ip ? S().ip : "Oyun bilgisayarın");
    renderPower();
  }

  let pollTimer;
  function startPolling() {
    clearInterval(pollTimer);
    refreshStatus();
    pollTimer = setInterval(() => { if (!launchJob) refreshStatus(); }, 5000);
  }

  // ------------------------------------------------------------------
  // Ana ekran
  // ------------------------------------------------------------------
  function featuredGame() {
    const byId = (id) => db.games.find((g) => g.id === id);
    if (db.featured && byId(db.featured)) return byId(db.featured);
    const played = db.games.filter((g) => db.stats[g.id]).sort((a, b) => db.stats[b.id].last - db.stats[a.id].last);
    return played[0] || db.games[0] || null;
  }

  function renderHero() {
    const el = $("#hero");
    const g = featuredGame();
    el.innerHTML = "";
    if (!g) {
      el.innerHTML = `<div class="hero-empty"><div><b>Henüz oyun yok</b><br>Kütüphaneye bir oyun ekleyerek başla.</div></div>`;
      return;
    }
    const bg = document.createElement("div");
    bg.className = "hero-bg";
    const hs = heroSources(g);
    if (hs.length) bg.appendChild(smartImg(hs, () => bg.appendChild(placeholder(""))));
    else bg.appendChild(placeholder(""));
    el.appendChild(bg);

    const st = db.stats[g.id];
    const inner = document.createElement("div");
    inner.className = "hero-inner";
    inner.innerHTML = `
      <div class="hero-kicker">${st ? "Son oynanan · " + esc(relTime(st.last)) : "Öne çıkan"}</div>
      <div class="hero-titlebox"></div>
      <div class="hero-actions">
        <button class="play-btn" id="heroPlay">${I.play}<span>OYNA</span></button>
        <button class="glass-btn" id="heroInfo" aria-label="Detaylar">${I.edit}</button>
      </div>`;
    const tb = $(".hero-titlebox", inner);
    const title = () => { tb.innerHTML = `<h1 class="hero-title"></h1>`; $("h1", tb).textContent = g.name; };
    const logos = logoSources(g);
    if (logos.length) tb.appendChild(smartImg(logos, title, "hero-logo"));
    else title();
    el.appendChild(inner);
    $("#heroPlay").onclick = () => play(g);
    $("#heroInfo").onclick = () => openDetail(g);
  }

  function renderPower() {
    const el = $("#powerBar");
    const on = pc.state === "online";
    const can = configured();
    el.innerHTML = `
      <button class="power-btn primary" data-act="wake" ${can && !on ? "" : "disabled"}>${I.bolt}<span>Uyandır</span></button>
      <button class="power-btn" data-act="sleep" ${on ? "" : "disabled"}>${I.moon}<span>Uyku</span></button>
      <button class="power-btn" data-act="restart" ${on ? "" : "disabled"}>${I.restart}<span>Yeniden başlat</span></button>
      <button class="power-btn danger" data-act="shutdown" ${on ? "" : "disabled"}>${I.power}<span>Kapat</span></button>`;
    el.querySelectorAll("button").forEach((b) => (b.onclick = () => powerAction(b.dataset.act)));
  }

  function renderGrid() {
    const grid = $("#grid");
    grid.innerHTML = "";
    $("#gameCount").textContent = db.games.length ? db.games.length + " oyun" : "";
    db.games.forEach((g, idx) => {
      const card = document.createElement("div");
      card.className = "card";
      card.style.animationDelay = Math.min(idx * 40, 400) + "ms";
      const cover = coverEl(g);
      cover.insertAdjacentHTML("beforeend", `<div class="shade"></div><span class="badge">${esc(platformLabel(g).toLocaleUpperCase("en-US"))}</span><button class="quick-play" aria-label="${esc(g.name)} oyna">${I.play}</button>`);
      card.appendChild(cover);
      card.insertAdjacentHTML("beforeend", `<div class="card-name"></div><div class="card-meta">${esc(relTime(db.stats[g.id] && db.stats[g.id].last))}</div>`);
      $(".card-name", card).textContent = g.name;
      cover.onclick = (e) => {
        if (e.target.closest(".quick-play")) { play(g); return; }
        openDetail(g);
      };
      grid.appendChild(card);
    });
    const add = document.createElement("button");
    add.className = "card add-card";
    add.innerHTML = `<div class="cover"><div><div class="plus">${I.plus}</div>Oyun ekle</div></div>`;
    add.onclick = () => openGameEditor();
    grid.appendChild(add);
  }

  function renderSetupCard() {
    const el = $("#setupCard");
    el.hidden = configured();
    if (configured()) return;
    el.innerHTML = `
      <h3>Hoş geldin! Önce bilgisayarını bağla</h3>
      <p>Oyun bilgisayarına <b>agent</b> klasöründeki ajanı kur. Kurulum ekranında gördüğün <b>IP</b>, <b>MAC</b> ve <b>erişim anahtarını</b> buraya gir.</p>
      <button class="btn primary" id="setupGo">${I.wifi}<span>Bilgisayarı bağla</span></button>`;
    $("#setupGo").onclick = openSettings;
  }

  function renderAll() {
    renderSetupCard();
    renderHero();
    renderStatus();
    renderGrid();
    $("#footPort").textContent = S().port || 5757;
  }

  // ------------------------------------------------------------------
  // Alt panel
  // ------------------------------------------------------------------
  let sheetOnClose = null;
  function openSheet(html, onClose) {
    $("#sheetBody").innerHTML = html;
    $("#sheet").scrollTop = 0;
    $("#scrim").classList.add("show");
    $("#sheet").classList.add("show");
    document.body.classList.add("locked");
    sheetOnClose = onClose || null;
    return $("#sheetBody");
  }
  function closeSheet() {
    $("#scrim").classList.remove("show");
    $("#sheet").classList.remove("show");
    document.body.classList.remove("locked");
    if (sheetOnClose) { const f = sheetOnClose; sheetOnClose = null; f(); }
  }
  const sheetOpen = () => $("#sheet").classList.contains("show");

  // Aşağı kaydırarak kapatma
  (function swipeToClose() {
    const sh = $("#sheet");
    let y0 = null, dy = 0;
    sh.addEventListener("touchstart", (e) => { if (sh.scrollTop <= 0) { y0 = e.touches[0].clientY; dy = 0; } }, { passive: true });
    sh.addEventListener("touchmove", (e) => {
      if (y0 == null) return;
      dy = e.touches[0].clientY - y0;
      if (dy > 0) { sh.style.transition = "none"; sh.style.transform = `translateY(${dy}px)`; }
    }, { passive: true });
    sh.addEventListener("touchend", () => {
      sh.style.transition = ""; sh.style.transform = "";
      if (y0 != null && dy > 110) closeSheet();
      y0 = null;
    });
  })();

  function confirmSheet(title, text, okLabel, danger) {
    return new Promise((res) => {
      const b = openSheet(`
        <h3>${esc(title)}</h3><p class="sub">${esc(text)}</p>
        <div class="btn-row"><button class="btn ghost" data-r="0">Vazgeç</button><button class="btn ${danger ? "danger" : "primary"}" data-r="1">${esc(okLabel)}</button></div>`,
      () => res(false));
      b.querySelectorAll("[data-r]").forEach((x) => (x.onclick = () => {
        const v = x.dataset.r === "1";
        sheetOnClose = null; closeSheet(); res(v);
      }));
    });
  }

  // ------------------------------------------------------------------
  // Oyun detayı
  // ------------------------------------------------------------------
  function openDetail(g) {
    const st = db.stats[g.id];
    const b = openSheet(`
      <div class="detail-hero"></div>
      <div class="detail-top">
        <h3></h3>
        <div class="detail-meta">
          <span class="tag">${esc(platformLabel(g))}</span>
          <span class="tag">${esc(relTime(st && st.last))}</span>
          ${st ? `<span class="tag">${st.count} kez oynandı</span>` : ""}
        </div>
        <button class="play-btn" style="width:100%" data-a="play">${I.play}<span>OYNA</span></button>
        <div class="btn-row">
          <button class="btn" data-a="edit">${I.edit}<span>Düzenle</span></button>
          <button class="btn danger" data-a="del">${I.trash}<span>Sil</span></button>
        </div>
        <button class="btn ghost" style="margin-top:10px" data-a="feat">Ana ekranda öne çıkar</button>
      </div>`);
    $("h3", b).textContent = g.name;
    const dh = $(".detail-hero", b);
    const hs = heroSources(g);
    if (hs.length) dh.appendChild(smartImg(hs, () => dh.appendChild(placeholder(""))));
    else dh.appendChild(placeholder(""));
    b.querySelector('[data-a="play"]').onclick = () => { closeSheet(); play(g); };
    b.querySelector('[data-a="edit"]').onclick = () => openGameEditor(g);
    b.querySelector('[data-a="feat"]').onclick = () => { db.featured = g.id; save(); closeSheet(); renderHero(); window.scrollTo({ top: 0, behavior: "smooth" }); };
    b.querySelector('[data-a="del"]').onclick = async () => {
      if (!(await confirmSheet("Oyunu sil", `"${g.name}" kütüphaneden kaldırılsın mı?`, "Sil", true))) return;
      db.games = db.games.filter((x) => x.id !== g.id);
      delete db.stats[g.id];
      if (db.featured === g.id) db.featured = null;
      save(); renderAll(); toast("Oyun silindi");
    };
  }

  // ------------------------------------------------------------------
  // Oyun ekle / düzenle
  // ------------------------------------------------------------------
  function openGameEditor(existing) {
    const g = existing ? Object.assign({}, existing) : { id: uid(), name: "", type: "steam", value: "", args: "" };
    let tab = g.type === "exe" && /Riot/i.test(g.value) && /--launch-product/.test(g.args || "") ? "riot" : g.type;
    const b = openSheet(`
      <h3>${existing ? "Oyunu düzenle" : "Oyun ekle"}</h3>
      <p class="sub">Steam oyunlarının kapak resimleri otomatik gelir. Diğerleri için galeriden resim seçebilirsin.</p>
      <div class="field"><div class="seg" id="segType">${Object.keys(PLATFORMS).map((k) => `<button data-k="${k}">${PLATFORMS[k].label}</button>`).join("")}</div></div>
      <div id="typeFields"></div>
      <div class="preview" id="preview"></div>
      <div class="field"><label>Oyun adı</label><input class="input" id="fName" placeholder="Örn. ELDEN RING"></div>
      <div class="field">
        <label>Kapak resmi</label>
        <div class="btn-row" style="margin-top:0">
          <button class="btn" id="pickImg">${I.image}<span>Galeriden seç</span></button>
          <button class="btn ghost" id="clearImg">Otomatik</button>
        </div>
        <input class="input" id="fCoverUrl" placeholder="veya resim bağlantısı (https://...)" style="margin-top:10px">
      </div>
      <button class="btn primary" id="saveGame">${I.check}<span>${existing ? "Kaydet" : "Kütüphaneye ekle"}</span></button>`);

    const fName = $("#fName", b), fCoverUrl = $("#fCoverUrl", b);
    fName.value = g.name || "";
    fCoverUrl.value = g.cover && !g.cover.startsWith("data:") ? g.cover : "";

    function updatePreview() {
      const p = $("#preview", b);
      p.innerHTML = "";
      const shown = Object.assign({}, g, { name: fName.value || g.name || "Oyun" });
      p.appendChild(coverEl(shown));
      const meta = document.createElement("div");
      const how = {
        steam: g.value ? "steam://rungameid/" + g.value : "AppID gir veya ara",
        epic: g.value ? "Epic Games: " + g.value : "Uygulama adını gir",
        exe: g.value || "Dosya yolunu gir",
        uri: g.value || "Bağlantıyı gir",
        shortcut: g.value || "Kısayol yolunu gir",
      }[g.type];
      meta.innerHTML = `<div class="p-name"></div><div class="p-meta"></div>`;
      $(".p-name", meta).textContent = shown.name;
      $(".p-meta", meta).textContent = (tab === "riot" ? "Riot Client · " : "") + how + (g.args ? " " + g.args : "");
      p.appendChild(meta);
    }

    function renderTypeFields() {
      b.querySelectorAll("#segType button").forEach((x) => x.classList.toggle("on", x.dataset.k === tab));
      const tf = $("#typeFields", b);
      if (tab === "steam") {
        tf.innerHTML = `
          <div class="field"><label>Steam'de ara</label>
            <div class="row-3"><input class="input" id="fSearch" placeholder="Oyun adı yaz…"><button class="btn" id="doSearch">${I.search}<span>Ara</span></button></div>
            <div id="results"></div>
          </div>
          <div class="field"><label>Steam AppID</label><input class="input mono" id="fValue" inputmode="numeric" placeholder="Örn. 1245620">
            <div class="hint">Mağaza sayfası adresindeki sayı: store.steampowered.com/app/<b>1245620</b>/</div></div>`;
        const run = () => steamSearch($("#fSearch", tf).value, $("#results", tf));
        $("#doSearch", tf).onclick = run;
        $("#fSearch", tf).onkeydown = (e) => { if (e.key === "Enter") run(); };
      } else if (tab === "epic") {
        tf.innerHTML = `<div class="field"><label>Epic uygulama adı (AppName)</label><input class="input mono" id="fValue" placeholder="Örn. Fortnite">
          <div class="hint">Epic Launcher → oyunda ••• → Yönet → "Masaüstü kısayolu oluştur". Kısayolun özelliklerindeki <b>apps/…?</b> arasındaki ad. Fortnite için: <b>Fortnite</b></div></div>`;
      } else if (tab === "riot") {
        tf.innerHTML = `<div class="field"><label>Riot oyunu</label><div class="seg" id="riotSeg">
          ${Object.keys(RIOT).map((k) => `<button data-r="${k}">${RIOT[k].name}</button>`).join("")}</div>
          <div class="hint">Riot Client varsayılan konumda olmalı: C:\\Riot Games\\Riot Client</div></div>`;
        const pick = (k) => {
          g.type = "exe"; g.value = /Riot/i.test(g.value || "") ? g.value : RIOT_EXE; g.args = RIOT[k].args;
          if (!fName.value || Object.values(RIOT).some((r) => r.name === fName.value)) fName.value = RIOT[k].name;
          tf.querySelectorAll("[data-r]").forEach((x) => x.classList.toggle("on", x.dataset.r === k));
          updatePreview();
        };
        tf.querySelectorAll("[data-r]").forEach((x) => (x.onclick = () => pick(x.dataset.r)));
        pick(/league/.test(g.args || "") ? "lol" : "valorant");
      } else if (tab === "exe") {
        tf.innerHTML = `
          <div class="field"><label>Oyunun .exe yolu (bilgisayarda)</label><input class="input mono" id="fValue" placeholder="C:\\Games\\Oyun\\oyun.exe"></div>
          <div class="field"><label>Başlatma parametreleri (isteğe bağlı)</label><input class="input mono" id="fArgs" placeholder="-fullscreen"></div>`;
      } else if (tab === "shortcut") {
        tf.innerHTML = `<div class="field"><label>Kısayol dosyası (bilgisayarda)</label><input class="input mono" id="fValue" placeholder="C:\\Users\\Ben\\Desktop\\Oyun.lnk">
          <div class="hint">.lnk, .url veya .exe dosyası. "Bilgisayarı tara" ile masaüstündeki kısayollar otomatik bulunur.</div></div>`;
      } else {
        tf.innerHTML = `<div class="field"><label>Başlatma bağlantısı</label><input class="input mono" id="fValue" placeholder="örn. battlenet://Pro">
          <div class="hint">Bilgisayarda çift tıklanınca oyunu açan herhangi bir protokol bağlantısı.</div></div>`;
      }
      const fv = $("#fValue", tf);
      if (fv) {
        fv.value = g.value || "";
        fv.oninput = () => { g.value = fv.value.trim(); updatePreview(); };
      }
      const fa = $("#fArgs", tf);
      if (fa) { fa.value = g.args || ""; fa.oninput = () => { g.args = fa.value; updatePreview(); }; }
      updatePreview();
    }

    async function steamSearch(term, box) {
      term = (term || "").trim();
      if (!term) return;
      box.innerHTML = `<div class="spinner"></div>`;
      const r = await Native.request("GET", "https://store.steampowered.com/api/storesearch/?l=turkish&cc=TR&term=" + encodeURIComponent(term), { timeout: 8000 });
      let items = [];
      try { items = JSON.parse(r.body).items || []; } catch (e) { /* hata */ }
      if (!items.length) { box.innerHTML = `<div class="empty-note">${r.status ? "Sonuç bulunamadı" : "Steam'e ulaşılamadı, internet bağlantını kontrol et"}</div>`; return; }
      box.innerHTML = `<div class="results"></div>`;
      const res = $(".results", box);
      items.slice(0, 9).forEach((it) => {
        const btn = document.createElement("button");
        btn.className = "result";
        const c = coverEl({ name: it.name, type: "steam", value: String(it.id) });
        btn.appendChild(c);
        btn.insertAdjacentHTML("beforeend", `<div class="r-name"></div>`);
        $(".r-name", btn).textContent = it.name;
        btn.onclick = () => {
          res.querySelectorAll(".cover").forEach((x) => x.classList.remove("picked"));
          c.classList.add("picked");
          g.value = String(it.id);
          fName.value = it.name;
          $("#fValue", b).value = g.value;
          updatePreview();
          Native.haptic();
        };
        res.appendChild(btn);
      });
    }

    b.querySelectorAll("#segType button").forEach((x) => (x.onclick = () => {
      const k = x.dataset.k;
      if (k === tab) return;
      tab = k;
      g.type = k === "riot" ? "exe" : k;
      g.value = ""; g.args = "";
      renderTypeFields();
    }));
    fName.oninput = updatePreview;
    fCoverUrl.onchange = () => { g.cover = fCoverUrl.value.trim() || undefined; updatePreview(); };
    $("#clearImg", b).onclick = () => { g.cover = undefined; g.hero = undefined; fCoverUrl.value = ""; updatePreview(); };
    $("#pickImg", b).onclick = () => {
      pickImage().then((data) => { if (data) { g.cover = data; g.hero = data; fCoverUrl.value = ""; updatePreview(); } });
    };
    $("#saveGame", b).onclick = () => {
      g.name = fName.value.trim();
      if (!g.value) return toast(tab === "steam" ? "Steam AppID gir ya da listeden seç" : "Başlatma bilgisini gir", "bad");
      if (g.type === "steam" && !/^\d+$/.test(g.value)) return toast("AppID sadece rakam olmalı", "bad");
      if (!g.name) return toast("Oyun adını gir", "bad");
      if (g.cover && !g.cover.startsWith("data:")) g.hero = g.cover;
      if (!g.cover) delete g.hero;
      if (g.type === "steam" || (existing && existing.name !== g.name)) delete g.art;
      if (existing) db.games = db.games.map((x) => (x.id === g.id ? g : x));
      else db.games.unshift(g);
      save(); closeSheet(); renderAll(); fillMissingArt();
      toast(existing ? "Kaydedildi" : g.name + " kütüphaneye eklendi", "ok");
    };
    renderTypeFields();
  }

  /** Galeriden resim seçer, 600x900 kapak olacak şekilde kırpıp küçültür. */
  function pickImage() {
    return new Promise((res) => {
      const inp = $("#filePick");
      inp.value = "";
      inp.onchange = () => {
        const f = inp.files && inp.files[0];
        if (!f) return res(null);
        const fr = new FileReader();
        fr.onload = () => {
          const im = new Image();
          im.onload = () => {
            const W = 600, H = 900, c = document.createElement("canvas");
            c.width = W; c.height = H;
            const s = Math.max(W / im.width, H / im.height);
            const w = im.width * s, h = im.height * s;
            c.getContext("2d").drawImage(im, (W - w) / 2, (H - h) / 2, w, h);
            res(c.toDataURL("image/jpeg", 0.82));
          };
          im.onerror = () => res(null);
          im.src = fr.result;
        };
        fr.readAsDataURL(f);
      };
      inp.click();
    });
  }

  // ------------------------------------------------------------------
  // Bilgisayardaki oyunları otomatik bulma
  // ------------------------------------------------------------------
  const gameKey = (g) => [g.type, String(g.value || "").toLowerCase(), g.args || ""].join("|");
  function inLibrary(f) {
    const k = gameKey(f), n = normName(f.name);
    return db.games.some((g) => gameKey(g) === k || normName(g.name) === n);
  }

  async function fetchPcGames() {
    const r = await Native.request("GET", agentUrl("/games"), { headers: { "X-Agent-Token": S().token }, timeout: 20000 });
    if (r.status === 404) return { error: "Bilgisayardaki ajan eski sürüm. agent klasörünü güncelleyip install_windows.bat'ı tekrar çalıştır." };
    if (r.status !== 200) return { error: errText(r) };
    try { return { games: JSON.parse(r.body).games || [] }; } catch (e) { return { error: "Geçersiz cevap" }; }
  }

  /** Bilgisayar açıldığında sessizce tarar; yeni oyun varsa kütüphanenin üstünde haber verir. */
  async function autoDetect() {
    if (autoDetect.busy || launchJob) return;
    autoDetect.busy = true;
    try {
      const res = await fetchPcGames();
      if (!res.games) return;
      db.lastScan = Date.now();
      db.ignored = db.ignored || [];
      const fresh = res.games.filter((f) => !inLibrary(f) && !db.ignored.includes(gameKey(f)));
      save();
      renderNewGames(fresh, res.games);
    } finally { autoDetect.busy = false; }
  }

  function renderNewGames(fresh, all) {
    const el = $("#newGames");
    if (!fresh.length) { el.hidden = true; return; }
    el.hidden = false;
    el.innerHTML = `
      <div class="ng-covers"></div>
      <div class="ng-text"><b>${fresh.length} yeni oyun bulundu</b><span>Bilgisayarında kurulu, kütüphanende yok</span></div>
      <button class="pill-btn ng-go">Göster</button>
      <button class="ng-x" aria-label="Gizle">${I.x}</button>`;
    const covers = $(".ng-covers", el);
    fresh.slice(0, 3).forEach((g) => covers.appendChild(coverEl(g)));
    $(".ng-go", el).onclick = () => openScan(all);
    $(".ng-x", el).onclick = () => {
      db.ignored = (db.ignored || []).concat(fresh.map(gameKey));
      save(); el.hidden = true;
      toast("Bu oyunlar bir daha önerilmeyecek");
    };
  }

  async function openScan(prefetched) {
    if (!configured()) return openSettings();
    const b = openSheet(`
      <h3>Bilgisayardaki oyunlar</h3>
      <p class="sub">Steam, Epic Games, Riot ve masaüstü / görev çubuğu kısayolları tarandı. Eklemek istediklerini seç.</p>
      <div id="scanBody"><div class="spinner"></div><div class="empty-note">Bilgisayar taranıyor…</div></div>`);
    let games = prefetched;
    if (!games) {
      if (pc.state !== "online") {
        const st = await checkStatus(2500);
        if (st.state !== "online") {
          $("#scanBody", b).innerHTML = `<div class="empty-note">Bilgisayar kapalı görünüyor. Taramak için önce bilgisayarı aç.</div>
            <button class="btn primary" id="scanWake">${I.bolt}<span>Bilgisayarı uyandır</span></button>`;
          $("#scanWake", b).onclick = () => { closeSheet(); powerAction("wake"); };
          return;
        }
      }
      const res = await fetchPcGames();
      if (!sheetOpen() || !$("#scanBody", b)) return;
      if (res.error) { $("#scanBody", b).innerHTML = `<div class="empty-note"></div>`; $(".empty-note", b).textContent = res.error; return; }
      games = res.games;
      db.lastScan = Date.now(); save();
    }
    const body = $("#scanBody", b);
    if (!games.length) { body.innerHTML = `<div class="empty-note">Hiç oyun bulunamadı.</div>`; return; }

    const items = games.map((f) => ({ f, added: inLibrary(f), on: !inLibrary(f) }));
    const groups = {};
    items.forEach((it) => (groups[it.f.source || "Diğer"] = groups[it.f.source || "Diğer"] || []).push(it));
    body.innerHTML = `<div class="scan-tools"><span id="scanCount"></span><button class="mini-link" id="scanAll">Tümünü seç</button></div><div id="scanList"></div>
      <div class="sheet-cta"><button class="btn primary" id="scanAdd"></button></div>`;
    const list = $("#scanList", body);
    const pendingArt = [];
    Object.keys(groups).forEach((src) => {
      list.insertAdjacentHTML("beforeend", `<div class="scan-group">${esc(src.toLocaleUpperCase("en-US"))} <span>${groups[src].length}</span></div>`);
      groups[src].forEach((it) => {
        const row = document.createElement("button");
        row.className = "scan-row" + (it.added ? " added" : "");
        const thumb = document.createElement("div");
        thumb.className = "scan-thumb";
        const draw = () => { thumb.innerHTML = ""; thumb.appendChild(coverEl(Object.assign({}, it.f, { art: it.art }))); };
        draw();
        row.appendChild(thumb);
        row.insertAdjacentHTML("beforeend", `<div class="scan-info"><div class="scan-name"></div><div class="scan-meta"></div></div><span class="check">${I.check}</span>`);
        $(".scan-name", row).textContent = it.f.name;
        $(".scan-meta", row).textContent = it.added ? "Kütüphanede var" : platformLabel(it.f);
        const sync = () => row.classList.toggle("on", it.on);
        sync();
        row.onclick = () => { if (it.added) return; it.on = !it.on; sync(); update(); Native.haptic(); };
        list.appendChild(row);
        if (it.f.type !== "steam") pendingArt.push(async () => { it.art = await matchArt(it.f.name); if (it.art) draw(); });
      });
    });
    const update = () => {
      const n = items.filter((it) => it.on).length;
      $("#scanCount", body).textContent = items.filter((it) => !it.added).length + " yeni · " + items.filter((it) => it.added).length + " ekli";
      const btn = $("#scanAdd", body);
      btn.innerHTML = `${I.plus}<span>${n ? n + " oyunu ekle" : "Oyun seç"}</span>`;
      btn.disabled = !n;
    };
    update();
    const flat = Object.keys(groups).flatMap((k) => groups[k]);
    $("#scanAll", body).onclick = () => {
      const all = flat.filter((it) => !it.added).every((it) => it.on);
      flat.forEach((it) => { if (!it.added) it.on = !all; });
      list.querySelectorAll(".scan-row").forEach((row, i) => row.classList.toggle("on", flat[i].on));
      update();
    };
    $("#scanAdd", body).onclick = () => {
      const chosen = flat.filter((it) => it.on);
      chosen.reverse().forEach((it) => {
        const g = { id: uid(), name: it.f.name, type: it.f.type, value: it.f.value, args: it.f.args || "" };
        if (it.f.type === "shortcut") g.source = it.f.source;
        if (it.art !== undefined) g.art = it.art;
        db.games.unshift(g);
      });
      db.ignored = (db.ignored || []).filter((k) => !chosen.some((it) => gameKey(it.f) === k));
      save(); closeSheet(); renderAll(); $("#newGames").hidden = true;
      toast(chosen.length + " oyun kütüphaneye eklendi", "ok");
      fillMissingArt();
    };
    // Steam dışı oyunlar için kapakları sırayla bul
    (async () => { for (const job of pendingArt) { if (!sheetOpen()) break; await job(); } })();
  }

  // ------------------------------------------------------------------
  // Ayarlar
  // ------------------------------------------------------------------
  function openSettings() {
    const s = S();
    const auto = hasNative ? window.Android.broadcastAddress() : "";
    const b = openSheet(`
      <h3>Bilgisayar bağlantısı</h3>
      <p class="sub">Bu bilgileri oyun bilgisayarında <b>install_windows.bat</b> çalıştırınca açılan pencerede görürsün.</p>
      <div class="row-3">
        <div class="field"><label>IP adresi</label><input class="input mono" id="sIp" inputmode="decimal" placeholder="192.168.1.20"></div>
        <div class="field"><label>Port</label><input class="input mono" id="sPort" inputmode="numeric" placeholder="5757"></div>
      </div>
      <div class="field"><label>MAC adresi (ethernet kartı)</label><input class="input mono" id="sMac" placeholder="AA-BB-CC-DD-EE-FF" autocapitalize="characters"></div>
      <div class="field"><label>Erişim anahtarı</label><input class="input mono" id="sToken" placeholder="agent/config.json içindeki token"></div>
      <div class="row">
        <div class="field"><label>Açılış bekleme (sn)</label><input class="input mono" id="sBoot" inputmode="numeric"></div>
        <div class="field"><label>Oyun öncesi bekleme</label><input class="input mono" id="sSettle" inputmode="numeric"></div>
      </div>
      <div class="field"><label>Yayın (broadcast) adresi — isteğe bağlı</label><input class="input mono" id="sBc" placeholder="${esc(auto || "Otomatik")}">
        <div class="hint">Boş bırakırsan Wi-Fi ağından otomatik bulunur${auto ? " (" + esc(auto) + ")" : ""}.</div></div>
      <div class="stack">
        <button class="btn" id="sTest">${I.wifi}<span>Bağlantıyı test et</span></button>
        <button class="btn primary" id="sSave">${I.check}<span>Kaydet</span></button>
      </div>`);
    const f = (id) => $("#" + id, b);
    f("sIp").value = s.ip; f("sPort").value = s.port || 5757; f("sMac").value = s.mac; f("sToken").value = s.token;
    f("sBoot").value = s.bootTimeout; f("sSettle").value = s.settleDelay; f("sBc").value = s.broadcast || "";
    const read = () => ({
      ip: f("sIp").value.trim(),
      port: parseInt(f("sPort").value, 10) || 5757,
      mac: f("sMac").value.trim().toUpperCase(),
      token: f("sToken").value.trim(),
      bootTimeout: Math.max(30, parseInt(f("sBoot").value, 10) || 180),
      settleDelay: Math.max(0, parseInt(f("sSettle").value, 10) || 0),
      broadcast: f("sBc").value.trim(),
    });
    const valid = (v) => {
      if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(v.ip)) return "IP adresi geçersiz";
      if (v.mac.replace(/[^0-9A-F]/g, "").length !== 12) return "MAC adresi 12 haneli olmalı (AA-BB-CC-DD-EE-FF)";
      if (!v.token) return "Erişim anahtarını gir";
      return null;
    };
    f("sTest").onclick = async () => {
      const v = read(), err = valid(v);
      if (err) return toast(err, "bad");
      const old = db.settings; db.settings = Object.assign({}, old, v);
      const r = await checkStatus(2500);
      db.settings = old;
      if (r.state === "online") toast("Bağlandı: " + (r.info.hostname || "bilgisayar") + " ✓", "ok");
      else if (r.state === "denied") toast("Bilgisayar açık ama erişim anahtarı hatalı", "bad");
      else toast("Ulaşılamadı. Bilgisayar kapalı olabilir ya da IP yanlış.", "bad");
    };
    f("sSave").onclick = () => {
      const v = read(), err = valid(v);
      if (err) return toast(err, "bad");
      db.settings = Object.assign({}, db.settings, v);
      save(); closeSheet(); renderAll(); startPolling();
      toast("Ayarlar kaydedildi", "ok");
    };
  }

  // ------------------------------------------------------------------
  // Güç komutları
  // ------------------------------------------------------------------
  async function powerAction(act) {
    if (!configured()) return openSettings();
    Native.haptic();
    if (act === "wake") {
      const r = await Native.wake(S().mac, S().ip, S().broadcast);
      if (r.status !== 200) return toast(r.body || "Uyandırma paketi gönderilemedi", "bad");
      toast("Uyandırma sinyali gönderildi ⚡", "ok");
      pc.state = "unknown"; renderStatus();
      return;
    }
    const names = { sleep: ["Uyku moduna al", "Bilgisayar uyku moduna geçecek."], restart: ["Yeniden başlat", "Bilgisayar 5 saniye içinde yeniden başlayacak."], shutdown: ["Bilgisayarı kapat", "Bilgisayar 5 saniye içinde kapanacak. Açık oyunlar kaydedilmeden kapanabilir."] };
    const [t, d] = names[act];
    if (!(await confirmSheet(t, d, t, act === "shutdown"))) return;
    const r = await Native.request("POST", agentUrl("/power"), { headers: { "X-Agent-Token": S().token }, body: { action: act }, timeout: 3000 });
    if (r.status === 200) { toast("Komut gönderildi", "ok"); setTimeout(refreshStatus, 6000); }
    else toast(errText(r), "bad");
  }

  function errText(r) {
    if (r.status === 401) return "Erişim anahtarı hatalı";
    try { const j = JSON.parse(r.body); if (j.error) return j.error; } catch (e) { /* düz metin */ }
    return r.status ? "Hata (" + r.status + ")" : "Bilgisayara ulaşılamadı";
  }

  // ------------------------------------------------------------------
  // Tek tuşla oyna: uyandır → bekle → oyunu başlat
  // ------------------------------------------------------------------
  let launchJob = null;

  function play(g) {
    if (!configured()) { toast("Önce bilgisayar bağlantısını ayarla", "bad"); return openSettings(); }
    if (launchJob) return;
    Native.haptic();
    const job = { cancelled: false, game: g };
    launchJob = job;
    runLaunch(job).finally(() => { if (launchJob === job) launchJob = null; });
  }

  async function runLaunch(job) {
    const g = job.game;
    const L = $("#launch");
    L.hidden = false;
    L.className = "launch";
    L.innerHTML = `
      <div class="launch-bg"></div>
      <div class="launch-body">
        <div class="launch-cover"></div>
        <h2></h2>
        <div class="l-status">Hazırlanıyor…</div>
        <div class="steps">
          <div class="step" data-s="check"><span class="ic"></span><span>Bilgisayar kontrol ediliyor</span></div>
          <div class="step" data-s="wake"><span class="ic"></span><span>Bilgisayar uyandırılıyor</span></div>
          <div class="step" data-s="boot"><span class="ic"></span><span>Windows açılıyor</span></div>
          <div class="step" data-s="launch"><span class="ic"></span><span>Oyun başlatılıyor</span></div>
        </div>
        <div class="progress"><i></i></div>
      </div>
      <div class="launch-foot"><button class="btn ghost" id="lCancel">Vazgeç</button></div>`;
    $("h2", L).textContent = g.name;
    const cov = $(".launch-cover", L);
    const cs = coverSources(g);
    if (cs.length) cov.appendChild(smartImg(cs, () => cov.appendChild(placeholder(g.name))));
    else cov.appendChild(placeholder(g.name));
    const bgs = heroSources(g).length ? heroSources(g) : cs;
    if (bgs.length) $(".launch-bg", L).appendChild(smartImg(bgs));
    document.body.classList.add("locked");

    const statusEl = $(".l-status", L);
    const bar = $(".progress i", L);
    const step = (name, state) => {
      const el = L.querySelector(`[data-s="${name}"]`);
      el.className = "step " + state;
      const ic = $(".ic", el);
      ic.innerHTML = state === "done" ? I.check : state === "fail" ? I.x : "";
    };
    const setStatus = (html) => (statusEl.innerHTML = html);
    const progress = (p) => (bar.style.width = Math.round(p * 100) + "%");
    const close = () => { L.hidden = true; L.innerHTML = ""; document.body.classList.remove("locked"); refreshStatus(); };
    const fail = (name, msg) => {
      step(name, "fail");
      L.classList.add("error");
      setStatus(esc(msg));
      const foot = $(".launch-foot", L);
      foot.innerHTML = `<div class="btn-row" style="margin-top:0"><button class="btn ghost" id="lClose">Kapat</button><button class="btn primary" id="lRetry">Tekrar dene</button></div>`;
      $("#lClose", L).onclick = close;
      $("#lRetry", L).onclick = () => { close(); setTimeout(() => play(g), 50); };
    };
    $("#lCancel", L).onclick = () => { job.cancelled = true; close(); };

    const headers = { "X-Agent-Token": S().token };

    // 1) Açık mı?
    step("check", "active");
    progress(0.05);
    let st = await checkStatus(1800);
    if (job.cancelled) return;
    if (st.state === "denied") return fail("check", "Bilgisayar açık ama erişim anahtarı eşleşmiyor. Ayarlardan kontrol et.");
    step("check", "done");

    if (st.state === "online") {
      step("wake", "skip"); step("boot", "skip");
      setStatus("Bilgisayar zaten açık");
    } else {
      // 2) Uyandır
      step("wake", "active");
      setStatus("Uyandırma sinyali gönderiliyor…");
      const w = await Native.wake(S().mac, S().ip, S().broadcast);
      if (job.cancelled) return;
      if (w.status !== 200) return fail("wake", w.body || "Uyandırma paketi gönderilemedi");
      step("wake", "done");
      progress(0.15);

      // 3) Ajan cevap verene kadar bekle
      step("boot", "active");
      const t0 = Date.now(), limit = (S().bootTimeout || 180) * 1000;
      let lastWake = t0;
      while (true) {
        const secs = Math.round((Date.now() - t0) / 1000);
        setStatus(`Bilgisayarın açılması bekleniyor · <b>${secs} sn</b>`);
        progress(0.15 + 0.6 * Math.min(1, (Date.now() - t0) / Math.min(limit, 60000)));
        st = await checkStatus(1500);
        if (job.cancelled) return;
        if (st.state === "online") break;
        if (st.state === "denied") return fail("boot", "Erişim anahtarı eşleşmiyor. Ayarlardan kontrol et.");
        if (Date.now() - t0 > limit) {
          return fail("boot", "Bilgisayar " + Math.round(limit / 1000) + " sn içinde açılmadı. BIOS'ta Wake-on-LAN açık mı, ağ kablosu takılı mı?");
        }
        if (Date.now() - lastWake > 12000 && Date.now() - t0 < 60000) { lastWake = Date.now(); Native.wake(S().mac, S().ip, S().broadcast); }
        await sleep(2000);
      }
      step("boot", "done");
      progress(0.8);
      // Steam vb. arka planda açılsın diye kısa bekleme
      const settle = S().settleDelay || 0;
      for (let i = settle; i > 0; i--) {
        if (job.cancelled) return;
        setStatus(`Masaüstü hazırlanıyor · <b>${i}</b>`);
        progress(0.8 + 0.12 * (1 - i / settle));
        await sleep(1000);
      }
    }

    // 4) Oyunu başlat
    step("launch", "active");
    setStatus("Oyun açılıyor…");
    progress(0.94);
    const payload = { name: g.name, type: g.type, value: g.value, args: g.args || "" };
    let r = await Native.request("POST", agentUrl("/launch"), { headers, body: payload, timeout: 5000 });
    if (r.status === 0 && !job.cancelled) { await sleep(2000); r = await Native.request("POST", agentUrl("/launch"), { headers, body: payload, timeout: 5000 }); }
    if (job.cancelled) return;
    if (r.status !== 200) return fail("launch", errText(r));
    step("launch", "done");
    progress(1);
    L.classList.add("done");
    $("h2", L).textContent = "İyi eğlenceler!";
    setStatus(esc(g.name) + " bilgisayarında açılıyor 🎮");
    Native.haptic();

    const s = db.stats[g.id] || { count: 0 };
    db.stats[g.id] = { count: s.count + 1, last: Date.now() };
    if (db.featured !== g.id) db.featured = null;
    save();
    renderHero(); renderGrid();
    $(".launch-foot", L).innerHTML = `<button class="btn primary" id="lDone">Tamam</button>`;
    $("#lDone", L).onclick = close;
    setTimeout(() => { if (!L.hidden && L.classList.contains("done")) close(); }, 4500);
  }

  // ------------------------------------------------------------------
  // Başlangıç
  // ------------------------------------------------------------------
  window.onNativeBack = function () {
    const L = $("#launch");
    if (!L.hidden) { if (launchJob) launchJob.cancelled = true; L.hidden = true; L.innerHTML = ""; document.body.classList.remove("locked"); return true; }
    if (sheetOpen()) { closeSheet(); return true; }
    return false;
  };
  window.onNativeResume = function () { refreshStatus(); };

  $("#settingsBtn").innerHTML = I.gear;
  $("#settingsBtn").onclick = openSettings;
  $("#statusChip").onclick = () => (configured() ? (toast("Durum yenileniyor…"), refreshStatus()) : openSettings());
  $("#addGameBtn").innerHTML = I.plus + "<span>Ekle</span>";
  $("#addGameBtn").onclick = () => openGameEditor();
  $("#scanBtn").innerHTML = I.radar + "<span>Tara</span>";
  $("#scanBtn").onclick = () => openScan();
  $("#scrim").onclick = closeSheet;

  if (DEMO && !configured()) {
    Object.assign(db.settings, { ip: "192.168.1.20", mac: "AA-BB-CC-DD-EE-FF", token: "demo", settleDelay: 3 });
  }
  if (!configured()) pc.state = "unset";
  renderAll();
  startPolling();
  fillMissingArt();
})();
