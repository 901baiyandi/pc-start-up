"""
Bilgisayarda kurulu oyunları bulur:
  - Steam (tüm kütüphane klasörleri)
  - Epic Games
  - Riot Games (VALORANT, League of Legends)
  - Masaüstü ve görev çubuğundaki kısayollar

Her oyun şu biçimde döner:
  {"name": ..., "type": "steam|epic|exe|shortcut", "value": ..., "args": ..., "source": ...}
"""

import json
import os
import re
from pathlib import Path

try:
    import winreg
except ImportError:  # Windows dışı
    winreg = None

# Oyun olmayan Steam araçları
STEAM_SKIP_IDS = {"228980", "1070560", "1391110", "1628350", "1493710", "250820", "1826330"}
STEAM_SKIP_WORDS = ("redistributable", "proton", "steam linux runtime", "steamworks",
                    "dedicated server", " sdk", "steamvr", "soundtrack")

# Masaüstünde sık bulunan ama oyun olmayan kısayollar
SHORTCUT_SKIP = re.compile(
    r"chrome|edge|firefox|opera|brave|yandex|explorer|dosya gezgini|recycle|geri dönüşüm|"
    r"discord|spotify|whatsapp|telegram|teams|zoom|skype|word|excel|powerpoint|outlook|onenote|"
    r"office|acrobat|reader|notepad|not defteri|vlc|winrar|7-zip|obs|visual studio|vs ?code|"
    r"control panel|denetim masası|this pc|bu bilgisayar|uninstall|kaldır|setup|install|"
    r"readme|manual|help|yardım|website|support|^steam$|epic games launcher|riot client|"
    r"ea app|ubisoft connect|battle\.net|gog galaxy|xbox|nvidia|geforce|amd|radeon|msi afterburner|"
    r"logitech|razer|corsair|steelseries|anydesk|teamviewer|qbittorrent|utorrent|python|idle|cmd|powershell",
    re.I,
)


# ---------------------------------------------------------------------------
# Yardımcılar
# ---------------------------------------------------------------------------
def parse_vdf(text):
    """Valve KeyValues (VDF/ACF) metnini sözlüğe çevirir."""
    tokens = re.findall(r'"((?:[^"\\]|\\.)*)"|([{}])', text)
    root, stack, key = {}, [], None
    cur = root
    for quoted, brace in tokens:
        if brace == "{":
            new = {}
            cur[key] = new
            stack.append(cur)
            cur, key = new, None
        elif brace == "}":
            cur = stack.pop() if stack else root
            key = None
        elif key is None:
            key = quoted.replace("\\\\", "\\")
        else:
            cur[key] = quoted.replace("\\\\", "\\")
            key = None
    return root


def _reg(hive, path, name):
    if not winreg:
        return None
    try:
        with winreg.OpenKey(hive, path) as k:
            return winreg.QueryValueEx(k, name)[0]
    except OSError:
        return None


def _read(path):
    try:
        return Path(path).read_text(encoding="utf-8", errors="replace")
    except OSError:
        return ""


def _norm(name):
    return re.sub(r"[^0-9a-z]+", "", name.lower().replace("™", "").replace("®", ""))


