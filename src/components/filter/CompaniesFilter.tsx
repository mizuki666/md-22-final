import { useDispatch, useSelector } from 'react-redux';
import { setCompaniesFilter } from '../../store/slices/ticketsSlice';
import { selectUniqueCompanies } from '../../store/selectors/tickets';
import type { RootState } from '../../store';
import './Filter.css';

export default function CompaniesFilter() {
  const dispatch = useDispatch();
  const companies = useSelector(selectUniqueCompanies);
  const companiesFilter = useSelector(
    (state: RootState) => state.tickets.companiesFilter,
  );

  const handleChange = (company: string, checked: boolean) => {
    const next = checked
      ? [...companiesFilter, company]
      : companiesFilter.filter((c) => c !== company);
    dispatch(setCompaniesFilter(next));
  };

  return (
    <div className="filter">
      <span className="filter__label">Компании</span>
      <ul className="filter__list">
        {companies.map((company) => (
          <li key={company} className="filter__item">
            <label className="filter__label-check">
              <input
                type="checkbox"
                checked={companiesFilter.includes(company)}
                onChange={(e) => handleChange(company, e.target.checked)}
              />
              <span>{company}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
