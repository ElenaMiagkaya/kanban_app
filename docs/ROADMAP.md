# План Kanban App

Живая дорожная карта проекта. В новом чате с ассистентом: **«продолжаем по docs/ROADMAP.md»**.

**Карта модулей:** [REGISTRY.md](./REGISTRY.md) · интерактивно: `canvases/kanban-app-registry.canvas.tsx`

**Текущий фокус:** **блок 8** — открытие проекта с `/profile` (`ProjectCard` → `project/:projectId`) + список досок на `ProjectPage`. Блок 7 (список projects) и **create-project** завершены; блоки 1–3 готовы.

---

## Порядок работ (кратко)

1. [x] `profileKeys`, `useProfile`
2. [x] **Блок 1 (UI):** `UserAvatar`, `ProfileCard` со слотами, `Sidebar`
3. [x] **Инфра mutation:** `updateProfileByUserId`, `updateProfile`, `setQueryData`
4. [x] **Блок 1 (фичи):** upload/remove аватара (Storage + `profiles.avatar_url`) + `avatarActions`
5. [x] **Блок 2 — имя:** `update-name` → слот `nameSlot`
6. [x] **Блок 3 — auth:** email и пароль — отдельные features + модалки (не `profiles`)
7. [x] Список projects на `/profile` + `useProjects`
8. [x] **create-project** — Modal, Zod, автопрефикс, `useMutation`
9. Открытие проекта (`ProjectCard` → `project/:projectId`) + доски на `ProjectPage` ← **сейчас**
10. **delete-project** — удаление с карточки + подтверждение в Modal
11. Канбан (колонки, задачи)

---

## Сейчас — профиль (неплоский виджет + FSD)

### Как устроены слои (для первого раза)

