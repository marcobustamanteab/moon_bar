import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface MenuItem {
  path: string;
  name: string;
  icon?: string;
}

interface SidebarProps {
  menuItems: MenuItem[];
  expanded: boolean;
}

const Sidebar = ({ menuItems, expanded }: SidebarProps) => {
  return (
    <Nav className="flex-column p-3 ">
      {menuItems.map((item, index) => (
        <Nav.Link 
          key={index}
          as={Link} 
          to={item.path}
          className=""
        >
          {item.icon} {expanded && item.name}
        </Nav.Link>
      ))}
    </Nav>
  );
};

export default Sidebar;