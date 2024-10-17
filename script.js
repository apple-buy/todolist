const addTodoBtn = document.querySelector(".add-todo-btn")
const todoInput = document.querySelector(".todo-input")
const todosList = document.querySelector(".todos-list")
const deleteSound = document.getElementById("deleteSound")
let draggedItem = null

// Добавляем обработчик события 'click' и 'touchstart' для кнопки добавления задачи
addTodoBtn.addEventListener("click", addTodo)
addTodoBtn.addEventListener("touchstart", addTodo)

// Placeholder исчезает при фокусе и возвращается при нажатии на кнопку "+"
todoInput.addEventListener("focus", () => {
  if (todoInput.placeholder === "Нове завдання") {
    todoInput.placeholder = ""
  }
})

addTodoBtn.addEventListener("click", () => {
  if (todoInput.placeholder === "") {
    todoInput.placeholder = "Нове завдання"
  }
})

// Добавление задачи по нажатию на Enter
todoInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    addTodo()
    todoInput.placeholder = "Нове завдання"
  }
})

function addTodo() {
  const taskText = todoInput.value.trim()

  if (taskText !== "") {
    const todoItem = document.createElement("li")
    todoItem.classList.add("todo-item")
    todoItem.setAttribute("draggable", true)

    const taskSpan = document.createElement("span")
    taskSpan.classList.add("task-text")
    taskSpan.textContent = taskText

    const buttonGroup = document.createElement("div")
    buttonGroup.classList.add("button-group")

    const doneBtn = document.createElement("button")
    doneBtn.classList.add("done-btn")

    // Добавляем обработчики 'click' и 'touchstart' для кнопки завершения задачи
    doneBtn.addEventListener("click", () => {
      taskSpan.classList.toggle("completed")
      taskSpan.style.textDecoration = taskSpan.classList.contains("completed")
        ? "line-through"
        : "none"
    })
    doneBtn.addEventListener("touchstart", () => {
      taskSpan.classList.toggle("completed")
      taskSpan.style.textDecoration = taskSpan.classList.contains("completed")
        ? "line-through"
        : "none"
    })

    const deleteBtn = document.createElement("button")
    deleteBtn.classList.add("delete-btn")

    // Добавляем обработчики 'click' и 'touchstart' для кнопки удаления задачи
    deleteBtn.addEventListener("click", () => {
      playDeleteSound()
      todoItem.classList.add("removing")
      setTimeout(() => {
        todoItem.remove()
      }, 500)
    })
    deleteBtn.addEventListener("touchstart", () => {
      playDeleteSound()
      todoItem.classList.add("removing")
      setTimeout(() => {
        todoItem.remove()
      }, 700)
    })

    buttonGroup.appendChild(doneBtn)
    buttonGroup.appendChild(deleteBtn)
    todoItem.appendChild(taskSpan)
    todoItem.appendChild(buttonGroup)
    todosList.appendChild(todoItem)

    todoInput.value = ""

    // Добавляем события перетаскивания
    todoItem.addEventListener("dragstart", (e) => {
      draggedItem = todoItem
      setTimeout(() => {
        todoItem.classList.add("dragging")
      }, 0)
    })

    todoItem.addEventListener("dragend", () => {
      todoItem.classList.remove("dragging")
      draggedItem = null
    })

    todoItem.addEventListener("dragover", (e) => {
      e.preventDefault()
      const afterElement = getDragAfterElement(todosList, e.clientY)
      if (afterElement == null) {
        todosList.appendChild(draggedItem)
      } else {
        todosList.insertBefore(draggedItem, afterElement)
      }
    })

    // Touch events for mobile drag and drop
    todoItem.addEventListener("touchstart", (e) => {
      draggedItem = todoItem
      todoItem.classList.add("dragging")
      e.preventDefault()
    })

    todoItem.addEventListener("touchend", (e) => {
      todoItem.classList.remove("dragging")
      draggedItem = null
      e.preventDefault()
    })

    todoItem.addEventListener("touchmove", (e) => {
      e.preventDefault()
      const touch = e.touches[0]
      const afterElement = getDragAfterElement(todosList, touch.clientY)
      if (afterElement == null) {
        todosList.appendChild(draggedItem)
      } else {
        todosList.insertBefore(draggedItem, afterElement)
      }
    })
  }
}

function playDeleteSound() {
  deleteSound.play()
}

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".todo-item:not(.dragging)"),
  ]

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect()
      const offset = y - box.top - box.height / 2
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child }
      } else {
        return closest
      }
    },
    { offset: Number.NEGATIVE_INFINITY },
  ).element
}

document.addEventListener("wheel", function (event) {
  const todosList = document.querySelector(".todos-list")

  // Если происходит вертикальная прокрутка, передаем её в контейнер задач
  todosList.scrollBy({
    top: event.deltaY,
  })
})

// Обработчик для прокрутки на мобильных устройствах (событие touch)
let startY

document.addEventListener("touchstart", function (event) {
  startY = event.touches[0].clientY
})

document.addEventListener("touchmove", function (event) {
  const todosList = document.querySelector(".todos-list")
  const touchY = event.touches[0].clientY
  const deltaY = startY - touchY // Рассчитываем разницу между начальной и текущей позицией касания

  todosList.scrollBy({
    top: deltaY, // Прокручиваем контейнер задач
  })

  startY = touchY // Обновляем начальное положение для следующего события
})
