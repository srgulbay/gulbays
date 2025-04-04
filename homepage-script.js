// homepage-script.js - Ana Sayfa Etkileşimleri ve Kişiselleştirme (Kesme İşareti Düzeltmesi)

document.addEventListener('DOMContentLoaded', () => {

    // --- Sabitler ---
    const RELATION_STORAGE_KEY = 'hikmetBahcesiUserRelation_v1';
    const TITLE_PREFIX_KEY = 'hikmetBahcesiTitlePrefix_v1';

    // --- DOM Elementleri ---
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainContentScreen = document.getElementById('main-content-screen');
    const mainTitleElement = document.getElementById('main-title');
    const relationButtonsContainer = welcomeScreen?.querySelector('.relation-buttons');
    const footerTextElement = document.getElementById('footer-text'); // Footer için ID eklendi varsayılıyor

    // --- Fonksiyonlar ---

    function showScreen(screenElementToShow) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        if (screenElementToShow) {
            screenElementToShow.classList.add('active');
            console.log(`Ekran aktif edildi: ${screenElementToShow.id}`);
        } else {
            console.error("Hata: Gösterilecek ekran elementi bulunamadı!");
            const setupScreen = document.getElementById('setup-screen'); // Fallback
            if(setupScreen) setupScreen.classList.add('active');
        }
    }

    /**
     * Ana sayfa başlığını ve sayfa başlığını kişiselleştirir (Kesme işareti düzeltmesiyle).
     * @param {string | null} prefix - Başlıkta kullanılacak önek (örn: "Amcan", "Dayın", "Ramazan").
     */
    function personalizeHomepage(prefix) {
        const displayPrefix = (prefix && prefix.trim() !== '') ? prefix.trim() : "Ramazan"; // Varsayılan

        let possessiveSuffix = ""; // İyelik eki
        // Eğer önek 'n' harfi ile bitiyorsa (Amcan, Dayın) kesmesiz 'ın' ekle
        if (displayPrefix.endsWith('n')) {
             possessiveSuffix = "ın"; // Kesme işareti yok
        } else {
             // Diğer durumlarda (Ramazan gibi) kesme işaretiyle 'ın' ekle
             possessiveSuffix = "'ın";
        }

        const pageTitle = `${displayPrefix} Ramazan${possessiveSuffix} Hikmet Bahçesi`;

        if (mainTitleElement) {
            mainTitleElement.textContent = pageTitle;
        }
        document.title = `${displayPrefix}'ın Köşesi`; // Tarayıcı başlığı daha kısa olabilir

        console.log(`Anasayfa kişiselleştirildi. Yeni başlık: ${pageTitle}`);

        // Footer'ı da güncelle (Opsiyonel)
        // if (footerTextElement) {
        //     footerTextElement.textContent = `&copy; 2025 ${pageTitle} - Sevgi ve dua ile...`;
        // }
    }

    function handleRelationSelect(event) {
        const button = event.target.closest('.relation-button');
        if (!button) return;

        const relation = button.dataset.relation;
        const prefix = button.dataset.titlePrefix;

        if (relation && prefix) {
            console.log(`İlişki seçildi: ${relation}, Prefix: ${prefix}`);
            try {
                localStorage.setItem(RELATION_STORAGE_KEY, relation);
                localStorage.setItem(TITLE_PREFIX_KEY, prefix);
                console.log("Seçim localStorage'a kaydedildi.");
                personalizeHomepage(prefix);
                showScreen(mainContentScreen);
            } catch (e) {
                console.error("localStorage kullanılırken hata:", e);
                alert("Tercihiniz kaydedilemedi ancak siteye devam edebilirsiniz.");
                personalizeHomepage(prefix);
                showScreen(mainContentScreen);
            }
        } else {
            console.warn("Butonda data-* niteliği eksik:", button);
        }
    }

    function initializeHomepage() {
        console.log("Anasayfa başlatılıyor...");
        if (!welcomeScreen || !mainContentScreen || !mainTitleElement) {
            console.error("Başlatma Hatası: Gerekli ekran veya başlık elementi bulunamadı!");
             appContainer.innerHTML = `<div style='padding:30px; text-align:center; color:red;'><h1>Kritik Hata!</h1><p>Sayfa yüklenirken bir sorun oluştu.</p></div>`;
             return;
        }

        let savedPrefix = null;
        try {
            savedPrefix = localStorage.getItem(TITLE_PREFIX_KEY);
        } catch (e) {
            console.warn("localStorage okunamadı.");
        }

        if (savedPrefix) {
            console.log(`Kaydedilmiş tercih (${savedPrefix}) bulundu. Ana ekran gösteriliyor.`);
            personalizeHomepage(savedPrefix);
            showScreen(mainContentScreen);
        } else {
            console.log("Kaydedilmiş tercih yok. Karşılama ekranı gösteriliyor.");
            if (relationButtonsContainer) {
                 relationButtonsContainer.removeEventListener('click', handleRelationSelect);
                 relationButtonsContainer.addEventListener('click', handleRelationSelect);
            } else {
                 console.error(".relation-buttons konteyneri bulunamadı!");
                 if(welcomeScreen) welcomeScreen.innerHTML = `<p class='error-message'>Butonlar yüklenemedi!</p>`;
            }
            showScreen(welcomeScreen);
        }
    }

    // --- Başlat ---
    initializeHomepage();

}); // DOMContentLoaded Sonu
