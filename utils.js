// utils.js

// Function to check if a Bengali year is a leap year
export function isLeapYear(banglaYear) {
  return banglaYear % 4 === 2;  // Bengali leap year logic (leap year occurs every 4 years except years divisible by 100 but not by 400)
}

// Function to get the Bangla months with the correct number of days
export function getBanglaMonths(banglaYear) {
  const isLeap = isLeapYear(banglaYear);

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
    { name: 'Falgun', days: isLeap ? 30 : 29 },  // Adjust Falgun's days based on leap year
    { name: 'Chaitro', days: 30 },
  ];
}


// Function to convert Gregorian date to Bangla date
export function convertToBanglaDate(englishDate) {
  const gYear = englishDate.getFullYear();
  let bengaliNewYear = new Date(gYear, 3, 14);  // Bengali New Year is on April 14th

  let banglaYear;
  if (englishDate < bengaliNewYear) {
    banglaYear = gYear - 594;
    bengaliNewYear = new Date(gYear-1, 3, 14);
  } else {
    banglaYear = gYear - 593;
  }

  let daysSinceBoishakhStart = Math.floor((englishDate - bengaliNewYear) / (1000 * 60 * 60 * 24));

  const banglaMonthDay = calculateBanglaMonthAndDay(daysSinceBoishakhStart, banglaYear);

  return {
    year: banglaYear,
    month: banglaMonthDay.month,
    day: banglaMonthDay.day,
  };
}

// Function to calculate Bangla month and day from the days since Boishakh start
export function calculateBanglaMonthAndDay(daysSinceBoishakhStart, banglaYear) {
  const banglaMonths = getBanglaMonths(banglaYear);

  let remainingDays = daysSinceBoishakhStart;

  for (let i = 0; i < banglaMonths.length; i++) {
    const month = banglaMonths[i];
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


export function getGregorianDateOfBanglaMonthStart(englishDate, banglaMonthName, banglaYear) {
    const banglaMonths = getBanglaMonths(banglaYear);
    
    let dayOffset = 0;
    for (const month of banglaMonths) {
        if (month.name === banglaMonthName) break;
        dayOffset += month.days;
    }

    const gYear = englishDate.getFullYear();
    let bengaliNewYear = new Date(gYear, 3, 14);  // Bengali New Year is on April 14th

    if (englishDate < bengaliNewYear) {
        banglaYear = gYear - 594;
        bengaliNewYear = new Date(gYear-1, 3, 14);
    } else {
        banglaYear = gYear - 593;
    }

    return new Date(bengaliNewYear.getTime() + dayOffset * 24 * 60 * 60 * 1000);
}


export function getNextBanglaMonthStart(objDateTimeBN) {
    const banglaMonths = getBanglaMonths(objDateTimeBN.banglaDate.year);
    let dayOffset = 0;
    for (let i = 0; i < banglaMonths.length; i++) {
        if (banglaMonths[i].name === objDateTimeBN.banglaDate.month) {
            dayOffset = (banglaMonths[i].days - objDateTimeBN.banglaDate.day) + 1;
        }
    }

    // Return Gregorian date for ১ তারিখ of next Bangla month
    return new Date(objDateTimeBN.bstDate.getTime() + dayOffset * 24 * 60 * 60 * 1000);
}


export function  getPreviousBanglaMonthStart(objDateTimeBN) {
    let dayOffset = objDateTimeBN.banglaDate.day;
    
    // Return Gregorian date for ১ তারিখ of next Bangla month
    return new Date(objDateTimeBN.bstDate.getTime() - dayOffset * 24 * 60 * 60 * 1000);
}
