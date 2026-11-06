// ============================================================
// app.js — Life Dashboard
// All JavaScript logic for the project goes here.
// Tasks will add functions section by section.
// ============================================================

// ============================================================
// TASK 2 — Greeting Section: Live Clock and Date
// ============================================================

// updateClock() runs every second to keep the display current.
// It reads the real system time using JavaScript's Date object,
// then writes the formatted values into the HTML elements.

function updateClock() {
  const now = new Date(); // get the current date and time right now

  // --- Time of day greeting ---
  const hour = now.getHours(); // 0–23
  let timeOfDay;
  if (hour < 12) {
    timeOfDay = 'Good morning';
  } else if (hour < 18) {
    timeOfDay = 'Good afternoon';
  } else {
    timeOfDay = 'Good evening';
  }

  // Read the saved name from LocalStorage.
  // If the user hasn't saved a name yet, fall back to "Friend".
  const userName = localStorage.getItem('userName') || 'Friend';
  document.getElementById('greeting-text').textContent =
    timeOfDay + ', ' + userName + '!';

  // --- Date formatting (e.g. "Friday, 6 November 2026") ---
  const dayNames   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const monthNames = ['January','February','March','April','May','June',
                      'July','August','September','October','November','December'];

  const dayName   = dayNames[now.getDay()];
  const day       = now.getDate();
  const monthName = monthNames[now.getMonth()];
  const year      = now.getFullYear();

  document.getElementById('current-date').textContent =
    dayName + ', ' + day + ' ' + monthName + ' ' + year;

  // --- Time formatting (e.g. "09:05:32 AM") ---
  let hours   = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0'); // always 2 digits
  const seconds = String(now.getSeconds()).padStart(2, '0'); // always 2 digits
  const ampm  = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;       // convert 24h → 12h
  hours = hours || 12;      // 0 should display as 12
  const hoursStr = String(hours).padStart(2, '0');

  document.getElementById('current-time').textContent =
    hoursStr + ':' + minutes + ':' + seconds + ' ' + ampm;
}

// Run once immediately so there is no blank flash on load,
// then repeat every 1000 ms (1 second) forever.
updateClock();
setInterval(updateClock, 1000);

// ============================================================
// TASK 3 — Custom Name Feature
// ============================================================

// saveUserName() reads what the user typed, saves it to
// LocalStorage, then immediately updates the greeting.
function saveUserName() {
  const input = document.getElementById('name-input');
  const name  = input.value.trim(); // remove accidental leading/trailing spaces

  if (name === '') {
    alert('Please enter a name before saving.');
    return; // stop here — don't save an empty string
  }

  localStorage.setItem('userName', name); // persist to LocalStorage
  input.value = '';                        // clear the input field after saving
  updateClock();                           // refresh greeting immediately
}

// loadUserName() runs once on page load.
// If a name was previously saved, it pre-fills the input field
// so the user can see and edit what is currently stored.
function loadUserName() {
  const savedName = localStorage.getItem('userName');
  if (savedName) {
    document.getElementById('name-input').placeholder = savedName;
  }
}

// Wire the Save Name button to saveUserName()
document.getElementById('save-name-btn').addEventListener('click', saveUserName);

// Also allow pressing Enter inside the input field to save
document.getElementById('name-input').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    saveUserName();
  }
});

// Load the saved name when the page first opens
loadUserName();

// ============================================================
// TASK 5 — Focus Timer Logic
// ============================================================

// How many seconds the timer starts with: 25 minutes × 60 = 1500
const TIMER_DURATION = 25 * 60;

// remainingSeconds tracks how much time is left right now.
// It starts at 1500 and counts down to 0.
let remainingSeconds = TIMER_DURATION;

// timerInterval holds the reference returned by setInterval().
// We need to keep it so we can cancel it with clearInterval() later.
// null means the timer is not currently running.
let timerInterval = null;

