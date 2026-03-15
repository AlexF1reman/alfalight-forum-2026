// Telegram WebApp initialization
let tg = null;
try {
  tg = window.Telegram.WebApp;
  if (tg) {
    tg.ready();
    tg.expand();
    console.log('✅ Telegram WebApp initialized');
  }
} catch (e) {
  console.log('ℹ️ Running outside Telegram');
}

// Data
const SCHEDULE = [
  {
    day: 1,
    date: "15 мая",
    slots: [
      { time: "09:00", end: "10:00", title: "Регистрация", isBreak: true },
      { time: "10:00", end: "10:30", title: "Открытие ALFA LIGHT FORUM", isKeynote: true, speakers: [{ name: "Елена Тятенкова", company: "Альфа-Банк" }] },
      { time: "10:30", end: "11:15", title: "Цифровая трансформация банка", speakers: [{ name: "Мария Соколова", company: "VK Cloud" }] },
      { time: "11:15", end: "11:30", title: "Кофе-брейк", isBreak: true },
      { time: "11:30", end: "12:15", title: "AI в финансовом секторе", speakers: [{ name: "Алексей Петров", company: "Яндекс" }] },
      { time: "12:15", end: "13:00", title: "Кибербезопасность 2026", speakers: [{ name: "Иван Сидоров", company: "Лаборатория Касперского" }] },
      { time: "13:00", end: "14:00", title: "Обед", isBreak: true },
      { time: "14:00", end: "14:45", title: "Мобильная разработка", speakers: [{ name: "Анна Кузнецова", company: "Тинькофф" }] },
      { time: "14:45", end: "15:30", title: "Облачные технологии", speakers: [{ name: "Дмитрий Волков", company: "SberCloud" }] },
      { time: "15:30", end: "15:45", title: "Кофе-брейк", isBreak: true },
      { time: "15:45", end: "16:30", title: "Закрытие", isKeynote: true }
    ]
  }
];

const SPEAKERS = [
  { name: "Елена Тятенкова", company: "Альфа-Банк", role: "Старший вице-президент, Руководитель департамента", topics: ["Открытие"] },
  { name: "Мария Соколова", company: "VK Cloud", role: "Технический директор", topics: ["Cloud", "AI"] },
  { name: "Алексей Петров", company: "Яндекс", role: "Руководитель AI", topics: ["AI", "ML"] },
  { name: "Иван Сидоров", company: "Лаборатория Касперского", role: "Эксперт по безопасности", topics: ["Security"] },
  { name: "Анна Кузнецова", company: "Тинькофф", role: "Lead Developer", topics: ["Mobile", "Flutter"] },
  { name: "Дмитрий Волков", company: "SberCloud", role: "Директор по развитию", topics: ["Cloud"] }
];

const FAQ = [
  { q: "Какой дресс-код?", a: "Smart Casual - деловой стиль без галстука" },
  { q: "Будут ли материалы докладов?", a: "Да, все материалы будут доступны после мероприятия" },
  { q: "Где парковка?", a: "Для гостей мероприятия доступна бесплатная парковка у входа" },
  { q: "Можно ли прийти с коллегой?", a: "Приглашения именные, передача невозможна" }
];

const TRANSPORT = [
  { icon: "🚇", title: "Метро", desc: "Технопарк, 5 мин" },
  { icon: "🚌", title: "Автобус", desc: "Остановка у центра" },
  { icon: "🚗", title: "Парковка", desc: "Бесплатно для гостей" },
  { icon: "🚕", title: "Такси", desc: "Указатель у входа" }
];

// Page switching
function switchPage(pageId, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  
  document.getElementById('page-' + pageId).classList.add('active');
  btn.classList.add('active');
  
  if (tg) tg.BackButton.show();
}

// Render schedule
function renderSchedule() {
  const dayTabs = document.getElementById('day-tabs');
  const scheduleList = document.getElementById('schedule-list');
  
  // Render day tabs
  SCHEDULE.forEach((day, i) => {
    const tab = document.createElement('button');
    tab.className = 'day-tab' + (i === 0 ? ' active' : '');
    tab.textContent = day.date;
    tab.onclick = () => {
      document.querySelectorAll('.day-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderScheduleDay(day);
    };
    dayTabs.appendChild(tab);
  });
  
  // Render first day
  renderScheduleDay(SCHEDULE[0]);
}

function renderScheduleDay(day) {
  const scheduleList = document.getElementById('schedule-list');
  scheduleList.innerHTML = '';
  
  day.slots.forEach(slot => {
    const card = document.createElement('div');
    card.className = 'event-card' + (slot.isBreak ? ' break' : '') + (slot.isKeynote ? ' keynote' : '');
    
    let tag = '';
    if (slot.isKeynote) tag = '<span class="event-tag tag-keynote">🔴 Ключевой доклад</span>';
    else if (slot.isBreak) tag = '<span class="event-tag tag-break">☕ Перерыв</span>';
    
    let speakerHtml = '';
    if (slot.speakers && slot.speakers.length > 0) {
      speakerHtml = `<div class="event-speaker">
        <div class="speaker-ava-placeholder">${slot.speakers[0].name.split(' ').map(n => n[0]).join('')}</div>
        <span class="speaker-name">${slot.speakers[0].name} · ${slot.speakers[0].company}</span>
      </div>`;
    }
    
    card.innerHTML = `
      ${tag}
      <div class="event-title">${slot.title}</div>
      ${speakerHtml}
    `;
    
    scheduleList.appendChild(card);
  });
}

// Render speakers
function renderSpeakers() {
  const grid = document.getElementById('speakers-grid');
  
  SPEAKERS.forEach(speaker => {
    const card = document.createElement('div');
    card.className = 'speaker-card';
    
    const initials = speaker.name.split(' ').map(n => n[0]).join('');
    const topics = speaker.topics.map(t => `<span class="topic-pill">${t}</span>`).join('');
    
    card.innerHTML = `
      <div class="speaker-photo">${initials}</div>
      <div class="speaker-card-name">${speaker.name}</div>
      <div class="speaker-card-role">${speaker.role}<br/>${speaker.company}</div>
      <div class="speaker-topics">${topics}</div>
    `;
    
    grid.appendChild(card);
  });
}

// Render FAQ
function renderFAQ() {
  const list = document.getElementById('faq-list');
  
  FAQ.forEach(item => {
    const faqItem = document.createElement('div');
    faqItem.className = 'faq-item';
    faqItem.innerHTML = `
      <button class="faq-q" onclick="this.parentElement.classList.toggle('open')">
        ${item.q}
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-a">
        <div class="faq-a-inner">${item.a}</div>
      </div>
    `;
    list.appendChild(faqItem);
  });
}

// Render transport
function renderTransport() {
  const grid = document.getElementById('transport-grid');
  
  TRANSPORT.forEach(item => {
    const div = document.createElement('div');
    div.className = 'transport-item';
    div.innerHTML = `
      <div class="transport-icon">${item.icon}</div>
      <div class="transport-title">${item.title}</div>
      <div class="transport-desc">${item.desc}</div>
    `;
    grid.appendChild(div);
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderSchedule();
  renderSpeakers();
  renderFAQ();
  renderTransport();
  
  // Map button
  document.getElementById('map-btn').onclick = () => {
    window.open('https://yandex.ru/maps/-/CPFmfL~S', '_blank');
  };
});
