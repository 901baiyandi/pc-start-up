package com.pcstartup.app;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.DhcpInfo;
import android.net.Uri;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.view.HapticFeedbackConstants;
import android.view.View;
import android.view.Window;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.URL;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Arayüz assets/www içindeki HTML/CSS/JS ile çizilir. Bu sınıf, tarayıcının
 * tek başına yapamadığı işleri (Wake-on-LAN paketi, yerel ağdaki ajana istek)
 * "Android" adlı köprü üzerinden JavaScript'e sunar.
 */
public class MainActivity extends Activity {

    private static final int PICK_IMAGE = 41;

    private WebView web;
    private ValueCallback<Uri[]> fileCallback;
    private final ExecutorService pool = Executors.newCachedThreadPool();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Window w = getWindow();
        w.setStatusBarColor(Color.parseColor("#07090f"));
        w.setNavigationBarColor(Color.parseColor("#07090f"));

        web = new WebView(this);
        web.setBackgroundColor(Color.parseColor("#07090f"));
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);

        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith("file:")) return false;
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
                } catch (Exception ignored) {
                }
                return true;
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback,
                                             FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                Intent i = new Intent(Intent.ACTION_GET_CONTENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                i.setType("image/*");
                try {
                    startActivityForResult(Intent.createChooser(i, "Kapak resmi seç"), PICK_IMAGE);
                } catch (Exception e) {
                    fileCallback = null;
                    return false;
                }
                return true;
            }
        });

        web.addJavascriptInterface(new Bridge(), "Android");
        web.loadUrl("file:///android_asset/www/index.html");
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == PICK_IMAGE && fileCallback != null) {
            Uri[] result = null;
            if (resultCode == RESULT_OK && data != null && data.getData() != null) {
                result = new Uri[]{data.getData()};
            }
            fileCallback.onReceiveValue(result);
            fileCallback = null;
            return;
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onBackPressed() {
        web.evaluateJavascript("window.onNativeBack && window.onNativeBack()", new ValueCallback<String>() {
            @Override
            public void onReceiveValue(String value) {
                if (!"true".equals(value)) finish();
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (web != null) web.evaluateJavascript("window.onNativeResume && window.onNativeResume()", null);
    }

    @Override
    protected void onDestroy() {
        pool.shutdownNow();
        super.onDestroy();
    }

    private void callback(final String id, final int status, final String body) {
        final String js = "window.NativeBridge && window.NativeBridge.resolve("
                + JSONObject.quote(id) + "," + status + "," + JSONObject.quote(body == null ? "" : body) + ")";
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                web.evaluateJavascript(js, null);
            }
        });
    }

    private String wifiBroadcast() {
        try {
            WifiManager wm = (WifiManager) getApplicationContext().getSystemService(Context.WIFI_SERVICE);
            DhcpInfo d = wm == null ? null : wm.getDhcpInfo();
            if (d == null || d.ipAddress == 0) return null;
            int b = (d.ipAddress & d.netmask) | ~d.netmask;
            return (b & 0xff) + "." + ((b >> 8) & 0xff) + "." + ((b >> 16) & 0xff) + "." + ((b >> 24) & 0xff);
        } catch (Exception e) {
            return null;
        }
    }

    static byte[] magicPacket(String mac) {
        String hex = mac.replaceAll("[^0-9A-Fa-f]", "");
        if (hex.length() != 12) throw new IllegalArgumentException("MAC adresi geçersiz");
        byte[] macBytes = new byte[6];
        for (int i = 0; i < 6; i++) {
            macBytes[i] = (byte) Integer.parseInt(hex.substring(i * 2, i * 2 + 2), 16);
        }
        byte[] packet = new byte[6 + 16 * 6];
        for (int i = 0; i < 6; i++) packet[i] = (byte) 0xff;
        for (int i = 6; i < packet.length; i += 6) System.arraycopy(macBytes, 0, packet, i, 6);
        return packet;
    }

    public class Bridge {

        @JavascriptInterface
        public boolean isNative() {
            return true;
        }

        @JavascriptInterface
        public String appVersion() {
            try {
                return getPackageManager().getPackageInfo(getPackageName(), 0).versionName;
            } catch (Exception e) {
                return "";
            }
        }

        @JavascriptInterface
        public String broadcastAddress() {
            String b = wifiBroadcast();
            return b == null ? "" : b;
        }

        /** Wake-on-LAN sihirli paketini birkaç adrese ve porta gönderir. */
        @JavascriptInterface
        public void wake(final String id, final String mac, final String targetIp, final String broadcast) {
            pool.execute(new Runnable() {
              @Override
              public void run() {
                try {
                    byte[] packet = magicPacket(mac);
                    Set<String> hosts = new LinkedHashSet<>();
                    if (broadcast != null && !broadcast.trim().isEmpty()) hosts.add(broadcast.trim());
                    String auto = wifiBroadcast();
                    if (auto != null) hosts.add(auto);
                    hosts.add("255.255.255.255");
                    if (targetIp != null && !targetIp.trim().isEmpty()) hosts.add(targetIp.trim());

                    int sent = 0;
                    try (DatagramSocket socket = new DatagramSocket()) {
                        socket.setBroadcast(true);
                        for (String h : hosts) {
                            InetAddress addr = InetAddress.getByName(h);
                            for (int port : new int[]{9, 7}) {
                                try {
                                    socket.send(new DatagramPacket(packet, packet.length, addr, port));
                                    sent++;
                                } catch (Exception ignored) {
                                }
                            }
                        }
                    }
                    callback(id, sent > 0 ? 200 : 0, sent > 0 ? "ok" : "Paket gönderilemedi");
                } catch (Exception e) {
                    callback(id, 0, e.getMessage());
                }
              }
            });
        }

        /** Yerel ağdaki ajana (veya Steam arama API'sine) HTTP isteği. */
        @JavascriptInterface
        public void request(final String id, final String method, final String url,
                            final String headersJson, final String body, final int timeoutMs) {
            pool.execute(new Runnable() {
              @Override
              public void run() {
                HttpURLConnection c = null;
                try {
                    c = (HttpURLConnection) new URL(url).openConnection();
                    c.setRequestMethod(method);
                    c.setConnectTimeout(timeoutMs);
                    c.setReadTimeout(Math.max(timeoutMs, 4000));
                    c.setUseCaches(false);
                    if (headersJson != null && !headersJson.isEmpty()) {
                        JSONObject h = new JSONObject(headersJson);
                        Iterator<String> keys = h.keys();
                        while (keys.hasNext()) {
                            String k = keys.next();
                            c.setRequestProperty(k, h.getString(k));
                        }
                    }
                    if (body != null && !body.isEmpty()) {
                        byte[] data = body.getBytes("UTF-8");
                        c.setDoOutput(true);
                        c.setRequestProperty("Content-Type", "application/json; charset=utf-8");
                        c.setFixedLengthStreamingMode(data.length);
                        try (OutputStream os = c.getOutputStream()) {
                            os.write(data);
                        }
                    }
                    int code = c.getResponseCode();
                    InputStream is = code >= 400 ? c.getErrorStream() : c.getInputStream();
                    callback(id, code, readAll(is));
                } catch (Exception e) {
                    callback(id, 0, String.valueOf(e.getMessage()));
                } finally {
                    if (c != null) c.disconnect();
                }
              }
            });
        }

        @JavascriptInterface
        public void haptic() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    web.performHapticFeedback(HapticFeedbackConstants.VIRTUAL_KEY);
                }
            });
        }
    }

    private static String readAll(InputStream is) throws Exception {
        if (is == null) return "";
        try (InputStream in = is) {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
            return out.toString("UTF-8");
        }
    }
}
