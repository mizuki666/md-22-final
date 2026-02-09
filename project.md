# Финальный проект: Поиск авиабилетов — план оставшихся работ

В этом документе оставлены **только невыполненные/недоделанные** части ТЗ (то, что уже сделано — убрано).

---

## Что нужно доделать, чтобы закрыть ТЗ (короткий список)

- **Привести фейковое API к корректному формату**: `public/tickets.json` должен быть **массивом** билетов, а не одним объектом (иначе `fetchTickets(): Promise<Ticket[]>` не соответствует факту).
- **Доделать `ticketsSlice`**: сейчас в `src/store/slices/ticketsSlice.ts` используется `initialState`, но он **не объявлен** → нужно сделать adapter + `getInitialState`, добавить thunk/extraReducers/reducers/селекторы.
- **Подключить Provider** в `src/main.tsx` (сейчас `<App />` рендерится без `Provider`).
- **UI под ТЗ**: компоненты сортировки, фильтров, списка билетов и карточки билета + интеграция с Redux (хуки `useSelector`/`useDispatch`).
- **Адаптив** (стили вы делаете сами) и финальная проверка `npm run dev` / `npm run build`.

---

## Этап 2 (доделать): `public/tickets.json` под `Ticket[]`

Сейчас `public/tickets.json` — **один объект**, а должен быть **массив объектов** (минимум 5–10), чтобы:

- `fetchTickets()` реально возвращал `Ticket[]`
- было что сортировать/фильтровать (разные `company`, `price`, `duration`, `connectionAmount`)

**Что сделать:**

- Обернуть текущий объект в массив `[]`.
- Добавить ещё несколько билетов (разные значения), обязательно с полями: `price`, `duration`, `connectionAmount`.

**Проверка:** `fetch('/tickets.json').then(r => r.json())` возвращает массив.
---

## Этап 3 (доделать) — пошагово: скелет slice + Provider

Сейчас проект не собирается: в `ticketsSlice.ts` написано `initialState`, но такой переменной нет. И приложение не знает про Redux store, потому что в `main.tsx` нет `Provider`. Ниже — что делать **по шагам**, по одному действию.

---

### Шаг 3.1 — Открыть файл slice

Открой файл **`src/store/slices/ticketsSlice.ts`**. Сейчас там есть `createSlice` и `initialState` без объявления — мы это исправим.

---

### Шаг 3.2 — Добавить adapter (хранилище билетов по id)

**Зачем:** Redux Toolkit даёт `createEntityAdapter` — это способ хранить список сущностей (билетов) по их `id`. Позже мы будем класть сюда загруженные билеты.

**Что написать** — сразу после импортов (после строки с `SortField`), **до** `const ticketsSlice = ...`:

```ts
const ticketsAdapter = createEntityAdapter<Ticket>({
  selectId: (ticket) => ticket.id,
});
```

То есть: создаём «адаптер» для типа `Ticket`, а ключ каждой записи — поле `id`.

---

### Шаг 3.3 — Описать тип «дополнительного» состояния

**Зачем:** В slice хранятся не только билеты (их даёт adapter), но и флаги загрузки, ошибка, выбранная сортировка и фильтры. Эти поля мы описываем отдельным типом.

**Что написать** — сразу после `ticketsAdapter`, **до** `initialState`:

```ts
type TicketsExtraState = {
  loading: boolean;
  error: string | null;
  sortBy: SortField;
  stopsFilter: number[];
  companiesFilter: string[];
};
```

Пока просто запомни: `loading` — идёт ли загрузка, `error` — текст ошибки (или null), `sortBy` — по чему сортировать, `stopsFilter` и `companiesFilter` — выбранные фильтры.

---

### Шаг 3.4 — Создать начальное состояние (initialState)

**Зачем:** В Redux у каждого reducer есть «начальное состояние». Мы берём начальное состояние от adapter и добавляем к нему наши поля.

**Что написать** — сразу после типа `TicketsExtraState`:

```ts
const initialState = ticketsAdapter.getInitialState<TicketsExtraState>({
  loading: false,
  error: null,
  sortBy: 'price',
  stopsFilter: [],
  companiesFilter: [],
});
```

Итог: изначально билетов нет (adapter даёт пустые `ids` и `entities`), загрузки нет, ошибки нет, сортировка по цене, фильтры пустые (значит «показать всё»).

---

