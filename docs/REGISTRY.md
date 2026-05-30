# Реестр Kanban App

Живая карта публичных модулей (FSD). Обновляйте **в том же PR**, что меняет `src/`.

| Документ                                  | Назначение                                  |
| ----------------------------------------- | ------------------------------------------- |
| [ROADMAP.md](./ROADMAP.md)                | План работ, порядок блоков                  |
| **REGISTRY.md** (этот файл)               | Что есть в коде: слои, зависимости, статусы |
| `canvases/kanban-app-registry.canvas.tsx` | Интерактивный просмотр с фильтрами          |

**Правило обновления:** новая фича → сначала строка в `shared/api`, затем `entities`, `features`, `widgets` / `pages`.

**Правило импорта FSD:** `pages` → `widgets` → `features` → `entities` → `shared`. Features не импортируют друг друга.

---

## Легенда статусов

| Статус | Значение                                                        |
| ------ | --------------------------------------------------------------- |
| ✅     | Рабочая связка с бэкендом (Supabase) и подключена в UI / router |
| 🧪     | Код в репо, заглушка или UI без API / не в сборке страницы      |
| 📋     | Только в [ROADMAP](./ROADMAP.md), в `src/` ещё нет              |

---

## Схема потоков (главное)

```
app
├── AppProviders → QueryProvider, AuthProvider, RouterProvider
├── guards: ProtectedRoute, PublicOnlyRoute, RootRedirectRoute
└── router → pages

Профиль
ProfilePage → ProfileWidget → useProfile → getProfile → getProfileByUserId
                              → ProfileCard → UserAvatar
                              → UploadAvatar / RemoveAvatar (слоты)

Auth
SignInByEmail → signInWithEmail (withRetry) → supabase.auth
             → onAuthStateChange в AuthProvider → /profile
AuthProvider.refreshAuth → getSession (withRetry)
```

---

## 1. Универсальные (`shared`)

### 1.1 API — `shared/api`

| Имя                     | Файл                                          | Тип    | Статус | Назначение                            | Вызывает                                       | Кто использует               |
| ----------------------- | --------------------------------------------- | ------ | ------ | ------------------------------------- | ---------------------------------------------- | ---------------------------- |
| `supabase`              | `shared/api/supabase/client.ts`               | клиент | ✅     | Supabase JS client + типы БД          | `createClient`, env `VITE_*`                   | все API, `AuthProvider`      |
| `signUpWithEmail`       | `shared/api/auth/signUpWithEmail.ts`          | API    | ✅     | Регистрация email/password            | `withRetry` → `supabase.auth.signUp`           | `SignUpByEmail`              |
| `signInWithEmail`       | `shared/api/auth/signInWithEmail.ts`          | API    | ✅     | Вход email/password                   | `withRetry` → `supabase.auth.signInWithPassword` | `SignInByEmail`            |
| `signOut`               | `shared/api/auth/signOut.ts`                  | API    | ✅     | Выход, сброс сессии                   | `withRetry` → `supabase.auth.signOut`          | `AuthProvider.handleSignOut` |
| `getSession`            | `shared/api/auth/getSession.ts`               | API    | ✅     | Текущая сессия                        | `withRetry` → `supabase.auth.getSession`       | `AuthProvider.refreshAuth`   |
| `getCurrentUser`        | `shared/api/auth/getCurrentUser.ts`           | API    | ✅     | User с проверкой JWT на сервере       | `withRetry` → `supabase.auth.getUser`          | резерв                       |
| `getProfileByUserId`    | `shared/api/profile/getProfileByUserId.ts`    | API    | ✅     | SELECT `profiles`                     | `supabase.from('profiles')`                    | `getProfile`                 |
| `updateProfileByUserId` | `shared/api/profile/updateProfileByUserId.ts` | API    | ✅     | UPDATE `profiles`                     | `supabase.from('profiles').update`             | `updateProfile`              |
| `uploadAvatarFile`      | `shared/api/storage/uploadAvatarFile.ts`      | API    | ✅     | Upload в Storage → public URL + `?v=` | `withRetry` → `storage.upload`, `getPublicUrl` | `useUploadAvatar`            |
| `removeAvatarFile`      | `shared/api/storage/removeAvatarFile.ts`      | API    | ✅     | DELETE файла из Storage               | `withRetry` → `storage.remove`                 | `useRemoveAvatar`            |
### 1.2 Lib — `shared/lib`

