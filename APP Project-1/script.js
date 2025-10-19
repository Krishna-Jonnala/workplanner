document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addBtn = document.getElementById("addBtn");
  const prioritySelect = document.getElementById("priority");
  const taskList = document.getElementById("taskList");
  const filterBtns = document.querySelectorAll(".filter-btn");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const saveTasks = () => localStorage.setItem("tasks", JSON.stringify(tasks));

  const renderTasks = (filter = "all") => {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
      if (filter === "completed") return task.completed;
      if (filter === "active") return !task.completed;
      return true;
    });

    filteredTasks.forEach((task, index) => {
      const li = document.createElement("li");
      if (task.completed) li.classList.add("completed");

      const taskInfo = document.createElement("div");
      taskInfo.classList.add("task-info");
      taskInfo.innerHTML = `<strong>${task.text}</strong>
                            <small>Added: ${task.time}</small>
                            <span class="task-priority">Priority: ${task.priority}</span>`;

      const taskActions = document.createElement("div");
      taskActions.classList.add("task-actions");

      const doneImg = document.createElement("img");
      doneImg.src = "images/done.png";
      doneImg.title = "Mark as done";
      doneImg.addEventListener("click", () => toggleTask(index));

      const deleteImg = document.createElement("img");
      deleteImg.src = "images/delete.png";
      deleteImg.title = "Delete task";
      deleteImg.addEventListener("click", () => deleteTask(index));

      taskActions.append(doneImg, deleteImg);

      li.append(taskInfo, taskActions);
      taskList.appendChild(li);
    });
  };

  const addTask = () => {
    const text = taskInput.value.trim();
    const priority = prioritySelect.value;

    if (text === "") return alert("Please enter a task!");

    const time = new Date().toLocaleString();

    tasks.push({ text, priority, completed: false, time });
    saveTasks();
    renderTasks();
    taskInput.value = "";
  };

  const toggleTask = (index) => {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  };

  const deleteTask = (index) => {
    if (confirm("Delete this task?")) {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    }
  };

  addBtn.addEventListener("click", addTask);

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".filter-btn.active").classList.remove("active");
      btn.classList.add("active");
      renderTasks(btn.dataset.filter);
    });
  });

  renderTasks();
});