### Шаг 3.5 — Добавить хотя бы один reducer

**Зачем:** В `createSlice` поле `reducers` не может быть совсем пустым в TypeScript — иначе бывают ошибки типов. Поэтому добавляем один «пустой» reducer, который ничего не меняет. Позже сюда же добавим `setSortBy`, `setStopsFilter`, `setCompaniesFilter`.

**Что сделать:** В объекте `reducers` вместо только комментария добавь одну строку:

```ts
reducers: {
  noop: (state) => state,
},
```

То есть action `noop` просто возвращает state без изменений. Имя можно любое, важно что reducer есть.

---

### Шаг 3.6 — Проверить, что slice экспортирует reducer

В конце файла уже есть:

```ts
export const ticketsReducer = ticketsSlice.reducer;
```

Ничего менять не нужно — просто убедись, что эта строка есть. Её импортирует `src/store/index.ts`.

---

### Итог по файлу `ticketsSlice.ts`

В итоге порядок в файле должен быть такой:

1. Импорты (`createSlice`, `createEntityAdapter`, `Ticket`, `SortField`).
2. `const ticketsAdapter = createEntityAdapter<Ticket>({ selectId: ... })`.
3. `type TicketsExtraState = { ... }`.
4. `const initialState = ticketsAdapter.getInitialState<TicketsExtraState>({ ... })`.
5. `const ticketsSlice = createSlice({ name: 'tickets', initialState, reducers: { noop: ... } })`.
6. `export const ticketsReducer = ticketsSlice.reducer`.

Сохрани файл и проверь: в терминале выполни `npm run build`. Ошибок быть не должно (по крайней мере не из‑за `initialState`).

---

### Шаг 3.7 — Подключить Provider в main.tsx

**Зачем:** Store у тебя уже создан в `src/store/index.ts`, но React о нём не знает. Чтобы компоненты могли читать state и вызывать actions через `useSelector` и `useDispatch`, всё приложение нужно обернуть в компонент **`Provider`** из `react-redux` и передать ему `store`.

**Что сделать** — открыть **`src/main.tsx`** и изменить так:

1. **Добавить импорты** в начало файла (рядом с существующими):
   ```ts
   import { Provider } from 'react-redux';
   import { store } from './store';
   ```

2. **Обернуть `<App />` в `<Provider>`:**  
   Было:
   ```tsx
   createRoot(document.getElementById('root')!).render(
     <StrictMode>
       <App />
     </StrictMode>,
   );
   ```
   Стало:
   ```tsx
   createRoot(document.getElementById('root')!).render(
     <StrictMode>
       <Provider store={store}>
         <App />
       </Provider>
     </StrictMode>,
   );
   ```

Сохрани файл.

---

### Шаг 3.8 — Проверка

1. В терминале: **`npm run dev`** — приложение должно запуститься без ошибок.
2. В браузере открой приложение. Если ставил расширение Redux DevTools — открой его и посмотри state: должна быть ветка **`tickets`** с полями `ids`, `entities`, `loading`, `error`, `sortBy`, `stopsFilter`, `companiesFilter`.

Если всё так — этап 3 выполнен. Дальше в этапе 4 в этот же slice добавим загрузку билетов (thunk), смену сортировки/фильтров (reducers) и селектор для списка на экране.

---

## Этап 4. Slice: thunk, reducers и селектор (добавить в тот же ticketsSlice)

**Цель:** в уже созданный на этапе 3 slice добавить загрузку билетов через **createAsyncThunk**, обновление фильтров/сортировки через **reducers** и производный **селектор** для отображаемого списка. Структура state и adapter уже есть (этап 3), меняем только файл `ticketsSlice.ts`.

**Зависимости:** этапы 1, 2, 3 (типы, API `fetchTickets`, store с slice-скелетом и Provider).

**Проверка:** диспатч thunk загружает билеты в state; смена sortBy и фильтров через actions меняет результат `selectFilteredAndSortedTickets`. Временно в App можно вывести `useSelector(selectFilteredAndSortedTickets).length`.

**Статус в проекте:** в slice пока только скелет — этот этап в работе.

### Что добавить в `src/store/slices/ticketsSlice.ts`

1. **Импорты**
   - `createAsyncThunk`, `PayloadAction` из `@reduxjs/toolkit`.
   - `fetchTickets` из `../../api/ticketsApi` (или по вашему пути).
   - `RootState` из `../index` (для селекторов).

