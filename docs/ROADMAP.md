# План Kanban App

Живая дорожная карта проекта. В новом чате с ассистентом: **«продолжаем по docs/ROADMAP.md»**.

**Текущий фокус:** профиль на `/profile` — неплоский `ProfileWidget` (слоты в `ProfileCard`) + фичи по блокам; затем projects.

---

## Порядок работ (кратко)

1. [x] `profileKeys`, `useProfile`
2. **Блок 1 (UI):** `shared/ui/UserAvatar`, `ProfileCard` со слотами, `Sidebar` — без mutation
3. **Инфра mutation:** `updateProfileByUserId`, `useUpdateProfile`, `setQueryData` — перед upload/remove и блоком 2
4. **Блок 1 (фичи):** upload/remove аватара + `avatarActions` в `ProfileWidget`
5. **Блок 2 — имя:** `edit-profile-name` → слот `nameSlot`
6. **Блок 3 — auth:** email и пароль — отдельные features + модалки (не `profiles`)
7. Список projects на `/profile` + `useProjects`
8. «Создать проект», `project/:id`, канбан

---

## Сейчас — профиль (неплоский виджет + FSD)

### Как устроены слои (для первого раза)

| Слой               | Роль                                                                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `shared/ui`        | **`UserAvatar`** — круг: фото / инициалы / пустой; пропсы `src?`, `name?`, `size?`. Без mutation и без знания `Profile`                                            |
| `entities/profile` | `Profile`, `useProfile`, `useUpdateProfile`, **`ProfileCard`** — layout и **слоты**. В блоке аватара: `<UserAvatar />`, не своя логика круга. Без импорта features |
| `features/*`       | Действия пользователя (кнопки, формы, mutation, модалки)                                                                                                           |
| `widgets/profile`  | `ProfileWidget`: loading/error + **передать features в слоты** `ProfileCard`                                                                                       |
| `widgets/sidebar`  | `<UserAvatar />` из тех же данных (`useProfile` / кеш), без кнопок upload/remove                                                                                   |

**Неплоский виджет** = `ProfileWidget` рендерит **один** `ProfileCard` и прокидывает фичи так:

```tsx
<ProfileCard
  profile={profile}
  slots={{
    avatarActions: (
      <>
        <UploadAvatar />
        <RemoveAvatar />
      </>
    ),
    nameSlot: <EditProfileName fullName={profile.fullName} userId={profile.id} />,
    emailActions: <ChangeEmail currentEmail={profile.email} />,
    passwordActions: <ChangePassword />,
  }}
/>
```

> `UserAvatar` рендерит **сам** `ProfileCard` (импорт из `@shared/ui`), не через слот.  
> `ProfileCard` не знает имена features — в слотах только `ReactNode`. Так соблюдается FSD.

**Схема `ProfileCard` (три блока):**

```text
ProfileCard
├── Блок 1 — аватар
│     ├── [shared] UserAvatar   ← src, name из profile
│     └── {avatarActions}       ← features: upload-avatar, remove-avatar
├── Блок 2 — имя
│     └── {nameSlot}          ← feature: edit-profile-name
└── Блок 3 — учётные данные
      ├── [entity] Email: {profile.email}  (только показ)
      ├── {emailActions}      ← feature: change-email (+ модалка)
      └── {passwordActions}   ← feature: change-password (+ модалка)
```

> Email не пишем в `profiles`. UPDATE таблицы — только `full_name`, `avatar_url`.

---

### Общая инфраструктура (mutation — запись в `profiles`)

Нужна **до** фич upload/remove и edit-name. **Не** нужна для `UserAvatar` (только показ).

- [x] TanStack Query: `QueryProvider`, `queryClient` с базовыми `defaultOptions`
- [x] `useProfile`, опции кеша (`staleTime`, `refetchOnMount` / `refetchOnReconnect: false`)
- [x] `profileKeys` + `queryKey: profileKeys.detail(...)` в `useProfile`
- [ ] `shared/api`: `updateProfileByUserId`
- [ ] `entities/profile`: `updateProfile`, **`useUpdateProfile`**, после успеха `setQueryData(profileKeys.detail(id), …)`