| Имя                     | Файл                                         | Тип     | Статус | Назначение                          | Вызывает                                         | Кто использует                                |
| ----------------------- | -------------------------------------------- | ------- | ------ | ----------------------------------- | ------------------------------------------------ | --------------------------------------------- |
| `isNetworkError`        | `shared/lib/network/isNetworkError.ts`       | утилита | ✅     | Сетевая ли ошибка (retry + auth UI) | маркеры в `message`, `isAuthRetryableFetchError` | `withRetry`, `mapAuthErrorToMessage`          |
| `withRetry`             | `shared/lib/retry/withRetry.ts`              | утилита | ✅     | Повтор `fn` при сетевых ошибках     | `isNetworkError` (дефолт), `wait`                | auth API, `uploadAvatarFile`, `removeAvatarFile` |
| `mapAuthErrorToMessage` | `shared/lib/auth/mapAuthErrorToMessage.ts`   | утилита | ✅     | Текст ошибки для auth UI            | `isNetworkError` + коды Supabase                 | `SignInByEmail`, `SignUpByEmail`, `SignOut`   |
| `getInitials`           | `shared/lib/profile/getInitials.ts`          | утилита | ✅     | Инициалы из имени                   | —                                                | `UserAvatar`                                  |
| `useAuth`               | `shared/lib/auth/session/useAuth.ts`         | хук     | ✅     | Читает `AuthContext`                | `AuthContext`                                    | guards, `useProfile`, оркестраторы, `SignOut` |
| `AuthContext`           | `shared/lib/auth/session/AuthContext.ts`     | context | ✅     | React-контекст сессии               | —                                                | `AuthProvider`, `useAuth`                     |
| `AuthContextType`       | `shared/lib/auth/session/AuthContextType.ts` | тип     | ✅     | `isAuth`, `user`, `signOut`, …      | —                                                | `AuthProvider`, `useAuth`                     |

### 1.3 UI + config — `shared/ui`, `shared/config`

| Имя          | Файл                       | Тип    | Статус | Назначение                    | Вызывает      | Кто использует                 |
| ------------ | -------------------------- | ------ | ------ | ----------------------------- | ------------- | ------------------------------ |
| `Button`     | `shared/ui/Button.tsx`     | UI     | ✅     | Кнопка                        | —             | `UploadAvatar`, `RemoveAvatar` |
| `UserAvatar` | `shared/ui/UserAvatar.tsx` | UI     | ✅     | Круг: фото / инициалы / пусто | `getInitials` | `ProfileCard`, `Sidebar`       |
| `ROUTES`     | `shared/config/routes.ts`  | config | ✅     | Пути маршрутов                | —             | `router`, guards, features     |

---

## 2. Авторизация

### 2.1 App — провайдеры и guards

