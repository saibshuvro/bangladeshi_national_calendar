
# Bangladeshi National Calendar

This project is a Bangladeshi National Calendar built using **HTML**, **CSS**, and **JavaScript**. It displays both the Bangla and English calendars, allowing users to navigate between months and select specific dates. The calendar also supports color inversion (light/dark theme switch) and allows you to go to a specific date.

## Features:
- Displays both **Bangla** and **English** months and dates.
- Allows navigation through **Bangla months** and **English months**.
- Users can select a specific date using a **date picker modal**.
- **Color inversion** for switching between light and dark themes.
- Responsive sidebar for easy navigation.

## Project Structure:
The project consists of four main files:

- `index.html`: The main HTML structure of the calendar.
- `style.css`: The styling and appearance of the calendar.
- `script.js`: The JavaScript functionality for populating the calendar, handling events, and managing the theme toggle.
- `utils.js`: Utility functions for handling date conversion, Bangla month calculations, and other date-related logic.

### File Descriptions:

#### `index.html`
This file contains the structure of the calendar, including the navbar, sidebar, calendar grid, and modal for date selection. It also includes a button for toggling the color theme (light/dark).

#### `style.css`
This file defines the visual appearance of the calendar. It uses a dark theme by default but allows for color inversion through the `.invert-colors` class.

#### `script.js`
This JavaScript file contains the logic for:
- Populating the calendar grid.
- Handling the navigation through months.
- Managing the **"Invert Colors"** button that toggles the theme.

#### `utils.js`
This file contains utility functions to:
- Convert **Gregorian dates** to **Bangla dates**.
- Calculate the start date of the next and previous Bangla months.
- Map Bangla month names to Bengali text.
- Handle leap years and month names.

## How to Run the Project:

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/saibshuvro/bangladeshi_national_calendar.git
   ```

2. Navigate to the project directory:
   ```bash
   cd bangladeshi_national_calendar
   ```

3. Open the `index.html` file in your browser to see the calendar in action.

Alternatively, you can use VS Code's **Live Server** extension to run the project on a local development server.

### Dependencies:
This project does not rely on any external libraries. All functionality is built with native JavaScript, HTML, and CSS.

### Functions in `utils.js`:
1. **`isLeapYear(banglaYear)`**: Determines if a given **Bangla year** is a leap year.
2. **`getBanglaMonths(banglaYear)`**: Returns an array of months with the correct number of days based on the provided **Bangla year**.
3. **`convertToBanglaDate(englishDate)`**: Converts a **Gregorian date** to a **Bangla date**.
4. **`calculateBanglaMonthAndDay(daysSinceBoishakhStart, banglaYear)`**: Calculates the **Bangla month and day** from the number of days since **Pohela Boishakh**.
5. **`getGregorianDateOfBanglaMonthStart(englishDate, banglaMonthName, banglaYear)`**: Returns the **Gregorian date** for the **1st of a given Bangla month**.
6. **`getNextBanglaMonthStart(objDateTimeBN)`**: Calculates the start date of the next Bangla month.
7. **`getPreviousBanglaMonthStart(objDateTimeBN)`**: Calculates the start date of the previous Bangla month.
8. **`getEnglishMonths(objDate)`**: Returns the **English month** with the number of days.
9. **`toBanglaName(banglaMonthName)`**: Converts a Bangla month name to its **Bengali script** equivalent.

## How Color Inversion Works:
The color inversion feature is toggled with the **"Change Theme"** button. When clicked, the theme switches between a dark theme and an inverted (light) theme.

- The `.invert-colors` class is toggled on the `body` element, applying `filter: invert(1)` to invert all colors.
- Images and icons are excluded from the inversion effect by setting `filter: invert(0)` on `img` tags.

## Contributing:
If you would like to contribute to this project, feel free to fork the repository and submit pull requests. Make sure to follow the code style and write descriptive commit messages.

