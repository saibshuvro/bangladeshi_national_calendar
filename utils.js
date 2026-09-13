const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

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

function addCalendarDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, 12);
}

// Falgun contains the leap day of the Gregorian year in which the Bangla year ends.
export function isLeapYear(banglaYear) {
  const gregorianYear = banglaYear + 594;
  return gregorianYear % 4 === 0
    && (gregorianYear % 100 !== 0 || gregorianYear % 400 === 0);
}

export function getBanglaMonths(banglaYear) {
  if (banglaYear >= 1426) {
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

export function convertToBanglaDate(englishDate) {
  const gregorianYear = englishDate.getFullYear();
  let bengaliNewYear = new Date(gregorianYear, 3, 14, 12);
  let banglaYear;

  if (toUtcDayNumber(englishDate) < toUtcDayNumber(bengaliNewYear)) {
    banglaYear = gregorianYear - 594;
    bengaliNewYear = new Date(gregorianYear - 1, 3, 14, 12);
  } else {
    banglaYear = gregorianYear - 593;
  }

  const daysSinceBoishakhStart =
    toUtcDayNumber(englishDate) - toUtcDayNumber(bengaliNewYear);
  const banglaMonthDay = calculateBanglaMonthAndDay(daysSinceBoishakhStart, banglaYear);

  return {
    year: banglaYear,
    month: banglaMonthDay.month,
    day: banglaMonthDay.day
  };
}

export function calculateBanglaMonthAndDay(daysSinceBoishakhStart, banglaYear) {
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
