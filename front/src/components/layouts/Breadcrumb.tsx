import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Users, Settings, User, Key, UserPlus, Edit, Activity, Users2, Package, List, Grid } from 'lucide-react';
import '../../assets/styles/components/breadcrumb.css';

interface RouteConfig {
  name: string;
  icon: React.ReactNode;
}

interface SubRouteConfig {
  [key: string]: {
    name: string;
    icon: React.ReactNode;
  };
}

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  
  const mainRoutes: { [key: string]: RouteConfig } = {
    '/': {
      name: 'Inicio',
      icon: <Home size={16} className="breadcrumb-icon" />
    },
    '/users': {
      name: 'Usuarios',
      icon: <Users size={16} className="breadcrumb-icon" />
    },
    '/products': {
      name: 'Productos',
      icon: <Package size={16} className="breadcrumb-icon" />
    },
    '/admin_site': {
      name: 'Administración',
      icon: <Settings size={16} className="breadcrumb-icon" />
    }
  };
  
  const subRoutes: { [key: string]: SubRouteConfig } = {
    '/users': {
      '/profile': {
        name: 'Mi Perfil',
        icon: <User size={16} className="breadcrumb-icon" />
      },
      '/change-password': {
        name: 'Editar Contraseña',
        icon: <Key size={16} className="breadcrumb-icon" />
      },
      '/manage': {  
        name: 'Gestión de Usuarios',
        icon: <Settings size={16} className="breadcrumb-icon" />
      },
      '/create': {
        name: 'Crear Usuario',
        icon: <UserPlus size={16} className="breadcrumb-icon" />
      },
      '/:id/update': {
        name: 'Editar Usuario',
        icon: <Edit size={16} className="breadcrumb-icon" />
      },
      '/activity-log': {
        name: 'Registro de Actividad',
        icon: <Activity size={16} className="breadcrumb-icon" />
      },
      '/groups': {
        name: 'Grupos',
        icon: <Users2 size={16} className="breadcrumb-icon" />
      }

    }, 
    '/products': {
      '/list': {
        name: 'Lista de Productos',
        icon: <List size={16} className="breadcrumb-icon" />
      },
      '/categories': {
        name: 'Categorías',
        icon: <Grid size={16} className="breadcrumb-icon" />
      },
      '/create': {
        name: 'Crear Producto',
        icon: <UserPlus size={16} className="breadcrumb-icon" />
      },
      '/:id/update': {
        name: 'Editar Producto',
        icon: <Edit size={16} className="breadcrumb-icon" />
      }
    }
  };

  const getRouteTokens = () => {
    const path = location.pathname;
    const pathSegments = path.split('/').filter(Boolean);
    
    if (pathSegments.length === 0) {
      return [{
        path: '/',
        ...mainRoutes['/']
      }];
    }

    const mainPath = `/${pathSegments[0]}`;
    const subPath = pathSegments[1] ? `/${pathSegments[1]}` : '';
    
    if (subPath && subRoutes[mainPath]?.[subPath]) {
      return [
        {
          path: mainPath,
          ...mainRoutes[mainPath]
        },
        {
          path: `${mainPath}${subPath}`,
          ...subRoutes[mainPath][subPath]
        }
      ];
    }

    if (pathSegments.length === 3 && pathSegments[2] === 'update') {
      return [
        {
          path: mainPath,
          ...mainRoutes[mainPath]
        },
        {
          path: `${mainPath}/:id/update`,
          ...subRoutes[mainPath]['/:id/update']
        }
      ];
    }

    return [{
      path: mainPath,
      ...mainRoutes[mainPath] || { name: 'No encontrado', icon: <Home size={16} /> }
    }];
  };

  const routeTokens = getRouteTokens();

  return (
    <nav className="breadcrumb-nav">
      {routeTokens.length === 1 ? (
        <span className="breadcrumb-item active">
          {routeTokens[0].icon}
          {routeTokens[0].name}
        </span>
      ) : (
        <>
          <Link to={routeTokens[0].path} className="breadcrumb-item">
            {routeTokens[0].icon}
            {routeTokens[0].name}
          </Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-item active">
            {routeTokens[1].icon}
            {routeTokens[1].name}
          </span>
        </>
      )}
    </nav>
  );
};

export default Breadcrumb;