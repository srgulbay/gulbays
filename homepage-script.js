// homepage-script.js - Ana Sayfa Etkileşimleri ve Kişiselleştirme

document.addEventListener('DOMContentLoaded', () => {

    // --- Sabitler ---
    // Tarayıcı hafızasında saklanacak verilerin anahtarları
    const RELATION_STORAGE_KEY = 'hikmetBahcesiUserRelation_v1'; // Daha özel bir anahtar
    const TITLE_PREFIX_KEY = 'hikmetBahcesiTitlePrefix_v1';

    // --- DOM Elementleri ---
    // Gerekli elementleri seçelim, yoksa hata vermemesi için kontrol edelim
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainContentScreen = document.getElementById('main-content-screen');
    const mainTitleElement = document.getElementById('main-title');
    const relationButtonsContainer = welcomeScreen?.querySelector('.relation-buttons'); // Sadece welcomeScreen varsa içini ara

    // --- Fonksiyonlar ---

    /**
     * Belirtilen ID'ye sahip ekranı 'active' yapar, diğerlerinden 'active' sınıfını kaldırır.
     * @param {HTMLElement | null} screenElementToShow - Gösterilecek ekranın DOM elementi.
     */
    function showScreen(screenElementToShow) {
        // Önce tüm ekranlardan 'active' sınıfını kaldır
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        // Gösterilecek ekrana 'active' sınıfını ekle
        if (screenElementToShow) {
            screenElementToShow.classList.add('active');
            console.log(`Ekran aktif edildi: ${screenElementToShow.id}`);
        } else {
            console.error("Hata: Gösterilecek ekran elementi bulunamadı!");
            // Hata durumunda belki varsayılan bir ekran gösterilebilir veya hata mesajı basılabilir.
            if(document.getElementById('setup-screen')) { // Eğer varsa setup gösterilebilir
                 document.getElementById('setup-screen').classList.add('active');
            }
        }
    }

    /**
     * Ana sayfa başlığını ve sayfa başlığını (tarayıcı sekmesi) kişiselleştirir.
     * @param {string | null} prefix - Başlıkta kullanılacak önek (örn: "Amcan", "Dayın"). Yoksa varsayılan kullanılır.
     */
    function personalizeHomepage(prefix) {
        // Geçerli ve boş olmayan bir prefix olduğundan emin olalım
        const displayPrefix = (prefix && prefix.trim() !== '') ? prefix.trim() : "Ramazan"; // Varsayılan: "Ramazan"

        const pageTitle = `${displayPrefix}'ın Hikmet Bahçesi`; // Tarayıcı sekmesi için

        if (mainTitleElement) {
            // Başlık elementinin içeriğini ayarla
            mainTitleElement.textContent = pageTitle;
        }
        // Sayfa başlığını da güncelle
        document.title = pageTitle;

        console.log(`Anasayfa kişiselleştirildi. Yeni başlık: ${pageTitle}`);
        // İsteğe bağlı: Alt bilgiyi de güncelleyebiliriz
        // const footerTextElement = document.getElementById('footer-text');
        // if (footerTextElement) { footerTextElement.textContent = `&copy; 2025 ${pageTitle} - Sevgi ve dua ile...`; }
    }

    /**
     * Karşılama ekranındaki ilişki butonu tıklama olayını yönetir.
     * @param {Event} event - Tıklama olayı nesnesi.
     */
    function handleRelationSelect(event) {
        // Tıklanan elementin gerçekten istediğimiz buton olup olmadığını kontrol et
        const button = event.target.closest('.relation-button');
        if (!button) return; // Buton değilse veya bulunamazsa çık

        // Butondan verileri al (data-* nitelikleri)
        const relation = button.dataset.relation;
        const prefix = button.dataset.titlePrefix;

        // Gerekli veriler butonda tanımlı mı kontrol et
        if (relation && prefix) {
            console.log(`İlişki seçildi: ${relation}, Prefix: ${prefix}`);
            try {
                // Seçimi tarayıcı hafızasına (localStorage) kaydet
                // Bu sayede kullanıcı sayfayı yenilediğinde veya kapatıp açtığında seçim hatırlanır
                localStorage.setItem(RELATION_STORAGE_KEY, relation);
                localStorage.setItem(TITLE_PREFIX_KEY, prefix);
                console.log("Seçim tarayıcı hafızasına kaydedildi.");

                // Arayüzü güncelle ve ana içeriği göster
                personalizeHomepage(prefix);
                showScreen(mainContentScreen); // Ana içerik ekranını göster

            } catch (e) {
                // localStorage kullanılamıyorsa (örn: gizli mod, tarayıcı ayarları)
                console.error("localStorage kullanılırken hata:", e);
                alert("Tercihiniz tarayıcıya kaydedilemedi (gizli modda olabilirsiniz), ancak siteye devam edebilirsiniz.");
                // Sadece bu oturum için kişiselleştir ve devam et
                personalizeHomepage(prefix);
                showScreen(mainContentScreen);
            }
        } else {
            console.warn("Tıklanan butonda 'data-relation' veya 'data-title-prefix' niteliği eksik:", button);
        }
    }

    // --- Başlangıç Mantığı ---
    function initializeHomepage() {
        console.log("Anasayfa başlatılıyor...");
        // Ana uygulama elementleri HTML'de var mı kontrol et
        if (!welcomeScreen || !mainContentScreen || !mainTitleElement) {
            console.error("Başlatma Hatası: Gerekli ekran elementleri (#welcome-screen, #main-content-screen) veya başlık elementi (#main-title) HTML'de bulunamadı!");
            // Hata mesajını daha belirgin göster
             appContainer.innerHTML = `<div style='padding:30px; text-align:center; color:red;'><h1>Kritik Hata!</h1><p>Sayfanın temel bileşenleri yüklenemedi. HTML kodunuzu kontrol edin.</p></div>`;
             return; // Başlatmayı durdur
        }

        let savedPrefix = null;
        try {
            // Kaydedilmiş bir tercih var mı kontrol et
            savedPrefix = localStorage.getItem(TITLE_PREFIX_KEY);
        } catch (e) {
            console.warn("localStorage okunamadı (tarayıcı engeli olabilir).");
        }

        if (savedPrefix) {
            // Kayıtlı tercih varsa: Direkt ana ekranı göster
            console.log(`Kaydedilmiş tercih (${savedPrefix}) bulundu. Ana ekran gösteriliyor.`);
            personalizeHomepage(savedPrefix);
            showScreen(mainContentScreen);
        } else {
            // Kayıtlı tercih yoksa: Karşılama ekranını göster ve butonlara listener ekle
            console.log("Kaydedilmiş tercih yok. Karşılama ekranı gösteriliyor.");
            if (relationButtonsContainer) {
                 // Daha önce listener eklenmediğinden emin ol (güvenlik için)
                 relationButtonsContainer.removeEventListener('click', handleRelationSelect);
                 relationButtonsContainer.addEventListener('click', handleRelationSelect);
            } else {
                 console.error(".relation-buttons konteyneri bulunamadı!");
                 // Butonlar olmadan karşılama ekranının anlamı kalmaz, hata verilebilir
                 welcomeScreen.innerHTML = `<p class='error-message'>İlişki butonları yüklenemedi!</p>`;
            }
            // Karşılama ekranı zaten HTML'de 'active' olarak ayarlandığı için
            // showScreen(welcomeScreen) çağırmaya gerek yok, ama emin olmak için çağrılabilir.
            showScreen(welcomeScreen);
        }
    }

    // --- Başlat ---
    initializeHomepage();

}); // DOMContentLoaded Sonu
