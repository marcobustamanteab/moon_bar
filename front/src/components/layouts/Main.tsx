import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import Breadcrumb from "./Breadcrumb";
// import { Container } from 'react-bootstrap';
import { Home, Users, Settings, User, Key, Activity, UserPlus, Grid, List, Package, Building } from "lucide-react";
import "../../assets/styles/components/header.css";
import "../../assets/styles/components/sidebar.css";
import "../../assets/styles/components/footer.css";

const MainLayout = () => {
  const [expanded, setExpanded] = useState(true);
  const sidebarWidth = expanded ? "250px" : "80px";

  const menuItems = [
    {
      path: "/",
      name: "Inicio",
      icon: <Home size={20} />,
    },
    {
      path: "/companies",
      name: "Empresas",
      icon: <Building size={20} />,
      adminOnly: true
    },
    {
      path: "/users",
      name: "Usuarios",
      icon: <Users size={20} />,
      subItems: [
        {
          path: "/users/profile",
          name: "Mi Perfil",
          icon: <User size={20} />,
        },
        {
          path: "/users/change-password",
          name: "Editar Contraseña",
          icon: <Key size={20} />,
        },
        {
          path: "/users/manage",
          name: "Gestión",
          icon: <Settings size={20} />,
          adminOnly: true,
        },
        {
          path: '/users/groups',
          name: 'Grupos',
          icon: <Users size={20} />,
          adminOnly: true
        },
        { 
          path: '/users/activity-log', 
          name: 'Registro de Actividad',
          icon: <Activity size={20} />,
          adminOnly: true,
      }, 

      ],
    },
    { 
      path: '/products', 
      name: 'Productos', 
      icon: <Package size={20} />,
      subItems: [
        {
          path: '/products/create',
          name: 'Crear Producto',
          icon: <UserPlus size={20} />,
          adminOnly: true
        },
        {
          path: '/products/list',
          name: 'Lista de Productos',
          icon: <List size={20} />
        },
        {
          path: '/products/categories',
          name: 'Categorías',
          icon: <Grid size={20} />,
          adminOnly: true
        },
      ]
    },
    {
      path: "/admin_site",
      name: "Administración",
      icon: <Settings size={20} />,
    },
    
  ];

  return (
    <div className="d-flex">
      <div
        className="custom-sidebar"
        style={{
          width: sidebarWidth,
          minHeight: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          transition: "width 0.3s ease",
        }}
      >
        <Sidebar menuItems={menuItems} expanded={expanded} />
      </div>

      <div
        style={{
          marginLeft: sidebarWidth,
          width: "100%",
          transition: "margin-left 0.3s ease",
          backgroundColor: "#f4f6f9",
          paddingBottom: "60px",
        }}
      >
        <Header onToggleSidebar={() => setExpanded(!expanded)} />
        <main className="content-wrapper">
          <div className="breadcrumb-wrapper">
            <Breadcrumb />
          </div>
          <div className="content-container card" style={{ borderTop: '3px solid rgb(45, 53, 100)' }}>
              <Outlet />
          </div>
        </main>
        <Footer sidebarWidth={sidebarWidth} />
      </div>
    </div>
  );
};

export default MainLayout;
