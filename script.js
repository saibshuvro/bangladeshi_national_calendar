class DateTimeBN {
  static instance = null;

  constructor() {
    if (DateTimeBN.instance) return DateTimeBN.instance;

    // Step 1: Store UTC and BST dates
    this.captureDateTimes();

    // Step 2: Compute Bangla date using BST date
    this.banglaDate = this.convertToBanglaDate(this.bstDate);

    DateTimeBN.instance = this;
  }

  // --- Capture UTC and BST dates ---
  captureDateTimes() {
    this.utcDate = new Date(); // UTC date-time
    const offsetMillis = 6 * 60 * 60 * 1000;
    this.bstDate = new Date(this.utcDate.getTime() + offsetMillis);
    console.log(this.bstDate); // BST = UTC + 6
  }

  convertToBanglaDate(date) {
    const gYear = date.getFullYear();
    const gMonth = date.getMonth();
    const gDay = date.getDate();

    this.bengaliNewYear = new Date(Date.UTC(gYear, 3, 13, 18, 0, 0) + (6 * 60 * 60 * 1000));
    // 14 April 00:00 BST

    let banglaYear;
    if (date < this.bengaliNewYear) {
      banglaYear = gYear - 594;
    } else {
      banglaYear = gYear - 593;
    }

    let daysSinceBoishakhStart = Math.floor((date - this.bengaliNewYear) / (1000 * 60 * 60 * 24));
    if (daysSinceBoishakhStart < 0) {
      daysSinceBoishakhStart += 365;
    }

    const banglaMonthDay = this.calculateBanglaMonthAndDay(daysSinceBoishakhStart, banglaYear);

    return {
      year: banglaYear,
      month: banglaMonthDay.month,
      day: banglaMonthDay.day,
    };
  }

  calculateBanglaMonthAndDay(daysSinceBoishakhStart, banglaYear) {
    this.isLeap = banglaYear % 4 === 2;

    this.banglaMonths = [
      { name: 'Boishakh', days: 31 },
      { name: 'Joishtho', days: 31 },
      { name: 'Ashar', days: 31 },
      { name: 'Srabon', days: 31 },
      { name: 'Bhadro', days: 31 },
      { name: 'Ashwin', days: 31 },
      { name: 'Kartik', days: 30 },
      { name: 'Ogrohayon', days: 30 },
      { name: 'Poush', days: 30 },
      { name: 'Magh', days: 30 },
      { name: 'Falgun', days: this.isLeap ? 30 : 29 },
      { name: 'Chaitro', days: 30 },
    ];

    let remainingDays = daysSinceBoishakhStart;

    for (let i = 0; i < this.banglaMonths.length; i++) {
      const month = this.banglaMonths[i];
      if (remainingDays < month.days) {
        return {
          month: month.name,
          day: remainingDays + 1,
        };
      }
      remainingDays -= month.days;
    }

    return { month: 'Boishakh', day: 1 };
  }

  getGregorianDateOfBanglaMonthStart(banglaMonthName) {
    // Step 2: Count days to the target month
    let dayOffset = 0;
    for (const month of this.banglaMonths) {
      if (month.name === banglaMonthName) break;
      dayOffset += month.days;
    }

    // Step 3: Return Gregorian date of ১ of target Bangla month
    return new Date(this.bengaliNewYear.getTime() + dayOffset * 24 * 60 * 60 * 1000);
  }
}

// --- Utility: Convert English number to Bangla ---
function toBanglaNumber(number) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(number).split('').map(d => banglaDigits[d] || d).join('');
}

// --- Populate calendar grid ---
function populateCalendarGrid() {
  const container = document.getElementById('calendar-grid');
  container.innerHTML = ""; // Clear previous cells

  const today = new DateTimeBN();
  const banglaMonthName = today.banglaDate.month;
  const banglaYear = today.banglaDate.year;

  // Get Gregorian date of Bangla ১ তারিখ
  const startDate = today.getGregorianDateOfBanglaMonthStart(banglaMonthName);
  const startWeekday = startDate.getDay(); // 0 = Sunday, ..., 6 = Saturday

  // Start from the Sunday of that week (or earlier days of previous Bangla month)
  const calendarStartDate = new Date(startDate);
  calendarStartDate.setDate(startDate.getDate() - startWeekday); // Go back to Sunday

  // Render 35 calendar cells (5 weeks)
  for (let i = 0; i < 35; i++) {
    const currentDate = new Date(calendarStartDate);
    currentDate.setDate(calendarStartDate.getDate() + i);

    const banglaDate = today.convertToBanglaDate(currentDate);

    const cell = document.createElement('div');
    cell.classList.add('calendar-cell');

    // Highlight today (optional)
    const isToday = currentDate.toDateString() === today.bstDate.toDateString();
    if (isToday) cell.classList.add('today');

    const banglaDiv = document.createElement('div');
    banglaDiv.className = 'bangla-date';
    banglaDiv.innerText = toBanglaNumber(banglaDate.day);

    const engDiv = document.createElement('div');
    engDiv.className = 'english-date';
    engDiv.innerText = currentDate.getDate();

    cell.appendChild(banglaDiv);
    cell.appendChild(engDiv);
    container.appendChild(cell);
  }
  // Display Bangla month and year
  const header = document.getElementById('bangla-month-year');
  header.innerText = `${today.banglaDate.month} ${toBanglaNumber(today.banglaDate.year)}`;
}

// --- Toggle sidebar ---
document.getElementById("menu-toggle").addEventListener("click", function () {
  document.getElementById("sidebar").classList.toggle("open");
});

// --- Load calendar ---
populateCalendarGrid();
