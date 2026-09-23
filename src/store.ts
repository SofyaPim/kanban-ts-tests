import type {  ITask, ColumnType } from "./types";

export class BoardStore {
  private tasksList: ITask[];
  constructor() {
    if (!localStorage.getItem("task")) {
      this.tasksList = [
        {
          id: "1",
          title: "example task",
          createdAt: 1,
          state: "todo",
        },
      ];
    } else {
      const taskItem = localStorage.getItem("task") as string;
      this.tasksList = JSON.parse(taskItem);
    }
  }
  // getTasks(): ITask[] {
  //   let copyList = [...this.tasksList];
  //   return copyList;
  // }
  getTasks(): ITask[] {
    return structuredClone(this.tasksList);
  }
  addTask(title: string, state: ColumnType = "todo"): ITask {
    const task: ITask = {
      id: crypto.randomUUID(),
      title: title,
      createdAt: Date.now(),
      state: state,
    };
    this.tasksList.push(task);
    this.saveToLocalStorage();
    return task;
  }
  updateTaskState(id: string, state: ColumnType): void {
    let currentTask = this.tasksList.find((task) => id === task.id);
    if (!currentTask) {
      throw new Error("check id");
    }
    currentTask.state = state;
    this.saveToLocalStorage();
  }
  deleteTask(id: string): void {
    let restTasks = this.tasksList.filter((task) => task.id !== id);
    this.tasksList = restTasks;
    this.saveToLocalStorage();
  }
  private saveToLocalStorage(): void {
    localStorage.setItem("task", JSON.stringify(this.tasksList));
  }
}
