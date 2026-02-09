import type { Ticket } from '../../types/ticket';
import './TicketCard.css';

function formatStops(connectionAmount: number | null): string {
  if (connectionAmount === null || connectionAmount === 0) return 'Без пересадок';
  if (connectionAmount === 1) return '1 пересадка';
  if (connectionAmount === 2) return '2 пересадки';
  return '3 и более';
}

function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (m === 0) return `${h} ч`;
  return `${h} ч ${m} мин`;
}

interface TicketCardProps {
  ticket: Ticket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const { from, to, company, price, currency, time, duration, date, connectionAmount } =
    ticket;

  return (
    <article className="ticket-card">
      <div className="ticket-card__header">
        <span className="ticket-card__price">
          {price.toLocaleString('ru-RU')} {currency}
        </span>
        <span className="ticket-card__company">{company}</span>
      </div>
      <div className="ticket-card__route">
        <div className="ticket-card__segment">
          <span className="ticket-card__label">{from} – {to}</span>
          <span className="ticket-card__time">
            {time.startTime} – {time.endTime}
          </span>
        </div>
        <div className="ticket-card__segment">
          <span className="ticket-card__label">В пути</span>
          <span className="ticket-card__time">{formatDuration(duration)}</span>
        </div>
        <div className="ticket-card__segment">
          <span className="ticket-card__label">Пересадки</span>
          <span className="ticket-card__time">{formatStops(connectionAmount)}</span>
        </div>
      </div>
      <div className="ticket-card__date">{date}</div>
    </article>
  );
}
