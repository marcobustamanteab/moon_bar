import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import Breadcrumb from './Breadcrumb';
// import { Container } from 'react-bootstrap';
import { Home, Users, Settings, User, Key } from 'lucide-react';
import '../../assets/styles/components/header.css';
import '../../assets/styles/components/sidebar.css';
import '../../assets/styles/components/footer.css';

const MainLayout = () => {  
  const [expanded, setExpanded] = useState(true);
  const sidebarWidth = expanded ? '250px' : '80px';

  const menuItems = [
    { 
      path: '/', 
      name: 'Inicio', 
      icon: <Home size={20} />
    },
    { 
      path: '/users', 
      name: 'Usuarios', 
      icon: <Users size={20} />,
      subItems: [
        { 
          path: '/users/profile', 
          name: 'Mi Perfil',
          icon: <User size={20} />
        },
        { 
          path: '/users/change-password', 
          name: 'Editar Contraseña',
          icon: <Key size={20} />
        }
      ]
    },
    { 
      path: '/admin_site', 
      name: 'Administración', 
      icon: <Settings size={20} />
    }
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

      <div style={{ marginLeft: sidebarWidth, width: '100%', transition: 'margin-left 0.3s ease', backgroundColor: '#f4f6f9'}}>
        <Header onToggleSidebar={() => setExpanded(!expanded)} />
        <main className="content-wrapper">
        <div className="breadcrumb-wrapper">
            <Breadcrumb />
          </div>
          <div className="content-container">
            <Outlet />
          </div>
        </main>
        <Footer sidebarWidth={sidebarWidth} />
      </div>
    </div>
  );
};

export default MainLayout;