import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTicketsThunk } from '../../store/slices/ticketsSlice';
import { selectFilteredAndSortedTickets } from '../../store/selectors/tickets';
import type { RootState, AppDispatch } from '../../store';
import TicketCard from './TicketCard';
import './TicketList.css';

function buildTocLineSvg(height: number): string {
  const points: [number, number][] = [];
  let x = 1;
  let y = 12;
  const stepV = 20;
  const stepH = 12;
  const xRight = 11;

  points.push([x, y]);
  while (y < height) {
    y += stepV;
    if (y > height) break;
    points.push([x, y]);
    x = x === 1 ? xRight : 1;
    y += stepH;
    if (y > height) break;
    points.push([x, y]);
  }
  if (points[points.length - 1][1] < height) {
    points.push([points[points.length - 1][0], height]);
  }
  const d = 'M' + points.map(([px, py]) => `${px} ${py}`).join(' L');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 ${height}"><path d="${d}" stroke="black" stroke-width="1" fill="none"/></svg>`;
  return encodeURIComponent(svg);
}

export default function TicketList() {
  const dispatch = useDispatch<AppDispatch>();
  const tickets = useSelector(selectFilteredAndSortedTickets);
  const loading = useSelector((state: RootState) => state.tickets.loading);
  const error = useSelector((state: RootState) => state.tickets.error);

  const scrollRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({
    thumbTop: 0,
    thumbHeight: 0,
    thumbVisible: false,
    trackHeight: 0,
  });

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    const wrap = wrapRef.current;
    if (!el || !wrap) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const trackHeight = wrap.clientHeight;
    const total = scrollHeight - clientHeight;
    if (trackHeight <= 0) {
      setScrollState((s) => ({ ...s, trackHeight: 0, thumbVisible: false }));
      return;
    }
    if (total <= 0) {
      setScrollState((s) => ({
        ...s,
        trackHeight,
        thumbTop: 0,
        thumbHeight: 0,
        thumbVisible: false,
      }));
      return;
    }
    const thumbHeight = Math.max(24, (clientHeight / scrollHeight) * trackHeight);
    const thumbTop = (scrollTop / scrollHeight) * trackHeight;
    setScrollState({
      thumbTop,
      thumbHeight,
      thumbVisible: true,
      trackHeight,
    });
  }, []);

  useEffect(() => {
    dispatch(fetchTicketsThunk());
  }, [dispatch]);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    const wrap = wrapRef.current;
    if (!el || !wrap) return;
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [tickets.length, updateScrollState]);

  const lineSvg =
    scrollState.trackHeight > 0
      ? buildTocLineSvg(scrollState.trackHeight)
      : '';

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
    <div className="ticket-list-wrap" ref={wrapRef}>
      <div
        className="ticket-list-scroll"
        ref={scrollRef}
        onScroll={updateScrollState}
      >
        <ul className="ticket-list">
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <TicketCard ticket={ticket} />
            </li>
          ))}
        </ul>
      </div>
      <div
        className="ticket-list-track"
        aria-hidden
        style={
          lineSvg
            ? {
                maskImage: `url("data:image/svg+xml,${lineSvg}")`,
                WebkitMaskImage: `url("data:image/svg+xml,${lineSvg}")`,
              }
            : undefined
        }
      >
        <div className="ticket-list-track-line" />
        <div
          className="ticket-list-thumb"
          data-hidden={!scrollState.thumbVisible}
          style={
            {
              '--fd-top': `${scrollState.thumbTop}px`,
              '--fd-height': `${scrollState.thumbHeight}px`,
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
}
