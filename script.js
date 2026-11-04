/**
 * ✦ FENIX ✦ Celestial Bio & Portfolio Script
 * Handles: Particles Canvas, 3D Card Tilt, Category Filtering, Copy Discord & Localization
 */

// --- Translations Dictionary ---
const translations = {
  ru: {
    speech_status: "Gun hit не работает",
    hero_role: "Game Modder • Reverse Engineer • CC:Tweaked Architect • Discord Automation",
    discord_label: "DISCORD (КЛИК ДЛЯ КОПИРОВАНИЯ)",
    github_label: "GITHUB АККАУНТ",
    tg_label: "СВЯЗЬ / TELEGRAM",
    tech_title: "Арсенал технологий",
    tech_subtitle: "Инструменты реверс-инжиниринга, разработки модификаций и автоматизации",
    projects_title: "Избранные проекты",
    projects_subtitle: "Все проекты открыты и защищены строгой лицензией GNU General Public License v3",
    filter_all: "Все проекты (8)",
    filter_modding: "Игровой моддинг",
    filter_automation: "Автоматизация & Discord",
    filter_systems: "Виртуальные системы & CC",
    view_github: "Репозиторий",
    footer_license: "Все открытые проекты защищены лицензией <strong>GNU General Public License v3.0</strong>.",
    toast_copied: "Discord скопирован: username999gl!",
    p_witcher_desc: "Глубокая панель читов в главном меню игры (11 категорий): круговые 360° знаки, синхронная активация всех 12 мутаций, залповый веер бомб и метеоритный огонь.",
    p_planet_desc: "Интерактивный оверлей хоста на Unity/Harmony: полное бессмертие, спавн предметов, мгновенный разгон биомассы, тепла, давления и начисление Terra Tokens.",
    p_discord_desc: "Современный десктопный клиент для автоматизации отправки сообщений, триггера нативных Slash-команд ботов (Nekotina, Mudae), шаблонов Spintax и выбора каналов.",
    p_vencord_desc: "Комплект кастомных плагинов для Vencord: стилизатор шрифтов Animefy и текстовый макро-экспандер Smart Text с готовыми инжекторами в один клик.",
    p_cc_desc: "Масштабная экосистема для виртуальных компьютеров: оконный менеджер Hub OS, 24+ аркадные игры, видео/аудио плееры DFPWM и мониторинг хранилищ Applied Energistics 2.",
    p_pipboy_desc: "Аутентичная десктопная консоль смотрителя убежища в стиле зеленого экрана Pip-Boy 3000 со встроенным декриптором и редактором сейвов AES-256.",
    p_cuphead_desc: "Патчер деревьев событий движка Construct: разгон темпа стрельбы до лимита тиков, разблокировка скрытых фаз боссов и оптимизация для мобильных устройств.",
    p_zombie_desc: "Бинарный патч библиотеки libcocos2dcpp.so: увеличение спавна зомби на охоте с 4-6 до 40 целей одновременно и снятие внутриигровых таймеров."
  },
  en: {
    speech_status: "Gun hit is not working",
    hero_role: "Game Modder • Reverse Engineer • CC:Tweaked Architect • Discord Automation",
    discord_label: "DISCORD (CLICK TO COPY)",
    github_label: "GITHUB ACCOUNT",
    tg_label: "CONTACT / TELEGRAM",
    tech_title: "Tech Arsenal",
    tech_subtitle: "Reverse engineering toolchains, game modification frameworks & automation suites",
    projects_title: "Featured Projects",
    projects_subtitle: "All projects are open-source and protected by the GNU General Public License v3",
    filter_all: "All Projects (8)",
    filter_modding: "Game Modding",
    filter_automation: "Automation & Discord",
    filter_systems: "Virtual Systems & CC",
    view_github: "Repository",
    footer_license: "All open-source projects are protected under <strong>GNU General Public License v3.0</strong>.",
    toast_copied: "Discord copied: username999gl!",
    p_witcher_desc: "In-game native cheat menu & modifier (11 categories): 360° signs, concurrent 12 mutations, cluster bomb volleys and celestial meteor strikes.",
    p_planet_desc: "Host GUI control panel & cheats for The Planet Crafter on Unity/Harmony: god mode, item spawning, instant terraformation multipliers and Terra Tokens.",
    p_discord_desc: "Modern CustomTkinter desktop client for automated messaging, native bot Slash-commands (Nekotina, Mudae), Spintax templates and channel picker.",
    p_vencord_desc: "Custom Vencord plugins suite: Animefy aesthetic text styler and Smart Text macro expander with 1-click batch injectors.",
    p_cc_desc: "Comprehensive ecosystem for ComputerCraft:Tweaked: Hub OS window manager, 24+ arcade games, DFPWM media players and AE2 storage monitoring.",
    p_pipboy_desc: "Authentic Pip-Boy 3000 desktop console & save editor for Fallout Shelter with on-the-fly AES-256 decryption and parameter tweaking.",
    p_cuphead_desc: "Construct engine event tree patcher for Cuphead Mobile: max-tick fire rate unlock, unreleased boss phase enabling and touch optimization.",
    p_zombie_desc: "Binary patch for libcocos2dcpp.so: expanding zombie hunt spawns from 4-6 to 40 concurrent targets and removing in-game timers."
  }
};

