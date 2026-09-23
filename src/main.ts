import { BoardStore } from "./store";
import type { ColumnType } from "./types";

const store = new BoardStore();
const appElement = document.getElementById("app");

if (!appElement) {
  throw new Error("Критическая ошибка: Элемент #app не найден в HTML!");
}
appElement.innerHTML = "";

function renderBoard(): void {
  const columnTitles = {
    todo: "Нужно сделать",
    "in-progress": "В работе",
    done: "Готово",
  };
  const columns: ColumnType[] = ["todo", "in-progress", "done"];

  columns.forEach((column) => {
    let filteredTasks = store.getTasks().filter((task) => task.state === column);

    let title = columnTitles[column];

    let cards = filteredTasks.map((card) => `<div draggable="true" class="card" data-id="${card.id}"><h2>${card.title}</h2><button class="delete-btn">X</button></div>`).join("");
    if (appElement) {
      appElement.insertAdjacentHTML(
        "beforeend",

        `
        <div class="column" data-drop="${column}">
          <h2>${title}</h2>
          <form><input type="text" placeholder="Новая задача..."><button type="submit">Добавить</button></form>
          <div class="tasks-list">
            ${cards}
          </div>
          
        </div>`,
      );
    }
  });
}
appElement.addEventListener("dragstart", (event) => {
  const target = event.target as HTMLElement;
  const card = target.closest(".card") as HTMLElement;
  if (!card || !card.classList.contains("card")) {
    return;
  }
  const id = card.dataset.id;
  if (id && event.dataTransfer) {
    event.dataTransfer.setData("text/plain", id);
  }
});
appElement.addEventListener("dragover", (event) => {
  event.preventDefault();
  const column = (event.target as HTMLElement).closest("[data-drop]");
  if (!column) {
    return;
  }
});
appElement.addEventListener('dragenter', (event) => {
  event.preventDefault();
  const column = (event.target as HTMLElement).closest("[data-drop]") as HTMLElement;
  if (!column) {
    return;
  }
  column.classList.add('column-highlight')
});
appElement.addEventListener('dragleave', (event) => {
  event.preventDefault();
  const column = (event.target as HTMLElement).closest("[data-drop]") as HTMLElement;
  if (!column) {
    return;
  }
  column.classList.remove('column-highlight')
});
appElement.addEventListener("drop", (event) => {
  event.preventDefault();
  const column = (event.target as HTMLElement).closest("[data-drop]") as HTMLElement;
  if (!column) {
    return;
  }
  const state = column.dataset.drop as ColumnType;
  if (event.dataTransfer) {
    const droppedId = event.dataTransfer.getData("text/plain");
    store.updateTaskState(droppedId, state);
    appElement.innerHTML = "";
    renderBoard();
  }
});
renderBoard();
appElement.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = (event.target as HTMLElement).closest("form") as HTMLElement;
  const column = form.closest("[data-drop]") as HTMLElement;
  const state = column.getAttribute("data-drop");
  const value = form.querySelector("input")?.value;
  
  if (value) {
    store.addTask(value, state as ColumnType);
    
  }
  appElement.innerHTML = "";
  renderBoard();
});
appElement.addEventListener('click', (event) => {
   const target = event.target as HTMLElement;
  const deleteBtn = target.closest(".delete-btn");
  
  if (!deleteBtn) {
    return;
  }
  
  const cardElement = deleteBtn.closest(".card") as HTMLElement;
  
  if (cardElement) {
    const id = cardElement.dataset.id;
    
    if (id) {
      store.deleteTask(id)
      appElement.innerHTML = ""
      renderBoard();
    }
  }
  
 
});
