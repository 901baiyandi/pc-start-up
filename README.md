# Arise ⚡🎮

> Tek dokunuş, oyun başlasın.

Telefondan **tek tuşla** oyun bilgisayarını uzaktan açıp istediğin oyunu otomatik başlatan Android uygulaması.

```
 Telefon (Android uygulaması)                      Oyun bilgisayarı (Windows)
 ┌──────────────────────────┐   1. Wake-on-LAN    ┌──────────────────────────┐
 │  [ELDEN RING]  ▶ OYNA    │ ──────────────────▶ │  Ağ kartı PC'yi açar     │
 │                          │   2. "Açık mısın?"  │  Windows açılır          │
 │  Uyandırılıyor… ✓        │ ◀────────────────── │  agent.py otomatik başlar│
 │  Windows açılıyor… ✓     │   3. "Oyunu başlat" │                          │
 │  Oyun başlatılıyor… ✓    │ ──────────────────▶ │  steam://rungameid/...   │
 └──────────────────────────┘                     └──────────────────────────┘
              Aynı Wi-Fi / modem ağında olmalı
```

**Özellikler**
- Oyun kapaklı, koyu temalı, konsol tarzı arayüz (Steam kapakları otomatik gelir)
- **OYNA**'ya bas → PC kapalıysa uyandırır → açılmasını bekler → oyunu başlatır
- **Oyunları kendisi bulur:** Steam, Epic Games, Riot ve masaüstü / görev çubuğu kısayollarını tarar
- Bilgisayar açıldığında yeni kurulan oyunları fark edip haber verir
- Steam dışı oyunların kapaklarını Steam'de isimle eşleştirerek bulur
- Steam'de isimle oyun arama ve tek dokunuşla ekleme
- Steam, Epic Games, Riot (VALORANT / LoL), herhangi bir `.exe` veya bağlantı desteği
- Kendi kapak resmini galeriden seçme
- Uzaktan **Uyandır / Uyku / Yeniden başlat / Kapat**
- Bilgisayarın açık/kapalı durumu canlı gösterilir
- Erişim anahtarı sayesinde ağdaki başka biri bilgisayarında komut çalıştıramaz

---

## 1. Telefona kurulum

1. Telefonda en son APK'yı indir:
   **https://github.com/901baiyandi/pc-start-up/releases/download/apk-latest/Arise.apk**
   (veya depodaki [`release/Arise.apk`](release/Arise.apk)).
2. Dosyayı aç. Android "bilinmeyen kaynaklara izin ver" diye sorarsa tarayıcına/dosya yöneticine izin ver.
3. Play Protect uyarısı çıkarsa **Yine de yükle**'ye dokun (uygulama Play Store'da olmadığı için normaldir).

Android 6.0 ve üstü gerekir.

## 2. Oyun bilgisayarına kurulum (bir kerelik)

### a) BIOS'ta Wake-on-LAN'ı aç
Bilgisayar açılırken **Del** / **F2** ile BIOS'a gir. Anakart markasına göre adı değişir:
`Wake on LAN`, `Power On By PCI-E`, `Resume by PCI-E Device`, `ErP` (**ErP Disabled** olmalı). Kaydet ve çık.

### b) Windows ağ kartı ayarları
1. **Aygıt Yöneticisi** → **Ağ bağdaştırıcıları** → ethernet kartına sağ tık → **Özellikler**
2. **Gelişmiş** sekmesi: `Wake on Magic Packet` → **Etkin**
   (varsa `Shutdown Wake-On-Lan` → **Etkin**, `Energy Efficient Ethernet` / `Green Ethernet` → **Devre dışı**)
3. **Güç Yönetimi** sekmesi: *"Bu aygıtın bilgisayarı uyandırmasına izin ver"* ✔ ve
   *"Sadece sihirli paketin…"* ✔

### c) Hızlı başlatmayı kapat
Denetim Masası → Güç Seçenekleri → *Güç düğmelerinin yapacaklarını seçin* →
*Şu anda kullanılamayan ayarları değiştirin* → **Hızlı başlatmayı aç** kutusunu kaldır.

### d) Otomatik oturum açma
Oyunun açılabilmesi için Windows'un şifre ekranında beklememesi gerekir.
`Win + R` → `netplwiz` → *"Kullanıcılar bu bilgisayarı kullanmak için bir kullanıcı adı ve parola girmelidir"*
kutusunu kaldır → şifreni gir.
(Kutu görünmüyorsa: Ayarlar → Hesaplar → Oturum açma seçenekleri → *"Windows Hello oturum açmayı zorunlu kıl"* kapat.)

