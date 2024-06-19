// DOM Elements
const taskTitleInput = document.getElementById("task-title");
const taskDescInput = document.getElementById("task-desc");
const taskDateInput = document.getElementById("task-date");
const addTaskBtn = document.getElementById("add-task-btn");
const clearAll = document.querySelector(".clear-btn");
const taskBox = document.querySelector(".task-box");
const sortBtn = document.getElementById("sort-btn");

// Task data
let editId,
  isEditTask = false;
let todos = JSON.parse(localStorage.getItem("todo-list")) || [];

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  addTaskBtn.addEventListener("click", addOrUpdateTask);
  clearAll.addEventListener("click", clearAllTasks);
  sortBtn.addEventListener("click", sortTasksByDueDate);

  showTodoList();
});

// Display the task list
function showTodoList() {
  let taskItems = "";

  todos.forEach((todo, id) => {
    let completed = todo.status === "completed" ? "checked" : "";
    taskItems += `
      <li class="task">
        <label for="${id}">
          <input type="checkbox" id="${id}" ${completed} onclick="updateTaskStatus(${id})">
          <div>
            <p class="title ${completed}">${todo.title}</p>
            <p class="desc">${todo.description}</p>
            <p class="date">${new Date(todo.dueDate).toLocaleString()}</p>
          </div>
        </label>
        <div class="settings">
          <i class="uil uil-ellipsis-h" onclick="showMenu(this)"></i>
          <ul class="task-menu">
            <li onclick='editTask(${id})'><i class="uil uil-pen"></i>Edit</li>
            <li onclick='deleteTask(${id})'><i class="uil uil-trash"></i>Delete</li>
          </ul>
        </div>
      </li>`;
  });

  taskBox.innerHTML = taskItems || `<span>You don't have any tasks here</span>`;
  clearAll.classList.toggle("active", todos.length > 0);
  taskBox.classList.toggle("overflow", taskBox.offsetHeight >= 300);
}

// Add or update task
function addOrUpdateTask() {
  let title = taskTitleInput.value;
  let description = taskDescInput.value;
  let dueDate = taskDateInput.value;

  if (title && description && dueDate) {
    if (isEditTask) {
      todos[editId] = {
        title,
        description,
        dueDate,
        status: todos[editId].status,
      };
      isEditTask = false;
    } else {
      todos.push({ title, description, dueDate, status: "pending" });
    }

    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodoList();
    clearInputFields();
  }
}

// Clear input fields
function clearInputFields() {
  taskTitleInput.value = "";
  taskDescInput.value = "";
  taskDateInput.value = "";
}

// Update task status
function updateTaskStatus(taskId) {
  todos[taskId].status =
    todos[taskId].status === "completed" ? "pending" : "completed";
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodoList();
}

// Edit task
function editTask(taskId) {
  let todo = todos[taskId];
  editId = taskId;
  isEditTask = true;
  taskTitleInput.value = todo.title;
  taskDescInput.value = todo.description;
  taskDateInput.value = todo.dueDate;
  taskTitleInput.focus();
}

// Delete task
function deleteTask(taskId) {
  isEditTask = false;
  todos.splice(taskId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodoList();
}

// Clear all tasks
function clearAllTasks() {
  isEditTask = false;
  todos = [];
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodoList();
}

// Sort tasks by due date
function sortTasksByDueDate() {
  todos.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodoList();
}

// Show settings menu
function showMenu(selectedTask) {
  let menuDiv = selectedTask.parentElement.lastElementChild;
  menuDiv.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target !== selectedTask) {
      menuDiv.classList.remove("show");
    }
  });
}
