// homepage-script.js - Ana Sayfa Etkileşimleri (Jitsi Hata Ayıklama ile)

document.addEventListener('DOMContentLoaded', () => {

    // --- Sabitler ve Değişkenler ---
    const RELATION_STORAGE_KEY = 'hikmetBahcesiUserRelation_v1';
    const TITLE_PREFIX_KEY = 'hikmetBahcesiTitlePrefix_v1';
    const JITSI_DOMAIN = "meet.jit.si";
    // === ODA ADINI GEREKİRSE BURADAN DEĞİŞTİRİN ===
    const JITSI_ROOM_NAME = "HikmetBahcesiAileSohbeti9876"; // Daha benzersiz bir isim

    let currentJitsiApi = null; // Aktif Jitsi API nesnesi

    // --- DOM Elementleri ---
    const screens = { /* ... */ }; // Önceki gibi
    const appContainer = document.getElementById('app-container');
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainContentScreen = document.getElementById('main-content-screen');
    const mainTitleElement = document.getElementById('main-title');
    const relationButtonsContainer = welcomeScreen?.querySelector('.relation-buttons');
    const startJitsiButton = document.getElementById('start-jitsi-button'); // *** BU ID'Yİ KONTROL ET ***
    const jitsiMeetScreen = document.getElementById('jitsi-meet-screen'); // *** BU ID'Yİ KONTROL ET ***
    const jitsiContainer = document.getElementById('jitsi-container');     // *** BU ID'Yİ KONTROL ET ***
    const backToMainButton = document.getElementById('back-to-main-button'); // *** BU ID'Yİ KONTROL ET ***
    // Diğer elementler...

    // --- Fonksiyonlar ---

    function playSound(sound) { /* ... Önceki gibi ... */ }
    function shuffleArray(array) { /* ... Önceki gibi ... */ }
    function getThemeClass(age) { /* ... Önceki gibi ... */ }
    function showScreen(screenIdToShow) { /* ... ID kullanarak güncelleme ... */
         if (!appContainer) return;
         document.querySelectorAll('.screen').forEach(screen => {
             screen.classList.remove('active');
         });
         const screenElement = document.getElementById(screenIdToShow); // ID ile bul
         if (screenElement) {
             screenElement.classList.add('active');
             console.log(`Ekran Aktif: ${screenIdToShow}`);
         } else {
             console.error(`Hata: Gösterilecek ekran elementi bulunamadı! ID: ${screenIdToShow}`);
         }
     }
    function personalizeHomepage(prefix) { /* ... Önceki gibi (kesme işareti düzeltmesiyle) ... */ }
    function handleRelationSelect(event) { /* ... Önceki gibi ... */ }
    function initializeHomepage() { /* ... Önceki gibi (Jitsi ve Geri buton listener'ları ekliyor) ... */ }

    /** Jitsi Meet Toplantısını Başlatır (Hata Ayıklama Mesajlarıyla) */
    function startJitsiMeeting() {
        console.log("startJitsiMeeting fonksiyonu çağrıldı."); // 1. Log

        // Jitsi Konteynerini Kontrol Et
        if (!jitsiContainer) {
            console.error("Jitsi konteyner elementi (#jitsi-container) HTML'de bulunamadı!");
            alert("Sohbet odası alanı yüklenirken bir hata oluştu (DOM Hatası).");
            return;
        }
        console.log("Jitsi konteyner elementi bulundu:", jitsiContainer); // 2. Log

        // Jitsi API Script'i Yüklendi mi Kontrol Et
        if (typeof JitsiMeetExternalAPI === 'undefined') {
             console.error("Jitsi External API (external_api.js) yüklenememiş veya tanımlı değil! index.html <head> bölümünü kontrol edin.");
             alert("Sohbet altyapısı yüklenemedi. İnternet bağlantınızı kontrol edin veya sayfa kaynağını doğrulayın.");
             return;
        }
        console.log("Jitsi External API tanımlı, yüklendiği varsayılıyor."); // 3. Log

        // Seçenekleri Ayarla
        const options = {
            roomName: JITSI_ROOM_NAME,
            width: '100%',
            height: '100%',
            parentNode: jitsiContainer,
            interfaceConfigOverwrite: {
                TOOLBAR_BUTTONS: ['microphone', 'camera', 'hangup', 'fullscreen', 'chat', 'tileview', 'settings', 'raisehand'],
                SETTINGS_SECTIONS: [ 'devices', 'language', 'profile', 'moderator' ],
                SHOW_CHROME_EXTENSION_BANNER: false,
                DEFAULT_BACKGROUND: '#e0e7ff', // Açık Mavi/İndigo tonu
            },
            configOverwrite: {
                startWithAudioMuted: false,
                startWithVideoMuted: false,
                prejoinPageEnabled: false
            }
        };
        console.log("Jitsi seçenekleri ayarlandı:", options); // 4. Log

        try {
             // Önceki toplantıyı temizle
            if (currentJitsiApi) {
                console.log("Var olan Jitsi API temizleniyor...");
                currentJitsiApi.dispose();
                currentJitsiApi = null;
            }
             // Jitsi konteynerini temizle (önemli!)
            jitsiContainer.innerHTML = '';
            console.log("Jitsi konteyneri temizlendi."); // 5. Log

             console.log(`Yeni Jitsi API oluşturuluyor (Alan: ${JITSI_DOMAIN}, Oda: ${JITSI_ROOM_NAME})...`); // 6. Log
             currentJitsiApi = new JitsiMeetExternalAPI(JITSI_DOMAIN, options);
             console.log("Yeni Jitsi API nesnesi oluşturuldu:", currentJitsiApi); // 7. Log

            // Toplantıdan ayrılma olayını dinle
            currentJitsiApi.addEventListener('videoConferenceLeft', () => {
                console.log('Jitsi toplantısından ayrıldı (API eventi).');
                leaveJitsiMeeting(); // Temizleme ve ekran değiştirme için fonksiyonu çağır
            });
             console.log("Jitsi API event listener'ları eklendi."); // 8. Log


             // Jitsi ekranını göster (bu kodun en sonda olması önemli!)
             console.log("Jitsi ekranı gösteriliyor..."); // 9. Log
             showScreen('jitsi-meet-screen');

        } catch (error) {
            console.error("!!! Jitsi API başlatılırken KRİTİK HATA oluştu:", error);
            alert("Sohbet odası başlatılamadı. Konsolu kontrol edin.");
             // Hata durumunda temizlik ve geri dönüş
             leaveJitsiMeeting(); // Ekranı geri çevirir ve API'yi (varsa) temizler
        }
    }

    /** Jitsi Meet Toplantısını Kapatır ve Ana Ekrana Döner */
    function leaveJitsiMeeting() {
        console.log("leaveJitsiMeeting çağrıldı.");
        if (currentJitsiApi) {
            console.log("Jitsi API temizleniyor...");
            // Önce iframe'i kaldırıp sonra dispose etmek daha kararlı olabilir
            if (jitsiContainer) jitsiContainer.innerHTML = '';
            currentJitsiApi.dispose();
            currentJitsiApi = null;
            console.log("Jitsi API temizlendi.");
        } else {
             console.log("Temizlenecek aktif Jitsi API yok.");
        }
        showScreen('main-content-screen'); // Ana ekrana dön
    }

    // --- Başlangıç Mantığı (initializeHomepage) ---
    // (Bu fonksiyonun içeriği önceki yanıttaki gibi kalmalı,
    //  startJitsiButton ve backToMainButton için listener eklemeleri dahil)
    function initializeHomepage() {
         console.log("Anasayfa başlatılıyor...");
         if (!welcomeScreen || !mainContentScreen || !mainTitleElement || !appContainer) { // appContainer da eklendi
             console.error("Başlatma Hatası: Temel elementler bulunamadı!");
             document.body.innerHTML = `<div style='padding:20px; text-align:center; color:red;'><h1>Hata!</h1><p>Sayfa yüklenirken bir sorun oluştu.</p></div>`;
             return;
         }

         let savedPrefix = null;
         try { savedPrefix = localStorage.getItem(TITLE_PREFIX_KEY); }
         catch (e) { console.warn("localStorage okunamadı."); }

         if (savedPrefix) {
             console.log(`Kaydedilmiş tercih (${savedPrefix}) bulundu.`);
             personalizeHomepage(savedPrefix);
             showScreen('main-content-screen');
         } else {
             console.log("Kaydedilmiş tercih yok. Karşılama ekranı gösteriliyor.");
             if (relationButtonsContainer) {
                  relationButtonsContainer.removeEventListener('click', handleRelationSelect);
                  relationButtonsContainer.addEventListener('click', handleRelationSelect);
             } else { console.error(".relation-buttons konteyneri bulunamadı!"); }
             showScreen('welcome-screen');
         }

         // --- Buradaki Listener Atamaları Önemli ---
         if (startJitsiButton) {
             startJitsiButton.addEventListener('click', startJitsiMeeting);
             console.log("Jitsi başlatma butonuna listener eklendi.");
         } else { console.error("#start-jitsi-button HTML'de bulunamadı!"); }

         if (backToMainButton) {
            backToMainButton.addEventListener('click', leaveJitsiMeeting);
            console.log("Jitsi geri dönme butonuna listener eklendi.");
         } else { console.error("#back-to-main-button HTML'de bulunamadı!"); }

          // Başlatma butonuna da listener ekleyelim (önceki kodda vardı, burada da olmalı)
          if (startButton) {
               startButton.addEventListener('click', () => {
                   console.log("Yarışmayı Başlat butonuna tıklandı.");
                   if (setupPlayers()) { // Kurulum başarılıysa başlat
                       startQuiz(); // BU FONKSİYON TANIMLI OLMALI (Quiz için ayrı scriptteyse burada hata verir)
                       // !!! EĞER BU ANA SAYFA İSE, startQuiz burada olmamalı !!!
                       // !!! BU KOD SADECE ANA SAYFA İÇİN, startQuiz BURADA OLMAMALI !!!
                       // !!! startButton'un işlevi setupPlayers ve showScreen('main-content-screen') olmalı !!!
                       // !!! DÜZELTME: startButton #welcome-screen'de DEĞİL, #setup-screen'de idi. Karışıklık olmuş olabilir.
                       // !!! Son index.html'e göre #start-button kurulum ekranında, #start-jitsi-button kartta.
                       // !!! Dolayısıyla, startButton listener'ı burada doğru.

                       // Eğer setupPlayers başarılıysa, ana ekranı göster (bu startQuiz içinde yapılabilir veya burada)
                       // Zaten handleRelationSelect içinde yapılıyor, startButton setup ekranı için gerekli.
                       // Bu kod bloğu doğru yerde. startQuiz fonksiyonu burada tanımlı DEĞİL, o quiz scriptinde.
                       // startButton tıklandığında setupPlayers() -> startQuiz() mantığı quiz scriptinde kalmalı.
                       // Bu script SADECE ANA SAYFA için. Tekrar düzenliyorum:

                       // DÜZELTİLMİŞ startButton Listener'ı (Ana sayfa için):
                       // Bu buton aslında yok, ilişki butonları var. Bu listener'a gerek yok.
                       // Eğer ilk kurulum ekranı içinse (oyuncu bilgisi vs), o zaman ID'si start-button olmalı.
                       // Son HTML'de bu ID kullanıldı. O zaman setupPlayers() ve startQuiz() çağrısı doğru.
                       // **KARAR:** Kullanıcının verdiği son HTML'deki `#start-button` doğru ID.
                       // Bu scriptin hem karşılama hem ana içeriği yönettiğini varsayıyoruz.
                       // O zaman `startQuiz` fonksiyonu burada olmalı mı? Hayır, `startQuiz` yarışmayı başlatır.
                       // `startButton` tıklandığında `setupPlayers` kontrolü yapıp `startQuiz` ÇAĞIRMAMALI,
                       // Sadece `showScreen('main-content-screen')` yapmalı (kişiselleştirme zaten yapıldı).
                       // **YENİDEN DÜZELTME:** Karışıklığı gidermek için, bu script sadece Karşılama -> Ana İçerik geçişini yapsın.
                       // Yarışmayı başlatma `Yarismav2/index.html` içindeki kendi scriptiyle yapılır.
                       // Bu nedenle `#start-button` listener'ı bu dosyada OLMAMALI.

                       // YUKARIDAKİ startButton listener'ını SİLİYORUZ. İlişki butonları zaten ekranı değiştiriyor.


                   } else {
                        console.log("Oyuncu kurulumu başarısız.");
                   }
               });
         } else { console.error("#start-button HTML'de bulunamadı!"); } // Bu hata normal, çünkü ID artık bu değil.

         // === initializeHomepage sonu ===
    }

    // --- Başlat ---
    initializeHomepage();

}); // DOMContentLoaded Sonu