| Слой               | Роль                                                                                                                                                            |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shared/ui`        | `**UserAvatar`\*\* — круг: фото / инициалы / пустой; пропсы `src?`, `name?`, `size?`. Без mutation и без знания `Profile`                                       |
| `entities/profile` | `Profile`, `useProfile`, `updateProfile`, `**ProfileCard**` — layout и **слоты**. В блоке аватара: `<UserAvatar />`, не своя логика круга. Без импорта features |
| `features/`\*      | Действия пользователя (кнопки, формы, mutation, модалки)                                                                                                        |
| `widgets/profile`  | `ProfileWidget`: loading/error + **передать features в слоты** `ProfileCard`                                                                                    |
| `widgets/sidebar`  | `<UserAvatar />` из тех же данных (`useProfile` / кеш), без кнопок upload/remove                                                                                |

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
    nameSlot: <UpdateName name={profile.fullName ?? ''} />,
    emailActions: <ChangeEmail UserEmail={profile.email} />,
    passwordActions: <ChangePassword userEmail={profile.email} />,
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
│     └── {nameSlot}          ← feature: update-name
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
- [x] `shared/api`: `updateProfileByUserId`
- [x] `entities/profile`: `updateProfile`; оркестраторы аватара вызывают его напрямую → `setQueryData(profileKeys.detail(id), …)`

`ProfileCard`, `UserAvatar`, слоты и сборка в `ProfileWidget` — в **блоках 1–3** (здесь не дублировать).

---

### Блок 1 — аватар (первый по UI; UI можно начать до инфраструктуры)

**Shared (`shared/ui/UserAvatar` + при необходимости `shared/lib/getInitials`):**

- [x] Компонент: есть `src` → `<img>`; нет фото, есть `name` → инициалы; иначе → пустой круг
- [x] Не рендерить `<img>` с пустым `src`
- [x] Пропсы без привязки к `Profile`: `src?`, `name?`, `size?` (для sidebar — меньший размер)
- [x] Переиспользование: `**ProfileCard`** и `**Sidebar\*\*`

**Entity (`ProfileCard`):**

- [x] В блоке аватара: `<UserAvatar />` внутри карточки + `slots.avatarActions` (слот `**userAvatar` не нужен\*\*)
- [x] Объект `slots` для фич; без кнопок upload/remove и без inline-`<img>` в entity

**Features** (после **инфраструктуры mutation**):

- [x] `features/remove-avatar` — `removeAvatarFile` → `updateProfile({ avatar_url: null })` → `setQueryData`
- [x] `features/upload-avatar` — `uploadAvatarFile` (Storage `avatars/{userId}/avatar.jpg`) → `updateProfile({ avatar_url })` → `setQueryData`
- [x] `userId` из `useAuth` (не из `useProfile`); features не импортируют друг друга
- [x] `withRetry` в `shared/api/storage`; `mutationKey` + `useIsMutating({ mutationKey: ['avatar'] })`

**Виджеты:**

- [x] `ProfileWidget`: `slots.avatarActions` — `UploadAvatar`, `RemoveAvatar`; `nameSlot` — `UpdateName`; `emailActions` — `ChangeEmail`; `passwordActions` — `ChangePassword`
- [x] `Sidebar`: `<UserAvatar />` из `useProfile` / кеша, без upload/remove

---

### Блок 2 — имя (после инфраструктуры mutation)

**Feature:**

- [x] `features/update-name` — `UpdateName`: input, Enter → Zod (`nameSchema`) → `useUpdateName` → `updateProfile({ full_name })` → `setQueryData`
- [x] `useUpdateName` — оркестратор (как аватар); `userId` из `useAuth`
- [x] Синхронизация пропа `name` → локальный стейт (`useEffect`); blur после успешного save
- [x] Без success-текста в UI (тихий успех); ошибки валидации и сервера под полем

**Виджет:**

- [x] `slots.nameSlot={<UpdateName name={profile.fullName ?? ''} />}`

---

### Блок 3 — email и пароль (auth, не профиль БД)

**Features (каждая со своей модалкой или внутри feature):**

- [x] `shared/ui`: `Modal` — overlay, Esc, scroll lock, `isCloseDisabled`
- [x] `features/change-email` — `supabase.auth.updateUser({ email })`, reauth через пароль, учёт подтверждения почты
- [x] `features/change-password` — `updateUser({ password })`, Zod, reauth, signOut после успеха

**Entity / виджет:**

- [x] Email только текст в `ProfileCard`
- [x] `slots.emailActions`, `slots.passwordActions` — features

---

### После профиля — projects на `/profile`

После входа на `/profile` — **два независимых query** (оба с `enabled` как у профиля):

| Query         | Данные                                 |
| ------------- | -------------------------------------- |
| `useProfile`  | `profiles` + email из сессии           |
| `useProjects` | `projects` где `owner_id = auth.uid()` |

- [x] `shared/api`: `getProjectsByOwnerId` (SELECT, RLS по владельцу)
- [x] `entities/project`: доменная модель, `Row` / `Pick`, маппер, `getProjects`
- [x] `projectKeys` + `useProjects` + `enabled: !auth.isLoading && isAuth && Boolean(user?.id)`
- [x] Виджет / секция на `ProfilePage`: **список проектов** пользователя
- [x] Кнопка **«Создать проект»** на `/profile` — feature `create-project` (Modal + mutation)
- [ ] Клик по карточке проекта → переход на `project/:projectId` (Link в widget, не в entity)
- [ ] Кнопка **«Удалить проект»** на карточке (feature `delete-project`, Modal подтверждения)

**Схема страницы `/profile`:**

```text
ProfilePage
├── ProfileWidget              → useProfile + ProfileCard(slots) + features
├── ProjectsListWidget         → useProjects + ProjectCard + CreateProject
│     ├── Link → project/:projectId   (следующий шаг)
│     └── DeleteProject               (после открытия проекта)
└── SignOut
```

> Запросы с `enabled: !auth.isLoading && isAuth && Boolean(user?.id)`.

---

## Projects — create-project (готово)

- [x] `shared/api`: `createNewProject` (INSERT, `owner_id` = текущий пользователь)
- [x] `entities/project`: `createProject`, `mapProjectToProjectInsert`, `CreateProjectInput`
- [x] `features/create-project`: Modal + форма, Zod (`createProjectSchema`), `useCreateProject`
- [x] После создания: `invalidateQueries({ queryKey: projectKeys.list(ownerId) })`
- [x] `projects.project_prefix`: CHECK в БД `^[A-Z]{3,10}$`; на клиенте Zod `^[A-Z]{3,5}$`; уникальность `owner_id + project_prefix`
- [x] UI: автопрефикс из **первого слова** названия (транслит кириллицы → 3 буквы) + ручное редактирование (`isPrefixTouched`); длина префикса на кнопке submit
- [x] `shared/lib/string/transliterateCyrillicToLatin`, `entities/project/deriveProjectPrefixFromTitle`
- [x] `description`: пустая строка из формы → `null` (Zod `transform`)

---

## Projects — открытие и удаление (следующие шаги)

### Открытие проекта ← **сейчас**

- [ ] `shared/config`: `getProjectRoute(projectId)` → `/project/:projectId`
- [ ] `widgets/projects-list`: обернуть `ProjectCard` в `<Link>` (роутинг в widget, не в entity)
- [ ] `shared/api`: `getProjectById`, `getBoardsByProjectId`
- [ ] `entities/project`: `getProject`, `useProject(projectId)`; `projectKeys.detail` уже есть
- [ ] `entities/board` (или в project query): `getBoards`, `useBoards(projectId)`
- [ ] `pages/project/ProjectPage`: `useParams`, загрузка проекта + список досок (минимальный UI до канбана)

**Схема:**

```text
ProjectsListWidget
  → Link to={getProjectRoute(id)}
      → ProjectCard
  → DeleteProject (отдельная кнопка, stopPropagation)