| Имя                 | Файл                                      | Слой | Статус | Назначение                               | Вызывает                                          | Кто использует             |
| ------------------- | ----------------------------------------- | ---- | ------ | ---------------------------------------- | ------------------------------------------------- | -------------------------- |
| `App`               | `app/App.tsx`                             | app  | ✅     | Корень приложения                        | `AppProviders`                                    | `main`                     |
| `AppProviders`      | `app/providers/AppProviders.tsx`          | app  | ✅     | Провайдеры + router                      | `QueryProvider`, `AuthProvider`, `RouterProvider` | `App`                      |
| `QueryProvider`     | `app/providers/QueryProvider.tsx`         | app  | ✅     | Обёртка TanStack Query                   | `queryClient`                                     | `AppProviders`             |
| `queryClient`       | `app/providers/query/queryClient.ts`      | app  | ✅     | Дефолты Query (`retry: 1`, `staleTime`…) | —                                                 | `QueryProvider`, mutations |
| `AuthProvider`      | `app/providers/auth/AuthProvider.tsx`     | app  | ✅     | Сессия, user, signOut, подписка auth     | `getSession`, `signOut`, `onAuthStateChange`      | `AppProviders`             |
| `ProtectedRoute`    | `app/router/guards/ProtectedRoute.tsx`    | app  | ✅     | Нет auth → `/sign-in`                    | `useAuth`                                         | `router`                   |
| `PublicOnlyRoute`   | `app/router/guards/PublicOnlyRoute.tsx`   | app  | ✅     | Есть auth → `/profile`                   | `useAuth`                                         | `router`                   |
| `RootRedirectRoute` | `app/router/guards/RootRedirectRoute.tsx` | app  | ✅     | `/` → profile или sign-in                | `useAuth`                                         | `router`                   |
| `router`            | `app/router/router.tsx`                   | app  | ✅     | Конфиг маршрутов                         | pages, guards                                     | `AppProviders`             |
| `AppLayoutRoute`    | `app/router/AppLayoutRoute.tsx`           | app  | ✅     | Outlet + layout                          | `AppLayout`                                       | `router`                   |

### 2.2 Features — auth

| Имя                | Файл                                                   | Слой     | Статус | Назначение               | Вызывает                                                   | Кто использует  |
| ------------------ | ------------------------------------------------------ | -------- | ------ | ------------------------ | ---------------------------------------------------------- | --------------- |
| `SignInByEmail`    | `features/sign-in-by-email/ui/SignInByEmail.tsx`       | features | ✅     | Форма входа + Zod        | `signInSchema`, `signInWithEmail`, `mapAuthErrorToMessage` | `SignInPage`    |
| `signInSchema`     | `features/sign-in-by-email/model/validation.ts`        | Zod      | ✅     | Валидация email/password | —                                                          | `SignInByEmail` |
| `SignUpByEmail`    | `features/sign-up-by-email/ui/SignUpByEmail.tsx`       | features | ✅     | Форма регистрации + Zod  | `signUpSchema`, `signUpWithEmail`, `mapAuthErrorToMessage` | `SignUpPage`    |
| `signUpSchema`     | `features/sign-up-by-email/model/validation.ts`        | Zod      | ✅     | Валидация регистрации    | —                                                          | `SignUpByEmail` |
| `SignOut`          | `features/sign-out/ui/SignOut.tsx`                     | features | ✅     | Кнопка выхода            | `useAuth().signOut`, `mapAuthErrorToMessage`               | `ProfilePage`   |
| `NavigateToSignUp` | `features/navigate-to-sign-up/ui/NavigateToSignUp.tsx` | features | 🧪     | Ссылка на регистрацию    | `ROUTES`                                                   | `SignInPage`    |

### 2.3 Pages — auth

| Имя          | Файл                              | Слой  | Статус | Назначение           | Собирает                            |
| ------------ | --------------------------------- | ----- | ------ | -------------------- | ----------------------------------- |
| `SignInPage` | `pages/sign-in/ui/SignInPage.tsx` | pages | ✅     | Страница входа       | `SignInByEmail`, `NavigateToSignUp` |
| `SignUpPage` | `pages/sign-up/ui/SignUpPage.tsx` | pages | ✅     | Страница регистрации | `SignUpByEmail`                     |

📋 **В ROADMAP:** `useMutation` для sign-in/up (полировка).

---

## 3. Профиль и аватар

### 3.1 Entity — `entities/profile`

