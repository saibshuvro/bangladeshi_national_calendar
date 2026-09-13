# Calendar Validation Record

Last reviewed: 2026-09-14

This document records what the converter calculates, why each rule boundary was
chosen, and which expectations come from independent sources. Automated tests
protect the implementation from regressions; they do not turn an estimated
historical result into a verified historical date.

## Scope and terminology

- **Estimated/proleptic:** the later fixed Shahidullah-style rules are applied
  backward to a date before their official adoption. This produces a consistent
  result but may differ from the astronomical panjika used at the time.
- **Official-era calculation:** the applicable standardized Bangladesh rule set
  is used for its supported period.
- **Historically observed:** a Bangla date reported for an event in historical
  material. It can intentionally differ from this converter's pre-1987 estimate.
- **Rule-derived fixture:** an expected result calculated independently from the
  documented month-length rule. It is not claimed to be quoted verbatim from a
  source.

## Supported boundaries

| Boundary | Treatment |
| --- | --- |
| Before 1947-04-14 | Rejected as unsupported |
| 1947-04-14 through 1987-04-13 | Estimated by applying the later Shahidullah-style fixed rules backward |
| 1987-04-14 through 1995-04-13 | Original standardized rule: first five months have 31 days, the remaining months normally have 30, and the leap day is in Chaitro |
| 1995-04-14 through 2019-04-13 | The 1402 reform period: the leap day is in Falgun |
| From 2019-04-14 | Current 1426 rule: the first six months have 31 days and Falgun has 29 days, or 30 in the applicable leap year |

April 14, 1947 is a product cutoff, not a claim that the standardized calendar
was already in use. April 14, 1987 is the reliability boundary used by this
project for the official-adoption era.

## Evidence sources

