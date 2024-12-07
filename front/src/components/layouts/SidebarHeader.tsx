import React, { useState, useEffect } from 'react';
import { Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import avatarImage from '../../assets/images/avatar001.jpeg';

interface SidebarHeaderProps {
  expanded: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ expanded }) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const { user } = useAuth();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }));
      setCurrentDate(now.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      }));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sidebar-header">
      {/* Logo Section */}
      <div className="brand-section">
        <Moon size={20} className="brand-icon" />
        {expanded && <span className="brand-text">MoonBar</span>}
      </div>

      {/* Separator */}
      <div className="sidebar-separator"></div>

      {/* User Section with horizontal layout */}
      <div className="user-section">
        {expanded ? (
          <div className="user-info-horizontal">
            <img
              src={avatarImage}
              alt="User avatar"
              className="user-avatar"
            />
            <div className="user-details-horizontal">
              <div className="user-name">{user?.first_name} {user?.last_name}</div>
              <div className="user-role">Administrador</div>
            </div>
          </div>
        ) : (
          <div className="user-info-collapsed">
            <img
              src={avatarImage}
              alt="User avatar"
              className="user-avatar"
            />
          </div>
        )}
        
        {expanded && (
          <div className="datetime-info">
            <div className="date">{currentDate}</div>
            <div className="time">{currentTime}</div>
          </div>
        )}
      </div>

      {/* Separator */}
      <div className="sidebar-separator"></div>
    </div>
  );
};

export default SidebarHeader;