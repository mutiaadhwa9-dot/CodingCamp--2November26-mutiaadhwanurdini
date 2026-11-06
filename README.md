# Life Dashboard

A personal productivity dashboard built with HTML, CSS, and Vanilla JavaScript — no frameworks, no backend.

Created as a Coding Camp assignment by **Mutia Adhwanurdini**.

---

## Features

### Core
- **Live Greeting** — shows "Good morning / afternoon / evening" based on the current hour, with today's date and a ticking clock
- **Focus Timer** — 25-minute countdown with Start, Stop, and Reset controls
- **To-Do List** — add, edit, complete (strikethrough), and delete tasks
- **Quick Links** — save shortcuts to favourite websites; each opens in a new tab
- **LocalStorage** — tasks and links persist between page refreshes automatically

### Bonus Challenges
- **Light / Dark Mode** — toggle button in the top-right corner; preference is saved across sessions
- **Custom Name** — enter your name once and the greeting remembers it after a refresh
- **Duplicate Prevention** — adding a task that already exists (case-insensitive) is blocked with an alert

---

## How to Open

1. Download or clone this repository
2. Open `index.html` by double-clicking it — it runs directly in any modern browser
3. No install, no server, no build step required

---

## Project Structure

```
project-root/
├── index.html        ← Single-page app
├── css/
│   └── style.css     ← All styling, including light/dark theme variables
├── js/
│   └── app.js        ← All JavaScript logic
└── README.md
```

---

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and content |
| CSS3 | Styling, CSS custom properties for theming, flexbox layout |
| Vanilla JavaScript | All interactivity and logic |
| LocalStorage API | Persisting tasks, links, name, and theme preference |

---

## Assignment Details

- **Program:** Coding Camp
- **Submission:** 2 November 2026
- **Student:** mutiaadhwanurdini
