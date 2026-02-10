import { useDispatch, useSelector } from 'react-redux';
import { setCompaniesFilter } from '../../store/slices/ticketsSlice';
import { selectUniqueCompanies } from '../../store/selectors/tickets';
import type { RootState } from '../../store';
import './filter.css';

const ANY_COMPANY = '';

export default function CompaniesFilter() {
  const dispatch = useDispatch();
  const companies = useSelector(selectUniqueCompanies);
  const companiesFilter = useSelector(
    (state: RootState) => state.tickets.companiesFilter,
  );
  const selectedCompany = companiesFilter.length > 0 ? companiesFilter[0] : ANY_COMPANY;

  const handleChange = (value: string) => {
    dispatch(setCompaniesFilter(value === ANY_COMPANY ? [] : [value]));
  };

  return (
    <div className="filter">
      <span className="filter__label">Компании</span>
      <ul className="filter__list">
        <li className="filter__item">
          <label className="filter__label-check">
            <input
              type="radio"
              name="company-filter"
              value={ANY_COMPANY}
              checked={selectedCompany === ANY_COMPANY}
              onChange={() => handleChange(ANY_COMPANY)}
            />
            <span>Любая авиакомпания</span>
          </label>
        </li>
        {companies.map((company) => (
          <li key={company} className="filter__item">
            <label className="filter__label-check">
              <input
                type="radio"
                name="company-filter"
                value={company}
                checked={selectedCompany === company}
                onChange={() => handleChange(company)}
              />
              <span>{company}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
