# Bangladesh Bangla Calendar

An independent, dependency-free web calendar that follows the revised Bangla
calendar rules used in Bangladesh. It shows today's Bangla date according to
Dhaka time and pairs Bangla dates with their Gregorian equivalents.

**Live site:** [bangladeshinationalcalendar.vercel.app](https://bangladeshinationalcalendar.vercel.app/)

> This is an independent project and is not an official Bangladesh government
> website.

## Why this project exists

Bangla calendars used in Bangladesh and traditional calendars used in West
Bengal can produce different dates. This project is specifically designed around
the revised civil calendar used in Bangladesh rather than the traditional
astronomical panjika.

For Bangla year 1426 onward, the implemented rules are:

- Boishakh through Ashwin contain 31 days each.
- Kartik, Ogrohayon, Poush, Magh, and Chaitro contain 30 days each.
- Falgun contains 29 days, or 30 when its corresponding Gregorian year is a
  leap year.
- Pohela Boishakh falls on April 14.

[Read about the revised calendar rules on Bangladesh's Teachers Portal.](https://www.teachers.gov.bd/content/details/493103)

## Features

- Displays today's Bangla and Gregorian dates using the Asia/Dhaka time zone.
- Shows a six-week Bangla month grid with matching Gregorian dates.
- Navigates between previous and next Bangla months.
- Opens any Gregorian date through a date-picker modal.
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

## Calendar utilities

**utils.js** exports:

- isLeapYear(banglaYear)
- getBanglaMonths(banglaYear)
- convertToBanglaDate(englishDate)
- calculateBanglaMonthAndDay(daysSinceBoishakhStart, banglaYear)
- getGregorianDateOfBanglaMonthStart(englishDate, banglaMonthName, banglaYear)
- getNextBanglaMonthStart(dateTimeBN)
- getPreviousBanglaMonthStart(dateTimeBN)
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

## Creator

Created by [Saib Saleh Nabil](https://github.com/saibshuvro).

- [GitHub](https://github.com/saibshuvro)
- [LinkedIn](https://www.linkedin.com/in/saib-saleh-nabil-29570b300)