`ProfileCard`, `UserAvatar`, слоты и сборка в `ProfileWidget` — в **блоках 1–3** (здесь не дублировать).

---

### Блок 1 — аватар (первый по UI; UI можно начать до инфраструктуры)

**Shared (`shared/ui/UserAvatar` + при необходимости `shared/lib/getInitials`):**

- [x] Компонент: есть `src` → `<img>`; нет фото, есть `name` → инициалы; иначе → пустой круг
- [x] Не рендерить `<img>` с пустым `src`
- [x] Пропсы без привязки к `Profile`: `src?`, `name?`, `size?` (для sidebar — меньший размер)
- [x] Переиспользование: **`ProfileCard`** и **`Sidebar`**

**Entity (`ProfileCard`):**

- [ ] В блоке аватара: `<UserAvatar />` внутри карточки + `slots.avatarActions` (слот **`userAvatar` не нужен**)
- [ ] Объект `slots` для фич; без кнопок upload/remove и без inline-`<img>` в entity

**Features** (после **инфраструктуры mutation**):

- [ ] `features/remove-avatar` — `avatar_url: null`, `useUpdateProfile`
- [ ] `features/upload-avatar` — MVP: URL → `avatar_url`; позже опционально Supabase Storage

**Виджеты:**

- [ ] `ProfileWidget`: в `slots.avatarActions` — обе фичи; довести все слоты по мере блоков 2–3
- [ ] `Sidebar`: `<UserAvatar />` (данные из `useProfile` или кеша; без upload/remove)

---

### Блок 2 — имя (после инфраструктуры mutation)

**Feature:**

- [ ] `features/edit-profile-name` — показ текста → клик → `input` → blur/Enter → `mutate({ fullName })`, Zod
- [ ] Плейсхолдер только в UI, **не** в `value` инпута

**Виджет:**

- [ ] `slots.nameSlot={<EditProfileName ... />}`

---

### Блок 3 — email и пароль (auth, не профиль БД)

**Features (каждая со своей модалкой или внутри feature):**

- [ ] `shared/ui`: `Modal` (или аналог)
- [ ] `features/change-email` — `supabase.auth.updateUser({ email })`, учёт подтверждения почты
- [ ] `features/change-password` — `updateUser({ password })`, Zod

**Entity / виджет:**

- [ ] Email только текст в `ProfileCard`
- [ ] `slots.emailActions`, `slots.passwordActions` — features

---

### После профиля — projects на `/profile`

После входа на `/profile` — **два независимых query** (оба с `enabled` как у профиля):

| Query         | Данные                                 |
| ------------- | -------------------------------------- |
| `useProfile`  | `profiles` + email из сессии           |
| `useProjects` | `projects` где `owner_id = auth.uid()` |

- [ ] `shared/api`: `getProjectsByOwnerId` (SELECT, RLS по владельцу)
- [ ] `entities/project`: доменная модель, `Row` / `Pick`, маппер, `getProjects`
- [ ] `projectKeys` + `useProjects` + `enabled: !auth.isLoading && isAuth && Boolean(user?.id)`
- [ ] Виджет / секция на `ProfilePage`: **список проектов** пользователя
- [ ] Клик по проекту → переход на `project/:projectId` (контент страницы может быть заглушкой)
- [ ] Кнопка **«Создать проект»** на `/profile` (пока UI; логика создания — в блоке **Projects** ниже)

**Схема страницы `/profile`:**

```text
ProfilePage
├── ProfileWidget              → useProfile + ProfileCard(slots) + features
├── ProjectsListWidget         → useProjects
├── CreateProjectButton
└── SignOut
```

> Запросы с `enabled: !auth.isLoading && isAuth && Boolean(user?.id)`.

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
- [x] Черновик макета `ProfileCard` (аватар, кнопки, поле имени) — рефакторинг под слоты, `UserAvatar` и features (блоки 1–3)
- [ ] `shared/ui/UserAvatar` — блок 1

### TanStack Query

- [x] `QueryProvider` в `AppProviders` (снаружи `AuthProvider`)
- [x] `queryClient` с дефолтами: `staleTime`, `gcTime`, `refetchOnWindowFocus: false`, `retry: 1`
- [x] React Query DevTools в режиме разработке