ProjectPage (/project/:projectId)
  → useProject(projectId)
  → список досок (title + id)
```

### Удаление проекта (после открытия)

- [ ] `shared/api`: `deleteProjectById` (DELETE, RLS по `owner_id`)
- [ ] `entities/project`: `deleteProject`
- [ ] `features/delete-project`: `useDeleteProject`, Modal подтверждения (как `change-password`)
- [ ] `onSuccess`: `invalidateQueries(projectKeys.list)` + `removeQueries(projectKeys.detail)`; `navigate(/profile)` если удалили со страницы проекта
- [ ] Проверить CASCADE в БД: `projects` → `boards` → `board_columns` → `tasks`
- [ ] Кнопка на карточке в `ProjectsListWidget`; клик не должен открывать проект (`stopPropagation`)

---

## Канбан (после projects)

- [ ] Колонки и задачи, статус через `column_id`, RLS
- [ ] TSQ для boards / tasks, ключи `boardKeys` / `taskKeys`
- [ ] `tasks.task_number` + атомарная нумерация задач по проекту (`PREFIX-N`) через RPC/функцию БД

---

## Полировка / MVP-2 (когда появится потребность)

### create-project — форма и префикс

> Сейчас (MVP): submit через `createProjectSchema`, длина префикса на кнопке, ошибки мутации через `mapAuthErrorToMessage` (временно).

- [ ] **Live-валидация префикса:** только латиница при вводе (`projectPrefixLettersSchema`, `prefixFormatError` в UI); длина — по-прежнему на кнопке + Zod на submit
- [ ] **Нормализация регистра:** `.transform(toUpperCase)` в Zod или в инпуте — чтобы `moy` не падало на CHECK `^[A-Z]{…}$`
- [ ] **Дубликат префикса:** проверка `owner_id + project_prefix` до INSERT или маппинг `23505` → «Префикс уже занят»
  - вариант A: `shared/api` `existsProjectPrefix(ownerId, prefix)` (SELECT)
  - вариант B: только маппер ошибок Supabase после failed mutation
- [ ] **`mapSupabaseProjectErrorToMessage`** (или расширить общий маппер) — не сырой `projects_prefix_format_chk` / `duplicate key`
- [ ] Согласовать доки с БД, если изменится CHECK на `project_prefix`

### Общее

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
- [x] Auth API обёрнуты в `withRetry` (дефолт `shouldRetry: isNetworkError`); отдельный `withAuthNetworkRetry` не нужен
- [x] `AuthProvider`, `useAuth`, подписка `onAuthStateChange`
- [x] Фичи: sign-in / sign-up по email (Zod), sign-out, ссылка на регистрацию
- [x] `mapAuthErrorToMessage`, `isNetworkError` (сетевые ошибки в UI auth)

### Профиль

- [x] Таблица `profiles`, RLS, триггер на `auth.users`
- [x] `getProfileByUserId` (shared/api), `getProfile` + `mapProfileRowToProfile` (entities)
- [x] Доменная модель `Profile`, `ProfileCard` со слотами, `ProfileWidget`, `UserAvatar`, `Sidebar`
- [x] `useProfile` (TanStack Query + `enabled` под auth), `profileKeys`, `updateProfile`
- [x] Email в UI из сессии, не из таблицы `profiles`
- [x] **Блок 1 — аватар:** Storage + `avatar_url`, `upload-avatar` / `remove-avatar`, слот `avatarActions`
- [x] **Блок 2 — имя:** `update-name`, `useUpdateName`, слот `nameSlot`
- [x] **Блок 3 — auth:** `change-email`, `change-password`, `Modal`, `updateAuthUser`, слоты `emailActions` / `passwordActions`

### Projects на `/profile`

- [x] `getProjectsByOwnerId`, `getProjects`, `projectKeys`, `useProjects`, `ProjectsListWidget`, `ProjectCard`, `formatDateRu`
- [x] **create-project:** `createNewProject`, `createProject`, `useCreateProject`, Modal + Zod + автопрефикс
- [x] `transliterateCyrillicToLatin`, `deriveProjectPrefixFromTitle`; `Button.onClick` опционален (submit в формах)

### TanStack Query

- [x] `QueryProvider` в `AppProviders` (снаружи `AuthProvider`)
- [x] `queryClient` с дефолтами: `staleTime`, `gcTime`, `refetchOnWindowFocus: false`, `retry: 1`
- [x] React Query DevTools в режиме разработке
