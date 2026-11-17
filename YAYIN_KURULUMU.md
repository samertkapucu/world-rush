# WORLD RUSH V2 — TikTok LIVE Studio

Oyun: `http://localhost:8000/live.html`

İsteğe bağlı şeffaf teşekkür katmanı: `http://localhost:8000/supporters.html`

İkisini LIVE Studio'da ayrı Bağlantı kaynağı olarak 1080×1920 çözünürlükte ekle. Katılım ücretsizdir: izleyici ekrandaki ülke kodunu yorumlar. Oyun içinde hediye kartı ve hediye kaynaklı hız avantajı yoktur. Teşekkür katmanı varsayılan olarak sadece gerçek hediye geldiğinde yaklaşık üç saniye görünür. 10 dakikalık destekçi tablosu varsayılan olarak kapalıdır; istenirse `supporters.html?leaderboard=1` adresiyle açılır. Tabloda yalnızca TikTok olayında açıkça bildirilen diamond değeri kullanılır; para veya coin geliri sayılmaz.

Windows'ta oyunun gerçek klasöründe `GUNCELLE.cmd` çalıştır. Aynı klasörde bir CMD açıp sunucuyu başlat:

```bat
py -m http.server 8000 --bind 127.0.0.1
```

İkinci CMD'de tek bridge'i başlat:

```bat
py -m pip install -r requirements-live.txt
py tiktok_live_bridge.py --user "mevcut-tiktok-kullanici-adin"
```

Şifre, çerez veya yayın anahtarı istenmez. Köprüde `TikTok LIVE connected` ve `WORLD RUSH browser connected` satırları bağlantıyı gösterir. Gerçek yorum ve hediye olaylarını ayrı bir hesapla, yalnızca yayın açıksa doğrula. Studio'nun önizlemesi tek başına canlı bağlantı testi değildir.

Eski sürüm `backup/pre-world-rush-v2` branch'inde saklanır. Yeni sürüm bilgileri [V2_RELEASE.md](V2_RELEASE.md) dosyasındadır. TikTok kurallarına uygunluk ve LIVE Studio ses yakalaması otomatik testlerle garanti edilemez.
