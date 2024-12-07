import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { Container } from 'react-bootstrap';
import '../../assets/styles/components/header.css'
import '../../assets/styles/components/sidebar.css'
import '../../assets/styles/components/footer.css'

const MainLayout = () => {  
  const [expanded, setExpanded] = useState(true);
  const sidebarWidth = expanded ? '250px' : '80px';

  const menuItems = [
    { path: '/', name: 'Inicio', icon: '🏠' },
    { path: '/users', name: 'Usuarios', icon: '👥' },
    { path: '/admin_site', name: 'Administración', icon: '⚙️' }
  ];

  return (
    <div className="d-flex">
      <div 
        className="custom-sidebar" 
        style={{
          width: sidebarWidth,
          minHeight: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          transition: 'width 0.3s ease'
        }}
      >
        <Sidebar menuItems={menuItems} expanded={expanded} />
      </div>

      <div style={{ marginLeft: sidebarWidth, width: '100%', transition: 'margin-left 0.3s ease' }}>
        <Header onToggleSidebar={() => setExpanded(!expanded)} />
        <main className="p-4">
          <Container>
            <Outlet />
          </Container>
        </main>
        <Footer sidebarWidth={sidebarWidth} />
      </div>
    </div>
  );
};

export default MainLayout;            