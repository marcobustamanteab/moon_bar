// components/Header.tsx
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Power } from "lucide-react";
import { FiUser, FiUsers } from "react-icons/fi";

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar className="custom_navbar" expand="lg">
      <Container fluid>
        <Button
          variant="outline-light"
          className="me-2 border-0"
          onClick={onToggleSidebar}
        >
          ☰
        </Button>
        <Navbar.Brand className="text-white">MoonBar</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">{/* Tus links actuales */}</Nav>
          <div className="d-flex align-items-center gap-3">
            <span className="text-light"><FiUser></FiUser>Usuario: {user?.username}</span>
            <span className="text-light"><FiUsers></FiUsers>Perfil: {user?.groups?.[0] || 'Sin grupo'}</span>
            <Button
              variant="outline-light border-0"
              onClick={handleLogout}
              className="d-flex align-items-center gap-2"
            >
              <Power size={20} />
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
