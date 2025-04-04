// homepage-script.js - Ana Sayfa Etkileşimleri

document.addEventListener('DOMContentLoaded', () => {

    // --- Sabitler ve Değişkenler ---
    const RELATION_STORAGE_KEY = 'hikmetBahcesiUserRelation'; // Tarayıcı hafızası için anahtar
    const TITLE_PREFIX_KEY = 'hikmetBahcesiTitlePrefix'; // Başlık öneki için anahtar

    // --- DOM Elementleri ---
    // Gerekli elementlerin varlığını kontrol ederek alalım
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainContentScreen = document.getElementById('main-content-screen');
    const mainTitleElement = document.getElementById('main-title');
    const relationButtonsContainer = welcomeScreen?.querySelector('.relation-buttons'); // Welcome screen içindeki butonları içeren div

    // --- Fonksiyonlar ---

    /**
     * Belirtilen ID'ye sahip ekranı gösterir, diğerlerini gizler.
     * @param {string} screenId Gösterilecek ekranın ID'si ('welcome-screen' veya 'main-content-screen')
     */
    function showScreen(screenId) {
        console.log(`showScreen çağrıldı: ${screenId}`);
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.toggle('active', screen.id === screenId);
        });
    }

    /**
     * Ana sayfa başlığını ve sayfa başlığını kişiselleştirir.
     * @param {string} prefix Başlıkta kullanılacak önek (örn: "Amcan", "Dayın")
     */
    function personalizeHomepage(prefix) {
        // Geçerli bir prefix olduğundan emin olalım
        const displayPrefix = prefix || "Ramazan"; // Eğer prefix yoksa varsayılan kullan

        if (mainTitleElement) {
            mainTitleElement.textContent = `${displayPrefix} Ramazan'ın Hikmet Bahçesi`;
        }
        // Sayfa başlığını da (tarayıcı sekmesinde görünen) güncelleyelim
        document.title = `${displayPrefix}'ın Köşesi`;

        console.log(`Anasayfa kişiselleştirildi. Yeni başlık: ${mainTitleElement?.textContent}`);
    }

    /**
     * İlişki butonu tıklama olayını yönetir.
     * @param {Event} event Tıklama olayı nesnesi
     */
    function handleRelationSelect(event) {
        // Tıklanan elementin bir buton olup olmadığını ve class'ını kontrol et
        const button = event.target.closest('.relation-button');
        if (!button) return; // Buton değilse veya bulunamazsa çık

        const relation = button.dataset.relation;
        const prefix = button.dataset.titlePrefix;

        // Butonda gerekli data-* nitelikleri var mı kontrol et
        if (relation && prefix) {
            console.log(`İlişki seçildi: ${relation}, Prefix: ${prefix}`);
            try {
                // Seçimi tarayıcı hafızasına kaydet (sayfa yenilense bile hatırlar)
                localStorage.setItem(RELATION_STORAGE_KEY, relation);
                localStorage.setItem(TITLE_PREFIX_KEY, prefix);
                console.log("Seçim localStorage'a kaydedildi.");

                // Arayüzü güncelle ve ana içeriği göster
                personalizeHomepage(prefix);
                showScreen('main-content-screen'); // Ana içerik ekranını göster

            } catch (e) {
                // localStorage kullanılamıyorsa (örn: gizli mod, tarayıcı ayarları)
                console.error("localStorage kullanılırken hata:", e);
                alert("Tercihiniz kaydedilemedi ancak siteye devam edebilirsiniz.");
                // Sadece bu oturum için kişiselleştir ve devam et
                personalizeHomepage(prefix);
                showScreen('main-content-screen');
            }
        } else {
            console.warn("Tıklanan butonda 'data-relation' veya 'data-title-prefix' niteliği eksik:", button);
        }
    }

    // --- Başlangıç Mantığı ---
    function initializeHomepage() {
        console.log("Anasayfa başlatılıyor...");
        // Gerekli ana elementler var mı kontrol et
        if (!welcomeScreen || !mainContentScreen || !mainTitleElement) {
             console.error("Başlatma Hatası: Gerekli ekran elementleri (#welcome-screen, #main-content-screen) veya başlık elementi (#main-title) bulunamadı!");
             // Kullanıcıya hata gösterilebilir
             document.body.innerHTML = `<div style="padding:20px; text-align:center; color:red;"><h1>Hata!</h1><p>Sayfa yüklenirken bir sorun oluştu.</p></div>`;
             return;
        }

        let savedPrefix = null;
        try {
            // Kaydedilmiş bir tercih var mı kontrol et
            savedPrefix = localStorage.getItem(TITLE_PREFIX_KEY);
        } catch (e) {
            console.warn("localStorage okunamadı.");
        }

        if (savedPrefix) {
            // Kayıtlı tercih varsa: Direkt ana ekranı kişiselleştirilmiş göster
            console.log(`Kaydedilmiş tercih (${savedPrefix}) bulundu. Ana ekran gösteriliyor.`);
            personalizeHomepage(savedPrefix);
            showScreen('main-content-screen');
        } else {
            // Kayıtlı tercih yoksa: Karşılama ekranını göster ve butonlara listener ekle
            console.log("Kaydedilmiş tercih yok. Karşılama ekranı gösteriliyor.");
            if (relationButtonsContainer) {
                // Daha önce listener eklenmediğinden emin olmak için (gerçi DOMContentLoaded içinde bir kez çalışır)
                relationButtonsContainer.removeEventListener('click', handleRelationSelect); // Öncekini kaldır (güvenlik için)
                relationButtonsContainer.addEventListener('click', handleRelationSelect); // Yenisini ekle
            } else {
                console.error(".relation-buttons konteyneri bulunamadı!");
            }
            showScreen('welcome-screen'); // Karşılama ekranını göster
        }
    }

    // --- Başlat ---
    initializeHomepage();

}); // DOMContentLoaded Sonu
