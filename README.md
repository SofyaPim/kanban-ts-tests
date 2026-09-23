[![CI](https://github.com/SofyaPim/kanban-ts-tests/actions/workflows/ci.yml/badge.svg)](https://github.com/SofyaPim/kanban-ts-tests/actions/workflows/ci.yml)

Канбан-доска на **TypeScript** с тремя колонками, перетаскиванием задач и
автосохранением в `localStorage`. Собрана на **Vite**, работает как **PWA** —
устанавливается на телефон как обычное приложение и не теряет данные офлайн.

> 📦 Сборка: [kanban-ts-tests](https://github.com/SofyaPim/kanban-ts-tests)
> 🚀 Демо: [kanban-ts](https://sofyapim.github.io/kanban-ts/)

## Возможности

- Три колонки: **Нужно сделать → В работе → Готово**
- Добавление задач в любую колонку одной строкой
- Перенос карточек мышью/пальцем (drag & drop)
- Удаление задач
- Автосохранение в `localStorage` — данные переживают перезагрузку
- PWA: установка на главный экран, service worker, обновления «на лету»

## Стек

| Технология | Версия | Роль |
| --- | --- | --- |
| TypeScript | ~6.0.2 | типизация |
| Vite | ^8.0.12 | dev-сервер и сборка |
| vite-plugin-pwa | ^1.3.0 | манифест + service worker |
| Vitest | ^5.0.1 | юнит-тесты |
| happy-dom | ^20.14.5 | DOM-окружение для тестов |

## Быстрый старт

```bash```
git clone https://github.com/SofyaPim/kanban-ts-tests.git
cd kanban-ts-tests
npm ci      # восстановить зависимости из package-lock.json
npm test    # прогнать тесты
npm run dev # открыть http://localhost:5173
Требуется Node.js 20.19+ и npm.

## Команды

npm run dev
npm test
npm run test:watch
npm run build
npm run preview

## Тесты

Тесты покрывают класс BoardStore (src/store.ts) — 10 тестов в пяти группах:
- инициализация — дефолтная задача при пустом localStorage, загрузка сохранённых задач;
- addTask — заполнение полей, state по умолчанию todo, уникальность сгенерированных id, запись в localStorage;
- updateTaskState — смена колонки и сохранение, ошибка check id для несуществующей задачи без побочных эффектов;
- deleteTask — удаление нужной карточки, молчаливое игнорирование несуществующего id;
- getTasks — возвращает глубокую копию (structuredClone): мутации результата не ломают хранилище.
Каждый тест изолирован: localStorage очищается в beforeEach.

## CI

Файл .github/workflows/ci.yml (.github/workflows/ci.yml) запускается на каждый push в main и на каждый pull request:
1. npm ci — чистая установка по lockfile;
2. npm test — прогон тестов;
3. npm run build — сборка с проверкой типов.

Установка PWA на телефон
1. Откройте демо (https://sofyapim.github.io/kanban-ts/) в браузере телефона.
2. Меню браузера → «Установить приложение» (Chrome/Android) или «Поделиться» → «На экран Домой» (Safari/iOS).
3. Иконка появится на главном экране — приложение откроется в отдельном окне и будет работать офлайн.

## Структура
src/
├── main.ts        # рендер доски, drag & drop, события форм
├── store.ts       # BoardStore — состояние и localStorage
├── types.ts       # ITask, ColumnType
├── store.test.ts  # юнит-тесты BoardStore (Vitest)
└── style.css      # стили доски и карточек
public/            # иконки приложения (manifest icons)
.github/workflows/ # CI: тесты и сборка на GitHub Actions
