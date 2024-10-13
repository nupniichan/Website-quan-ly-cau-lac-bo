import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  // Manage active state locally
  const [activeMenu, setActiveMenu] = useState('user');

  // Handle navigation and update active menu
  const handleNavigation = (path, menu) => {
    setActiveMenu(menu);
    navigate(path);
  };

  return (
    <div className="sidebar">
      <input type="text" placeholder="Nhập chức năng cần tìm..." className="search-bar" />
      <ul className="sidebar-menu">
        <li 
        className={`menu-item ${activeMenu === 'dashboard' ? 'active' : ''}`} 
        onClick={() => handleNavigation('/', 'dashboard')}>
          <img className="menu-icon" src="src/img/icon/dashboard.png" alt="Dashboard" />
          <span>Dashboard</span>
        </li>
        <li
          className={`menu-item ${activeMenu === 'user' ? 'active' : ''}`}
          onClick={() => handleNavigation('/user-management', 'user')}
        >
          <img className="menu-icon" src="src/img/icon/user.png" alt="Quản lý người dùng" />
          <span>Quản lý người dùng</span>
        </li>
        <li
          className={`menu-item ${activeMenu === 'event' ? 'active' : ''}`}
          onClick={() => handleNavigation('/event-management', 'event')}
        >
          <img className="menu-icon" src="src/img/icon/event.png" alt="Quản lý sự kiện" />
          <span>Quản lý sự kiện</span>
        </li>
        <li
          className={`menu-item ${activeMenu === 'budget' ? 'active' : ''}`}
          onClick={() => handleNavigation('/budget-management', 'budget')}
        >
          <img className="menu-icon" src="src/img/icon/budget.png" alt="Quản lý ngân sách" />
          <span>Quản lý ngân sách</span>
        </li>
        <li
          className={`menu-item ${activeMenu === 'prize' ? 'active' : ''}`}
          onClick={() => handleNavigation('/prize-management', 'prize')}
        >
          <img className="menu-icon" src="src/img/icon/prize.png" alt="Quản lý giải thưởng" />
          <span>Quản lý giải thưởng</span>
        </li>
        <li
          className={`menu-item ${activeMenu === 'report' ? 'active' : ''}`}
          onClick={() => handleNavigation('/report-management', 'report')}
        >
          <img className="menu-icon" src="src/img/icon/report.png" alt="Báo cáo" />
          <span>Quản lý báo cáo</span>
        </li>
        <li
          className={`menu-item ${activeMenu === 'club' ? 'active' : ''}`}
          onClick={() => handleNavigation('/club-management', 'club')}
        >
          <img className="menu-icon" src="src/img/icon/report.png" alt="Câu lạc bộ" />
          <span>Quản lý câu lạc bộ</span>
        </li>
      </ul>
      <div className="sidebar-footer">
        <ul className="sidebar-footer-menu">
          <li className="menu-item">
            <img className="menu-icon" src="src/img/icon/setting.png" alt="Settings" />
            <span>Settings</span>
          </li>
          <li className="menu-item">
            <img className="menu-icon" src="src/img/icon/logout.png" alt="Logout" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  onSelect: PropTypes.func.isRequired,
  selectedContent: PropTypes.string.isRequired,
};

export default Sidebar;
