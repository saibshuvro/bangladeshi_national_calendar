const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export const EARLIEST_SUPPORTED_BANGLA_YEAR = 1354;
export const EARLIEST_SUPPORTED_GREGORIAN_DATE = '1947-04-14';
export const OFFICIAL_CALENDAR_START_DATE = '1987-04-14';

const EARLIEST_SUPPORTED_DAY_NUMBER = Date.UTC(1947, 3, 14) / MILLISECONDS_PER_DAY;
const OFFICIAL_CALENDAR_START_DAY_NUMBER = Date.UTC(1987, 3, 14) / MILLISECONDS_PER_DAY;

const FALGUN_LEAP_REFORM_YEAR = 1402;
const CURRENT_REFORM_YEAR = 1426;

const BANGLA_MONTH_NAMES = {
  Boishakh: 'বৈশাখ',
  Joishtho: 'জ্যৈষ্ঠ',
  Ashar: 'আষাঢ়',
  Srabon: 'শ্রাবণ',
  Bhadro: 'ভাদ্র',
  Ashwin: 'আশ্বিন',
  Kartik: 'কার্তিক',
  Ogrohayon: 'অগ্রহায়ণ',
  Poush: 'পৌষ',
  Magh: 'মাঘ',
  Falgun: 'ফাল্গুন',
  Chaitro: 'চৈত্র'
};

function toUtcDayNumber(date) {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MILLISECONDS_PER_DAY
  );
}

function getSupportedGregorianDayNumber(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new TypeError('A valid Gregorian Date is required.');
  }

  const dayNumber = toUtcDayNumber(date);

  if (dayNumber < EARLIEST_SUPPORTED_DAY_NUMBER) {
    throw new RangeError(
      `Gregorian dates before ${EARLIEST_SUPPORTED_GREGORIAN_DATE} are not supported.`
    );
  }

  return dayNumber;
}

function addCalendarDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, 12);
}

// A Bangla year is a leap year when the Gregorian year in which it ends is a leap year.
export function isLeapYear(banglaYear) {
  const gregorianYear = banglaYear + 594;
  return gregorianYear % 4 === 0
    && (gregorianYear % 100 !== 0 || gregorianYear % 400 === 0);
}

export function getBanglaMonths(banglaYear) {
  if (!Number.isInteger(banglaYear)) {
    throw new TypeError('Bangla year must be an integer.');
  }

  if (banglaYear < EARLIEST_SUPPORTED_BANGLA_YEAR) {
    throw new RangeError(
      `Bangla years before ${EARLIEST_SUPPORTED_BANGLA_YEAR} are not supported.`
    );
  }

  // Current rules, introduced in Bangla year 1426 (2019–2020).
  if (banglaYear >= CURRENT_REFORM_YEAR) {
    return [
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
      { name: 'Falgun', days: isLeapYear(banglaYear) ? 30 : 29 },
      { name: 'Chaitro', days: 30 }
    ];
  }

  // The 1402 reform moved the leap day from Chaitro to Falgun.
  if (banglaYear >= FALGUN_LEAP_REFORM_YEAR) {
    return [
      { name: 'Boishakh', days: 31 },
      { name: 'Joishtho', days: 31 },
      { name: 'Ashar', days: 31 },
      { name: 'Srabon', days: 31 },
      { name: 'Bhadro', days: 31 },
      { name: 'Ashwin', days: 30 },
      { name: 'Kartik', days: 30 },
      { name: 'Ogrohayon', days: 30 },
      { name: 'Poush', days: 30 },
      { name: 'Magh', days: 30 },
      { name: 'Falgun', days: isLeapYear(banglaYear) ? 31 : 30 },
      { name: 'Chaitro', days: 30 }
    ];
  }

  // Before 1402, use the Shahidullah-style rules. For 1354–1393 this is a
  // proleptic estimate: the later standardized rules are applied backward.
  return [
    { name: 'Boishakh', days: 31 },
    { name: 'Joishtho', days: 31 },
    { name: 'Ashar', days: 31 },
    { name: 'Srabon', days: 31 },
    { name: 'Bhadro', days: 31 },
    { name: 'Ashwin', days: 30 },
    { name: 'Kartik', days: 30 },
    { name: 'Ogrohayon', days: 30 },
    { name: 'Poush', days: 30 },
    { name: 'Magh', days: 30 },
    { name: 'Falgun', days: 30 },
    { name: 'Chaitro', days: isLeapYear(banglaYear) ? 31 : 30 }
  ];
}