### e) Ajanı kur
1. [Python](https://www.python.org/downloads/)'u kur — kurulumda **"Add python.exe to PATH"** kutusunu işaretle.
2. Bu depodaki **`agent`** klasörünü bilgisayarına kopyala (örn. `C:\Arise\agent`).
3. **`install_windows.bat`** dosyasına çift tıkla (yönetici izni ister). Bu betik:
   - Güvenlik duvarında 5757 portunu açar
   - Ajanı Windows açılışında otomatik başlatır
   - Ekrana **erişim anahtarını**, **MAC** ve **IP** adresini yazar → bunları not al

> **İpucu:** Modem arayüzünden bilgisayara **sabit IP (DHCP rezervasyonu)** ver, yoksa IP zamanla değişebilir.

> **Önemli:** Wake-on-LAN neredeyse her zaman sadece **ethernet kablosuyla** çalışır. Bilgisayar Wi-Fi ile bağlıysa
> uzaktan açma büyük ihtimalle çalışmaz (açıkken oyun başlatma yine çalışır).

## 3. Uygulamayı bağla

Uygulamayı aç → **Bilgisayarı bağla** (veya sağ üstteki ⚙):

| Alan | Nereden? |
|---|---|
| IP adresi | `install_windows.bat` çıktısındaki IPv4 (örn. `192.168.1.20`) |
| MAC adresi | Ethernet kartının fiziksel adresi (örn. `A1-B2-C3-D4-E5-F6`) |
| Erişim anahtarı | `agent\config.json` içindeki `token` |
| Açılış bekleme | PC'nin açılması için en fazla kaç sn beklensin (varsayılan 180) |
| Oyun öncesi bekleme | PC açıldıktan sonra Steam'in hazırlanması için bekleme (varsayılan 12 sn) |

**Bağlantıyı test et** ile kontrol et (bilgisayar açıkken) → **Kaydet**.

## 4. Oyun ekleme

### Otomatik (önerilen)
Bilgisayar açıkken kütüphanedeki **Tara** düğmesine bas. Ajan şunları tarar:

| Kaynak | Nereden okunur |
|---|---|
| Steam | Tüm Steam kütüphane klasörlerindeki kurulu oyunlar (`libraryfolders.vdf`, `appmanifest_*.acf`) |
| Epic Games | `C:\ProgramData\Epic\EpicGamesLauncher\Data\Manifests` |
| Riot Games | VALORANT ve League of Legends kuruluysa |
| Masaüstü / görev çubuğu | `.lnk` ve `.url` kısayolları (tarayıcı, Discord gibi oyun olmayanlar elenir) |

Eklemek istediklerini seç → **Ekle**. Steam dışı oyunların kapakları Steam mağazasında isimle eşleştirilerek
otomatik bulunur. Bilgisayar her açıldığında yeni kurulan oyunlar kütüphanenin üstünde
**"N yeni oyun bulundu"** olarak gösterilir.

### Elle
**+ Ekle** →
- **Steam:** Oyun adını yaz → **Ara** → kapağa dokun. Kapak resmi otomatik gelir.
- **Epic:** Oyunun AppName değeri (Fortnite için `Fortnite`).
- **Riot:** VALORANT veya League of Legends seç.
- **.exe:** Oyunun bilgisayardaki tam yolu, örn. `C:\Games\Minecraft\Launcher.exe`.
- **Bağlantı:** `battlenet://`, `uplay://` gibi bir başlatma adresi.
- **Kısayol:** Bilgisayardaki bir `.lnk` / `.url` dosyasının yolu.

Steam dışı oyunlar için **Galeriden seç** ile kapak resmi ekleyebilirsin.

---

## Sorun giderme

| Sorun | Çözüm |
|---|---|
| "Bilgisayar açılmadı" | BIOS WoL / ErP, ağ kartı ayarları, hızlı başlatma ve ethernet kablosunu kontrol et. PC'yi bir kez normal açıp **Başlat → Kapat** ile kapat (fişten çekilirse bazı kartlar WoL'u unutur). |
| PC açıldı ama oyun başlamadı | Otomatik oturum açma kurulu mu? `agent\agent.log` dosyasına bak. "Oyun öncesi bekleme"yi artır. |
| Tara: "ajan eski sürüm" | `agent` klasörünü bu depodaki yeni sürümle değiştirip `install_windows.bat`'ı tekrar çalıştır. |
| "Anahtar hatalı" | Uygulamadaki anahtar `agent\config.json` içindeki `token` ile aynı olmalı. |
| Durum hep "Kapalı" | Telefon aynı Wi-Fi'da mı? IP doğru mu? Misafir ağı (guest Wi-Fi) cihazları birbirinden ayırır, kullanma. |

## Güvenlik

- Ajan sadece doğru **erişim anahtarını** gönderen isteklere cevap verir. Anahtarı kimseyle paylaşma.
- Güvenlik duvarı kuralı sadece **Özel** ağlarda açıktır; ajanı kesinlikle modemden internete açma (port yönlendirme yapma).
- Anahtarı değiştirmek için `agent\config.json` içindeki `token` değerini silip ajanı yeniden başlat; yenisi üretilir.

## Kaldırma
`agent\uninstall_windows.bat` dosyasını çalıştır.

---

## Geliştiriciler için

```
agent/                 Oyun bilgisayarında çalışan ajan (Python, sadece standart kütüphane)
  agent.py             HTTP API: GET /status, GET /games, POST /launch, POST /power  (port 5757)
  scanner.py           Kurulu oyunları bulan tarayıcı (Steam / Epic / Riot / kısayollar)
  install_windows.bat  Güvenlik duvarı + otomatik başlatma kurulumu
android/               Android uygulaması
  src/…/MainActivity.java   WebView + yerel köprü (Wake-on-LAN, HTTP)
  assets/www/          Arayüz (HTML/CSS/JS)
  build.sh             Gradle'sız APK derleme betiği
release/Arise.apk   Hazır derlenmiş APK
```

**APK derleme** (Ubuntu/Debian):
```bash
sudo apt-get install -y openjdk-17-jdk aapt apksigner zipalign android-sdk-platform-23 dalvik-exchange
./android/build.sh        # -> android/build/Arise.apk
```
`android/` klasöründe yapılan her değişiklikte GitHub Actions APK'yı otomatik derler; `main` dalında
**Releases** sayfasına da yükler.

**Arayüzü tarayıcıda deneme:** `android/assets/www/index.html?demo` dosyasını açarsan sahte bir bilgisayarla
tüm akış (uyandırma → açılış → oyun başlatma) denenebilir.

`android/signing/pcstartup.keystore` imza anahtarı (şifre `pcstartup`) bilerek depodadır; böylece her yeni
sürüm eskisinin üzerine güncelleme olarak kurulabilir.
