import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTicketsThunk } from '../../store/slices/ticketsSlice';
import { selectFilteredAndSortedTickets } from '../../store/selectors/tickets';
import type { RootState, AppDispatch } from '../../store';
import TicketCard from './TicketCard';
import './TicketList.css';

export default function TicketList() {
  const dispatch = useDispatch<AppDispatch>();
  const tickets = useSelector(selectFilteredAndSortedTickets);
  const loading = useSelector((state: RootState) => state.tickets.loading);
  const error = useSelector((state: RootState) => state.tickets.error);

  useEffect(() => {
    dispatch(fetchTicketsThunk());
  }, [dispatch]);

  if (loading) {
    return <div className="ticket-list ticket-list_loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="ticket-list ticket-list_error">{error}</div>;
  }

  if (tickets.length === 0) {
    return (
      <div className="ticket-list ticket-list_empty">
        Нет билетов по выбранным фильтрам
      </div>
    );
  }

  return (
    <ul className="ticket-list">
      {tickets.map((ticket) => (
        <li key={ticket.id}>
          <TicketCard ticket={ticket} />
        </li>
      ))}
    </ul>
  );
}
