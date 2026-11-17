# WORLD RUSH v10 — Yayına hazır kurulum (Türkçe)

**Oyunun 9:16 kaynağı:** `http://localhost:8000/live.html`

Bu adres, oyunu `index.html?stream=1` üzerinden tek bir tam ekran çerçevede çalıştırır. Adres `live.html` olarak kalır. WebGL ve HUD kaynak boyutuna göre yeniden boyutlanır. 1080×1920 ve 540×960 boyutlarında oyun tüm alanı doldurur. Kare veya yatay kaynakta pist tüm alanı kaplar, skor ve araçlar ortadaki 9:16 alanında kalır. Yayın için kaynak çözünürlüğü yine 1080×1920 olmalıdır.

Yayın yerleşimi 540×960 mantıksal ölçü kullanır. Önemli içerik soldan 22, sağdan 66, üstten 100 ve alttan 170 piksel içeride tutulur. 1080×1920 kaynakta bunlar iki katına çıkar. TikTok'un hedef ve sohbet katmanları hesap/Studio düzenine göre değişebilir. Kendi mobil önizlemende bu alanları kontrol et.

## Tek seferlik TikTok LIVE Studio kurulumu

1. Güncellemeyi, çalışan Python sunucusunun hizmet verdiği WORLD RUSH klasöründe `GUNCELLE.cmd` ile al. Yeni güncelleyici değiştirilen dosyaları tarih-saat ekli `.old` kopyalarında saklar. Oyunu başka bir klasöre indirmek açık sunucuyu güncellemez.
2. Aynı klasörden `WORLD_RUSH_YAYIN_HAZIRLA.cmd` dosyasını çalıştır. Kaynak adresi `http://localhost:8000/live.html`.
3. LIVE Studio'da dikey sahnenin çözünürlüğünü **1080×1920**, Bağlantı kaynağının özel çözünürlüğünü **1080 genişlik × 1920 yükseklik** yap. Kaynağı yenile.
4. Kaynağı seç. Önceden elle yapılan kırpmayı sıfırla ve dönüşümü sıfırla. Ardından **Sığdır / Fit** uygula ve ortala. Boyut/konum alanları varsa **1080×1920**, **X=0, Y=0**, kırpma kenarları **0** olmalı. Studio sürümünde komut adları değişebilir. Sahneyi kaydet.
5. Kaynak boyutu doğruyken sahnede boşluk kalıyorsa Studio'nun kaynak dönüşümünü kontrol et. HTML, Studio'daki kaynak konumunu veya kırpma değerlerini değiştiremez. Yenilenmiş kaynağı 1080×1920 sahneye sığdırmak tek ölçek oranı kullanır.
6. Kaynak sesini etkinleştir. Otomatik ses engellenirse kaynağın etkileşim görünümünde pistin içine tıkla, ardından **M** tuşuna bas. Gerekirse aynı `live.html` adresini Chrome'da açıp pistin içine tıkladıktan sonra M ile ses motorunu dene. Chrome ve Studio'nun ses izinleri ayrı olabilir.
7. Studio ses göstergesini ve ikinci cihazdaki yayın sesini kontrol et. Gerçek hediye/yorum doğrulaması için `START_TIKTOK_BRIDGE.cmd` ayrıca çalışmalı. Yerel test düğmeleri gerçek TikTok olaylarını doğrulamaz.

## Tekrarlanabilir görüntü testi

Node.js kurulu bir geliştirme bilgisayarında repo klasöründe çalıştır:

```sh
npm ci
npx playwright install chromium
npm run test:live
npm run test:live -- --resize-only
```

Test kendi yerel HTTP sunucusunu açar. 1080×1920, 540×960 ve 1080×1080 kaynaklarda başlangıcı, yarışın ilerleyen bölümünü, Lion efektini, üç kamera modunu ve sonraki turu çalıştırır. Dört aracın ve HUD'un görünür sınırlarını ölçer. Görüntüler ve ölçümler `work/live-check/` içine yazılır. Yerel WebSocket olayları simüle edilir. Test hızlandırılmış oyun adımları ve gerçek WebGL ekran görüntüleri kullanır, FPS ölçümü yapmaz.

