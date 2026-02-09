import React from 'react';
import './filter.css';

interface SelctorsFilter {
  head?: string;
  text?: string;
  content?: string;
}

const Filters: React.FC<SelctorsFilter> = ({ 
  head = 'Поиск авиабилетов', 
  text = 'Заголовок',
  content = 'Контент'
}) => {
  return (
    <header className="filters-container">
      <div className="header-container">
        <div className="header-content">
          <div className="header-text">
            {head}
            {text}
            {content}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Filters;