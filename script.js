import { convertToBanglaDate, getGregorianDateOfBanglaMonthStart, getNextBanglaMonthStart, getPreviousBanglaMonthStart } from './utils.js';

let currentToday;

class DateTimeBN {
  constructor(givenDate = null) {
    // Step 1: Store BST date
    this.captureDateTimes(givenDate);

    // Step 2: Compute Bangla date using BST date
    this.banglaDate = convertToBanglaDate(this.bstDate);
  }

  // --- Capture BST date ---
  captureDateTimes(givenDate) {
    if (givenDate === null) {
      this.bstDate = new Date();
    } else {
      this.bstDate = new Date(givenDate);
    }
    console.log(this.bstDate);
  }

}

// --- Utility: Convert English number to Bangla ---
function toBanglaNumber(number) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(number).split('').map(d => banglaDigits[d] || d).join('');
}

// --- Populate calendar grid ---
function populateCalendarGrid(selectedDate = null) {
  const container = document.getElementById('calendar-grid');
  container.innerHTML = ""; // Clear previous cells

  const today = new DateTimeBN(selectedDate);
  currentToday = today;

  // Get Gregorian date of Bangla ১ তারিখ
  const startDate = getGregorianDateOfBanglaMonthStart(today.bstDate, today.banglaDate.month, today.banglaDate.year);
  const startWeekday = startDate.getDay(); // 0 = Sunday, ..., 6 = Saturday

  // Start from the Sunday of that week (or earlier days of previous Bangla month)
  const calendarStartDate = new Date(startDate);
  calendarStartDate.setDate(startDate.getDate() - startWeekday); // Go back to Sunday

  // Render 35 calendar cells (5 weeks)
  for (let i = 0; i < 42; i++) {
    const currentDate = new Date(calendarStartDate);
    currentDate.setDate(calendarStartDate.getDate() + i);

    const banglaDate = convertToBanglaDate(currentDate);

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


// Modal elements
const modal = document.getElementById("date-modal");
const goToDate = document.getElementById("go-to-date");
const closeBtn = document.querySelector(".close");
const goBtn = document.getElementById("go-btn");
const datePicker = document.getElementById("date-picker");
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menu-toggle");

// Open modal on click
goToDate.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "block";
});

// Close modal
closeBtn.onclick = () => modal.style.display = "none";

window.addEventListener("click", (e) => {
  // Close modal if clicked outside
  if (e.target === modal) {
    modal.style.display = "none";
  }

  // Close sidebar if open and clicked outside
  if (
    sidebar.classList.contains("open") &&
    !sidebar.contains(e.target) &&
    e.target !== menuToggle
  ) {
    sidebar.classList.remove("open");
  }
});

// Handle date selection
goBtn.addEventListener("click", () => {
  const selectedDate = datePicker.value;
  if (selectedDate) {
    // alert("You selected: " + selectedDate); 
    // Here, you can call your calendar function to go to this date
    populateCalendarGrid(selectedDate);
    modal.style.display = "none";
  }
});

const previousMonthBtn = document.getElementById("previous-month-btn");
const nextMonthBtn = document.getElementById("next-month-btn");

previousMonthBtn.addEventListener("click", () => {
  populateCalendarGrid(getPreviousBanglaMonthStart(currentToday));
});

nextMonthBtn.addEventListener("click", () => {
  populateCalendarGrid(getNextBanglaMonthStart(currentToday));
});