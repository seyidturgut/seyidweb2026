import { ContentData } from './types';

const WEBSITES = [
  "https://ezanvaktipro.com/",
  "https://legalmatic.net/",
  "https://sicilmatik.com/",
  "https://www.sistemglobal.com.tr/",
  "https://qmindlab.com/",
  "https://siyahtilki.com/",
  "https://khilonfast.com/",
  "https://www.udesign.com.tr/",
  "https://octopussignage.com/",
  "https://kutuphanem.kocaeli.bel.tr/",
  "https://kbbtiyatro.netlify.app/",
  "https://kbbbilimmerkezi.netlify.app/",
  "https://engelsizyasam.kocaeli.bel.tr/"
];

const APPS = [
  { name: "Ezan Vakti Pro", url: "https://play.google.com/store/apps/details?id=com.mobilexsoft.ezanvakti&utm_source=emea_Med" },
  { name: "Ringtone Module", url: "https://play.google.com/store/apps/details?id=com.mobilexsoft.ezanvakti.ringtonemodule&utm_source=emea_Med" },
  { name: "İmsakiye 2025", url: "https://play.google.com/store/apps/details?id=com.mobilexsoft.imsakiye&utm_source=emea_Med" },
  { name: "Stickers App", url: "https://play.google.com/store/apps/details?id=com.mobilexsoft.ezanvakti.islamic.wastickerapps&utm_source=emea_Med" },
  { name: "Masjid App", url: "https://play.google.com/store/apps/details?id=com.mobilexsoft.masjid&utm_source=emea_Med" }
];

