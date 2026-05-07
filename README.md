# Kanban App

Учебный pet-проект Kanban-доски для портфолио.  
Текущий этап: собран архитектурный и навигационный каркас до интеграции Supabase.

## Стек

- React
- TypeScript
- Vite
- React Router (`createBrowserRouter`, `RouterProvider`, `Outlet`)
- Feature-Sliced Design (FSD)
- ESLint + Prettier
- Steiger (архитектурные проверки FSD)

## Запуск проекта

```bash
npm install
npm run dev
```

## Скрипты

```bash
npm run lint:eslint   # проверка ESLint
npm run lint:arch     # проверка архитектуры Steiger
npm run lint          # ESLint + Steiger
npm run format:check  # проверка форматирования Prettier
npm run format        # автоформатирование Prettier
```

# Что уже сделано (до Supabase)

- Проект инициализирован на React + TypeScript + Vite
- Настроены алиасы для слоев FSD:
  - `@app`
  - `@pages`
  - `@widgets`
  - `@features`
  - `@entities`
  - `@shared`
- Подключены и настроены ESLint + Prettier
- Подключен Steiger с мягким профилем правил на этапе MVP
- Реализована базовая структура по FSD
- Слайсы разложены по сегментам `ui` / `model` (где применимо)
- Настроен роутинг через `createBrowserRouter` + `RouterProvider`
- Реализованы страницы:
  - `/sign-in`
  - `/sign-up`
  - `/profile`
  - `/project/:projectId`
  - `*` (ErrorPage)
- Добавлен `AppLayout` и вложенная маршрутизация через `Outlet`
- Созданы базовые доменные типы:
  - `User`
  - `Project`
  - `Board`
  - `Column`
  - `Task`
- Добавлены временные моки для раннего этапа разработки (`entities/user/model/mockUser.ts`)

## FSD-слои проекта

- `app` — точка входа, провайдеры, роутинг
- `pages` — маршрутные экраны
- `widgets` — крупные UI-блоки
- `features` — пользовательские действия
- `entities` — бизнес-сущности и их модели
- `shared` — переиспользуемая инфраструктура (`config` / `ui` / `lib` / `api`)
