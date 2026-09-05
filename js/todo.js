const STORAGE_KEY = "thiranexTodoTasks";

let tasks = [];
let currentFilter = "all";



const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");

const totalCount = document.querySelector("#total-count");
const activeCount = document.querySelector("#active-count");
const completedCount = document.querySelector("#completed-count");

const emptyMessage = document.querySelector("#empty-message");
const filterButtons = document.querySelectorAll(".filter-button");




function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (savedTasks) {
      tasks = JSON.parse(savedTasks);
    }
  } catch (error) {
    console.error("Unable to load tasks:", error);
    tasks = [];
  }
}




function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Unable to save tasks:", error);
  }
}




function generateTaskId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}




function addTask(taskText) {
  const newTask = {
    id: generateTaskId(),
    text: taskText,
    completed: false
  };

  tasks.push(newTask);

  saveTasks();
  renderTasks();
}



function renderTasks() {
  todoList.replaceChildren();

  const filteredTasks = getFilteredTasks();

  filteredTasks.forEach((task) => {
    const listItem = createTaskElement(task);
    todoList.appendChild(listItem);
  });

  updateCounts();
  updateEmptyMessage(filteredTasks.length);
}



function getFilteredTasks() {
  if (currentFilter === "active") {
    return tasks.filter((task) => !task.completed);
  }

  if (currentFilter === "completed") {
    return tasks.filter((task) => task.completed);
  }

  return tasks;
}



function createTaskElement(task) {
  const listItem = document.createElement("li");

  listItem.className = "todo-item";

  if (task.completed) {
    listItem.classList.add("completed");
  }

  listItem.dataset.taskId = task.id;

  // Checkbox
  const checkbox = document.createElement("input");

  checkbox.type = "checkbox";
  checkbox.className = "todo-check";
  checkbox.checked = task.completed;
  checkbox.setAttribute(
    "aria-label",
    `Mark ${task.text} as ${task.completed ? "active" : "completed"}`
  );

  // Task text
  const taskText = document.createElement("span");

  taskText.className = "todo-text";
  taskText.textContent = task.text;

  // Actions container
  const actions = document.createElement("div");

  actions.className = "todo-actions";

  // Edit button
  const editButton = document.createElement("button");

  editButton.type = "button";
  editButton.className = "edit-button";
  editButton.dataset.action = "edit";
  editButton.textContent = "Edit";
  editButton.setAttribute("aria-label", `Edit task: ${task.text}`);

  // Delete button
  const deleteButton = document.createElement("button");

  deleteButton.type = "button";
  deleteButton.className = "delete-button";
  deleteButton.dataset.action = "delete";
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("aria-label", `Delete task: ${task.text}`);

  actions.appendChild(editButton);
  actions.appendChild(deleteButton);

  listItem.appendChild(checkbox);
  listItem.appendChild(taskText);
  listItem.appendChild(actions);

  return listItem;
}


// ================================
// UPDATE TASK
// ================================

function updateTask(taskId) {
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return;
  }

  const updatedText = prompt("Edit your task:", task.text);

  if (updatedText === null) {
    return;
  }

  const cleanedText = updatedText.trim();

  if (!cleanedText) {
    alert("Task cannot be empty.");
    return;
  }

  task.text = cleanedText;

  saveTasks();
  renderTasks();
}


// ================================
// TOGGLE TASK COMPLETION
// ================================

function toggleTask(taskId) {
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return;
  }

  task.completed = !task.completed;

  saveTasks();
  renderTasks();
}


// ================================
// DELETE TASK
// ================================

function deleteTask(taskId) {
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return;
  }

  const confirmed = confirm(`Delete "${task.text}"?`);

  if (!confirmed) {
    return;
  }

  tasks = tasks.filter((item) => item.id !== taskId);

  saveTasks();
  renderTasks();
}


// ================================
// UPDATE TASK COUNTS
// ================================

function updateCounts() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const active = total - completed;

  totalCount.textContent = total;
  activeCount.textContent = active;
  completedCount.textContent = completed;
}


// ================================
// EMPTY MESSAGE
// ================================

function updateEmptyMessage(filteredTaskCount) {
  if (filteredTaskCount === 0) {
    emptyMessage.hidden = false;
  } else {
    emptyMessage.hidden = true;
  }
}


// ================================
// CREATE TASK FORM EVENT
// ================================

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskText = todoInput.value.trim();

  if (!taskText) {
    return;
  }

  addTask(taskText);

  todoInput.value = "";
  todoInput.focus();
});


// ================================
// EVENT DELEGATION
// ================================

todoList.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");

  if (!actionButton) {
    return;
  }

  const listItem = actionButton.closest(".todo-item");

  if (!listItem) {
    return;
  }

  const taskId = listItem.dataset.taskId;
  const action = actionButton.dataset.action;

  if (action === "edit") {
    updateTask(taskId);
  }

  if (action === "delete") {
    deleteTask(taskId);
  }
});


// ================================
// CHECKBOX EVENT DELEGATION
// ================================

todoList.addEventListener("change", (event) => {
  if (!event.target.classList.contains("todo-check")) {
    return;
  }

  const listItem = event.target.closest(".todo-item");

  if (!listItem) {
    return;
  }

  const taskId = listItem.dataset.taskId;

  toggleTask(taskId);
});


// ================================
// FILTER BUTTONS
// ================================

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;

      filterButton.classList.toggle("active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });

    renderTasks();
  });
});


// ================================
// INITIALIZE APPLICATION
// ================================

loadTasks();
renderTasks();