// formatTime(seconds) converts a raw number of seconds into "MM:SS".
// Example: 90 seconds → "01:30"
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);          // whole minutes
  const secs = seconds % 60;                       // leftover seconds
  return String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
}

// updateTimerDisplay() writes the current remainingSeconds
// into the #timer-display element so the user can see it.
function updateTimerDisplay() {
  document.getElementById('timer-display').textContent = formatTime(remainingSeconds);
}

// startTimer() begins the countdown.
// Guard: if the timer is already running (timerInterval !== null),
// calling Start again does nothing — prevents double-speed counting.
function startTimer() {
  if (timerInterval !== null) return; // already running, ignore

  timerInterval = setInterval(function () {
    remainingSeconds--;         // subtract one second
    updateTimerDisplay();       // refresh what the user sees

    // When the counter hits zero, stop automatically and notify the user.
    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      remainingSeconds = 0;
      updateTimerDisplay();
      alert('⏰ Focus session complete! Great work — take a short break.');
    }
  }, 1000); // fires every 1000 milliseconds = every 1 second
}

// stopTimer() pauses the countdown without resetting it.
// Pressing Start again will resume from where it left off.
function stopTimer() {
  clearInterval(timerInterval); // cancel the running interval
  timerInterval = null;         // mark as not running
}

// resetTimer() stops the timer and restores the full 25 minutes.
function resetTimer() {
  clearInterval(timerInterval);
  timerInterval    = null;
  remainingSeconds = TIMER_DURATION; // back to 1500
  updateTimerDisplay();              // show "25:00" again
}

// Wire each button to its matching function
document.getElementById('timer-start-btn').addEventListener('click', startTimer);
document.getElementById('timer-stop-btn').addEventListener('click', stopTimer);
document.getElementById('timer-reset-btn').addEventListener('click', resetTimer);

// ============================================================
// TASK 7 — To-Do List Logic
// ============================================================

// tasks is the master array that holds every task object.
// Each task looks like: { id: 1234567890, text: "Buy groceries", completed: false }
let tasks = [];

// generateId() creates a unique number for each task using the
// current timestamp. This lets us identify which task to edit
// or delete without relying on its position in the array.
function generateId() {
  return Date.now();
}

// ---- DUPLICATE CHECK (Challenge #3) ----
// isDuplicate(text) checks if any existing task already has
// the same text, ignoring uppercase/lowercase differences.
// "Buy milk" and "buy MILK" are treated as the same task.
function isDuplicate(text) {
  const normalised = text.trim().toLowerCase();
  return tasks.some(function (task) {
    return task.text.toLowerCase() === normalised;
  });
}

// ---- ADD ----
// addTask() reads the input field, validates the text,
// checks for duplicates, creates a task object, and re-renders.
function addTask() {
  const input = document.getElementById('task-input');
  const text  = input.value.trim();

  // Do not add an empty task
  if (text === '') {
    alert('Please type a task before adding.');
    return;
  }

  // Challenge #3: block duplicate tasks
  if (isDuplicate(text)) {
    alert('This task already exists!');
    input.value = '';
    return;
  }

  // Build the task object and push it into the array
  const newTask = {
    id:        generateId(),
    text:      text,
    completed: false
  };
  tasks.push(newTask);

  input.value = ''; // clear the input field ready for the next task
  renderTasks();    // rebuild the visible list
  saveTasks();      // persist to LocalStorage (added properly in Task 8;
                    // calling it here now so the pattern is already in place)
}

// ---- TOGGLE COMPLETE ----
// toggleComplete(id) finds the task with the matching id,
// flips its completed boolean, and re-renders.
function toggleComplete(id) {
  const task = tasks.find(function (t) { return t.id === id; });
  if (task) {
    task.completed = !task.completed; // true → false, false → true
  }
  renderTasks();
  saveTasks();
}

