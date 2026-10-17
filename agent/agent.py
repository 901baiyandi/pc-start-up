"""
PC Start-Up — Ajan (oyun bilgisayarında çalışır)

Bilgisayar açıldığında arka planda çalışır ve telefondaki uygulamadan gelen
"şu oyunu başlat" komutlarını dinler. Sadece Python standart kütüphanesi kullanır.

    python agent.py            -> normal çalıştırma
    pythonw agent.py           -> (Windows) pencere açmadan arka planda çalıştırma
"""

import json
import os
import platform
import secrets
import socket
import subprocess
import sys
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
CONFIG_PATH = BASE_DIR / "config.json"
LOG_PATH = BASE_DIR / "agent.log"
START_TIME = time.time()
IS_WINDOWS = platform.system() == "Windows"


def log(msg):
    line = f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {msg}"
    try:
        print(line, flush=True)
    except Exception:
        pass  # pythonw ile stdout yok
    try:
        with open(LOG_PATH, "a", encoding="utf-8") as f:
            f.write(line + "\n")
    except OSError:
        pass


def load_config():
    cfg = {"port": 5757, "token": ""}
    if CONFIG_PATH.exists():
        cfg.update(json.loads(CONFIG_PATH.read_text(encoding="utf-8")))
    if not cfg.get("token"):
        cfg["token"] = secrets.token_urlsafe(16)
        CONFIG_PATH.write_text(json.dumps(cfg, indent=2), encoding="utf-8")
        log("Yeni erişim anahtarı oluşturuldu (config.json içinde).")
    return cfg


def local_ips():
    ips = set()
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("10.255.255.255", 1))
        ips.add(s.getsockname()[0])
        s.close()
    except OSError:
        pass
    try:
        for info in socket.getaddrinfo(socket.gethostname(), None, socket.AF_INET):
            ips.add(info[4][0])
    except OSError:
        pass
    ips.discard("127.0.0.1")
    return sorted(ips)


def open_uri(uri):
    if IS_WINDOWS:
        os.startfile(uri)  # noqa: (sadece Windows'ta mevcut)
    elif sys.platform == "darwin":
        subprocess.Popen(["open", uri])
    else:
        subprocess.Popen(["xdg-open", uri])


def launch(game):
    """Oyunu türüne göre başlatır. game: {"type": ..., "value": ..., "args": ...}"""
    kind = (game.get("type") or "").lower()
    value = str(game.get("value") or "").strip()
    if not value:
        raise ValueError("Başlatma değeri boş")

    if kind == "steam":
        if not value.isdigit():
            raise ValueError("Steam AppID sadece rakamlardan oluşmalı")
        open_uri(f"steam://rungameid/{value}")
    elif kind == "epic":
        open_uri(f"com.epicgames.launcher://apps/{value}?action=launch&silent=true")
    elif kind == "uri":
        open_uri(value)
    elif kind == "exe":
        exe = Path(os.path.expandvars(value))
        if not exe.exists():
            raise ValueError(f"Dosya bulunamadı: {exe}")
        args = game.get("args") or ""
        cmd = [str(exe)] + (args.split() if isinstance(args, str) else list(args))
        flags = 0
        if IS_WINDOWS:
            flags = subprocess.DETACHED_PROCESS | subprocess.CREATE_NEW_PROCESS_GROUP
        subprocess.Popen(cmd, cwd=str(exe.parent), creationflags=flags)
    else:
        raise ValueError(f"Bilinmeyen başlatma türü: {kind}")


def power(action):
    if IS_WINDOWS:
        cmds = {
            "shutdown": ["shutdown", "/s", "/t", "5"],
            "restart": ["shutdown", "/r", "/t", "5"],
            "sleep": ["rundll32.exe", "powrprof.dll,SetSuspendState", "0,1,0"],
            "lock": ["rundll32.exe", "user32.dll,LockWorkStation"],
        }
    else:
        cmds = {
            "shutdown": ["systemctl", "poweroff"],
            "restart": ["systemctl", "reboot"],
            "sleep": ["systemctl", "suspend"],
            "lock": ["loginctl", "lock-session"],
        }
    if action not in cmds:
        raise ValueError("Geçersiz güç komutu")
    subprocess.Popen(cmds[action])


class Handler(BaseHTTPRequestHandler):
    server_version = "PCStartUpAgent/1.0"

    def log_message(self, fmt, *args):
        pass

    def _send(self, code, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _authorized(self):
        token = self.headers.get("X-Agent-Token", "")
        return secrets.compare_digest(token, self.server.cfg["token"])

    def _body(self):
        length = int(self.headers.get("Content-Length") or 0)
        if length > 64 * 1024:
            raise ValueError("İstek çok büyük")
        return json.loads(self.rfile.read(length) or b"{}")

    def do_GET(self):
        if self.path == "/status":
            # Durum bilgisi anahtarsız da döner ki uygulama "açık mı" görebilsin,
            # ama anahtarın doğru olup olmadığını da bildirir.
            return self._send(200, {
                "ok": True,
                "hostname": socket.gethostname(),
                "os": f"{platform.system()} {platform.release()}",
                "uptime": int(time.time() - START_TIME),
                "authorized": self._authorized(),
            })
        self._send(404, {"ok": False, "error": "Bulunamadı"})

    def do_POST(self):
        if not self._authorized():
            return self._send(401, {"ok": False, "error": "Erişim anahtarı hatalı"})
        try:
            data = self._body()
            if self.path == "/launch":
                launch(data)
                log(f"Oyun başlatıldı: {data.get('name') or data.get('value')}")
                return self._send(200, {"ok": True})
            if self.path == "/power":
                action = data.get("action")
                log(f"Güç komutu: {action}")
                power(action)
                return self._send(200, {"ok": True})
            self._send(404, {"ok": False, "error": "Bulunamadı"})
        except Exception as e:  # noqa: BLE001
            log(f"Hata: {e}")
            self._send(400, {"ok": False, "error": str(e)})


def main():
    cfg = load_config()
    server = ThreadingHTTPServer(("0.0.0.0", int(cfg["port"])), Handler)
    server.cfg = cfg
    log(f"Ajan çalışıyor -> port {cfg['port']}  |  IP: {', '.join(local_ips()) or '?'}")
    log(f"Erişim anahtarı: {cfg['token']}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
