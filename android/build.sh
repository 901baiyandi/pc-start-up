#!/usr/bin/env bash
# PC Start-Up Android APK derleme betiği (Gradle gerektirmez).
#
# Ubuntu/Debian'da gerekli paketler:
#   sudo apt-get install -y openjdk-17-jdk aapt apksigner zipalign \
#        android-sdk-platform-23 dalvik-exchange
#
# Kullanım:  ./build.sh            -> build/PCStartUp.apk
set -euo pipefail
cd "$(dirname "$0")"

ANDROID_JAR="${ANDROID_JAR:-/usr/lib/android-sdk/platforms/android-23/android.jar}"
DX="${DX:-dalvik-exchange}"
KEYSTORE="${KEYSTORE:-signing/pcstartup.keystore}"
KS_PASS="${KS_PASS:-pcstartup}"
OUT=build
APK_NAME=PCStartUp.apk

rm -rf "$OUT" && mkdir -p "$OUT/gen" "$OUT/classes" "$OUT/dex"

echo "[1/5] Kaynaklar derleniyor (aapt)"
aapt package -f -m -J "$OUT/gen" -M AndroidManifest.xml -S res -I "$ANDROID_JAR"

echo "[2/5] Java derleniyor (javac)"
javac -encoding UTF-8 -source 8 -target 8 -nowarn -Xlint:-options \
  -bootclasspath "$ANDROID_JAR" -d "$OUT/classes" \
  $(find src "$OUT/gen" -name '*.java')

echo "[3/5] DEX oluşturuluyor"
"$DX" --dex --min-sdk-version=23 --output="$OUT/dex/classes.dex" "$OUT/classes"

echo "[4/5] APK paketleniyor"
aapt package -f -M AndroidManifest.xml -S res -A assets -I "$ANDROID_JAR" \
  -F "$OUT/unsigned.apk"
(cd "$OUT/dex" && aapt add ../unsigned.apk classes.dex >/dev/null)
zipalign -f -p 4 "$OUT/unsigned.apk" "$OUT/aligned.apk"

echo "[5/5] İmzalanıyor"
apksigner sign --ks "$KEYSTORE" --ks-pass "pass:$KS_PASS" --key-pass "pass:$KS_PASS" \
  --out "$OUT/$APK_NAME" "$OUT/aligned.apk"
apksigner verify "$OUT/$APK_NAME"

echo "Hazır -> android/$OUT/$APK_NAME ($(du -h "$OUT/$APK_NAME" | cut -f1))"
