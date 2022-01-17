const ACTIVE = "active";
const CHECKED = "checked";


const deskTaskInput = document.querySelector(".new-todo-js"); //Начальный инпут //
const todo = document.querySelector(".todo-list-js"); // Элемент списка ul //]
const footer_filters = document.getElementById("footer_filters"); //Добавление футера фильтров //
const todoList = localStorage.todoList? JSON.parse(localStorage.getItem("todoList")): []; // Массив задач //
const todoItems = document.getElementsByClassName("todo-item-js"); //Массив li //
const toggleAll = document.querySelector(".toggleAll-js"); //Кнопка toggleAll //
let value_toggleAll = JSON.parse(localStorage.getItem("toggleAll")); //Значение toggle (true or false) //
toggleAll.checked = value_toggleAll;

const addItem = (description) => {
  //Создание задачи//
  todo.innerHTML += createTemplate(
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
  return `<li class="todo-item todo-item-js todo-item-js_${i}  ${
    item.completed ? "checked" : "active"
  }">
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
  localStorage.setItem("toggleAll", toggleAll.checked);
};
//Проверка массива todoList,если у всех элементов ключ completed:true,то передаст true,иначе false//
const checkToggleAll = () =>
  (toggleAll.checked = todoList.every(({ completed }) => completed));

//Счетчик оставшихся активных задач //
const taskCounter = () => {
  const count = document.getElementById("count");
  let counter = 0;
  for (let i = 0; i < todoItems.length; i++)
    if (!todoItems[i].classList.contains("checked")) {
      counter++;
    }
  count.innerHTML = counter;
};
//Функция для вызова и удаление футера фильтров //
const checkFooter = () => {
  if (todoList.length > 0) {
    footer_filters.classList.remove("invisible");
    footer_filters.classList.add("visible");
  } else {
    footer_filters.classList.add("invisible");
    footer_filters.classList.remove("visible");
  }
};

// Инициализация страницы и обновление массива todoList //
const fillHtmlList = () => {
  todo.innerHTML = "";
  if (todoList.length > 0) {
    todoList.forEach((item, i) => {
      todo.innerHTML += createTemplate(item, i);
    });
  }
  taskCounter();
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
  fillHtmlList();
  checkToggleAll();
  updateLocal();
  taskCounter();
};

// Прослушивание инпута  на нажатие enter и добавление его в список //
deskTaskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && deskTaskInput.value != 0) {
    addItem(event.target.value);
    checkToggleAll();
    checkFooter();
    taskCounter();
  }
});

//Потеря фокуса на инпуте //
deskTaskInput.onblur = function (e) {
  if (deskTaskInput.value != 0) {
    addItem(e.target.value);
    checkToggleAll();
    checkFooter();
    taskCounter();
  }
};

// Удаление задачи //
const deleteTask = (i) => {
  todoList.splice(i, 1);
  todoItems[i].remove();
  updateLocal();
  fillHtmlList();
  taskCounter();
  checkFooter();
};

//Удаление выполненных задач //
const deleteCompletedTasks = () => {
  for (let i = todoList.length - 1; i >= 0; i--) {
    if (todoList[i].completed) {
      todoList.splice(i, 1);
      todoItems[i].remove();
      updateLocal();
    }
  }
};
const btn_clear_tasks = document.querySelector(".clear_task-js"); //кнопка удаления всех выполненных задач //
btn_clear_tasks.onclick = () => {
  deleteCompletedTasks();
  checkFooter();
};
//Прослушивание клика кнопки toggleAll для выделения всех задач (сделать выполненными либо сбросить их) //
toggleAll.addEventListener("click", (e) => {
  // Меняем массив с элементами
  todoList.forEach((elem) => {
    elem.completed = e.target.checked;
  });

  // Меняем отображение в html
  for (let item of todoItems) {
    if (e.target.checked) {
      item.classList.add("checked");
    } else {
      item.classList.remove("checked");
    }
  }
  fillHtmlList();
  taskCounter();
  updateLocal();
});
//Фильтр кнопок All,active,completed //
const filter_btn = document.querySelector(".buttons");
filter_btn.addEventListener("click", (event) => {
  //По клику по элементу узнаем его filterClass и дальше запускаем switch //
  let filterClass = event.target.dataset["filter"];
  switch (filterClass) {
    case ACTIVE:
      todo.classList.add(ACTIVE);
      todo.classList.remove(CHECKED);
      break;
    case CHECKED:
      todo.classList.add(CHECKED);
      todo.classList.remove(ACTIVE);
      break;
    default:
      todo.classList.remove(CHECKED, ACTIVE);
  }
  updateLocal();
});

//Добавление класса "selected" для активного "а" в кнопках фильтров //
const buttons_a = document.querySelectorAll(".buttons li a");
buttons_a.forEach((item) => {
  item.addEventListener("click", (event) => {
    buttons_a.forEach((elem) => {
      elem.classList.remove("selected");
    });
    item.classList.add("selected");
  });
});

//функция для редактирования задачи списка //
const editTask = (i, event) => {
  const itemLabel = event.target;
  const input = document.createElement("input");
  input.value = todoList[i].description;
  // вставляем инпут и даём ему фокус
  todoItems[i].appendChild(input);
  input.focus();
  input.classList.add("edit");
  todoItems[i].classList.add("editing");
  input.value = todoList[i].description;

  //прослушиваем потерю фокуса и убирает инпту
  input.addEventListener("blur", (e) => {
    if (!e.target.value) {
      todoList.splice(i, 1);
      todoItems[i].remove();
    } else {
      // удаляем поле
      todoItems[i].removeChild(input);
      todoItems[i].classList.remove("editing");
      // добавляем текст в ячейку
      todoList[i].description = e.target.value;
      itemLabel.innerText = e.target.value;
    }

    deskTaskInput.focus();

    updateLocal();
    taskCounter();
    checkFooter();
  });

  input.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      deskTaskInput.focus();
      if (!input.value.length) {
        todoList.splice(i, 1);
        todoItems[i].remove();
      }
    }
  });
};

fillHtmlList();
checkFooter();
