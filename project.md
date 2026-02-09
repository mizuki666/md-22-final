# Мануал: приложение поиска авиабилетов (React + Redux Toolkit + TypeScript)

## Цель

Приложение для поиска авиабилетов с:
- фейковым API через **async-thunk**;
- сортировкой по цене, длительности, количеству пересадок;
- фильтрацией по авиакомпаниям и по количеству пересадок.

---

## 1. Чек-лист по критериям (10 баллов)

| Критерий | Баллы | Что нужно |
|----------|--------|-----------|
| Vite/CRA, `npm run dev` и `npm run build` работают | 2 | Добавить в `package.json` скрипт `"start": "vite"` для совместимости с формулировкой задания |
| Redux Toolkit (не createStore, не connect/mapState/mapDispatch) | 2 | Store через `configureStore`, компоненты через `useSelector`/`useDispatch` или хуки из slice |
| Адаптивная вёрстка по макету Figma | 2 | Стили под ПК и мобильные, проверка на разных ширинах |
| Доп. методы RTK: createAsyncThunk, createEntityAdapter | +1 за каждый | У вас уже есть createAsyncThunk; добавить createEntityAdapter для списка билетов |
| TypeScript | 2 | Типы для всех сущностей и пропсов |

---

## 2. Пошаговая реализация

### Шаг 1. Скрипты и типы

**1.1.** В `package.json` в `scripts` добавьте (если ещё нет):

```json
"start": "vite"
```

Чтобы проект «запускался с помощью npm start», как в задании.

**1.2.** Типы билета оставьте в одном месте — например только в `src/types/ticket.ts`. Интерфейс из задания:

```ts
export interface TicketTime {
  startTime: string;
  endTime: string;
}

export interface Ticket {
  id: number;
  from: string;
  to: string;
  company: string;
  price: number;
  currency: 'RUB';
  time: TicketTime;
  duration: number;
  date: string;
  connectionAmount: number | null;
}
```

Дополнительно можно хранить там же типы для сортировки и фильтров (SortField, SortOrder, Filters).

---

### Шаг 2. Redux: store и slice

**2.1. Store**

Создайте `src/store/index.ts`:

```ts
import { configureStore } from '@reduxjs/toolkit';
import ticketsReducer from './ticketsSlice';

export const store = configureStore({
  reducer: {
    tickets: ticketsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**2.2. Slice с createAsyncThunk и (опционально) createEntityAdapter**

- В slice обрабатывайте экшены от `fetchTickets` и `fetchCompanies` через `extraReducers`.
- Состояние: список билетов, список компаний, выбранные фильтры (компании, пересадки), поле и порядок сортировки, статус загрузки/ошибка.

Пример структуры состояния без adapter:

```ts
{
  items: Ticket[],
  companies: string[],
  filters: { companies: string[], stops: number[] },
  sortBy: SortField,
  sortOrder: 'asc' | 'desc',
  loading: boolean,
  error: string | null
}
```

Для получения балла за **createEntityAdapter**:

- Используйте `createEntityAdapter<Ticket>()` для хранения билетов по `id`.
- В `extraReducers` при `fetchTickets.fulfilled` вызывайте `adapter.setAll(state, action.payload)`.
- Селекторы: `adapter.getSelectors()`, при необходимости комбинируйте с фильтрами/сортировкой в других селекторах.

**2.3. Подключение store в приложении**

В `src/main.tsx`:

```tsx
import { Provider } from 'react-redux';
import { store } from './store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
```

Без `Provider` Redux в приложении не работает.

---

### Шаг 3. Фейковое API (async-thunk)

У вас уже есть `src/api/ticketApi.ts` с `createAsyncThunk`:

- `fetchTickets(params)` — возвращает билеты (с фильтрацией/сортировкой на стороне «API» или в селекторах — на ваш выбор).
- `fetchCompanies()` — список компаний.

Важно:

- В slice при загрузке приложения (или при смене фильтров/сортировки) вызывать `dispatch(fetchTickets(...))` и `dispatch(fetchCompanies())`.
- Параметры для `fetchTickets` брать из state (фильтры, sortBy, sortOrder), чтобы при смене фильтров/сортировки запрос шёл с актуальными параметрами.

Формат данных должен поддерживать сортировку (у вас уже есть `price`, `duration`, `connectionAmount`).

---

### Шаг 4. Фильтрация и сортировка

**4.1. Фильтрация по пересадкам**

- В state храните массив выбранных значений пересадок, например `stops: number[]` (0, 1, 2, «любое»).
- В UI — чекбоксы/кнопки: «Без пересадок», «1 пересадка», «2 пересадки» и т.д.
- При выборе обновляйте state и заново вызывайте `fetchTickets` с новым `stops` (или фильтруйте в селекторе из данных, полученных с «сервера»).

**4.2. Фильтрация по авиакомпаниям**

- В state храните массив выбранных компаний `companies: string[]`.
- В UI — чекбоксы по списку компаний (список из `fetchCompanies`).
- При изменении обновляйте state и снова запрашивайте билеты с параметром `companies`.

**4.3. Сортировка**

- В state: `sortBy: 'price' | 'duration' | 'connectionAmount'` и `sortOrder: 'asc' | 'desc'`.
- В UI — переключатель (кнопки/селект): «Цена», «Время в пути», «Пересадки» и направление.
- При смене обновляйте state и вызывайте `fetchTickets` с `sortBy` и `order`.

Логику можно держать в thunk (как у вас сейчас) или отдавать с «сервера» все билеты и фильтровать/сортировать в селекторах — оба варианта допустимы.

---

### Шаг 5. Компоненты

**5.1. Список билетов**

- Компонент (например, `TicketList`) получает из Redux список билетов через `useSelector` (напрямую или через селектор с фильтрацией/сортировкой).
- Рендерит карточки билетов (отдельный компонент `Ticket` для одного билета).
- В карточке: откуда/куда, компания, цена, время вылета/прилёта, длительность, дата, количество пересадок.

**5.2. Боковая панель фильтров**

- Компонент фильтров использует `useSelector` для списка компаний и текущих фильтров/сортировки, `useDispatch` для экшенов смены фильтров и сортировки.
- При изменении чекбоксов/кнопок — диспатчить экшены, которые обновляют state и (в эффекте или в самом обработчике) вызывают `dispatch(fetchTickets(...))`.

**5.3. Header**

- Оставьте как есть или приведите в соответствие макету Figma.

---

### Шаг 6. Адаптивная вёрстка

- Сверстайте по макету Figma: сетка, отступы, шрифты, цвета.
- Используйте медиа-запросы (`@media`) для мобильной версии: колонка фильтров сверху или в выдвижной панели, список билетов — одна колонка, удобные размеры кнопок и чекбоксов.
- Проверьте запуск на ПК и на узкой ширине (мобильный вид).

---

### Шаг 7. TypeScript

- Все пропсы компонентов опишите интерфейсами.
- Redux: типизируйте `RootState`, `AppDispatch`, аргументы и результат thunk, типы в slice.
- Избегайте `any`.

---

## 3. Где вы ошиблись и что исправить

### Критичные ошибки

**1. Redux не подключён к приложению**

- В `main.tsx` нет `Provider` и `store`. Даже при наличии `createAsyncThunk` в `ticketApi.ts` Redux не используется.
- **Исправление:** создать store (`configureStore`), slice с `extraReducers` для thunk, в `main.tsx` обернуть `<App />` в `<Provider store={store}>`.

**2. Нет slice и хранилища состояния**

- Нет `createSlice`, нет состояния для билетов, компаний, фильтров и сортировки.
- **Исправление:** один slice (например, `ticketsSlice`) с полями `items`, `companies`, `filters`, `sortBy`, `sortOrder`, `loading`, `error` и с `extraReducers` для `fetchTickets` и `fetchCompanies`. Для балла за createEntityAdapter храните билеты через `createEntityAdapter<Ticket>()`.

**3. Компоненты не используют Redux**

- Ни один компонент не вызывает `useSelector` или `useDispatch`. Фильтры и список билетов не связаны со state.
- **Исправление:** в компоненте списка билетов — `useSelector` для списка билетов (и при необходимости loading/error); в компоненте фильтров — `useSelector` для компаний и текущих фильтров/сортировки, `useDispatch` для обновления фильтров и вызова `fetchTickets`/`fetchCompanies`.

**4. Список билетов не отображается**

- В `App.tsx` вместо списка билетов заглушка «райт зон» (очевидная опечатка).
- **Исправление:** вывести компонент списка билетов (например, `<TicketList />`), который берёт данные из Redux и рендерит карточки. Компонент `Ticket` сейчас пустой — нужно реализовать разметку одной карточки (from, to, company, price, time, duration, connectionAmount).

**5. Компонент фильтров не реализует фильтрацию**

- `filter.tsx` только выводит три строки (head, text, content) без разметки и без привязки к state. Нет чекбоксов по компаниям, по пересадкам, нет переключателя сортировки.
- **Исправление:** добавить UI для выбора компаний (из Redux), пересадок и типа/порядка сортировки; по клику диспатчить экшены и при необходимости вызывать `fetchTickets` с актуальными параметрами.

### Дополнительные замечания

**6. Дублирование типов**

- Интерфейс `Ticket` описан и в `src/types/ticket.ts`, и в `src/components/tickets/interface/ticket.ts`.
- **Исправление:** оставить один источник истины (например, `src/types/ticket.ts`) и везде импортировать оттуда. Второй файл можно удалить или реэкспортировать из types.

**7. Опечатка в имени интерфейса**

- В `filter.tsx`: `SelctorsFilter` → лучше `SelectorsFilter` или, по смыслу, `FilterProps`.

**8. Скрипт запуска**

- В задании указано «запускается с помощью npm start или npm run dev». В `package.json` есть только `dev`. Для однозначного соответствия критерию добавьте `"start": "vite"`.

**9. createEntityAdapter не используется**

- Для дополнительного балла нужен `createEntityAdapter` для массива билетов. Сейчас массив хранится «как есть». Добавьте adapter в slice и используйте `setAll`/`getSelectors()`.

**10. Стили**

- `filter.css` с `background: red` — явно черновой вариант; привести к макету Figma.

---

## 4. Порядок внедрения (кратко)

1. Добавить `"start": "vite"` в `package.json`.
2. Создать store и slice (с extraReducers для fetchTickets и fetchCompanies), при желании — с createEntityAdapter.
3. Подключить `Provider` в `main.tsx`.
4. Реализовать компонент карточки билета и список билетов с `useSelector`.
5. Доработать компонент фильтров: UI + `useDispatch`/`useSelector`, вызов `fetchTickets` при смене параметров.
6. В `App.tsx` вывести список билетов вместо «райт зон».
7. Унифицировать типы (один файл для Ticket).
8. Сверстать по макету и проверить адаптив.

После этого проект будет соответствовать критериям: Vite, Redux Toolkit без legacy API, createAsyncThunk (и при желании createEntityAdapter), TypeScript и адаптивная вёрстка по макету.
