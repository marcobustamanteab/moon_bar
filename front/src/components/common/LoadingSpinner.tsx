import React from 'react';
import { Moon } from 'lucide-react';
import '../../assets/styles/components/spinner.css';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <Moon size={40} className="moon-icon pulse" />
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;