# Student Registration System
**BSCS 4th Semester &bull; Web Technologies Capstone Project &bull; SP26**

---

### Student Profile Header
- **Name:** [Umar Farooq]
- **Roll Number:** [F24BDOCS1M01337]
- **Sections:**  2M
- **Grade Weight:** 50 + 5 Bonus Marks

---

## Project Overview
This is an individual capstone project implementing a **Student Registration System**. The application uses a plain HTML5 front-end styled with **Custom CSS (100% framework-free layout)** and a plain JavaScript logical layer that integrates with a local **JSON Server mock REST API** backend using `fetch` with `async/await`.

All standard REST HTTP methods (GET, POST, PUT, DELETE) are implemented to manage student profiles, perform inline validation, search/filter, and view real-time registry stats.

---

## Tech Stack
- **Markup:** HTML5 (Semantic, accessible structure)
- **Styling:** Custom CSS (Framework-free design system featuring Flexbox, Grid, custom keyframes, transitions, and native styling overlays)
- **JavaScript:** Vanilla Javascript (No jQuery, React, Vue, or Angular)
- **Modals:** Native HTML5 `<dialog>` elements (Controlled natively via `.showModal()` and `.close()`)
- **Backend Database:** Local JSON Server REST API (`db.json`)
- **Data Fetching:** Fetch API with `async/await` and `try/catch` error handling

---

## Features

### 1. User Portal (`index.html`)
- **GET Request**: Dynamically fetches the list of students from the database and renders them in a responsive directory.
- **POST Request**: Submits a new registration with 7 fields (Full Name, Email, Roll Number, Phone, Department, Semester, Date).
- **Inline Validation**: Checks for:
  - Name characters (letters and spaces only, min 3 letters).
  - Format checks (email and phone formats).
  - Roll number format validation (e.g. `BCS-XX-XX` or `BSE-XX-XXX`) and **uniqueness validation** (no two students can share a roll number).
  - Date check (does not allow selecting future dates).
- **Interactive UI**: Showcases a loading overlay while querying the server, and a detailed warning panel if the JSON server is unreachable.
- **Search & Filters**: Features a debounced search bar (by name or roll number) and a department category filter.
- **Auto Re-render**: Refreshes the display list instantly upon successful registration without reloading the page.

### 2. Admin Dashboard (`admin.html`)
- **Visual Contrast**: Dark-charcoal navigation gradient, clean grid structure, and distinct admin headers.
- **Real-Time Statistics (3 metrics)**:
  - Total Registered Students (Count)
  - Active Student Rate (Percentage)
  - Senior Students (Count of students currently in semesters 5th to 8th)
- **PUT Request**: Opens a native `<dialog>` edit modal to modify a student's info (name, email, phone, department, semester, status, registration date) while keeping the Roll Number locked as a permanent key.
- **DELETE Request**: Opens a native `<dialog>` confirmation modal before removing a student record from the system.
- **Search & Filters**: Includes debounced search and filtering on the management table.

---

## Project File Structure
```text
New folder/
├── index.html       # User panel interface (Registration & Directory)
├── admin.html       # Admin panel interface (Stats & CRUD Controls)
├── style.css        # Custom CSS styling overrides (Layout, Modals, Spinners)
├── app.js           # User panel scripts & validations
├── admin.js         # Admin panel statistics & edit/delete dialog scripts
├── db.json          # JSON Server mock database
└── README.md        # Project setup & run documentation
```

---

## Installation & Running the App

### Step 1: Install & Run JSON Server
Make sure you have Node.js installed. Open your terminal in the project directory (`New folder`) and execute the following command to watch the database:

```bash
npx json-server --watch db.json --port 3000
```

*Note: Ensure it runs on port `3000` as the frontend scripts are configured to communicate with `http://localhost:3000/students`.*

### Step 2: Open the Frontend
Once JSON Server is running successfully:
- Double-click `index.html` (or open it via Live Server/browser) to launch the **Student Portal**.
- Navigate to the **Admin Dashboard** using the button in the top navigation bar.

---

## Verification & Rubric Checklist

- [x] All 4 HTTP methods used (`GET`, `POST`, `PUT`, `DELETE`).
- [x] Every fetch is inside `try/catch` and checks `response.ok`.
- [x] No `console.log()` statements left in code (except intentional logs).
- [x] Form contains at least 5 input fields (7 inputs implemented).
- [x] Inline error styles displayed dynamically without using standard `alert()` blocks.
- [x] Statistics: 3 real-time dashboard cards on the Admin panel.
- [x] Custom CSS styling applied consistently across both pages.
- [x] Native HTML5 Dialog element used for modals (100% Framework Free).
- [x] Search bar uses debounced input to prevent high-frequency filtering.

