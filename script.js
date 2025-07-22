document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");
  const emptyImage = document.querySelector(".empty-image");
  const todosContainer = document.querySelector(".toDos-container");
  const progressBar = document.getElementById("progress");
  const progressNumbers = document.getElementById("numbers");

  let currentlyEditing = null;

  const toggleEmptyState = () => {
    const isEmpty = taskList.children.length === 0;
    emptyImage.style.display = isEmpty ? "block" : "none";
    todosContainer.style.justifyContent = isEmpty ? "center" : "flex-start";
    todosContainer.style.alignItems = isEmpty ? "center" : "flex-start";
    todosContainer.style.width = isEmpty ? "50%" : "100%";
  };

  const updateProgress = (checkCompletion = true) => {
    const totalTasks = taskList.children.length;
    const completedTasks =
      taskList.querySelectorAll(".checkbox:checked").length;
    progressBar.style.width = totalTasks
      ? `${(completedTasks / totalTasks) * 100}%`
      : "0%";
    progressNumbers.textContent = `
${completedTasks}/${totalTasks}`;

    if (completedTasks && totalTasks > 0 && completedTasks === totalTasks) {
      confetti();
    }
  };
  const saveTaskToLocalStorage = () => {
    const tasks = Array.from(taskList.querySelectorAll("li")).map((li) => ({
      text: li.querySelector("span").textContent,
      completed: li.querySelector(".checkbox").checked,
    }));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const loadTaskFromLocalStorage = () => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(({ text, completed }) =>
      addTask(text, completed, false)
    );
    toggleEmptyState();
    updateProgress();
  };

  const addTask = (text, completed = false, checkCompletion = true) => {
    const taskText = text || taskInput.value.trim();
    if (!taskText) return;

    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${completed ? "checked" : ""} />
      <span>${taskText}</span> 
      <div class="task-buttons">
        <button class="edit-btn">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="delete-btn">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>`;

    const checkbox = li.querySelector(".checkbox");
    const editBtn = li.querySelector(".edit-btn");

    if (completed) {
      li.classList.add("completed");
      editBtn.disabled = true;
      editBtn.style.opacity = ".5";
      editBtn.style.pointerEvents = "none";
    }

    checkbox.addEventListener("change", () => {
      const isChecked = checkbox.checked;
      li.classList.toggle("completed", isChecked);
      editBtn.disabled = isChecked;
      editBtn.style.opacity = isChecked ? ".5" : "1";
      editBtn.style.pointerEvents = isChecked ? "none" : "auto";
      updateProgress();
      saveTaskToLocalStorage();
    });

    editBtn.addEventListener("click", () => {
      if (!checkbox.checked) {
        taskInput.value = li.querySelector("span").textContent;
        currentlyEditing = li;
        li.remove();
        toggleEmptyState();
        updateProgress(false);
        saveTaskToLocalStorage();
      }
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      li.remove();
      toggleEmptyState();
      updateProgress();
      saveTaskToLocalStorage();
    });

    if (currentlyEditing) {
      taskList.insertBefore(li, taskList.children[0]);
      currentlyEditing = null;
    } else {
      taskList.appendChild(li);
    }

    taskInput.value = "";
    toggleEmptyState();
    updateProgress(checkCompletion);
  };

  addTaskBtn.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent form submission
    addTask();
  });

  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTask();
    }
  });

  toggleEmptyState(); // Ensure image shows on first load
  loadTaskFromLocalStorage();
});
const launchConfetti = () => {
  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
  };

  function shoot() {
    confetti({
      ...defaults,
      particleCount: 30,
      scalar: 1.2,
      shapes: ["circle", "square"],
      colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
    });

    confetti({
      ...defaults,
      particleCount: 20,
      scalar: 2,
      shapes: ["emoji"],
      shapeOptions: {
        emoji: {
          value: ["🦄", "🌈"],
        },
      },
    });
  }

  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);
};