Sistem Chromium'u kullanmak için `WORLD_RUSH_CHROMIUM` ortam değişkenine çalıştırılabilir dosya yolunu ver. Kaynaklar Three.js CDN'inden yüklenir. Otomasyonun Web Audio durumunu kontrol etmesi, Studio'nun sesi yakaladığını veya gerçek TikTok hediyelerinin ulaştığını doğrulamaz.

## iPhone Mobile Gaming ile TikTok LIVE — 192.168.1.187

**LIVE Studio erişimi olmadan telefon ekranını yayınlamak için:**

1. PC'de WORLD RUSH sunucusu (`python -m http.server 8000`) açık kalmalı; iPhone Safari'de `http://192.168.1.187:8000/index.html` açılır.
2. PC'de GitHub'daki son sürümü çek ve **START_TIKTOK_BRIDGE.cmd** dosyasını aç. Mevcut TikTok kullanıcı adını gir. Bu sürüm, TikTok yorum ve hediye olaylarını **yalnızca PC'nin 192.168.1.187 özel Wi-Fi IP adresinde** de dinler.
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

## Mobil ses ve TikTok hediye görselleri

- iPhone Safari'de WORLD RUSH açıldığında oyun üzerinde **🔊 SESİ AÇ / TAP FOR SOUND** düğmesine **bir kez dokun**. Ses başlamasının ardından düğme gizlenir. Sesin duyulup duyulmadığını kısa onay tonuyla kontrol et. iPhone'un medya sesini de aç.
- TikTok Mobile Gaming'den Safari'ye dönerken iOS Web Audio'yu askıya alabilir. Ses kesilirse Safari'deki ses düğmesine yeniden dokun. Ekran paylaşımında oyun sesinin izleyicilere de gittiğini ikinci hesaptan mutlaka dinleyerek doğrula; iOS/TikTok yakalama davranışı değişebilir.
- Hediye kılavuzu artık **🌹 🍩 🌌 🏎️ 🦁** ikonlarıyla kısa süreli görünür; sıralama paneli yukarı taşındı. Gerçek TikTok LIVE bağlantısı kurulduğunda oyun **TikTok'un kendi hediye kataloglarından gelen görsel URL'lerini** kullanmayı dener. Katalogda görsel yoksa veya CDN erişilemiyorsa emoji görünür. Bu görseller gerçek bir hediye alınana kadar gelen hediye sayısı veya geliri temsil etmez.
- Gerçek hediye geldiğinde görsel kart ve kısa efekt çıkar; manuel **TEST** düğmeleri yalnızca simülasyondur.

## Önemli teknik sınırlar

- **Kamera/bayraklar/gift efektleri** oyun kodunda uygulanmıştır; TikTok LIVE Studio'da 1080×1920 kaynak ve gerçek TikTok hesabı ile uçtan uca test gereklidir.
- TikTok gift metadata `diamond_count` alanı, her zaman kullanıcının ödediği Coin sayısının aynısı değildir. Oyun bunları sadece *metadata puanı* diye adlandırır; USD, TL veya doğrulanmış gelir göstermez.
- Yerel WebSocket `127.0.0.1:8765` yalnızca aynı bilgisayarda açılan localhost sayfasına hizmet eder. Başka sunucuya veya internete açılmamalı.
- LIVE Studio Link kaynağının sesini tarayıcı otomatik oynatma politikası engelleyebilir. Ses çıkışını mobil önizlemede test et; gerekirse temiz Chrome uygulama penceresini kullan ve `M` ile sesi etkinleştir.
- TikTok'un resmi etkileşimli oyun iş ortaklığı başvurusu: https://cp-game.tiktok.com/interactive-game-registration

## Güncel hesap ve hediye görselleri

Ekrandaki eski @kullanıcı adı kaldırıldı. Köprü başlatılırken mevcut TikTok kullanıcı adını gir. Boş bırakıldığında eski hesaba bağlanmayı denemez.

Pist kenarlarındaki neon bariyerler, sütunlar ve dış yapılar geri açıldı. Büyük hediye kartları Rose, Doughnut, Galaxy, Sports Car ve Lion görsellerini doğrudan TikTok CDN'inden yükler. Kaynak ve 106 bölge karşılaştırması [hediye görsel raporunda](screenshots/gift-artwork-sources.md) bulunur.
