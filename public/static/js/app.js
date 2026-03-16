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
  { name: "Елена Тятенкова", company: "Альфа-Банк", role: "Старший вице-президент", topics: ["Открытие"], photo: "/img/speaker1.jpg" },
  { name: "Мария Соколова", company: "VK Cloud", role: "Технический директор", topics: ["Cloud", "AI"], photo: "/img/speaker2.jpg" },
  { name: "Алексей Петров", company: "Яндекс", role: "Руководитель AI", topics: ["AI", "ML"], photo: "/img/speaker3.jpg" },
  { name: "Иван Сидоров", company: "Лаборатория Касперского", role: "Эксперт по безопасности", topics: ["Security"], photo: "/img/speaker4.jpg" },
  { name: "Анна Кузнецова", company: "Тинькофф", role: "Lead Developer", topics: ["Mobile", "Flutter"], photo: "/img/speaker5.jpg" },
  { name: "Дмитрий Волков", company: "SberCloud", role: "Директор по развитию", topics: ["Cloud"], photo: "/img/speaker6.jpg" }
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
    
    // Use photo if available, otherwise show initials
    const photoHtml = speaker.photo 
      ? `<img src="${speaker.photo}" alt="${speaker.name}" class="speaker-photo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" /><div class="speaker-photo-placeholder" style="display:none">${initials}</div>`
      : `<div class="speaker-photo-placeholder">${initials}</div>`;
    
    card.innerHTML = `
      ${photoHtml}
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

// Get current slot and next slot based on time
function getCurrentAndNextSlot() {
  const now = new Date();
  // For demo purposes, use fixed date. In production, use real date.
  // Set to May 15, 2026
  const eventDate = new Date('2026-05-15T00:00:00');
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeMinutes = currentHour * 60 + currentMinute;
  
  let currentSlot = null;
  let nextSlot = null;
  
  for (let i = 0; i < SCHEDULE[0].slots.length; i++) {
    const slot = SCHEDULE[0].slots[i];
    const [startH, startM] = slot.time.split(':').map(Number);
    const [endH, endM] = slot.end.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    
    // Demo mode: if current time is during event hours, use it
    // Otherwise show demo data based on fixed time
    const isCurrentlyActive = currentTimeMinutes >= startMinutes && currentTimeMinutes < endMinutes;
    
    // For demo, let's show slot 1 (opening) as current if before 10:00
    // or slot at current time for testing
    if (currentSlot === null && !slot.isBreak) {
      currentSlot = slot;
    } else if (currentSlot && !slot.isBreak && nextSlot === null) {
      nextSlot = slot;
      break;
    }
  }
  
  return { current: currentSlot, next: nextSlot };
}

// Render homepage - current and next talks
function renderHomepageLive() {
  const slots = getCurrentAndNextSlot();
  
  // Current talk
  const currentCard = document.querySelector('#page-home .event-card.keynote');
  if (currentCard && slots.current) {
    const titleEl = currentCard.querySelector('.event-title');
    const speakerEl = currentCard.querySelector('.speaker-name');
    const tagEl = currentCard.querySelector('.event-tag');
    
    if (titleEl) titleEl.textContent = slots.current.title;
    if (speakerEl && slots.current.speakers) {
      speakerEl.textContent = slots.current.speakers[0].name + ' · ' + slots.current.speakers[0].company;
    }
    if (tagEl) {
      tagEl.className = 'event-tag tag-keynote';
      tagEl.textContent = '🔴 Идёт сейчас';
    }
  }
  
  // Next talk
  const nextCard = document.querySelector('#page-home .event-card:not(.keynote)');
  if (nextCard && slots.next) {
    const titleEl = nextCard.querySelector('.event-title');
    const speakerEl = nextCard.querySelector('.speaker-name');
    const tagEl = nextCard.querySelector('.event-tag');
    
    if (titleEl) titleEl.textContent = slots.next.title;
    if (speakerEl && slots.next.speakers) {
      speakerEl.textContent = slots.next.speakers[0].name + ' · ' + slots.next.speakers[0].company;
    }
    if (tagEl) {
      tagEl.className = 'event-tag tag-talk';
      tagEl.textContent = 'через 45 мин';
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderSchedule();
  renderSpeakers();
  renderFAQ();
  renderTransport();
  renderHomepageLive();
  
  // Update every minute
  setInterval(renderHomepageLive, 60000);
  
  // Map button
  document.getElementById('map-btn').onclick = () => {
    window.open('https://yandex.ru/maps/-/CPFmfL~S', '_blank');
  };
});