| Source | What it supports | Limitation |
| --- | --- | --- |
| [Banglapedia: Panjika](https://en.banglapedia.org/index.php?title=Panjika) | The Shahidullah Committee's fixed month structure; government use from 1988; the 1995 task force; Falgun as the leap month; introduction on 1 Boishakh 1402 | Summarizes the reforms rather than reproducing the original government order or annual calendars |
| [Prothom Alo: আরেক দফা সংস্কার হচ্ছে বাংলা বর্ষপঞ্জি](https://www.prothomalo.com/bangladesh/%E0%A6%86%E0%A6%B0%E0%A7%87%E0%A6%95-%E0%A6%A6%E0%A6%AB%E0%A6%BE-%E0%A6%B8%E0%A6%82%E0%A6%B8%E0%A7%8D%E0%A6%95%E0%A6%BE%E0%A6%B0-%E0%A6%B9%E0%A6%9A%E0%A7%8D%E0%A6%9B%E0%A7%87-%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE-%E0%A6%AC%E0%A6%B0%E0%A7%8D%E0%A6%B7%E0%A6%AA%E0%A6%9E%E0%A7%8D%E0%A6%9C%E0%A6%BF) | Mandatory official Bangla dating from 1987; the earlier Chaitro leap day; the 1995 recommendation moving it to Falgun | Contemporary reporting about the reform process, not the original order |
| [Prothom Alo: বাংলা দিনপঞ্জি বদল, আজ পয়লা কার্তিক](https://www.prothomalo.com/bangladesh/%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE-%E0%A6%A6%E0%A6%BF%E0%A6%A8%E0%A6%AA%E0%A6%9E%E0%A7%8D%E0%A6%9C%E0%A6%BF-%E0%A6%AC%E0%A6%A6%E0%A6%B2-%E0%A6%86%E0%A6%9C-%E0%A6%AA%E0%A7%9F%E0%A6%B2%E0%A6%BE-%E0%A6%95%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%A4%E0%A6%BF%E0%A6%95) | Ashwin becoming 31 days in 1426; the resulting Kartik boundary; the historical 16 December / 1 Poush mismatch under the former fixed calendar | Newspaper report rather than a primary calendar publication |
| [Bangladesh Teachers Portal: revised current rules](https://teachers.gov.bd/blog/details/593283) | The current first-six-month structure and the current Falgun rule | User-contributed government-platform content; retain a primary-source replacement as an open research task |
| [Bangladesh Teachers Portal: 21 February](https://www.teachers.gov.bd/content/details/1220194) | The historically observed 21 February 1952 date of 8 Falgun 1358 and the reason for later alignment | User-contributed government-platform content; a contemporary archival scan would be stronger |

The project should replace or supplement secondary sources with the original
Bangla Academy recommendation, government order, or dated government calendars
when accessible.

## Representative expectations

| Gregorian date | Expected converter result | Evidence status and purpose |
| --- | --- | --- |
| 1947-04-14 | 1 Boishakh 1354 | Product-defined start of the estimated range; rule-derived |
| 1947-08-15 | 31 Srabon 1354 | Proleptic estimate only; must not be presented as the historically observed Partition-era Bangla date |
| 1952-02-21 | 9 Falgun 1358 | Expected proleptic result; deliberately differs from the sourced historical date of 8 Falgun 1358 |
| 1971-12-16 | 2 Poush 1378 | Expected proleptic result; deliberately differs from the sourced historical date of 1 Poush 1378 |
| 1987-04-13 | 30 Chaitro 1393 | Last estimated date; rule-derived |
| 1987-04-14 | 1 Boishakh 1394 | First date classified as official-era by this project |
| 1988-03-13 | 30 Falgun 1394 | Original standardized leap-year rule; rule-derived |
| 1988-03-14 | 1 Chaitro 1394 | Original standardized leap-year rule; rule-derived |
| 1988-04-13 | 31 Chaitro 1394 | Original standardized leap day in Chaitro; rule-derived |
| 1995-04-13 | 30 Chaitro 1401 | Last day before the 1402 reform; rule-derived |
| 1995-04-14 | 1 Boishakh 1402 | Reform boundary reported by Banglapedia |
| 1996-03-14 | 31 Falgun 1402 | Falgun leap-day rule after the 1402 reform; rule-derived |
| 1996-03-15 | 1 Chaitro 1402 | Falgun-to-Chaitro transition after the 1402 reform; rule-derived |
| 2018-10-15 | 30 Ashwin 1425 | Former 30-day Ashwin rule; rule-derived from the documented rule |
| 2018-10-16 | 1 Kartik 1425 | Former Ashwin-to-Kartik transition; rule-derived |
| 2019-10-16 | 31 Ashwin 1426 | Current reform behavior reported by Prothom Alo |
| 2019-10-17 | 1 Kartik 1426 | Current reform boundary reported by Prothom Alo |
| 2020-02-14 | 1 Falgun 1426 | Current rule and leap-related boundary; rule-derived |
| 2026-04-13 | 30 Chaitro 1432 | Modern year-end boundary; rule-derived |
| 2026-04-14 | 1 Boishakh 1433 | Modern new-year boundary; rule-derived |

## Automated validation coverage

`tests/utils.test.js` currently checks:

- the estimated-range cutoff and the official-era classification boundary;
- normal and leap-related month lengths in all three rule sets;
- every month transition in representative years;
- both reform boundaries;
- the intentional difference between proleptic output and the sourced 1952 and
  1971 historical dates;
- Gregorian month/year boundaries, invalid input, and navigation.

A true Gregorian → Bangla → Gregorian round trip is intentionally deferred until
the Phase 3 inverse converter accepts an arbitrary Bangla year, month, and day.
Testing a value by deriving both sides from the same month-start helper would not
provide independent round-trip assurance.

## Correction procedure

Calendar corrections must include:

1. the affected Gregorian date;
2. the result currently shown;
3. the expected Bangla year, month, and day;
4. whether the claim concerns a historical observation or a standardized rule;
5. a link, scan, publication title, page number, or other traceable evidence.

Use the [calendar-correction issue form](https://github.com/saibshuvro/bangladeshi_national_calendar/issues/new?template=calendar-correction.yml).
Do not change a rule boundary from an unsourced calculator result alone.
