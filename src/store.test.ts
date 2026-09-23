import { describe, it, expect, beforeEach } from "vitest";
import { BoardStore } from "./store";
import type { ITask } from "./types";

const STORAGE_KEY = "task";

// Хелпер: фабрика задачи (avoid повторов в fixtures)
const makeTask = (overrides: Partial<ITask> = {}): ITask => ({
  id: crypto.randomUUID(),
  title: "Задача",
  createdAt: Date.now(),
  state: "todo",
  ...overrides,
});

// Прочитать то, что реально лежит в localStorage
const readStorage = (): ITask[] =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as ITask[];

// Шаблон «засеять localStorage и создать стор поверх него»
const seedAndCreate = (tasks: ITask[]): BoardStore => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  return new BoardStore();
};

beforeEach(() => {
  localStorage.clear(); // изолируем тесты друг от друга
});

describe("BoardStore", () => {
  describe("инициализация", () => {
    it("создаёт дефолтную задачу, если localStorage пуст", () => {
      const store = new BoardStore();
      const tasks = store.getTasks();

      expect(tasks).toHaveLength(1);
      expect(tasks[0]).toMatchObject({
        id: "1",
        title: "example task",
        state: "todo",
      });
      expect(tasks[0].createdAt).toBe(1);
    });

    it("загружает существующие задачи из localStorage", () => {
      const seeded = [makeTask({ id: "a", title: "Первая" }), makeTask({ id: "b", title: "Вторая", state: "done" })];
      const store = seedAndCreate(seeded);

      expect(store.getTasks()).toEqual(seeded);
    });
  });

  describe("addTask", () => {
    it("создаёт задачу с корректными полями и сохраняет", () => {
      const store = new BoardStore();
      const task = store.addTask("Новая задача", "in-progress");

      expect(task.title).toBe("Новая задача");
      expect(task.state).toBe("in-progress");
      expect(task.id).toEqual(expect.any(String));
      expect(task.id).not.toBe(""); // UUID сгенерирован
      expect(task.createdAt).toEqual(expect.any(Number));

      // дефолтная + новая лежит и в localStorage
      expect(readStorage()).toHaveLength(2);
      expect(readStorage()[1]).toEqual(task);
    });

    it("использует state по умолчанию 'todo', если не передан", () => {
      const store = new BoardStore();
      const task = store.addTask("Без колонки");

      expect(task.state).toBe("todo");
    });

    it("генерирует уникальные id", () => {
      const store = new BoardStore();
      const first = store.addTask("A");
      const second = store.addTask("B");

      expect(first.id).not.toBe(second.id);
    });
  });

  describe("updateTaskState", () => {
    it("перемещает задачу в другую колонку и сохраняет", () => {
      const store = seedAndCreate([makeTask({ id: "a" }), makeTask({ id: "b", title: "Таргет" })]);

      store.updateTaskState("b", "done");

      expect(store.getTasks().find((t) => t.id === "b")?.state).toBe("done");
      expect(readStorage().find((t) => t.id === "b")?.state).toBe("done");
      // остальные не тронуты
      expect(store.getTasks().find((t) => t.id === "a")?.state).toBe("todo");
    });

    it("бросает Error при несуществующем id и не портит данные", () => {
      const store = seedAndCreate([makeTask({ id: "a" })]);

      expect(() => store.updateTaskState("nope", "done")).toThrow(Error);
      expect(() => store.updateTaskState("nope", "done")).toThrow("check id");

      // состояние и localStorage не изменились
      expect(store.getTasks()[0].state).toBe("todo");
      expect(readStorage()[0].state).toBe("todo");
    });
  });

  describe("deleteTask", () => {
    it("удаляет задачу по id и сохраняет", () => {
      const store = seedAndCreate([makeTask({ id: "a" }), makeTask({ id: "b" })]);

      store.deleteTask("a");

      expect(store.getTasks().map((t) => t.id)).toEqual(["b"]);
      expect(readStorage().map((t) => t.id)).toEqual(["b"]);
    });

    it("тихо игнорирует несуществующий id", () => {
      const store = seedAndCreate([makeTask({ id: "a" })]);
      const before = store.getTasks();

      expect(() => store.deleteTask("ghost")).not.toThrow();
      expect(store.getTasks()).toEqual(before);
    });
  });

  describe("getTasks", () => {
    it("возвращает копию: мутации результата не влияют на состояние", () => {
      const store = seedAndCreate([makeTask({ id: "a" })]);

      const copy = store.getTasks();
      copy.push(makeTask({ id: "x" })); // push в копию
      copy[0].title = "Изменено"; // мутация объекта копии

      const fresh = store.getTasks();
      expect(fresh).toHaveLength(1); // x не появился внутри
      expect(fresh[0].title).toBe("Задача"); // исходник не изменился
    });
  });
});