# ---------------------------------------------------------------------------
# Steam
# ---------------------------------------------------------------------------
def steam_dir():
    candidates = []
    if winreg:
        candidates.append(_reg(winreg.HKEY_CURRENT_USER, r"Software\Valve\Steam", "SteamPath"))
        candidates.append(_reg(winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\WOW6432Node\Valve\Steam", "InstallPath"))
    candidates += [
        os.path.expandvars(r"%ProgramFiles(x86)%\Steam"),
        os.path.expanduser("~/.steam/steam"),
        os.path.expanduser("~/.local/share/Steam"),
    ]
    for c in candidates:
        if c and Path(c).is_dir():
            return Path(c)
    return None


def scan_steam(root=None):
    root = Path(root) if root else steam_dir()
    if not root:
        return []
    libraries = {root}
    vdf = parse_vdf(_read(root / "steamapps" / "libraryfolders.vdf"))
    for entry in (vdf.get("libraryfolders") or {}).values():
        if isinstance(entry, dict) and entry.get("path"):
            libraries.add(Path(entry["path"]))
        elif isinstance(entry, str) and os.path.isdir(entry):  # eski biçim
            libraries.add(Path(entry))

    games = []
    for lib in libraries:
        for acf in sorted((lib / "steamapps").glob("appmanifest_*.acf")):
            st = parse_vdf(_read(acf)).get("AppState") or {}
            appid, name = st.get("appid", ""), st.get("name", "")
            if not appid or not name or appid in STEAM_SKIP_IDS:
                continue
            if any(w in name.lower() for w in STEAM_SKIP_WORDS):
                continue
            games.append({"name": name, "type": "steam", "value": appid, "source": "Steam"})
    return games


# ---------------------------------------------------------------------------
# Epic Games
# ---------------------------------------------------------------------------
def scan_epic(manifest_dir=None):
    d = Path(manifest_dir) if manifest_dir else Path(
        os.path.expandvars(r"%ProgramData%\Epic\EpicGamesLauncher\Data\Manifests"))
    games = []
    if not d.is_dir():
        return games
    for item in sorted(d.glob("*.item")):
        try:
            m = json.loads(_read(item))
        except ValueError:
            continue
        cats = m.get("AppCategories") or []
        if m.get("bIsIncompleteInstall") or (cats and "games" not in cats):
            continue
        app, ns, cid = m.get("AppName"), m.get("CatalogNamespace"), m.get("CatalogItemId")
        if not app:
            continue
        value = f"{ns}%3A{cid}%3A{app}" if ns and cid else app
        games.append({"name": m.get("DisplayName") or app, "type": "epic", "value": value, "source": "Epic Games"})
    return games


# ---------------------------------------------------------------------------
# Riot Games
# ---------------------------------------------------------------------------
RIOT_PRODUCTS = {
    "valorant": ("VALORANT", "valorant"),
    "league_of_legends": ("League of Legends", "league_of_legends"),
}


def scan_riot(data_dir=None):
    d = Path(data_dir) if data_dir else Path(os.path.expandvars(r"%ProgramData%\Riot Games"))
    if not d.is_dir():
        return []
    client = None
    try:
        installs = json.loads(_read(d / "RiotClientInstalls.json") or "{}")
        client = installs.get("rc_default") or installs.get("rc_live")
    except ValueError:
        pass
    client = client or r"C:\Riot Games\Riot Client\RiotClientServices.exe"
    games = []
    for key, (name, product) in RIOT_PRODUCTS.items():
        if (d / "Metadata" / f"{key}.live").is_dir():
            games.append({
                "name": name, "type": "exe", "value": client, "source": "Riot Games",
                "args": f"--launch-product={product} --launch-patchline=live",
            })
    return games


# ---------------------------------------------------------------------------
# Masaüstü / görev çubuğu kısayolları
# ---------------------------------------------------------------------------
def shortcut_dirs():
    dirs = []
    if winreg:
        desk = _reg(winreg.HKEY_CURRENT_USER,
                    r"Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders", "Desktop")
        if desk:
            dirs.append((Path(os.path.expandvars(desk)), "Masaüstü"))
    dirs += [
        (Path.home() / "Desktop", "Masaüstü"),
        (Path.home() / "OneDrive" / "Desktop", "Masaüstü"),
        (Path.home() / "OneDrive" / "Masaüstü", "Masaüstü"),
        (Path(os.environ.get("PUBLIC", r"C:\Users\Public")) / "Desktop", "Masaüstü"),
        (Path(os.path.expandvars(r"%APPDATA%\Microsoft\Internet Explorer\Quick Launch\User Pinned\TaskBar")),
         "Görev çubuğu"),
    ]
    return dirs


def parse_url_file(path):
    m = re.search(r"^URL=(.+)$", _read(path), re.M)
    return m.group(1).strip() if m else ""


def scan_shortcuts(dirs=None):
    games, seen = [], set()
    for d, label in (dirs if dirs is not None else shortcut_dirs()):
        try:
            if not d.is_dir():
                continue
            key = str(d.resolve()).lower()
        except OSError:
            continue
        if key in seen:
            continue
        seen.add(key)
        for f in sorted(d.iterdir()):
            ext = f.suffix.lower()
            if ext not in (".lnk", ".url") or SHORTCUT_SKIP.search(f.stem):
                continue
            name = f.stem
            if ext == ".url":
                url = parse_url_file(f)
                m = re.match(r"steam://rungameid/(\d+)", url)
                if m:
                    games.append({"name": name, "type": "steam", "value": m.group(1), "source": label})
                    continue
                m = re.match(r"com\.epicgames\.launcher://apps/([^?]+)", url)
                if m:
                    games.append({"name": name, "type": "epic", "value": m.group(1), "source": label})
                    continue
                if not url or url.startswith(("http:", "https:", "file:")):
                    continue
            games.append({"name": name, "type": "shortcut", "value": str(f), "source": label})
    return games


# ---------------------------------------------------------------------------
def scan_all():
    found = []
    for fn in (scan_steam, scan_epic, scan_riot, scan_shortcuts):
        try:
            found += fn()
        except Exception:  # noqa: BLE001 - bir kaynak bozuksa diğerleri yine taransın
            pass

    # Aynı oyun birden fazla yerde bulunursa (örn. Steam + masaüstü kısayolu) tekini tut
    result, keys, names = [], set(), set()
    for g in found:
        k = (g["type"], g["value"].lower(), g.get("args", ""))
        n = _norm(g["name"])
        if k in keys or (g["type"] == "shortcut" and n in names):
            continue
        keys.add(k)
        names.add(n)
        result.append(g)
    return result