let currentLang = localStorage.getItem("fenix_lang") || "ru";

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("fenix_lang", lang);
  document.documentElement.lang = lang;
  document.getElementById("lang-label").textContent = lang === "ru" ? "EN" : "RU";

  document.querySelectorAll("[data-i18n]").forEach(elem => {
    const key = elem.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      elem.innerHTML = translations[lang][key];
    }
  });
}

// --- Interactive Particle Stars Canvas ---
const canvas = document.getElementById("particles-canvas");
const ctx = canvas.getContext("2d");

let particles = [];
let mouse = { x: null, y: null, radius: 120 };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.6;
    this.baseSize = this.size;
    this.speedX = (Math.random() - 0.5) * 0.35;
    this.speedY = (Math.random() - 0.5) * 0.35;
    this.opacity = Math.random() * 0.7 + 0.2;
    this.goldShade = Math.random() > 0.4 ? "#ffd166" : (Math.random() > 0.5 ? "#f4a261" : "#fff5d0");
    this.pulseSpeed = Math.random() * 0.02 + 0.005;
    this.pulseAngle = Math.random() * Math.PI * 2;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;

    // Twinkle
    this.pulseAngle += this.pulseSpeed;
    this.opacity = 0.3 + 0.4 * Math.sin(this.pulseAngle);

    // Mouse reaction
    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x -= (dx / dist) * force * 2;
        this.y -= (dy / dist) * force * 2;
        this.size = this.baseSize * 1.5;
      } else {
        this.size = this.baseSize;
      }
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0.1, this.opacity);
    ctx.fillStyle = this.goldShade;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.goldShade;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(100, Math.floor((canvas.width * canvas.height) / 12000));
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}

// --- 3D Card Tilt Effect ---
function initCardTilt() {
  const cards = document.querySelectorAll(".project-card");
  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
  });
}

// --- Category Filtering ---
function initFiltering() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      cards.forEach(card => {
        const cat = card.getAttribute("data-category");
        if (filter === "all" || cat === filter) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
}

// --- Copy Discord & Toast ---
function showToast(msg) {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-msg");
  toastMsg.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function initCopyDiscord() {
  const copyBtn = document.getElementById("copy-discord");
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText("username999gl").then(() => {
      const msg = translations[currentLang].toast_copied || "Discord скопирован: username999gl!";
      showToast(msg);
    }).catch(() => {
      showToast("username999gl");
    });
  });
}

// --- Init Everything ---
document.addEventListener("DOMContentLoaded", () => {
  setLanguage(currentLang);
  document.getElementById("lang-toggle").addEventListener("click", () => {
    setLanguage(currentLang === "ru" ? "en" : "ru");
  });

  resizeCanvas();
  animateParticles();
  initCardTilt();
  initFiltering();
  initCopyDiscord();
});
