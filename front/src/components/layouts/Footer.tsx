import { Container } from 'react-bootstrap';

interface FooterProps {
  sidebarWidth: string;
}

const Footer = ({ sidebarWidth }: FooterProps) => {
  return (
    <footer 
      className="custom-footer py-3"
      style={{ 
        position: 'fixed',
        bottom: 0,
        right: 0,
        left: sidebarWidth,
        transition: 'left 0.3s ease',
        zIndex: 1000,
        height: '50px'
      }}
    >
      <Container fluid>
        <p className="mb-0 text-center">© 2024 MoonBar - Todos los derechos reservados</p>
      </Container>
    </footer>
  );
};

export default Footer;