export function convertToBanglaDate(englishDate) {
  const englishDayNumber = getSupportedGregorianDayNumber(englishDate);

  const gregorianYear = englishDate.getFullYear();
  let bengaliNewYear = new Date(gregorianYear, 3, 14, 12);
  let banglaYear;

  if (englishDayNumber < toUtcDayNumber(bengaliNewYear)) {
    banglaYear = gregorianYear - 594;
    bengaliNewYear = new Date(gregorianYear - 1, 3, 14, 12);
  } else {
    banglaYear = gregorianYear - 593;
  }

  const daysSinceBoishakhStart =
    englishDayNumber - toUtcDayNumber(bengaliNewYear);
  const banglaMonthDay = calculateBanglaMonthAndDay(daysSinceBoishakhStart, banglaYear);

  return {
    year: banglaYear,
    month: banglaMonthDay.month,
    day: banglaMonthDay.day
  };
}

export function isEstimatedBanglaDate(englishDate) {
  return getSupportedGregorianDayNumber(englishDate)
    < OFFICIAL_CALENDAR_START_DAY_NUMBER;
}

export function calculateBanglaMonthAndDay(daysSinceBoishakhStart, banglaYear) {
  if (!Number.isInteger(daysSinceBoishakhStart) || daysSinceBoishakhStart < 0) {
    throw new RangeError('Date falls outside the requested Bangla year.');
  }

  let remainingDays = daysSinceBoishakhStart;

  for (const month of getBanglaMonths(banglaYear)) {
    if (remainingDays < month.days) {
      return {
        month: month.name,
        day: remainingDays + 1
      };
    }
    remainingDays -= month.days;
  }

  throw new RangeError('Date falls outside the requested Bangla year.');
}

export function getGregorianDateOfBanglaMonthStart(
  _englishDate,
  banglaMonthName,
  banglaYear
) {
  let dayOffset = 0;

  for (const month of getBanglaMonths(banglaYear)) {
    if (month.name === banglaMonthName) {
      const bengaliNewYear = new Date(banglaYear + 593, 3, 14, 12);
      return addCalendarDays(bengaliNewYear, dayOffset);
    }
    dayOffset += month.days;
  }

  throw new RangeError(`Unknown Bangla month: ${banglaMonthName}`);
}

export function getNextBanglaMonthStart(dateTimeBN) {
  const currentMonth = getBanglaMonths(dateTimeBN.banglaDate.year)
    .find((month) => month.name === dateTimeBN.banglaDate.month);

  if (!currentMonth) {
    throw new RangeError(`Unknown Bangla month: ${dateTimeBN.banglaDate.month}`);
  }

  const daysUntilNextMonth = currentMonth.days - dateTimeBN.banglaDate.day + 1;
  return addCalendarDays(dateTimeBN.bstDate, daysUntilNextMonth);
}

export function getPreviousBanglaMonthStart(dateTimeBN) {
  let previousYear = dateTimeBN.banglaDate.year;
  let currentMonthIndex = getBanglaMonths(previousYear)
    .findIndex((month) => month.name === dateTimeBN.banglaDate.month);

  if (currentMonthIndex === -1) {
    throw new RangeError(`Unknown Bangla month: ${dateTimeBN.banglaDate.month}`);
  }

  if (currentMonthIndex === 0) {
    previousYear -= 1;
    currentMonthIndex = 12;
  }

  const previousMonthDays = getBanglaMonths(previousYear)[currentMonthIndex - 1].days;
  const daysSincePreviousMonthStart =
    previousMonthDays + dateTimeBN.banglaDate.day - 1;

  return addCalendarDays(dateTimeBN.bstDate, -daysSincePreviousMonthStart);
}

export function toBanglaName(banglaMonthName) {
  return BANGLA_MONTH_NAMES[banglaMonthName];
}
