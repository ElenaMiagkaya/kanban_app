# Kanban App

Учебный pet-проект Kanban-доски для портфолио на **Feature-Sliced Design**.

**Текущий этап:** профиль на `/profile` (аватар через Supabase Storage, слоты в `ProfileCard`). Следующий шаг — редактирование имени (блок 2), затем projects и канбан.

Подробный прогресс: **[docs/ROADMAP.md](./docs/ROADMAP.md)** · карта модулей: **[docs/REGISTRY.md](./docs/REGISTRY.md)** · интерактивно: `../canvases/kanban-app-registry.canvas.tsx`

## Стек

- React 19, TypeScript, Vite
- React Router v7 (`createBrowserRouter`, `RouterProvider`)
- Supabase (Auth + Postgres + Storage + RLS)
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

- Роутинг и layout, auth (вход / регистрация / выход), guards, `AuthProvider`
- Auth и Storage API: повтор при сетевых ошибках (`withRetry` + `isNetworkError`)
- Профиль: `useProfile`, `ProfileCard` со слотами, upload/remove аватара, `UserAvatar` в sidebar
- Сгенерированные типы Supabase, маппер `Profile` из строки БД

Полный список — в **[docs/ROADMAP.md](./docs/ROADMAP.md)** и **[docs/REGISTRY.md](./docs/REGISTRY.md)**.
