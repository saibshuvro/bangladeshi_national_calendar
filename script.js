import {
  convertToBanglaDate,
  getGregorianDateOfBanglaMonthStart,
  getNextBanglaMonthStart,
  getPreviousBanglaMonthStart,
  toBanglaName
} from './utils.js';

const BANGLADESH_TIME_ZONE = 'Asia/Dhaka';
const THEME_STORAGE_KEY = 'calendar-theme';
let currentCalendarDate;
let selectedCalendarDate = null;

class DateTimeBN {
  constructor(givenDate = null) {
    this.bstDate = givenDate === null ? getDhakaToday() : normalizeDate(givenDate);
    this.banglaDate = convertToBanglaDate(this.bstDate);
  }
}

function getDhakaToday() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: BANGLADESH_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());

  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return new Date(Number(values.year), Number(values.month) - 1, Number(values.day), 12);
}

function normalizeDate(value) {
  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 12);
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    throw new TypeError('Date must use the YYYY-MM-DD format.');
  }

  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12);
}

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isSameDate(first, second) {
  return first.getFullYear() === second.getFullYear()
    && first.getMonth() === second.getMonth()
    && first.getDate() === second.getDate();
}

function toBanglaNumber(number) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(number).split('').map((digit) => banglaDigits[digit] || digit).join('');
}

function renderTodaySummary() {
  const today = new DateTimeBN();
  const isoDate = toIsoDate(today.bstDate);
  const banglaDateElement = document.getElementById('today-bangla-date');
  const gregorianDateElement = document.getElementById('today-gregorian-date');

  banglaDateElement.textContent =
    `আজ ${toBanglaNumber(today.banglaDate.day)} ${toBanglaName(today.banglaDate.month)} `
    + `${toBanglaNumber(today.banglaDate.year)} বঙ্গাব্দ`;
  banglaDateElement.dateTime = isoDate;

  gregorianDateElement.textContent = new Intl.DateTimeFormat('bn-BD', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(today.bstDate);
  gregorianDateElement.dateTime = isoDate;
}

function populateCalendarGrid(selectedDate = null) {
  const container = document.getElementById('calendar-grid');
  container.replaceChildren();

  const selected = new DateTimeBN(selectedDate);
  currentCalendarDate = selected;

  const startDate = getGregorianDateOfBanglaMonthStart(
    selected.bstDate,
    selected.banglaDate.month,
    selected.banglaDate.year
  );
  const calendarStartDate = new Date(startDate);
  calendarStartDate.setDate(startDate.getDate() - startDate.getDay());

  const visibleDates = [];
  const actualToday = getDhakaToday();
  let calendarRow;

  for (let index = 0; index < 42; index += 1) {
    if (index % 7 === 0) {
      calendarRow = document.createElement('div');
      calendarRow.className = 'calendar-row';
      calendarRow.setAttribute('role', 'row');
      container.appendChild(calendarRow);
    }

    const currentDate = new Date(calendarStartDate);
    currentDate.setDate(calendarStartDate.getDate() + index);
    visibleDates.push(currentDate);

    const banglaDate = convertToBanglaDate(currentDate);
    const cell = document.createElement('div');
    cell.className = 'calendar-cell';
    cell.setAttribute('role', 'gridcell');

    if (
      banglaDate.month !== selected.banglaDate.month
      || banglaDate.year !== selected.banglaDate.year
    ) {
      cell.classList.add('outside-month');
    }

    if (isSameDate(currentDate, actualToday)) {
      cell.classList.add('today');
      cell.setAttribute('aria-current', 'date');
    }

    if (selectedCalendarDate && isSameDate(currentDate, selectedCalendarDate)) {
      cell.classList.add('selected');
      cell.setAttribute('aria-selected', 'true');
    }

    const banglaDiv = document.createElement('div');
    banglaDiv.className = 'bangla-date';
    banglaDiv.textContent = toBanglaNumber(banglaDate.day);

    const englishDiv = document.createElement('div');
    englishDiv.className = 'english-date';
    englishDiv.textContent = currentDate.getDate() === 1 || index === 0
      ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(currentDate)
      : currentDate.getDate();

    const gregorianLabel = new Intl.DateTimeFormat('bn-BD', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(currentDate);
    cell.setAttribute(
      'aria-label',
      `${toBanglaNumber(banglaDate.day)} ${toBanglaName(banglaDate.month)} `
      + `${toBanglaNumber(banglaDate.year)} বঙ্গাব্দ, ${gregorianLabel}`
    );

    cell.append(banglaDiv, englishDiv);
    calendarRow.appendChild(cell);
  }

  document.getElementById('bangla-month-year').textContent =
    `${toBanglaName(selected.banglaDate.month)} ${toBanglaNumber(selected.banglaDate.year)}`;

  const firstVisibleDate = visibleDates[0];
  const lastVisibleDate = visibleDates.at(-1);
  const englishMonthFormatter = new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric'
  });
  document.getElementById('english-month-year').textContent =
    `${englishMonthFormatter.format(firstVisibleDate)} – `
    + englishMonthFormatter.format(lastVisibleDate);
}

const modal = document.getElementById('date-modal');
const datePicker = document.getElementById('date-picker');
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');

function setSidebar(open) {
  sidebar.classList.toggle('open', open);
  sidebar.setAttribute('aria-hidden', String(!open));
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন');
}

function setModal(open) {
  modal.classList.toggle('is-open', open);
  modal.setAttribute('aria-hidden', String(!open));

  if (open) {
    datePicker.focus();
  }
}

menuToggle.addEventListener('click', () => {
  setSidebar(!sidebar.classList.contains('open'));
});

document.getElementById('go-to-date').addEventListener('click', () => {
  setSidebar(false);
  setModal(true);
});

document.querySelector('.close').addEventListener('click', () => setModal(false));

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    setModal(false);
  }

  if (
    sidebar.classList.contains('open')
    && !sidebar.contains(event.target)
    && event.target !== menuToggle
  ) {
    setSidebar(false);
  }
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setModal(false);
    setSidebar(false);
  }
});

document.getElementById('go-btn').addEventListener('click', () => {
  if (datePicker.value) {
    selectedCalendarDate = normalizeDate(datePicker.value);
    populateCalendarGrid(selectedCalendarDate);
    setModal(false);
  }
});

document.getElementById('previous-month-btn').addEventListener('click', () => {
  populateCalendarGrid(getPreviousBanglaMonthStart(currentCalendarDate));
});

document.getElementById('next-month-btn').addEventListener('click', () => {
  populateCalendarGrid(getNextBanglaMonthStart(currentCalendarDate));
});

document.getElementById('go-to-today').addEventListener('click', () => {
  selectedCalendarDate = null;
  populateCalendarGrid();
  setSidebar(false);
});

const themeButton = document.getElementById('invert-colors-btn');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

function updateThemeState() {
  const isLight = document.documentElement.classList.contains('light-theme');
  themeButton.setAttribute('aria-pressed', String(isLight));
  themeColorMeta.content = isLight ? '#f4f8f5' : '#0b3d2e';
}

themeButton.addEventListener('click', () => {
  const isLight = document.documentElement.classList.toggle('light-theme');

  try {
    sessionStorage.setItem(THEME_STORAGE_KEY, isLight ? 'light' : 'dark');
  } catch {
    // Theme switching still works when browser storage is unavailable.
  }

  updateThemeState();
});

updateThemeState();
renderTodaySummary();
populateCalendarGrid();
