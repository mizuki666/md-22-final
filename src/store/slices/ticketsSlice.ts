import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { Ticket, SortField } from '../../types/ticket';
import { fetchTickets } from '../../api/ticketsApi';
const ticketsAdapter = createEntityAdapter<Ticket>();

export const fetchTicketsThunk = createAsyncThunk<Ticket[], void>(
  'tickets/fetchTickets',
  () => fetchTickets(),
);

type TicketsExtraState = {
  loading: boolean;
  error: string | null;
  sortBy: SortField;
  stopsFilter: number[];
  companiesFilter: string[];
};

const initialState = ticketsAdapter.getInitialState<TicketsExtraState>({
  loading: false,
  error: null,
  sortBy: 'price',
  stopsFilter: [],
  companiesFilter: [],
});

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setSortBy(state, action: PayloadAction<SortField>) {
      state.sortBy = action.payload;
    },
    setStopsFilter(state, action: PayloadAction<number[]>) {
      state.stopsFilter = action.payload;
    },
    setCompaniesFilter(state, action: PayloadAction<string[]>) {
      state.companiesFilter = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTicketsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicketsThunk.fulfilled, (state, action) => {
        ticketsAdapter.setAll(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchTicketsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Ошибка загрузки';
      });
  },
});

export const { setSortBy, setStopsFilter, setCompaniesFilter } =
  ticketsSlice.actions;
export const ticketsReducer = ticketsSlice.reducer;
export { ticketsAdapter };
