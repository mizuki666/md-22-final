import { useDispatch, useSelector } from 'react-redux';
import { setStopsFilter } from '../../store/slices/ticketsSlice';
import type { RootState } from '../../store';
import './Filter.css';

const STOP_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: 'Без пересадок' },
  { value: 1, label: '1 пересадка' },
  { value: 2, label: '2 пересадки' },
  { value: 3, label: '3 и более' },
];

export default function StopsFilter() {
  const dispatch = useDispatch();
  const stopsFilter = useSelector((state: RootState) => state.tickets.stopsFilter);

  const handleChange = (value: number, checked: boolean) => {
    const next = checked
      ? [...stopsFilter, value]
      : stopsFilter.filter((n) => n !== value);
    dispatch(setStopsFilter(next));
  };

  return (
    <div className="filter">
      <span className="filter__label">Количество пересадок</span>
      <ul className="filter__list">
        {STOP_OPTIONS.map(({ value, label }) => (
          <li key={value} className="filter__item">
            <label className="filter__label-check">
              <input
                type="checkbox"
                checked={stopsFilter.includes(value)}
                onChange={(e) => handleChange(value, e.target.checked)}
              />
              <span>{label}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