| Имя                      | Файл                                               | Тип        | Статус | Назначение                            | Вызывает                                       | Кто использует                       |
| ------------------------ | -------------------------------------------------- | ---------- | ------ | ------------------------------------- | ---------------------------------------------- | ------------------------------------ |
| `Profile`                | `entities/profile/model/types.ts`                  | тип        | ✅     | Домен: id, fullName, email, avatarUrl | —                                              | везде в профиле                      |
| `UpdateProfileInput`     | `entities/profile/api/updateProfile.ts`            | тип        | ✅     | `avatar_url` или `full_name`          | —                                              | `updateProfile`                      |
| `profileKeys`            | `entities/profile/api/profileKeys.ts`              | TSQ keys   | ✅     | `['profile', id]`                     | —                                              | `useProfile`, mutations              |
| `mapProfileRowToProfile` | `entities/profile/model/mapProfileRowToProfile.ts` | маппер     | ✅     | Row БД → `Profile`                    | —                                              | `getProfile`, `updateProfile`        |
| `getProfile`             | `entities/profile/api/getProfile.ts`               | API entity | ✅     | Профиль из БД + email из сессии       | `getProfileByUserId`, `mapProfileRowToProfile` | `useProfile`                         |
| `updateProfile`          | `entities/profile/api/updateProfile.ts`            | API entity | ✅     | UPDATE профиля → `Profile`            | `updateProfileByUserId`, маппер                | `useUploadAvatar`, `useRemoveAvatar` |
| `useProfile`             | `entities/profile/api/useProfile.ts`               | хук        | ✅     | Query профиля                         | `useAuth`, `getProfile`, `profileKeys`         | `ProfileWidget`, `Sidebar`           |
| `ProfileCard`            | `entities/profile/ui/ProfileCard.tsx`              | UI         | ✅     | Layout профиля + слоты                | `UserAvatar`                                   | `ProfileWidget`                      |

### 3.2 Features — аватар

| Имя                 | Файл                                              | Тип     | Статус | Назначение                 | Вызывает                                                   | Кто использует         |
| ------------------- | ------------------------------------------------- | ------- | ------ | -------------------------- | ---------------------------------------------------------- | ---------------------- |
| `useUploadAvatar`   | `features/upload-avatar/model/useUploadAvatar.ts` | хук     | ✅     | Оркестратор upload         | `uploadAvatarFile` → `updateProfile` → `setQueryData`      | `UploadAvatar`         |
| `useRemoveAvatar`   | `features/remove-avatar/model/useRemoveAvatar.ts` | хук     | ✅     | Оркестратор remove         | `removeAvatarFile` → `updateProfile({ avatar_url: null })` | `RemoveAvatar`         |
| `UploadAvatar`      | `features/upload-avatar/ui/UploadAvatar.tsx`      | UI      | ✅     | file input, Zod, mutation  | `useUploadAvatar`, `fileSchema`, `useIsMutating`           | `ProfileWidget` (слот) |
| `RemoveAvatar`      | `features/remove-avatar/ui/RemoveAvatar.tsx`      | UI      | ✅     | Кнопка удаления            | `useRemoveAvatar`, `useIsMutating`                         | `ProfileWidget` (слот) |
| `fileSchema`        | `features/upload-avatar/model/validation.ts`      | Zod     | ✅     | Файл: image, ≤5MB          | —                                                          | `UploadAvatar`         |
| `edit-profile-name` | —                                                 | feature | 📋     | Редактирование `full_name` | `updateProfile`                                            | ROADMAP `nameSlot`     |
| `change-email`      | —                                                 | feature | 📋     | Смена email через Auth     | `supabase.auth.updateUser`                                 | ROADMAP                |
| `useProjects`       | —                                                 | хук     | 📋     | Список проектов            | `getProjectsByOwnerId`                                     | ROADMAP                |

### 3.3 Widgets + pages — профиль

| Имя             | Файл                                | Слой    | Статус | Назначение                          | Вызывает                                     | Кто использует |
| --------------- | ----------------------------------- | ------- | ------ | ----------------------------------- | -------------------------------------------- | -------------- |
| `ProfileWidget` | `widgets/profile/ProfileWidget.tsx` | widgets | ✅     | Loading + `ProfileCard` + слоты фич | `useProfile`, `UploadAvatar`, `RemoveAvatar` | `ProfilePage`  |
| `Sidebar`       | `widgets/sidebar/ui/Sidebar.tsx`    | widgets | ✅     | Мини-аватар в шапке                 | `useProfile`, `UserAvatar`                   | `AppLayout`    |
| `ProfilePage`   | `pages/profile/ui/ProfilePage.tsx`  | pages   | ✅     | `/profile`                          | `ProfileWidget`, `SignOut`                   | `router`       |