// ---- EDIT ----
// editTask(id) uses the browser's built-in prompt() to ask
// the user for new text, then updates the task and re-renders.
function editTask(id) {
  const task = tasks.find(function (t) { return t.id === id; });
  if (!task) return;

  const newText = prompt('Edit task:', task.text);

  // prompt() returns null if the user pressed Cancel
  if (newText === null) return;

  const trimmed = newText.trim();

  if (trimmed === '') {
    alert('Task text cannot be empty.');
    return;
  }

  // Check for duplicates, but allow keeping the same text (skip self-match)
  const isDuplicateEdit = tasks.some(function (t) {
    return t.id !== id && t.text.toLowerCase() === trimmed.toLowerCase();
  });

  if (isDuplicateEdit) {
    alert('Another task with that name already exists!');
    return;
  }

  task.text = trimmed;
  renderTasks();
  saveTasks();
}

// ---- DELETE ----
// deleteTask(id) removes the task from the array using filter(),
// which returns a new array containing every task EXCEPT the one
// whose id matches — then re-renders.
function deleteTask(id) {
  tasks = tasks.filter(function (t) { return t.id !== id; });
  renderTasks();
  saveTasks();
}

// ---- RENDER ----
// renderTasks() clears the <ul> and rebuilds it from scratch
// based on the current tasks array. This is the simplest reliable
// approach for a beginner project — rebuild everything on each change.
function renderTasks() {
  const list = document.getElementById('task-list');
  list.innerHTML = ''; // wipe the current content

  if (tasks.length === 0) {
    list.innerHTML = '<li class="empty-message">No tasks yet. Add one above!</li>';
    return;
  }

  tasks.forEach(function (task) {
    // Create the <li> element
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type    = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('click', function () {
      toggleComplete(task.id);
    });

    // Task text span
    const span = document.createElement('span');
    span.className   = 'task-text';
    span.textContent = task.text;

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className   = 'task-btn edit-btn';
    editBtn.textContent = '✏ Edit';
    editBtn.addEventListener('click', function () {
      editTask(task.id);
    });

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className   = 'task-btn delete-btn';
    deleteBtn.textContent = '🗑 Delete';
    deleteBtn.addEventListener('click', function () {
      deleteTask(task.id);
    });

    // Assemble the row: checkbox → text → edit → delete
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    list.appendChild(li);
  });
}

// ---- LOCALSTORAGE: SAVE & LOAD (Task 8) ----

// saveTasks() converts the tasks array into a JSON string and
// stores it in LocalStorage under the key 'tasks'.
//
// Why JSON? LocalStorage can only store plain text (strings).
// JSON.stringify() turns an array or object into a text representation
// so it can be saved, and JSON.parse() turns it back when we load it.
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// loadTasks() reads the saved JSON string from LocalStorage,
// converts it back into a real JavaScript array, and assigns
// it to the tasks variable so the rest of the app can use it.
function loadTasks() {
  const saved = localStorage.getItem('tasks');

  // getItem() returns null if nothing has been saved yet.
  // Only parse if there is actually something to parse.
  if (saved !== null) {
    tasks = JSON.parse(saved);
  }
}

// Wire the Add Task button to addTask()
document.getElementById('add-task-btn').addEventListener('click', addTask);

// Allow pressing Enter inside the task input to add a task
document.getElementById('task-input').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    addTask();
  }
});

// On page load: restore saved tasks first, then render them.
// The order matters — load before render, or the list will appear empty.
loadTasks();
renderTasks();

// ============================================================
// TASK 9 — Quick Links Logic
// ============================================================

// links is the master array for all saved link objects.
// Each link looks like: { id: 1234567890, label: "YouTube", url: "https://youtube.com" }
let links = [];

