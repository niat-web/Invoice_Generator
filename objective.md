# Invoice_Generator

## Objective
This project implements a dynamic invoice generator using JavaScript, HTML, and CSS. It allows users to input customer information, add items to the invoice, calculate the total amount including tax and discounts, preview the invoice, and clear the form. The application includes dark mode functionality and integrates with an external API to display product information.

## Output
<iframe src="https://niat-web.github.io/Invoice_Generator/" height="1000" width="300" title="Invoice_Generator"></iframe>

## Project Requirements
**Technologies:** HTML, CSS, JavaScript, Bootstrap (implied), Font Awesome (implied), API integration (using `fetch`)

## Features to Implement
- Dynamic item row addition and removal.
- Real-time invoice calculation based on item details, tax rates, and discount.
- Invoice preview generation with customer and item information.

## UI Enhancements
- Dark mode toggle for improved user experience.
- Display product data from an external API.

## Project Tasks & Expected Outcomes
| Task | Expected Outcome |
|------|------------------|
| Implement item addition | Users can dynamically add rows to the item table. |
| Implement item removal | Users can remove unwanted rows from the item table. |
| Calculate invoice total | The application accurately calculates the invoice total based on item details, tax, and discounts. |
| Generate invoice preview | The application displays a preview of the invoice with all relevant information. |
| Implement Dark Mode | The application switches between light and dark themes. |
| Fetch data from API | Product data is successfully fetched from the API. |
| Display API Data | The fetched data is displayed in a user-friendly format. |
| Clear Form Data | On submit, the form is cleared, ready for a new invoice. |

## JavaScript Concepts
| Concept | Implementation |
|---------|----------------|
| DOM manipulation | Adding and removing item rows, updating invoice preview content, toggling dark mode classes. |
| Event listeners | Handling button clicks for adding items, calculating the invoice, toggling dark mode, and submitting data. |
| Array iteration | Looping through item rows to calculate totals. |
| Form validation | Validating customer form input before calculation. |
| Asynchronous JavaScript | Fetching and handling data from an external API using async/await. |

## API Details
| API | Endpoint | Description |
|-----|----------|-------------|
| Free Test API | `https://freetestapi.com/api/v1/products` | Fetches product data (name, description, image, price, rating, brand) for display in the application. |