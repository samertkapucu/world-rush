# LIVE kaynak doğrulaması

18 Kasım 2026 tarihinde Chromium ve gerçek WebGL çizimiyle kontrol edildi. Test ortamında yazılımsal GPU kullanıldı.

| Kontrol | Sonuç |
| --- | --- |
| 1080×1920, 540×960 ve 1080×1080 | Her boyutta 7 görüntü kontrolü geçti |
| Başlangıç ve ilerleyen yarış | Dört araç, bayraklar ve skor satırları görünür |
| Üç kamera modu | Araç sınırları tanımlanan güvenli alan içinde |
| Lion kartı | Simüle WebSocket hediyesi doğru takıma boost verdi |
| Tekrarlanan hediye kimliği | Puan ikinci kez eklenmedi |
| Takım seçmemiş izleyicinin hediyesi | Rastgele takıma atanmadı |
| Yeni tur | Oyun otomatik olarak sonraki tura geçti |
| 540×960 → 1080×1080 → 1080×1920 → 540×960 | Aynı açık kaynakta yeniden boyutlandırma geçti |
| Ses motoru | Otomatik oynatma izni verilen tarayıcıda AudioContext running |
| JavaScript | Testlerde sayfa hatası oluşmadı |

Görüntüler doğrudan tarayıcı ekran görüntüleridir. Çizim tamponu boyutu kaynak çözünürlüğüyle aynı ölçüldü. HUD ve araç kutuları mantıksal 540×960 koordinatlara dönüştürülüp sınır denetiminden geçirildi. Test edilen kamera ve yarış durumlarında araç genişlikleri yaklaşık 67–118 mantıksal piksel arasındaydı.

Test hızlandırılmış oyun adımlarıyla gerçek oyun mantığını çalıştırır. Ara karelerde GPU çizimi atlanır, kontrol karelerinde gerçek WebGL çıktısı kaydedilir. WebSocket olayları test tarafından üretilir.

## Görüntüler

- [1080×1920 başlangıç](live-start-1080x1920.jpg)
- [1080×1920 yarış](world-rush-1080x1920.jpg)
- [1080×1920 simüle hediye](live-gift-1080x1920.jpg)
- [540×960 yarış](live-540x960.jpg)
- [1080×1080 kaynak](live-square-1080x1080.jpg)

## Tekrar çalıştırma

Repo kökünde `npm ci`, `npx playwright install chromium`, `npm run test:live` ve `npm run test:live -- --resize-only` çalıştırılır. Kurulum ve Studio yerleşimi [YAYIN_KURULUMU.md](../YAYIN_KURULUMU.md) dosyasında açıklanır.

## Windows üzerinde kalan kontroller

Kullanıcının TikTok LIVE Studio sahnesine erişilmedi. Studio'nun gerçek dönüşümü, kişiye özel TikTok katmanları, gerçek yayın sesinin yakalanması ve gerçek TikTok hediye bağlantısı burada doğrulanamadı. Bu testler 60 FPS sonucunu ölçmez. Güvenli alanlar üstte 100, sağda 66, altta 170 mantıksal piksel varsayımıyla düzenlendi. Studio önizlemesiyle kontrol edilmelidir. Windows komut dosyaları Linux ortamında çalıştırılmadı.
