# Bangladesh Bangla Calendar

An independent, dependency-free web calendar that follows the standardized
Bangla civil-calendar rules used in Bangladesh. It shows today's Bangla date
according to Dhaka time and pairs Bangla dates with their Gregorian equivalents.

**Live site:** [bangladeshinationalcalendar.vercel.app](https://bangladeshinationalcalendar.vercel.app/)

> This is an independent project and is not an official Bangladesh government
> website.

## Why this project exists

Bangla calendars used in Bangladesh and traditional calendars used in West
Bengal can produce different dates. This project is specifically designed around
the revised civil calendar used in Bangladesh rather than the traditional
astronomical panjika.

The converter supports dates from **1 Boishakh 1354 (April 14, 1947)**. Results
before **April 14, 1987** are explicitly marked as estimates because they apply
the later Shahidullah-style standardized rules backward rather than reconstructing
the traditional astronomical panjika used at the time.

| Bangla years | Reliability | Implemented month and leap-day rules |
| --- | --- | --- |
| **1354–1393** | Estimated | The later Shahidullah-style rule is applied proleptically: Boishakh–Bhadro have 31 days; Ashwin–Falgun have 30; Chaitro has 30 days, or 31 when the ending Gregorian year is a leap year. |
| **1394–1401** | Official-era calculation | The same month lengths apply, with the leap day in Chaitro. |
| **1402–1425** | Official-era calculation | Boishakh–Bhadro have 31 days; Ashwin–Chaitro have 30; the leap day moves to Falgun, giving it 31 days in the applicable leap year. |
| **1426 onward** | Current official calculation | Boishakh–Ashwin have 31 days; Kartik–Magh and Chaitro have 30; Falgun has 29 days, or 30 in the applicable leap year. |

Pohela Boishakh is fixed to April 14 throughout this implementation. That is a
calculation convention—not a claim that every pre-1987 historical panjika used
the same Gregorian boundary. Dates before April 14, 1947 are rejected.

Sources: [Banglapedia's Panjika article](https://en.banglapedia.org/index.php?title=Panjika),
[Prothom Alo's history of the reforms](https://www.prothomalo.com/bangladesh/%E0%A6%86%E0%A6%B0%E0%A7%87%E0%A6%95-%E0%A6%A6%E0%A6%AB%E0%A6%BE-%E0%A6%B8%E0%A6%82%E0%A6%B8%E0%A7%8D%E0%A6%95%E0%A6%BE%E0%A6%B0-%E0%A6%B9%E0%A6%9A%E0%A7%8D%E0%A6%9B%E0%A7%87-%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE-%E0%A6%AC%E0%A6%B0%E0%A7%8D%E0%A6%B7%E0%A6%AA%E0%A6%9E%E0%A7%8D%E0%A6%9C%E0%A6%BF),
and [Bangladesh's Teachers Portal on the current rules](https://www.teachers.gov.bd/content/details/493103).
See [the calendar validation record](docs/calendar-validation.md) for the
source hierarchy, representative expected dates, known limitations, and test
coverage.

## Features

- Displays today's Bangla and Gregorian dates using the Asia/Dhaka time zone.
- Shows a six-week Bangla month grid with matching Gregorian dates.
- Navigates between previous and next Bangla months.
- Opens any Gregorian date from April 14, 1947 onward through a date-picker
  modal and warns when a pre-1987 result is an estimate.
- Distinguishes today's date with a filled highlight and a selected date with a
  green outline.
- Provides dark and light themes, retaining the selected theme across reloads
  in the same browser tab with sessionStorage.
- Includes responsive styling and accessible labels, landmarks, controls, and
  calendar cells.
- Includes search metadata, canonical and social tags, JSON-LD structured data,
  robots.txt, and an XML sitemap.

## Project structure

| File | Purpose |
| --- | --- |
| **index.html** | Semantic page content, calendar interface, SEO metadata, and structured data |
| **style.css** | Responsive dark/light themes and component styling |
| **script.js** | Calendar rendering, Dhaka-time handling, interactions, and theme persistence |
| **utils.js** | Bangla calendar conversion, month-length, leap-year, and navigation utilities |
| **tests/utils.test.js** | Historical rule, reform-boundary, conversion, range, and navigation tests |
| **docs/calendar-validation.md** | Source-backed rules, representative expectations, and validation limitations |
| **.github/ISSUE_TEMPLATE/calendar-correction.yml** | Structured form for evidence-backed calendar corrections |
| **package.json** | Node test command and module configuration; no runtime dependencies |
| **robots.txt** | Search-crawler access rules and sitemap location |
| **sitemap.xml** | Canonical URL submitted to search engines |

The application uses only native HTML, CSS, and JavaScript. There are no runtime
dependencies or build steps.

## Run locally

Clone the repository:

~~~bash
git clone https://github.com/saibshuvro/bangladeshi_national_calendar.git
cd bangladeshi_national_calendar
~~~

Serve the directory with VS Code Live Server or another static server. For
example:

~~~bash
python3 -m http.server 8000
~~~

Then open [http://localhost:8000](http://localhost:8000).

Using a local server is recommended because the JavaScript files use ES modules.

Run the calendar regression tests with a current Node.js release:

~~~bash
npm test
~~~

## Calendar utilities

**utils.js** exports:

- EARLIEST_SUPPORTED_BANGLA_YEAR
- EARLIEST_SUPPORTED_GREGORIAN_DATE
- OFFICIAL_CALENDAR_START_DATE
- isLeapYear(banglaYear)
- getBanglaMonths(banglaYear)
- convertToBanglaDate(englishDate)
- calculateBanglaMonthAndDay(daysSinceBoishakhStart, banglaYear)
- getGregorianDateOfBanglaMonthStart(englishDate, banglaMonthName, banglaYear)
- getNextBanglaMonthStart(dateTimeBN)
- getPreviousBanglaMonthStart(dateTimeBN)
- isEstimatedBanglaDate(englishDate)
- toBanglaName(banglaMonthName)

Date arithmetic uses calendar-day values rather than raw elapsed milliseconds,
which avoids daylight-saving boundary errors for visitors outside Bangladesh.

## Deployment and indexing

The project can be deployed directly as a static Vercel site. After deploying
changes, verify the production property in Google Search Console and submit:

~~~text
https://bangladeshinationalcalendar.vercel.app/sitemap.xml
~~~

If the production domain changes, update the canonical URL, Open Graph URL,
structured-data identifiers, robots.txt, and sitemap.xml together.

## Contributing

Contributions and calendar-correction reports are welcome. Please open an issue
or pull request with the affected Gregorian date, expected Bangla date, and a
reliable source for the correction.

[Submit a calendar correction](https://github.com/saibshuvro/bangladeshi_national_calendar/issues/new?template=calendar-correction.yml).

## Creator

Created by [Saib Saleh Nabil](https://github.com/saibshuvro).

- [GitHub](https://github.com/saibshuvro)
- [LinkedIn](https://www.linkedin.com/in/saib-saleh-nabil-29570b300)