2. **createAsyncThunk**
   - Thunk с типом `createAsyncThunk<Ticket[], void>('tickets/fetchTickets', () => fetchTickets())`.
   - В `createSlice` добавить `extraReducers(builder => { ... })`:
     - `fetchTickets.pending`: `state.loading = true`, `state.error = null`.
     - `fetchTickets.fulfilled`: `ticketsAdapter.setAll(state, action.payload)`, `state.loading = false`.
     - `fetchTickets.rejected`: `state.loading = false`, `state.error = action.error.message ?? 'Ошибка загрузки'` (или привести к строке).

3. **Reducers (добавить в существующий объект reducers)**
   - `setSortBy(state, action: PayloadAction<SortField>)` → `state.sortBy = action.payload`.
   - `setStopsFilter(state, action: PayloadAction<number[]>)` → `state.stopsFilter = action.payload`.
   - `setCompaniesFilter(state, action: PayloadAction<string[]>)` → `state.companiesFilter = action.payload`.
   - Экспорт actions: `export const { setSortBy, setStopsFilter, setCompaniesFilter } = ticketsSlice.actions` (и при необходимости экспорт thunk по имени для диспатча).

4. **Селекторы**
   - Базовые от adapter:  
     `const ticketsSelectors = ticketsAdapter.getSelectors((state: RootState) => state.tickets);`  
     при необходимости экспортировать `ticketsSelectors.selectAll`, `ticketsSelectors.selectById`.
   - Производный селектор `selectFilteredAndSortedTickets(state: RootState): Ticket[]`:
     - взять все билеты: `const all = ticketsSelectors.selectAll(state)` (или `ticketsAdapter.getSelectors(...).selectAll(state)`);
     - если `state.tickets.stopsFilter.length > 0` — оставить билеты, у которых `connectionAmount` входит в `stopsFilter` (значение `null` считать как 0 пересадок, если так в ТЗ);
     - если `state.tickets.companiesFilter.length > 0` — оставить билеты, у которых `company` входит в `companiesFilter`;
     - отсортировать массив по `state.tickets.sortBy`: по полям `price`, `duration` или `connectionAmount` (для `null` задать правило, например считать как 0);
     - вернуть массив.
   - Селектор экспортировать и использовать в компонентах списка билетов (этап 6).

---

## Этап 5. Компоненты: сортировка и фильтры (левая колонка)

**Цель:** пользователь может выбрать способ сортировки и фильтры; изменения пишутся в Redux, список билетов (этап 6) сам подстроится через селектор.

**Зависимости:** этап 4 (actions и state в slice).

**Что сделать:**

1. **Блок сортировки** (например `src/components/sort/SortBar.tsx` или внутри одного компонента фильтров):
   - Три варианта: «Цена», «Время в пути», «Пересадки» (соответствуют `SortField`).
   - По клику диспатчить `setSortBy('price' | 'duration' | 'connectionAmount')`.
   - Данные из store: `useSelector(state => state.tickets.sortBy)` для подсветки выбранного.

2. **Фильтр пересадок:**
   - Чекбоксы: «Без пересадок», «1 пересадка», «2», «3 и более» (значения 0, 1, 2, 3 или как у вас в типах).
   - Клик — диспатч `setStopsFilter` с обновлённым массивом выбранных значений (добавить/удалить число).

3. **Фильтр авиакомпаний:**
   - Список компаний: уникальные `company` из билетов. Варианты: селектор, который по `selectAll` возвращает уникальные компании, или хранить список компаний в state при загрузке.
   - Чекбоксы по компаниям — диспатч `setCompaniesFilter` с массивом выбранных названий.

4. В `App.tsx` в левую колонку (первый `<section>`) вставить блок сортировки и оба блока фильтров.

**Проверка:** переключение сортировки и фильтров не даёт ошибок; в Redux DevTools видно смену `sortBy`, `stopsFilter`, `companiesFilter`.

**Статус в проекте:** компонентов filter/sort нет — этап в работе.

---

## Этап 6. Компоненты: список билетов и карточка билета (правая колонка)

**Цель:** отобразить загруженные билеты с учётом фильтров и сортировки; показывать загрузку и ошибку.

**Зависимости:** этап 4 (селектор `selectFilteredAndSortedTickets`), этап 5 не обязателен для отображения (можно проверить без фильтров).

