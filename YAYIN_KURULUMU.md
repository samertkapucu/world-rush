# WORLD RUSH V2 — TikTok LIVE Studio

Oyun: `http://localhost:8000/live.html`

Teşekkür yazısı artık ana oyunun içindedir.

LIVE Studio'da yalnızca `live.html` Bağlantı kaynağını 1080×1920 çözünürlükte kullan. Eski `supporters.html` kaynağını sahneden kaldır. Katılım ücretsizdir: izleyici ekrandaki ülke kodunu yorumlar. Oyun içinde hediye kartı ve hediye kaynaklı hız avantajı yoktur. Ana oyun gerçek hediye geldiğinde yaklaşık üç saniye destekçinin adını gösterir. 10 dakikalık destekçi tablosu varsayılan olarak kapalıdır; istenirse `supporters.html?leaderboard=1` adresiyle açılır. Tabloda yalnızca TikTok olayında açıkça bildirilen diamond değeri kullanılır; para veya coin geliri sayılmaz.

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

LIVE görünümü sadeleştirildi: dört ülke ve ücretsiz yorum satırı görünür. Kamera her yarışta en fazla üç kez otomatik açı değiştirir.
