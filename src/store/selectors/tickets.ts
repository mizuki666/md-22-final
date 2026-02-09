import type { RootState } from '../index';
import type { Ticket } from '../../types/ticket';
import { ticketsAdapter } from '../slices/ticketsSlice';

const ticketsSelectors = ticketsAdapter.getSelectors<RootState>(
  (state) => state.tickets,
);

export const selectAllTickets = ticketsSelectors.selectAll;
export const selectTicketById = ticketsSelectors.selectById;

export const selectFilteredAndSortedTickets = (state: RootState): Ticket[] => {
  const all = ticketsSelectors.selectAll(state);
  const { stopsFilter, companiesFilter, sortBy } = state.tickets;

  let result = all;

  if (stopsFilter.length > 0) {
    result = result.filter((t) => {
      const stops = t.connectionAmount ?? 0;
      return (
        stopsFilter.includes(stops) ||
        (stopsFilter.includes(3) && stops >= 3)
      );
    });
  }

  if (companiesFilter.length > 0) {
    result = result.filter((t) => companiesFilter.includes(t.company));
  }

  const field = sortBy as keyof Ticket;
  result = [...result].sort((a, b) => {
    const aVal = (a[field] ?? 0) as number;
    const bVal = (b[field] ?? 0) as number;
    return aVal - bVal;
  });

  return result;
};

export const selectUniqueCompanies = (state: RootState): string[] => {
  const all = ticketsSelectors.selectAll(state);
  const companies = new Set(all.map((t) => t.company));
  return Array.from(companies).sort();
};