export const CONTENT: Record<string, ContentData> = {
  TR: {
    hero: {
      name: "SEYİD TURGUT",
      role: "Lead Product Designer & UI/UX Specialist",
      reportTitle: "UX/UI & Kreatif Tasarım Faaliyet Raporu",
    },
    intro: {
      welcome: "Ezan Vakti Pro & Kreatif Ekosistem Analizi",
      advisory: "Daha iyi bir deneyim için sesli ve tam ekran görüntülemeniz önerilir.",
      button: "Raporu İncele"
    },
    executive: {
      title: "1.0 Yönetici Özeti",
      body: "10 Milyondan fazla kullanıcının hayatına dokunan dijital bir ekosistem. Seyid Turgut, Google Play ve App Store'da devleşen 'Ezan Vakti Pro' Super App ekosisteminin arkasındaki tasarım mimarıdır. 14+ farklı ana ekran modu ve bütüncül tasarım sistemi ile pazar liderliğine yön vermektedir.",
      stats: [
        { label: "Toplam İndirme", value: "10M+" },
        { label: "Mağaza Puanı", value: "4.8" },
        { label: "Web Projeleri (2025)", value: "13+" },
        { label: "Mobil Modüller", value: "5+" },
      ]
    },
    portfolio: {
      title: "2.0 Proje Portföyü",
      webTitle: "2025 Web Arayüzleri",
      appTitle: "Mobil Ekosistem",
      websites: WEBSITES,
      apps: APPS
    },
    uxui: {
      title: "3.0 UX/UI Mimarisi",
      subtitle: "Çok Modlu Super App Deneyimi",
      body: "Kullanıcı alışkanlıklarını analiz ederek en akıcı yolculuğu çizmek. Milyonlarca kullanıcı için namaz vakitlerinden yapay zekaya uzanan sürtünmesiz bir mimari.",
      items: [
        { title: "Çok Modlu Dashboard", desc: "Klasik Liste, Kadran (Dairesel), Timeline ve Kart yapıları ile her kullanıcı tipine (14+ Mod) uygun özelleştirilebilir arayüz." },
        { title: "Kuran-ı Kerim (Deep UX)", desc: "Sadece okuma değil, çalışma aracı. Tecvid renklendirmesi, Odaklanma Modu (Oklu Takip) ve kişiselleştirilebilir tipografi." },
        { title: "AI Asistan & Modüller", desc: "'Asistan GPT' ile doğal sohbet, Dua Kardeşliği sosyal akışları ve Zikirmatik gibi etkileşimli modüller." }
      ]
    },
    visual: {
      title: "4.0 Görsel Tasarım Sistemi",
      subtitle: "Tutarlılık ve Marka Kimliği",
      body: "Seyid Turgut, uygulamanın sadece renklerini değil, ruhunu tasarladı. Tüm ekranlarda sürdürülen tutarlı bir görsel dil (Design System).",
      items: [
        { title: "Gelişmiş Tema Yönetimi", desc: "Göz yormayan Gece Modu, ferah Gündüz Modu ve markaya özel 'Turkuaz' & 'Gold' premium tema paketleri." },
        { title: "Özel İkonografi", desc: "Line ve Fill stillerinde, tek vuruş ağırlığına sahip, geometrik ve anında tanınabilir özel çizim ikon setleri." },
        { title: "Tipografi Hiyerarşisi", desc: "Başlık > Alt Başlık > Metin kurgusuyla bilgi akışını kolaylaştıran, okunabilirliği maksimize eden font seçimi." }
      ]
    },
    multimedia: {
      title: "5.0 Multimedya & Pazarlama",
      subtitle: "İçerik Odaklı Büyüme",
      body: "Tasarım sadece ekranda kalmadı. ASO, Video ve Sosyal Medya ile markanın sesi görsel bir şölene dönüştürüldü.",
      items: [
        { title: "ASO & Vitrin", desc: "Google Play/App Store için yüksek dönüşüm sağlayan, özellik vurgulu profesyonel screenshot ve mockup tasarımları." },
        { title: "Video Prodüksiyon", desc: "YouTube kanalı için kurgu, animasyon ve her hafta düzenli Cuma Hutbesi video süreçlerinin yönetimi." },
        { title: "Sosyal İçerik", desc: "Instagram (Hikmetname) için ayet/hadis içeren, estetik ve paylaşılabilir 'Story' ve 'Feed' kart tasarımları." }
      ]
    },
    conclusion: {
      title: "Sonuç & Handoff",
      body: "Kullanıcı empatisi ile ticari başarının kesişim noktası. Tasarımlar, yazılım ekipleri (Android/iOS) için teknik standartlarda (Responsive, Asset Export) hazırlanarak kusursuz bir geliştirme süreci sağlanmıştır.",
      items: [
        { title: "Ürün Stratejisti", desc: "Fikirden Pazara." },
        { title: "Developer Handoff", desc: "Teknik Uyum." },
        { title: "Super App", desc: "Bütüncül Vizyon." }
      ]
    },
    ui: {
      play: "Oynat",
      pause: "Durdur",
      mute: "Sessiz",
      unmute: "Sesi Aç",
      scroll: "Kaydır"
    },
    game: {
      startTitle: "Tasarım Avcısı",
      startDesc: "Logo yere düşmeden tasarım elementlerini topla! 100 puana ulaş, %10 indirimi kap.",
      mobileInstruction: "Uçmak için ekrana dokun veya butonu kullan.",
      desktopInstruction: "Uçmak için BOŞLUK (Space) tuşuna bas.",
      gameOver: "Oyun Bitti!",
      tryAgain: "Tekrar Dene",
      score: "Puan",
      winTitle: "Tebrikler! %10 İndirim Kazandınız",
      winDesc: "Tasarım elementlerini başarıyla topladınız. Aşağıdaki butona tıklayarak indiriminizi WhatsApp üzerinden talep edebilirsiniz.",
      claimBtn: "İndirimi Talep Et",
      waMessage: "Merhaba Seyid Bey, tasarım oyununda 100 puanı geçtim ve %10 İndirim kazandım! Projem hakkında görüşmek istiyorum."
    }
  },
  EN: {
    hero: {
      name: "SEYID TURGUT",
      role: "Lead Product Designer & UI/UX Specialist",
      reportTitle: "UX/UI & Creative Design Activity Report",
    },
    intro: {
      welcome: "Ezan Vakti Pro & Creative Ecosystem Analysis",
      advisory: "For the best experience, audio and full-screen viewing is recommended.",
      button: "View Report"
    },
    executive: {
      title: "1.0 Executive Summary",
      body: "A digital ecosystem touching the lives of over 10 Million users. Seyid Turgut is the design architect behind the 'Ezan Vakti Pro' Super App, a market leader on Google Play & App Store, featuring 14+ home screen modes and a holistic design system.",
      stats: [
        { label: "Total Downloads", value: "10M+" },
        { label: "Store Score", value: "4.8" },
        { label: "Web Projects (2025)", value: "13+" },
        { label: "Mobile Modules", value: "5+" },
      ]
    },
    portfolio: {
      title: "2.0 Project Portfolio",
      webTitle: "2025 Web Interfaces",
      appTitle: "Mobile Ecosystem",
      websites: WEBSITES,
      apps: APPS
    },
    uxui: {
      title: "3.0 UX/UI Architecture",
      subtitle: "Multi-Modal Super App Experience",
      body: "Analyzing user habits to chart the most fluid journey. A frictionless architecture for millions, ranging from prayer times to AI assistants.",
      items: [
        { title: "Multi-Modal Dashboard", desc: "Customizable interfaces including Classic List, Quadrant, Timeline, and Card structures (14+ Modes) for every user type." },
        { title: "Quran (Deep UX)", desc: "Not just reading, but studying. Tajweed color-coding, Focus Mode (Arrow Tracking), and customizable typography." },
        { title: "AI Assistant & Modules", desc: "Natural chat with 'Assistant GPT', social flows for Prayer Brotherhood, and interactive Dhikr modules." }
      ]
    },
    visual: {
      title: "4.0 Visual Design System",
      subtitle: "Consistency & Brand Identity",
      body: "Seyid Turgut designed not just the colors, but the soul of the app. A consistent Design System maintained across all screens.",
      items: [
        { title: "Advanced Theming", desc: "Eye-friendly Dark Mode, airy Light Mode, and premium brand-specific 'Turquoise' & 'Gold' theme packages." },
        { title: "Custom Iconography", desc: "Custom-drawn icon sets in Line and Fill styles, with single stroke weight and geometric precision." },
        { title: "Typography Hierarchy", desc: "Font selection that facilitates information flow (Heading > Sub > Body) and maximizes readability." }
      ]
    },
    multimedia: {
      title: "5.0 Multimedia & Marketing",
      subtitle: "Content-Driven Growth",
      body: "Design didn't stay on the screen. The brand's voice was transformed into a visual feast through ASO, Video, and Social Media.",
      items: [
        { title: "ASO & Showcase", desc: "High-conversion professional screenshots and mockups for Google Play/App Store highlighting key features." },
        { title: "Video Production", desc: "Editing, animation, and management of weekly Friday Sermon video processes for YouTube." },
        { title: "Social Content", desc: "Aesthetic 'Story' and 'Feed' card designs containing verses/hadiths for Instagram (Hikmetname)." }
      ]
    },
    conclusion: {
      title: "Conclusion & Handoff",
      body: "The intersection of user empathy and commercial success. Designs are prepared in technical standards (Responsive, Asset Export) for software teams (Android/iOS) ensuring a flawless development process.",
      items: [
        { title: "Product Strategist", desc: "Idea to Market." },
        { title: "Developer Handoff", desc: "Technical Fit." },
        { title: "Super App", desc: "Holistic Vision." }
      ]
    },
    ui: {
      play: "Play",
      pause: "Pause",
      mute: "Mute",
      unmute: "Unmute",
      scroll: "Scroll"
    },
    game: {
      startTitle: "Design Hunter",
      startDesc: "Collect design elements without letting the logo fall! Reach 100 points to win a 10% discount.",
      mobileInstruction: "Tap screen or button to fly.",
      desktopInstruction: "Press SPACE to fly.",
      gameOver: "Game Over!",
      tryAgain: "Try Again",
      score: "Score",
      winTitle: "Congrats! You Won 10% Discount",
      winDesc: "You successfully collected the design elements. Click below to claim your discount via WhatsApp.",
      claimBtn: "Claim Discount",
      waMessage: "Hi Seyid, I finished the interactive game on your portfolio and won a 10% Discount! I'd like to discuss my project."
    }
  }
};