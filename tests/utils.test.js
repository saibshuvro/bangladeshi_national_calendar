import assert from 'node:assert/strict';
import test from 'node:test';

import {
  EARLIEST_SUPPORTED_BANGLA_YEAR,
  EARLIEST_SUPPORTED_GREGORIAN_DATE,
  OFFICIAL_CALENDAR_START_DATE,
  calculateBanglaMonthAndDay,
  convertToBanglaDate,
  getBanglaMonths,
  getGregorianDateOfBanglaMonthStart,
  getNextBanglaMonthStart,
  getPreviousBanglaMonthStart,
  isEstimatedBanglaDate,
  isLeapYear
} from '../utils.js';

function localDate(isoDate) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);

  if (!match) {
    throw new TypeError(`Invalid test date: ${isoDate}`);
  }

  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12);
}

function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, 12);
}

function toIsoDate(date) {
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function dateTimeBN(date) {
  return {
    bstDate: date,
    banglaDate: convertToBanglaDate(date)
  };
}

test('uses the Shahidullah-era month lengths from 1394 through 1401', () => {
  assert.deepEqual(
    getBanglaMonths(1394).map(({ days }) => days),
    [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 31]
  );
  assert.deepEqual(
    getBanglaMonths(1395).map(({ days }) => days),
    [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30]
  );
});

test('places the Shahidullah-era leap day in Chaitro', () => {
  assert.equal(isLeapYear(1394), true);
  assert.equal(getBanglaMonths(1394).find(({ name }) => name === 'Falgun').days, 30);
  assert.equal(getBanglaMonths(1394).find(({ name }) => name === 'Chaitro').days, 31);
  assert.equal(isLeapYear(1395), false);
  assert.equal(getBanglaMonths(1395).find(({ name }) => name === 'Chaitro').days, 30);
});

test('extends the Shahidullah-style rules proleptically to Bangla year 1354', () => {
  assert.equal(isLeapYear(1354), true);
  assert.deepEqual(
    getBanglaMonths(1354).map(({ days }) => days),
    [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 31]
  );

  const cases = [
    ['1947-04-14', { year: 1354, month: 'Boishakh', day: 1 }],
    ['1947-08-15', { year: 1354, month: 'Srabon', day: 31 }],
    ['1948-03-13', { year: 1354, month: 'Falgun', day: 30 }],
    ['1948-03-14', { year: 1354, month: 'Chaitro', day: 1 }],
    ['1948-04-13', { year: 1354, month: 'Chaitro', day: 31 }]
  ];

  for (const [gregorianDate, expected] of cases) {
    assert.deepEqual(convertToBanglaDate(localDate(gregorianDate)), expected, gregorianDate);
  }
});

test('keeps historically observed dates distinct from proleptic estimates', () => {
  assert.deepEqual(
    convertToBanglaDate(localDate('1952-02-21')),
    { year: 1358, month: 'Falgun', day: 9 }
  );
  assert.deepEqual(
    convertToBanglaDate(localDate('1971-12-16')),
    { year: 1378, month: 'Poush', day: 2 }
  );
});

test('uses the 1402-to-1425 month lengths', () => {
  assert.deepEqual(
    getBanglaMonths(1425).map(({ days }) => days),
    [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30]
  );
});

test('places the 1402-to-1425 leap day in Falgun', () => {
  assert.equal(isLeapYear(1422), true);
  assert.equal(getBanglaMonths(1422).find(({ name }) => name === 'Falgun').days, 31);
  assert.equal(isLeapYear(1425), false);
  assert.equal(getBanglaMonths(1425).find(({ name }) => name === 'Falgun').days, 30);
});

test('converts dates around the 1402 leap-day reform', () => {
  const cases = [
    ['1995-04-13', { year: 1401, month: 'Chaitro', day: 30 }],
    ['1995-04-14', { year: 1402, month: 'Boishakh', day: 1 }],
    ['1996-02-13', { year: 1402, month: 'Falgun', day: 1 }],
    ['1996-03-14', { year: 1402, month: 'Falgun', day: 31 }],
    ['1996-03-15', { year: 1402, month: 'Chaitro', day: 1 }]
  ];

  for (const [gregorianDate, expected] of cases) {
    assert.deepEqual(convertToBanglaDate(localDate(gregorianDate)), expected, gregorianDate);
  }
});

test('converts a Shahidullah-era leap day in Chaitro', () => {
  const cases = [
    ['1988-02-13', { year: 1394, month: 'Falgun', day: 1 }],
    ['1988-03-13', { year: 1394, month: 'Falgun', day: 30 }],
    ['1988-03-14', { year: 1394, month: 'Chaitro', day: 1 }],
    ['1988-04-13', { year: 1394, month: 'Chaitro', day: 31 }],
    ['1988-04-14', { year: 1395, month: 'Boishakh', day: 1 }]
  ];

  for (const [gregorianDate, expected] of cases) {
    assert.deepEqual(convertToBanglaDate(localDate(gregorianDate)), expected, gregorianDate);
  }
});

test('uses the revised month lengths from Bangla year 1426', () => {
  assert.deepEqual(
    getBanglaMonths(1433).map(({ days }) => days),
    [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 29, 30]
  );
});

test('adds the revised leap day to Falgun', () => {
  assert.equal(isLeapYear(1426), true);
  assert.equal(getBanglaMonths(1426).find(({ name }) => name === 'Falgun').days, 30);
  assert.equal(isLeapYear(1427), false);
  assert.equal(getBanglaMonths(1427).find(({ name }) => name === 'Falgun').days, 29);
});

test('converts documented dates around the 1426 reform', () => {
  const cases = [
    ['2018-10-15', { year: 1425, month: 'Ashwin', day: 30 }],
    ['2018-10-16', { year: 1425, month: 'Kartik', day: 1 }],
    ['2019-10-16', { year: 1426, month: 'Ashwin', day: 31 }],
    ['2019-10-17', { year: 1426, month: 'Kartik', day: 1 }],
    ['2019-02-13', { year: 1425, month: 'Falgun', day: 1 }],
    ['2020-02-14', { year: 1426, month: 'Falgun', day: 1 }]
  ];

  for (const [gregorianDate, expected] of cases) {
    assert.deepEqual(convertToBanglaDate(localDate(gregorianDate)), expected, gregorianDate);
  }
});

test('converts the Bangla new-year boundary', () => {
  assert.deepEqual(
    convertToBanglaDate(localDate('2026-04-13')),
    { year: 1432, month: 'Chaitro', day: 30 }
  );
  assert.deepEqual(
    convertToBanglaDate(localDate('2026-04-14')),
    { year: 1433, month: 'Boishakh', day: 1 }
  );
});

test('converts Gregorian month and year boundaries', () => {
  const cases = [
    ['2025-12-31', { year: 1432, month: 'Poush', day: 16 }],
    ['2026-01-01', { year: 1432, month: 'Poush', day: 17 }],
    ['2020-02-28', { year: 1426, month: 'Falgun', day: 15 }],
    ['2020-02-29', { year: 1426, month: 'Falgun', day: 16 }],
    ['2020-03-01', { year: 1426, month: 'Falgun', day: 17 }]
  ];

  for (const [gregorianDate, expected] of cases) {
    assert.deepEqual(convertToBanglaDate(localDate(gregorianDate)), expected, gregorianDate);
  }
});

for (const banglaYear of [1354, 1394, 1402, 1425, 1433]) {
  test(`converts every month boundary in Bangla year ${banglaYear}`, () => {
    const months = getBanglaMonths(banglaYear);

    for (let index = 0; index < months.length; index += 1) {
      const month = months[index];
      const startDate = getGregorianDateOfBanglaMonthStart(null, month.name, banglaYear);
      const endDate = addDays(startDate, month.days - 1);
      const nextDate = addDays(endDate, 1);
      const nextMonth = months[index + 1];

      assert.deepEqual(
        convertToBanglaDate(startDate),
        { year: banglaYear, month: month.name, day: 1 },
        `${banglaYear} ${month.name} start`
      );
      assert.deepEqual(
        convertToBanglaDate(endDate),
        { year: banglaYear, month: month.name, day: month.days },
        `${banglaYear} ${month.name} end`
      );
      assert.deepEqual(
        convertToBanglaDate(nextDate),
        nextMonth
          ? { year: banglaYear, month: nextMonth.name, day: 1 }
          : { year: banglaYear + 1, month: 'Boishakh', day: 1 },
        `${banglaYear} ${month.name} transition`
      );
    }
  });
}

for (const banglaYear of [1354, 1394, 1402, 1425, 1433]) {
  test(`navigates to adjacent month starts in Bangla year ${banglaYear}`, () => {
    const months = getBanglaMonths(banglaYear);

    for (let index = 0; index < months.length; index += 1) {
      const month = months[index];
      const monthStart = getGregorianDateOfBanglaMonthStart(null, month.name, banglaYear);
      const dateWithinMonth = addDays(monthStart, 9);

      const nextYear = index === months.length - 1 ? banglaYear + 1 : banglaYear;
      const nextMonthName = index === months.length - 1
        ? 'Boishakh'
        : months[index + 1].name;
      const expectedNext = getGregorianDateOfBanglaMonthStart(
        null,
        nextMonthName,
        nextYear
      );

      assert.equal(
        toIsoDate(getNextBanglaMonthStart(dateTimeBN(dateWithinMonth))),
        toIsoDate(expectedNext),
        `${banglaYear} ${month.name} next`
      );

      if (banglaYear === EARLIEST_SUPPORTED_BANGLA_YEAR && index === 0) {
        assert.throws(
          () => getPreviousBanglaMonthStart(dateTimeBN(dateWithinMonth)),
          {
            name: 'RangeError',
            message: `Bangla years before ${EARLIEST_SUPPORTED_BANGLA_YEAR} are not supported.`
          }
        );
        continue;
      }

      const previousYear = index === 0 ? banglaYear - 1 : banglaYear;
      const previousMonths = getBanglaMonths(previousYear);
      const previousMonthName = index === 0
        ? previousMonths.at(-1).name
        : months[index - 1].name;
      const expectedPrevious = getGregorianDateOfBanglaMonthStart(
        null,
        previousMonthName,
        previousYear
      );

      assert.equal(
        toIsoDate(getPreviousBanglaMonthStart(dateTimeBN(dateWithinMonth))),
        toIsoDate(expectedPrevious),
        `${banglaYear} ${month.name} previous`
      );
    }
  });
}

test('enforces the earliest supported historical date', () => {
  assert.equal(EARLIEST_SUPPORTED_BANGLA_YEAR, 1354);
  assert.equal(EARLIEST_SUPPORTED_GREGORIAN_DATE, '1947-04-14');
  assert.deepEqual(
    convertToBanglaDate(localDate(EARLIEST_SUPPORTED_GREGORIAN_DATE)),
    { year: 1354, month: 'Boishakh', day: 1 }
  );
  assert.throws(
    () => convertToBanglaDate(localDate('1947-04-13')),
    { name: 'RangeError', message: 'Gregorian dates before 1947-04-14 are not supported.' }
  );
  assert.throws(
    () => getBanglaMonths(1353),
    { name: 'RangeError', message: 'Bangla years before 1354 are not supported.' }
  );
  assert.throws(
    () => isEstimatedBanglaDate(localDate('1947-04-13')),
    { name: 'RangeError', message: 'Gregorian dates before 1947-04-14 are not supported.' }
  );
});

test('identifies estimated and official calendar dates', () => {
  assert.equal(OFFICIAL_CALENDAR_START_DATE, '1987-04-14');
  assert.equal(isEstimatedBanglaDate(localDate('1947-04-14')), true);
  assert.equal(isEstimatedBanglaDate(localDate('1987-04-13')), true);
  assert.equal(isEstimatedBanglaDate(localDate(OFFICIAL_CALENDAR_START_DATE)), false);
  assert.equal(isEstimatedBanglaDate(localDate('2026-09-14')), false);
  assert.deepEqual(
    convertToBanglaDate(localDate('1987-04-13')),
    { year: 1393, month: 'Chaitro', day: 30 }
  );
  assert.deepEqual(
    convertToBanglaDate(localDate(OFFICIAL_CALENDAR_START_DATE)),
    { year: 1394, month: 'Boishakh', day: 1 }
  );
});

test('rejects invalid conversion input', () => {
  assert.throws(
    () => convertToBanglaDate(new Date(Number.NaN)),
    { name: 'TypeError', message: 'A valid Gregorian Date is required.' }
  );
});

test('rejects day offsets outside a Bangla year', () => {
  assert.throws(
    () => calculateBanglaMonthAndDay(-1, 1433),
    { name: 'RangeError', message: 'Date falls outside the requested Bangla year.' }
  );
  assert.throws(
    () => calculateBanglaMonthAndDay(365, 1433),
    { name: 'RangeError', message: 'Date falls outside the requested Bangla year.' }
  );
});

test('rejects an unknown Bangla month', () => {
  assert.throws(
    () => getGregorianDateOfBanglaMonthStart(null, 'NotAMonth', 1433),
    { name: 'RangeError', message: 'Unknown Bangla month: NotAMonth' }
  );
});
