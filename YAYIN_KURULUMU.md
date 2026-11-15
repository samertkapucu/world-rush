# WORLD RUSH v10 — Yayına hazır kurulum (Türkçe)

**Oyunun 9:16 kaynağı:** `http://localhost:8000/live.html`

Bu URL, `index.html?stream=1` adresini açar. Gerçek 1080×1920 dikey yayında pist ve HUD o boyuta yeniden render edilir; Chrome adres çubuğunu veya geniş masaüstünü kırpmak gerekmez.

## Tek seferlik TikTok LIVE Studio kurulumu

1. WORLD RUSH klasöründen **WORLD_RUSH_YAYIN_HAZIRLA.cmd** dosyasını aç. Sunucu yoksa başlatılır ve LIVE URL panoya kopyalanır. Mevcut Python sunucusu çalışıyorsa yenisi açılmaz.
2. TikTok LIVE Studio → Kaynak ekle → **Bağlantı / Link / Web sayfası** (sürümüne göre adı değişebilir). **Ctrl+V** ile `http://localhost:8000/live.html` gir.
3. **Özel çözünürlük / Custom resolution: genişlik 1080, yükseklik 1920** seç. Kaynağı dikey yayın sahnesine **Sığdır / Fit**. Masaüstü/Chrome penceresi yakalama kaynağını kaldır.
4. Sahneni TikTok LIVE Studio içinde **kaydet**. Artık her yayın için kırpma gerekmemeli. `http://localhost:8000` sunucusu açık kalmalı.
5. Mobil önizleme ile üst profil/hedef ve alt yorum alanını kontrol et. Ses izni/kaynak sesini de ayrıca test et. Tarayıcı kaynakları otomatik sesi engelleyebilir.

**LINK kaynağı yoksa:** `START_WORLD_RUSH_PORTRAIT.cmd` dosyasını aç. Bu, Chrome'u sekmesiz/adres çubuksuz dikey oyun penceresi olarak açar. LIVE Studio'da **Pencere yakalama** ile yalnızca o pencereyi seç; kırpmayı bir kez kaydedip aynı sahneyi tekrar kullan.

## iPhone Mobile Gaming ile TikTok LIVE — 192.168.1.187

**LIVE Studio erişimi olmadan telefon ekranını yayınlamak için:**

1. PC'de WORLD RUSH sunucusu (`python -m http.server 8000`) açık kalmalı; iPhone Safari'de `http://192.168.1.187:8000/index.html` açılır.
2. PC'de GitHub'daki son sürümü çek ve **START_TIKTOK_BRIDGE.cmd** dosyasını aç. TikTok kullanıcı adı `worldrush.live` için Enter'a bas. Bu sürüm, TikTok yorum ve hediye olaylarını **yalnızca PC'nin 192.168.1.187 özel Wi-Fi IP adresinde** de dinler.
3. Windows Güvenlik Duvarı izin isterse yalnızca **Özel ağlar (Private)** seç. Genel ağlara (Public) açma, port yönlendirme (port forwarding) yapma.
4. TikTok'ta iPhone → LIVE → Mobile Gaming → Go LIVE, ardından Safari'deki WORLD RUSH ekranına dön.
5. **Bağlantı testi:** iPhone'da önce `http://192.168.1.187:8000/index.html?debug=1` aç. LIVE başlamadan `BRIDGE ON · WAITING FOR TIKTOK`, LIVE başladıktan sonra `TIKTOK CONNECTED · TEST EVENTS` görünmesi beklenir. Yayına geçerken `?debug=1` parametresini kaldır; debug yazısı izleyicilere görünmesin.
6. İkinci bir TikTok hesabından, ekrandaki geçerli ülke kodlarından birini (ör. `SA`, `AE`, `KW`, `QA`) yorumla. Takım sayacının arttığını doğrula. Sonra yalnızca istenirse küçük bir gerçek hediye ile dene.
7. Bağlantı yoksa: PC ve iPhone aynı Wi-Fi'de mi, PC'nin IPv4'ü hâlâ `192.168.1.187` mi, Windows Güvenlik Duvarı Python'un özel ağ erişimine izin veriyor mu kontrol et. iPhone'da oyunu yeniden yükle. TikTok'ta LIVE Gifts özelliğinin hesabında açık ve uygun olması da gereklidir.

**Kritik:** Bu bağlantı yalnızca aynı özel yerel ağda çalışır; başka bir Wi-Fi veya mobil veri üzerinden çalışmaz. TikTokLive üçüncü taraf bir kütüphanedir; olayların gelmesi garanti değildir. Gerçek hediyelerin oyuna ulaştığını test etmeden sistemin canlıda hazır olduğunu varsayma. LIVE Gifts kapalıysa veya hesap uygun değilse izleyiciler hediye gönderemeyebilir.

