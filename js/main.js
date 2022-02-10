const ACTIVE = "active";
const CHECKED = "checked";

const deskTaskInput = document.querySelector(".newTodo"); //Начальный инпут //
const todoContainer = document.querySelector(".todoList"); // Элемент списка ul //]
const footerFilter = document.querySelector(".footerFilters"); //Добавление футера фильтров //
const toggleCheckBox = document.querySelector(".toggleAll"); //Кнопка toggleCheckBox //
const todoItems = document.getElementsByClassName("todoItem"); //Массив li //
const todoList = JSON.parse(localStorage.getItem("todoList")) ?? []; // Массив задач //

const addItem = (description) => {
  //Создание задачи//
  todoContainer.innerHTML += createTemplate(
    {
      description,
      completed: false,
    },
    todoList.length
  );
  //Добавление в массив //
  todoList.push({
    description,
    completed: false,
  });
  updateLocal();
  deskTaskInput.value = "";
};
// Создание Шаблона задачи //
const createTemplate = (item, i) => {
  return `<li class="todoItem   ${item.completed ? "checked" : "active"}">
  <div class="view">
    <input onclick="completeTask(${i})" type="checkbox"  class="toogle" ${
    item.completed ? "checked" : ""
  }>
    <label onclick="editTask(${i}, event)">${item.description}</label>
    <button onclick="deleteTask(${i})" class="destroy"></button>
    </div>
    </li>`;
};

// Обновление LocalStorage //
const updateLocal = () => {
  localStorage.setItem("todoList", JSON.stringify(todoList));
};
//Проверка массива todoList,если у всех элементов ключ completed:true,то передаст true,иначе false//
const updateToggleAll = () => {
  if (todoList.length > 0) {
    toggleCheckBox.checked = todoList.every(({ completed }) => completed);
  } else {
    toggleCheckBox.checked = false;
  }
};

const counterActiveTask = document.querySelector(".counterActiveTask");
//Счетчик оставшихся активных задач //
const updateActiveTasksCount = () => {
  const todoNotCompleted = todoList.filter((item) => !item.completed).length;
  counterActiveTask.textContent = `${todoNotCompleted}`;
};
//Функция для вызова и удаление футера фильтров //
const updateFooter = () => {
  if (todoList.length) {
    footerFilter.style.display = "block";
  } else {
    footerFilter.style.display = "none";
  }
};

// Инициализация страницы и обновление массива todoList //
const renderInitialTodos = () => {
  todoContainer.textContent = "";
  if (todoList.length) {
    todoList.forEach((item, i) => {
      todoContainer.innerHTML += createTemplate(item, i);
    });
  }
  updateActiveTasksCount();
};
// Выполнение задачи списка //
const completeTask = (i) => {
  todoList[i].completed = !todoList[i].completed;
  if (todoList[i].completed) {
    todoItems[i].classList.add("checked");
    todoItems[i].classList.remove("active");
  } else {
    todoItems[i].classList.remove("checked");
    todoItems[i].classList.add("active");
  }
  updateAppState();
};

// Прослушивание инпута  на нажатие enter и добавление его в список //
deskTaskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && deskTaskInput.value != 0) {
    addItem(event.target.value);
    updateAppState();
  }
});

// Удаление задачи //
const deleteTask = (i) => {
  todoList.splice(i, 1);
  todoItems[i].remove();
  updateAppState();
  renderInitialTodos();
};

//Удаление выполненных задач //
const deleteCompletedTasks = () => {
  for (let i = todoList.length - 1; i >= 0; i--) {
    if (todoList[i].completed) {
      deleteTask(i);
    }
  }
};
const btnClearTask = document.querySelector(".clearTask"); //кнопка удаления всех выполненных задач //
btnClearTask.onclick = () => {
  deleteCompletedTasks();
};
//Прослушивание клика кнопки toggleCheckBox для выделения всех задач (сделать выполненными либо сбросить их) //
toggleCheckBox.addEventListener("click", (e) => {
  // Меняем массив с элементами
  todoList.forEach((elem) => {
    elem.completed = e.target.checked;
  });

  // Меняем отображение в html
  for (const item of todoItems) {
    if (e.target.checked) {
      item.classList.add("checked");
      item.classList.remove("active");
    } else {
      item.classList.remove("checked");
      item.classList.add("active");
    }
  }
  updateAppState();
});
//Фильтр кнопок All,active,completed //
const btnFiltersTasks = document.querySelector(".filtersBtns");
btnFiltersTasks.addEventListener("click", (event) => {
  //По клику по элементу узнаем его filterClass и дальше запускаем switch //
  const filterClass = event.target.dataset["filter"];
  switch (filterClass) {
    case ACTIVE:
      todoContainer.classList.add(ACTIVE);
      todoContainer.classList.remove(CHECKED);
      break;
    case CHECKED:
      todoContainer.classList.add(CHECKED);
      todoContainer.classList.remove(ACTIVE);
      break;
    default:
      todoContainer.classList.remove(CHECKED, ACTIVE);
  }
});

//Добавление класса "selected" для активного "а" в кнопках фильтров //
const btnFilterTask = document.querySelectorAll(".filterBtn");
btnFilterTask.forEach((item) => {
  item.addEventListener("click", () => {
    btnFilterTask.forEach((elem) => {
      elem.classList.remove("selected");
    });
    item.classList.add("selected");
  });
});

//функция для редактирования задачи списка //
const editTask = (i, event) => {
  const itemLabel = event.target;
  const input = document.createElement("input");
  // вставляем инпут и даём ему фокус
  todoItems[i].appendChild(input);
  input.focus();
  input.classList.add("edit");
  todoItems[i].classList.add("editing");
  input.value = todoList[i].description;

  //прослушиваем потерю фокуса и убирает инпту
  input.addEventListener("blur", (e) => {
    if (!e.target.value) {
      deleteTask(i);
    } else {
      // удаляем поле
      todoItems[i].removeChild(input);
      todoItems[i].classList.remove("editing");
      // добавляем текст в ячейку
      todoList[i].description = e.target.value;
      itemLabel.innerText = e.target.value;
      updateLocal();
    }
    deskTaskInput.focus();
  });
  input.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      deskTaskInput.focus();
    }
  });
};

updateAppState = function () {
  updateToggleAll();
  updateLocal();
  updateActiveTasksCount();
  updateFooter();
};

window.onload = function () {
  renderInitialTodos();
  updateFooter();
  updateToggleAll();
};