---

## 4. App / layout / прочие страницы

| Имя           | Файл                                  | Слой    | Статус | Назначение                  | Собирает / вызывает     |
| ------------- | ------------------------------------- | ------- | ------ | --------------------------- | ----------------------- |
| `AppLayout`   | `widgets/app-layout/ui/AppLayout.tsx` | widgets | ✅     | Header + sidebar + children | `Sidebar`, `{children}` |
| `ProjectPage` | `pages/project/ui/ProjectPage.tsx`    | pages   | 🧪     | Заглушка проекта            | —                       |
| `ErrorPage`   | `pages/error/ui/ErrorPage.tsx`        | pages   | 🧪     | 404 / error boundary        | —                       |

---

## 5. Заглушки канбана (пока без API)

| Имя             | Файл                                           | Слой     | Статус | Назначение            |
| --------------- | ---------------------------------------------- | -------- | ------ | --------------------- |
| `BoardView`     | `widgets/board-view/ui/BoardView.tsx`          | widgets  | 🧪     | «вид доски»           |
| `Topbar`        | `widgets/topbar/ui/Topbar.tsx`                 | widgets  | 🧪     | верхняя панель        |
| `CreateTask`    | `features/create-task/ui/CreateTask.tsx`       | features | 🧪     | создание задачи       |
| `ToggleSidebar` | `features/toggle-sidebar/ui/ToggleSidebar.tsx` | features | 🧪     | toggle sidebar        |
| `TaskCard`      | `entities/task/ui/TaskCard.tsx`                | entities | 🧪     | карточка задачи       |
| `ProjectCard`   | `entities/project/ui/ProjectCard.tsx`          | entities | 🧪     | карточка проекта      |
| `ColumnCard`    | `entities/column/ui/ColumnCard.tsx`            | entities | 🧪     | карточка колонки      |
| `Task`          | `entities/task/model/types.ts`                 | тип      | 🧪     | домен задачи без API  |
| `Project`       | `entities/project/model/types.ts`              | тип      | 🧪     | домен проекта без API |
| `Column`        | `entities/column/model/types.ts`               | тип      | 🧪     | домен колонки без API |
| `Board`         | `entities/board/model/types.ts`                | тип      | 🧪     | домен доски без API   |

---

## 6. Цепочки «кто кого зовёт» (шпаргалка)

### Upload аватара

```
UploadAvatar
  → fileSchema (Zod)
  → useUploadAvatar.mutate(file)
      → uploadAvatarFile (withRetry → Storage)
      → updateProfile → updateProfileByUserId
      → onSuccess: setQueryData(profileKeys.detail)
ProfileCard / Sidebar ← useProfile (тот же cache)
```

### Чтение профиля

```
ProfileWidget / Sidebar
  → useProfile (enabled: auth ready)
      → getProfile → getProfileByUserId
      → mapProfileRowToProfile (+ email из useAuth)
```

### Вход и сессия

```
SignInByEmail
  → signInSchema
  → signInWithEmail (withRetry) → supabase.auth
  → onAuthStateChange в AuthProvider обновляет user
  → navigate /profile

AuthProvider.refreshAuth
  → getSession (withRetry) → session | null (гость без throw)
```

---

## Changelog registry

- **2026-05-29:** `withRetry` на auth API (`getSession`, sign-in/up/out, `getCurrentUser`); ROADMAP — блок 1 готов, фокус блок 2
- **2026-05-30:** первый `REGISTRY.md`; avatar Storage, `withRetry`, `isNetworkError`; синхронизация с Canvas
- **2026-05-29:** upload/remove аватар, профиль на `/profile`

---

## Checklist при PR

- [ ] Новые публичные модули — строки в реестре (снизу вверх: `shared/api` → `entities` → `features` → `widgets`/`pages`)
- [ ] Обновлены «Вызывает» / «Кто использует» у соседей
- [ ] Новый сквозной сценарий — секция **6. Цепочки**
- [ ] Строка в **Changelog registry**
- [ ] При необходимости — [ROADMAP](./ROADMAP.md) и `kanban-app-registry.canvas.tsx`
