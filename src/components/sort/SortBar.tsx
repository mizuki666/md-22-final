import { useDispatch, useSelector } from 'react-redux';
import { setSortBy } from '../../store/slices/ticketsSlice';
import type { SortField } from '../../types/ticket';
import type { RootState } from '../../store';
import './SortBar.css';

const OPTIONS: { value: SortField; label: string }[] = [
  { value: 'price', label: 'Цена' },
  { value: 'duration', label: 'Время в пути' },
  { value: 'connectionAmount', label: 'Пересадки' },
];

export default function SortBar() {
  const dispatch = useDispatch();
  const sortBy = useSelector((state: RootState) => state.tickets.sortBy);

  return (
    <div className="sort-bar">
        {OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            className={`sort-bar__btn ${sortBy === value ? 'sort-bar__btn_active' : ''}`}
            onClick={() => dispatch(setSortBy(value))}
          >
            {label}
          </button>
        ))}
    </div>
  );
}
