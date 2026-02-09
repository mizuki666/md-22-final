import React from 'react';
import './header.css';
import planeSvg from '../../assets/plane.svg';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showPlane?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title = 'Поиск авиабилетов', 
  showPlane = true 
}) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          {showPlane && (
            <div className="header-logo">
              <img 
                src={planeSvg} 
                alt="Логотип" 
                className="header-plane-icon"
              />
            </div>
          )}
          
          <div className="header-text">
            {title}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;