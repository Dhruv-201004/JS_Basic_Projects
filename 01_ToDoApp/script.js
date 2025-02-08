// Loads DOM first
document.addEventListener("DOMContentLoaded", () => {
  // Get Required Elements
  const todoInput = document.getElementById("to-do-input");
  const addTaskButton = document.getElementById("add-task-btn");
  const todoList = document.getElementById("to-do-list");

  // Array For Tasks (Load from Local Storage)
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Display task
  tasks.forEach((task) => renderTasks(task));

  // Add Task Function
  addTaskButton.addEventListener("click", () => {
    const taskText = todoInput.value.trim();
    if (taskText === "") return;

    // Task Object
    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };

    tasks.push(newTask);
    todoInput.value = ""; // Clear Input

    // Save Tasks
    saveTasks();

    // Render Task
    renderTasks(newTask);
  });

  // Add to Local Storage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks)); // Convert to String
  }

  // Render Tasks
  function renderTasks(task) {
    // Create list elements
    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);

    // Check Completed
    if (task.completed) li.classList.add("completed");

    // Add HTML
    li.innerHTML = `
    <span>${task.text}</span>
    <button>Delete</button>`;

    // Append in List
    todoList.appendChild(li);

    // Toggle Completed
    li.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") return;
      task.completed = !task.completed;
      li.classList.toggle("completed");
      saveTasks();
    });

    li.querySelector("button").addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent Toggle from firing(Bubbling event)

      // Filter tasks -- Removes current task from tasks array
      tasks = tasks.filter((t) => t.id !== task.id);
      li.remove();
      saveTasks();
    });
  }
});
