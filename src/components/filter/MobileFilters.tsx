import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import StopsFilter from './StopsFilter';
import CompaniesFilter from './CompaniesFilter';
import { STOP_OPTIONS } from './StopsFilter';
import './filter.css';
import './MobileFilters.css';

function getSummary(stopsFilter: number[], companiesFilter: string[]) {
  const stopsText =
    stopsFilter.length === 0
      ? 'любое кол-во пересадок'
      : STOP_OPTIONS.filter((o) => stopsFilter.includes(o.value))
          .map((o) => o.label)
          .join(', ');
  const companiesText =
    companiesFilter.length === 0 ? 'Любая авиакомпания' : companiesFilter.join(', ');
  return `${companiesText}, ${stopsText}`;
}

export default function MobileFilters() {
  const [open, setOpen] = useState(false);
  const stopsFilter = useSelector((state: RootState) => state.tickets.stopsFilter);
  const companiesFilter = useSelector(
    (state: RootState) => state.tickets.companiesFilter,
  );
  const summary = getSummary(stopsFilter, companiesFilter);

  return (
    <div className="mobile-filters">
      <button
        type="button"
        className="mobile-filters__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-filters-panel"
        id="mobile-filters-trigger"
      >
        <span className="mobile-filters__summary">{summary}</span>
        <span className="mobile-filters__action">
          Открыть настройки
          <span className={`mobile-filters__arrow ${open ? 'mobile-filters__arrow_open' : ''}`}>
            ▼
          </span>
        </span>
      </button>
      <div
        id="mobile-filters-panel"
        className={`mobile-filters__panel ${open ? 'mobile-filters__panel_open' : ''}`}
        role="region"
        aria-labelledby="mobile-filters-trigger"
      >
        <StopsFilter />
        <CompaniesFilter />
      </div>
    </div>
  );
}