**Что сделать:**

1. **Список билетов** (например `src/components/tickets/TicketList.tsx`):
   - `useSelector(selectFilteredAndSortedTickets)` — массив для отображения.
   - `useSelector(state => state.tickets.loading)` и `state.tickets.error`.
   - Если `loading` — показать скелетон/лоадер.
   - Если `error` — показать сообщение об ошибке.
   - Иначе — мапить массив в компонент карточки билета.
   - При монтировании диспатчить thunk загрузки билетов (один раз, например в `useEffect` или при первом открытии страницы).

2. **Карточка билета** (например `src/components/tickets/TicketCard.tsx`):
   - Props: объект `Ticket`.
   - Отобразить: `from`, `to`, `company`, `price`, `currency`, `time.startTime` / `time.endTime`, `duration`, `date`, `connectionAmount` (текстом: «Без пересадок», «1 пересадка», «2 пересадки» и т.д.). При желании форматировать время через date-fns.

3. В `App.tsx` во вторую колонку (второй `<section>`) вставить список билетов.

**Проверка:** после загрузки отображаются билеты; при смене сортировки/фильтров список обновляется; при загрузке виден индикатор, при ошибке — сообщение.

**Статус в проекте:** компонентов tickets нет — этап в работе.

---

## Этап 7. Сборка layout и первый полный прогон

**Цель:** левая колонка (сортировка + фильтры) и правая (список билетов) собраны в App; загрузка при старте; всё взаимодействует через Redux.

**Зависимости:** этапы 4, 5, 6.

**Что сделать:**

1. Убедиться, что в `App.tsx`:
   - Левая колонка: блок сортировки + фильтр пересадок + фильтр авиакомпаний.
   - Правая колонка: список билетов (с загрузкой и ошибкой).
2. При первом открытии приложения диспатчится thunk загрузки (в списке билетов или в App).
3. Проверить: сортировка по цене/времени/пересадкам меняет порядок; фильтры по пересадкам и компаниям сужают список.

**Проверка:** сценарий «открыл приложение → увидел билеты → поменял сортировку → включил/выключил фильтры» работает без ошибок.

---

## Этап 8. Адаптивная вёрстка

**Цель:** соответствие макету Figma, корректная работа на ПК и на мобильных.

**Зависимости:** этап 7 (вся логика и разметка на месте).

**Что сделать:**

1. Сверстать по макету: блоки, порядок, отступы (стили настраиваете сами).
2. ПК: sidebar слева, список справа (как в текущей разметке).
3. Мобильные: колонки в столбик; фильтры/сортировка доступны (аккордеон, выезжающая панель или отдельный блок — по макету).
4. Проверить при разных ширинах: layout не ломается, элементы читаемы и кликабельны.

**Проверка:** вид на десктопе и на узком экране соответствует требованиям и макету.

---

## Чек-лист перед сдачей

- [ ] `npm run dev` — приложение открывается и работает.
- [ ] `npm run build` — сборка без ошибок.
- [ ] Только Redux Toolkit: `configureStore`, нет `createStore`, нет `connect`/`mapStateToProps`/`mapDispatchToProps`.
- [ ] Используются `createAsyncThunk` (загрузка билетов) и `createEntityAdapter` (массив билетов в slice).
- [ ] Сортировка по цене, длительности, пересадкам работает.
- [ ] Фильтр по пересадкам и по авиакомпаниям работают.
- [ ] Типы TypeScript заданы для store, API и компонентов.
- [ ] Вёрстка соответствует макету и корректна на ПК и мобильных.
- [ ] Репозиторий на GitHub публичный, в нём готовое решение.

---

## Порядок оставшихся этапов (кратко)

1. **Исправить данные** — `public/tickets.json` сделать массивом `Ticket[]` и добавить достаточно билетов для тестов.
2. **Довести до запуска** — починить `ticketsSlice` (adapter + `initialState`) и подключить `Provider` в `main.tsx`.
3. **Реализовать требования ТЗ в slice** — `createAsyncThunk` (загрузка), `createEntityAdapter` (хранение), reducers для сортировки/фильтров, селектор для выдачи списка.
4. **Собрать UI** — сортировка, фильтры, список билетов, карточка билета (все через хуки RTK).
5. **Адаптив + финальная проверка** — сверстать под Figma и проверить `npm run dev` / `npm run build`.
