# Kanban App

Учебный pet-проект Kanban-доски для портфолио на **Feature-Sliced Design**.

**Текущий этап:** Supabase (auth + Postgres + RLS), загрузка профиля через TanStack Query. Дальше — список projects и канбан.

Подробный прогресс и план: **[docs/ROADMAP.md](./docs/ROADMAP.md)**

## Стек

- React 19, TypeScript, Vite
- React Router v7 (`createBrowserRouter`, `RouterProvider`)
- Supabase (Auth + Postgres + RLS)
- TanStack Query (+ DevTools в dev)
- Zod (валидация форм)
- FSD, ESLint, Prettier, Steiger

## Запуск

1. Создай файл `.env` в корне `kanban-app` (значения — в Supabase Dashboard → Project Settings → API):

   ```env
   VITE_SUPABASE_URL=https://<project-ref>.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
   ```

2. Установка и dev-сервер:

   ```bash
   npm install
   npm run dev
   ```

## Скрипты

```bash
npm run dev           # dev-сервер
npm run build         # production-сборка
npm run lint          # ESLint + Steiger
npm run lint:eslint   # только ESLint
npm run lint:arch     # только Steiger (FSD)
npm run format        # Prettier
npm run format:check
npm run gen:types     # типы БД из Supabase → src/types/database.types.ts
```

Перед `gen:types` нужен вход в Supabase CLI: `npx supabase login`.

## FSD-слои

| Слой       | Назначение                         |
| ---------- | ---------------------------------- |
| `app`      | провайдеры, роутинг, guards        |
| `pages`    | страницы-маршруты                  |
| `widgets`  | крупные блоки UI                   |
| `features` | действия пользователя              |
| `entities` | сущности, модели, запросы сущности |
| `shared`   | api, lib, config, ui               |

## Что уже есть (кратко)

- Роутинг и layout, auth (вход / регистрация / выход), защищённые маршруты
- Профиль: загрузка из `profiles` + email из сессии, `useProfile`
- Сгенерированные типы Supabase, маппер `Profile` из строки БД

Полный список по этапам — в **[docs/ROADMAP.md](./docs/ROADMAP.md)**.