// ---- ADD ----
// addLink() reads both input fields, validates them,
// builds a link object, saves, and re-renders.
function addLink() {
  const labelInput = document.getElementById('link-label-input');
  const urlInput   = document.getElementById('link-url-input');

  const label = labelInput.value.trim();
  const url   = urlInput.value.trim();

  // Both fields are required
  if (label === '') {
    alert('Please enter a label for the link (e.g. "YouTube").');
    return;
  }

  if (url === '') {
    alert('Please enter a URL (e.g. "https://youtube.com").');
    return;
  }

  // Make sure the URL starts with http:// or https://
  // so it opens correctly in a new tab instead of being
  // treated as a relative path on the same page.
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    alert('URL must start with http:// or https://');
    return;
  }

  const newLink = {
    id:    Date.now(),
    label: label,
    url:   url
  };

  links.push(newLink);

  // Clear both input fields after a successful add
  labelInput.value = '';
  urlInput.value   = '';

  renderLinks();
  saveLinks();
}

// ---- DELETE ----
// deleteLink(id) removes the matching link from the array and re-renders.
function deleteLink(id) {
  links = links.filter(function (link) { return link.id !== id; });
  renderLinks();
  saveLinks();
}

// ---- RENDER ----
// renderLinks() clears #links-container and rebuilds it
// from the current links array.
function renderLinks() {
  const container = document.getElementById('links-container');
  container.innerHTML = ''; // clear existing cards

  if (links.length === 0) {
    container.innerHTML = '<p class="links-empty-message">No links saved yet. Add one above!</p>';
    return;
  }

  links.forEach(function (link) {
    // Outer card div
    const card = document.createElement('div');
    card.className = 'link-card';

    // The clickable anchor tag — opens in a new browser tab
    const anchor = document.createElement('a');
    anchor.href        = link.url;
    anchor.textContent = '🔗 ' + link.label;
    anchor.target      = '_blank';            // open in new tab
    anchor.rel         = 'noopener noreferrer'; // security best practice for target="_blank"

    // Small delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className   = 'link-delete-btn';
    deleteBtn.textContent = '✕';
    deleteBtn.title       = 'Remove this link';
    deleteBtn.addEventListener('click', function () {
      deleteLink(link.id);
    });

    card.appendChild(anchor);
    card.appendChild(deleteBtn);
    container.appendChild(card);
  });
}

// ---- LOCALSTORAGE: SAVE & LOAD ----

// saveLinks() serialises the links array to JSON and stores it.
function saveLinks() {
  localStorage.setItem('links', JSON.stringify(links));
}

// loadLinks() reads the saved JSON and restores the links array.
function loadLinks() {
  const saved = localStorage.getItem('links');
  if (saved !== null) {
    links = JSON.parse(saved);
  }
}

// Wire the Add Link button
document.getElementById('add-link-btn').addEventListener('click', addLink);

// Allow pressing Enter in either input field to add the link
document.getElementById('link-label-input').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') addLink();
});
document.getElementById('link-url-input').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') addLink();
});

// On page load: restore saved links and render them
loadLinks();
renderLinks();

// ============================================================
// TASK 10 — Light / Dark Mode Toggle (Challenge #1)
// ============================================================

// toggleTheme() adds or removes the 'dark-mode' class on <body>,
// updates the button label, and saves the preference to LocalStorage.
function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-mode');
  // toggle() returns true if the class was ADDED (now dark),
  // false if it was REMOVED (now light).

  const btn = document.getElementById('theme-toggle-btn');
  btn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';

  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// loadTheme() runs once on page load.
// It reads the saved preference and applies the correct class
// before anything is painted, so there is no flash of the wrong theme.
function loadTheme() {
  const saved = localStorage.getItem('theme');
  const btn   = document.getElementById('theme-toggle-btn');

  if (saved === 'dark') {
    document.body.classList.add('dark-mode');
    btn.textContent = '☀️ Light Mode';
  } else {
    // 'light' or nothing saved — stay in light mode (the default)
    btn.textContent = '🌙 Dark Mode';
  }
}

// Wire the toggle button
document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);

// Apply the saved theme immediately on page load
loadTheme();
