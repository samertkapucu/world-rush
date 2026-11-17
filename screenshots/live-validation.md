# Archived pre-V2 validation

The gift boost screenshots and claims below describe the backed-up version at `a3ea5a3`. For current behavior see [V2_RELEASE.md](../V2_RELEASE.md).

# LIVE kaynak doğrulaması

18 Kasım 2026 tarihinde Chromium ve gerçek WebGL çizimiyle kontrol edildi. Test ortamında yazılımsal GPU kullanıldı.

| Kontrol | Sonuç |
| --- | --- |
| 1080×1920, 540×960 ve 1080×1080 | Her boyutta 11 görüntü kontrolü geçti |
| Başlangıç ve ilerleyen yarış | Dört araç, bayraklar ve skor satırları görünür |
| Üç kamera modu | Araç sınırları tanımlanan güvenli alan içinde |
| Lion kartı | Simüle WebSocket hediyesi doğru takıma boost verdi |
| Tekrarlanan hediye kimliği | Puan ikinci kez eklenmedi |
| Takım seçmemiş izleyicinin hediyesi | Rastgele takıma atanmadı |
| Dört eşzamanlı hediye | Dört araçta ayrı destekçi ve turbo etiketi |
| Son 50 metre | FINAL SPRINT ve kalan mesafe gösterildi |
| Finiş ve lig | Kazanan kartı, 3/2/1 puan ve sonraki yarış sayacı doğrulandı |
| Yeni tur | Sonuç ekranındaki hediye, doğru destekçi adıyla sonraki yarışa aktarıldı |
| 540×960 → 1080×1080 → 1080×1920 → 540×960 | Aynı açık kaynakta yeniden boyutlandırma geçti |
| Ses motoru | Otomatik oynatma izni verilen tarayıcıda AudioContext running |
| JavaScript | Testlerde sayfa hatası oluşmadı |

Görüntüler doğrudan tarayıcı ekran görüntüleridir. Çizim tamponu boyutu kaynak çözünürlüğüyle aynı ölçüldü. HUD ve araç kutuları mantıksal 540×960 koordinatlara dönüştürülüp sınır denetiminden geçirildi. Test edilen kamera ve yarış durumlarında araç genişlikleri yaklaşık 32–87 mantıksal piksel arasındaydı.

Test hızlandırılmış oyun adımlarıyla gerçek oyun mantığını çalıştırır. Ara karelerde GPU çizimi atlanır, kontrol karelerinde gerçek WebGL çıktısı kaydedilir. WebSocket olayları test tarafından üretilir.

## Görüntüler

- [1080×1920 başlangıç](live-start-1080x1920.jpg)
- [1080×1920 yarış](world-rush-1080x1920.jpg)
- [1080×1920 simüle hediye](live-gift-1080x1920.jpg)
- [1080×1920 dört turbo](live-four-boosts-1080x1920.jpg)
- [1080×1920 son sprint](live-sprint-1080x1920.jpg)
- [1080×1920 kazanan](live-winner-1080x1920.jpg)
- [540×960 yarış](live-540x960.jpg)
- [1080×1080 kaynak](live-square-1080x1080.jpg)

## Tekrar çalıştırma

Repo kökünde `npm ci`, `npx playwright install chromium`, `npm run test:live` ve `npm run test:live -- --resize-only` çalıştırılır. Kurulum ve Studio yerleşimi [YAYIN_KURULUMU.md](../YAYIN_KURULUMU.md) dosyasında açıklanır.

## Windows üzerinde kalan kontroller

Kullanıcının TikTok LIVE Studio sahnesine erişilmedi. Studio'nun gerçek dönüşümü, kişiye özel TikTok katmanları, gerçek yayın sesinin yakalanması ve gerçek TikTok hediye bağlantısı burada doğrulanamadı. Bu testler 60 FPS sonucunu ölçmez. Güvenli alanlar üstte 100, sağda 66, altta 300 mantıksal piksel varsayımıyla düzenlendi. Studio önizlemesiyle kontrol edilmelidir. Windows komut dosyaları Linux ortamında çalıştırılmadı.

Son görsel güncellemesinde özgün TikTok CDN resimlerinin beş kartta yüklenmesi de otomatik kontrol edildi. Neon yan süslemeleri ve büyütülmüş hediye kartlarıyla üç çözünürlükte testler tekrar çalıştırıldı.

Katılım açıklaması ve hediye kılavuzu sürekli görünür. Araç altındaki halka lideri veya aktif turboyu belirtir. Turbo etiketindeki süre son olayın gerçekten eklediği süredir; 10 saniyelik toplam sınırı uygulanır. Lig puanları mevcut lig boyunca birikir; lig değişiminde sıfırlanır. Yerel testlerin destekçi adı DEMO olarak işaretlenir.

## Hızlı tur geçişi ve arena değişimi

Sonuç ekranı 3 saniye, sonraki başlangıç 1,5 saniyedir. Üç kaynak boyutundaki test, finişten 5 saniye sonra yeni yarışın başladığını, her ülkenin şerit değiştirdiğini ve bekleyen hediyenin doğru destekçiyle taşındığını denetler. `npm run test:live -- --themes-only` dört arena geçişini 1080×1920 boyutunda kontrol eder; ülke kimlikleri ve şerit renklerinin eşleşmesi de denetlenir.

- [Sonraki yarış: yeni şeritler ve Sunset Circuit](live-next-arena-1080x1920.jpg)

## TikTok sohbetine ayrılan alan

Paylaşılan Studio önizlemesine göre kritik içeriklerin alt sınırı y=660 mantıksal piksele çekildi. Test artık tüm HUD kutuları için bu sınırı, araçlar için y=600 sınırını doğrular. Her çözünürlükte sonraki yarışa bir temsili sohbet katmanı eklenerek ekran görüntüsü alınır. Bu katman yalnızca testte bulunur; gerçek TikTok sohbetini kontrol etmez.

- [1080×1920 temsili sohbet önizlemesi](live-chat-preview-1080x1920.jpg)