## Gerçek yorum / hediyeler

1. TikTok hesabının **LIVE yayın izni** açık olmalı; yalnızca LIVE Studio önizlemesini görmek yeterli değil.
2. `START_TIKTOK_BRIDGE.cmd` dosyasını çalıştır. Yayın yapan TikTok hesabının kullanıcı adını (başında @ olmadan) gir. Bu köprü üçüncü taraf TikTokLive kütüphanesine dayanır; TikTok'un resmi, onaylı entegrasyonu değildir.
3. LIVE başladıktan sonra ikinci bir hesapla `SA` / `AE` / `KW` / `QA` (mevcut ligde gösterilen kodlar) yorumlarından birini yaz. Bu yorum takım seçer. Ardından en ucuz hediye gibi **isteğe bağlı** küçük bir hediye ile gerçek olayın oyuna ulaştığını denetle. İzleyici hediye almaya zorlanmamalı.
4. Normal oyun sayfasında `P` ile yönetici panelini aç: **LOCAL BRIDGE: ON** ve **TIKTOK: LIVE** ayrı ayrı görünmeli; ikisi de doğrulanmadan gerçek hediye testinin başarılı olduğu söylenemez. Yönetici paneli LIVE kaynak modunda görünmez.

> LIVE Studio'da "**Erişim yok**" uyarısı görünüyorsa hesap uygunluğunu ve yayın iznini kontrol et. Yeni hesapta LIVE erişimi yoksa oyun hazırlanabilir, ama gerçek yayın ve hediye geliri başlatılamaz. Yaş, bölgesel takipçi koşulları ve LIVE Gifts uygunluğu TikTok tarafından belirlenir.

## WORLD RUSH gift → speed kuralları

Aşağıdaki **örnek hediye adları, gözlenen kataloglardan alınmıştır; bölgeye/zamana göre değişebilir**. Oyunumuz gerçek olayın **metadata puanına** bakarak sınıflandırır; listelenen Coin örneklerinin güncel fiyat veya gerçek kazanç garantisi yoktur.

| Örnek hediye | Örnek katalog değeri | Oyun etkisi |
| --- | ---: | --- |
| Rose | 1 | Spark — 0,65 sn boost |
| Finger Heart | 5 | Spark — 0,65 sn boost |
| Doughnut | 30 | Pulse — 1,2 sn boost |
| Money Gun | 500 | Turbo — 2,25 sn boost |
| Galaxy | 1.000 | Super Turbo — 4 sn boost |
| Sports Car | 7.000 | Super Turbo — 4 sn + yaklaşık 2,2 sn sinematik yakınlaşma |
| Lion | 29.999 | Legend — 6,5 sn boost + yaklaşık 3,3 sn kutlama |
| TikTok Universe | 44.999 | Legend — 6,5 sn boost + yaklaşık 3,3 sn kutlama |

Yarış içi boost toplamı **en fazla 10 sn**. Son sıradaki takım liderden en az 12m gerideyse mevcut **×1,25** comeback avantajı uygulanır. Hiçbir hediye yarışı tek başına anında bitirmez. Yarış esnasında gelen farklı hediyeler, yalnızca tanımlı limitler dahilinde etki verir.

Gerçek hediye kataloğunu LIVE Gift ekranından kontrol et. Oyunda normal sayfada `P` tuşuna basarak **LAST GIFT** satırından hangi isim ve kaç metadata puanı geldiğini görebilirsin. `TEST ROSE`, `TEST GALAXY`, `TEST SPORTS CAR`, `TEST LION` düğmeleri ücretli değildir ve gerçek destek sayılmaz.

## Önemli teknik sınırlar

- **Kamera/bayraklar/gift efektleri** oyun kodunda uygulanmıştır; TikTok LIVE Studio'da 1080×1920 kaynak ve gerçek TikTok hesabı ile uçtan uca test gereklidir.
- TikTok gift metadata `diamond_count` alanı, her zaman kullanıcının ödediği Coin sayısının aynısı değildir. Oyun bunları sadece *metadata puanı* diye adlandırır; USD, TL veya doğrulanmış gelir göstermez.
- Yerel WebSocket `127.0.0.1:8765` yalnızca aynı bilgisayarda açılan localhost sayfasına hizmet eder. Başka sunucuya veya internete açılmamalı.
- LIVE Studio Link kaynağının sesini tarayıcı otomatik oynatma politikası engelleyebilir. Ses çıkışını mobil önizlemede test et; gerekirse temiz Chrome uygulama penceresini kullan ve `M` ile sesi etkinleştir.
- TikTok'un resmi etkileşimli oyun iş ortaklığı başvurusu: https://cp-game.tiktok.com/interactive-game-registration
