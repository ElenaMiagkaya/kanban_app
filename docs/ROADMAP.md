# План Kanban App

Живая дорожная карта проекта. В новом чате с ассистентом: **«продолжаем по docs/ROADMAP.md»**.

**Текущий фокус:** закрыть профиль (редактирование + список проектов на `/profile`), затем создание проекта и страница проекта.

---

## Порядок работ (кратко)

1. Доделать `profileKeys` (выполнено)
2. Редактирование профиля — `useMutation`, обновление кеша
3. Список **проектов** пользователя на странице профиля + `useProjects`
4. Кнопка **«Создать проект»** (UI; mutation — в блоке Projects)
5. Создание проекта, переход на `project/:id` — блок **Projects**
6. Канбан — колонки и задачи

---

## Сейчас — завершение профиля и projects на `/profile`

### Инфраструктура профиля

- [x] TanStack Query: `QueryProvider`, `queryClient` с базовыми `defaultOptions`
- [x] `useProfile`, опции кеша (`staleTime`, `refetchOnMount` / `refetchOnReconnect: false`)
- [x] `profileKeys` + `queryKey: profileKeys.detail(...)` в `useProfile`
- [x] Коммит: зафиксировать этап (по желанию)

### Редактирование профиля (мутации TanStack Query)

- [ ] `shared/api`: `updateProfile` — поля `full_name`, `avatar_url` (RLS: UPDATE своей строки)
- [ ] `feature` (например `edit-profile`): форма, Zod, кнопка «Сохранить»
- [ ] `useMutation`; после успеха: `setQueryData(profileKeys.detail(userId), …)` или `invalidateQueries`
- [ ] UI на `/profile`: просмотр и редактирование (секция или режим формы)
- [ ] Email не редактируем в БД — только из auth (как при чтении)

### Проекты на странице профиля

После входа на `/profile` — **два независимых query** (оба с `enabled` как у профиля):

| Query         | Данные                                        |
| ------------- | --------------------------------------------- |
| `useProfile`  | одна строка `profiles` + email из сессии      |
| `useProjects` | список `projects` где `owner_id = auth.uid()` |

- [ ] `shared/api`: `getProjectsByOwnerId` (SELECT, RLS по владельцу)
- [ ] `entities/project`: доменная модель, `Row` / `Pick`, маппер, `getProjects`
- [ ] `projectKeys` + `useProjects` + `enabled: !auth.isLoading && isAuth && Boolean(user?.id)`
- [ ] Виджет / секция на `ProfilePage`: **список проектов** пользователя
- [ ] Клик по проекту → переход на `project/:projectId` (контент страницы может быть заглушкой)
- [ ] Кнопка **«Создать проект»** на `/profile` (пока UI; логика создания — в блоке **Projects** ниже)

**Схема страницы `/profile`:**

```text
ProfilePage
├── ProfileWidget           → useProfile
├── ProjectsListWidget      → useProjects
├── CreateProjectButton     → feature (mutation позже)
└── SignOut
```

> Не дергать приватные запросы до `!auth.isLoading && isAuth && user`.

---

## Projects (после списка на профиле)

- [ ] `shared/api`: `createProject` (INSERT, `owner_id` = текущий пользователь)
- [ ] `feature` create-project + `useMutation`
- [ ] После создания: `invalidateQueries({ queryKey: projectKeys.list(ownerId) })` или обновление кеша
- [ ] Подключить кнопку «Создать проект» к mutation
- [ ] Страница `project/:projectId` — минимальный UI (название проекта / заглушка до канбана)

---

## Канбан (после projects)

- [ ] Колонки и задачи, статус через `column_id`, RLS
- [ ] TSQ для boards / tasks, ключи `boardKeys` / `taskKeys`

---

## Полировка (когда появится потребность)

- [ ] Retry сети в `shared/api/auth` (`withAuthNetworkRetry` + `isAuthNetworkError`)
- [ ] Маппер ошибок загрузки профиля / Supabase (не сырой `error.message`)
- [ ] `useMutation` для sign-in / sign-up / sign-out; при `signOut` — `queryClient.removeQueries` / `clear`
- [ ] Lazy routes, Steiger строже
- [ ] TanStack Query: `QueryCache` / global `onError` (тосты, Sentry) — изучить при многих queries
- [ ] TanStack Query: Suspense + boundaries на pages — когда надоест копипаст loading
- [ ] TanStack Query: Persist — кеш после F5 / offline; осторожно с logout

---

## Сделано

### Каркас и инструменты

- [x] React + TypeScript + Vite
- [x] FSD: слои `app`, `pages`, `widgets`, `features`, `entities`, `shared`
- [x] Алиасы: `@app`, `@pages`, `@widgets`, `@features`, `@entities`, `@shared`, `@/`
- [x] ESLint, Prettier, Steiger (мягкий профиль на этапе MVP)
- [x] React Router v7: `createBrowserRouter`, `RouterProvider`, `Outlet`
- [x] Маршруты: `/`, `/sign-in`, `/sign-up`, `/profile`, `/project/:projectId`, `*` (ErrorPage)
- [x] `AppLayout`, guards: `ProtectedRoute`, `PublicOnlyRoute`, `RootRedirectRoute`
- [x] Базовые доменные типы и UI-заготовки: project, board, column, task (часть UI ещё на моках / без бэкенда)

### Supabase и типы БД

- [x] Клиент Supabase (`createClient<Database>`), переменные `VITE_SUPABASE_*`
- [x] Скрипт `npm run gen:types` → `src/types/database.types.ts`
- [x] Таблицы в БД: `profiles`, `projects`, `boards`, `board_columns`, `tasks` (домен под канбан заложен)

### Auth

- [x] API: `signUpWithEmail`, `signInWithEmail`, `signOut`, `getSession`, `getCurrentUser`
- [x] `AuthProvider`, `useAuth`, подписка `onAuthStateChange`
- [x] Фичи: sign-in / sign-up по email (Zod), sign-out, ссылка на регистрацию
- [x] `mapAuthErrorToMessage`, `isAuthNetworkError` (отдельное сообщение для сетевых ошибок)
- [ ] `withAuthNetworkRetry` в auth API — в плане (полировка)

### Профиль (чтение)

- [x] Таблица `profiles`, RLS, триггер на `auth.users`
- [x] `getProfileByUserId` (shared/api), `getProfile` + `mapProfileRowToProfile` (entities)
- [x] Доменная модель `Profile`, `ProfileCard`, `ProfileWidget`
- [x] `useProfile` (TanStack Query + `enabled` под auth)
- [x] `profileKeys`
- [x] Email в UI из сессии, не из таблицы `profiles`

### TanStack Query

- [x] `QueryProvider` в `AppProviders` (снаружи `AuthProvider`)
- [x] `queryClient` с дефолтами: `staleTime`, `gcTime`, `refetchOnWindowFocus: false`, `retry: 1`
- [x] React Query DevTools в режиме разработке
