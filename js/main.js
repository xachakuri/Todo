const ACTIVE = "active";
const CHECKED = "checked";


const deskTaskInput = document.querySelector(".new-todo"); //Начальный инпут //
const todoContainer = document.querySelector(".todo-list"); // Элемент списка ul //]
const footerFilter = document.getElementById("footer_filters"); //Добавление футера фильтров //
const todoList =JSON.parse(localStorage.getItem("todoList")) ?? []; // Массив задач //
const todoItems = document.getElementsByClassName("todo-item"); //Массив li //
const toggleAllCheckboxes = document.querySelector(".toggleAll"); //Кнопка toggleAllCheckboxes //
const isAllToggled = JSON.parse(localStorage.getItem("toggleAllCheckboxes")); //Значение toggle (true or false) //
toggleAllCheckboxes.checked = isAllToggled;

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
  return `<li class="todo-item   ${
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
  localStorage.setItem("toggleAllCheckboxes", toggleAllCheckboxes.checked);
};
//Проверка массива todoList,если у всех элементов ключ completed:true,то передаст true,иначе false//
const updateToggleAll = () => {
   if (todoList.length>0) {
    (toggleAllCheckboxes.checked = todoList.every(({ completed }) => completed)) ;
  }
  else {
    toggleAllCheckboxes.checked= false;
  }
}

//Счетчик оставшихся активных задач //
const setCount = () => {
  const count = document.getElementById("count");
  const todoNotCompleted = todoList.filter((item) => !item.completed).length;
  count.textContent = `${todoNotCompleted}`;
};
//Функция для вызова и удаление футера фильтров //
const addFooter = () => {
  if (todoList.length > 0) {
    footerFilter.classList.remove("invisible");
    footerFilter.classList.add("visible");
  } else {
    footerFilter.classList.add("invisible");
    footerFilter.classList.remove("visible");
  }
};

// Инициализация страницы и обновление массива todoList //
const renderInitialTodos = () => {
  todoContainer.textContent = "";
  if (todoList.length > 0 ) {
    todoList.forEach((item, i) => {
      todoContainer.innerHTML += createTemplate(item, i);
    });
  }
  setCount();
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
  changeStatus();
};

// Прослушивание инпута  на нажатие enter и добавление его в список //
deskTaskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && deskTaskInput.value != 0) {
    addItem(event.target.value);
    changeStatus();
  }
});

//Потеря фокуса на инпуте //
deskTaskInput.onblur = function (e) {
  if (deskTaskInput.value != 0) {
    addItem(e.target.value);
    changeStatus();
  }
};


// Удаление задачи //
const deleteTask = (i) => {
  todoList.splice(i,1)
  todoItems[i].remove();
  changeStatus();
  renderInitialTodos();
};

//Удаление выполненных задач //
const deleteCompletedTasks = () => {
  for (let i = todoList.length - 1; i >= 0; i--) {
    if (todoList[i].completed) {
      todoList.splice(i, 1);
      todoItems[i].remove();
      changeStatus();
      renderInitialTodos();
    }
  }
};
const btnClearTask = document.querySelector(".clear_task"); //кнопка удаления всех выполненных задач //
btnClearTask.onclick = () => {
  deleteCompletedTasks();
  changeStatus();
};
//Прослушивание клика кнопки toggleAllCheckboxes для выделения всех задач (сделать выполненными либо сбросить их) //
toggleAllCheckboxes.addEventListener("click", (e) => {
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
  changeStatus();
});
//Фильтр кнопок All,active,completed //
const btnFiltersTasks = document.querySelector(".filters_btns");
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
  changeStatus();
});

//Добавление класса "selected" для активного "а" в кнопках фильтров //
const btnFilterTask = document.querySelectorAll(".filter_btn");
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

    changeStatus();
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

changeStatus = function() {
  updateToggleAll();
  updateLocal();
  setCount();
  addFooter();
}

window.onload = function() {
renderInitialTodos();
addFooter();
};
