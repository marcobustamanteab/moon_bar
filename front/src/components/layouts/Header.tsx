/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Power, Building } from "lucide-react";
import { FiUser, FiUsers } from "react-icons/fi";
import { Company, CompanyUser } from "../../interfaces/company.interface";

const Header = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
  const { logout, user, companies } = useAuth();
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  console.log("Header - User:", user);
  console.log("Header - Companies Raw:", companies);
  console.log("Companies first item:", companies[0]);

  // Determinar si es superusuario
  const isSuperUser = user?.is_superuser || user?.groups?.includes("Administrador");

  useEffect(() => {
    console.log("Empresas actualizadas:", companies);

    // Verificación de seguridad para companies
    if (companies && companies.length > 0) {
      // Intenta obtener la empresa de localStorage o usar la primera
      try {
        const storedCompanyData = localStorage.getItem("selectedCompany");
        console.log("Stored company data:", storedCompanyData);

        let companyToSelect: Company | null = null;

        // Intentar parsear el dato de localStorage
        if (storedCompanyData) {
          try {
            companyToSelect = JSON.parse(storedCompanyData);
          } catch {
            // Si falla el parseo, usar la primera empresa
            console.log("Failed to parse stored company, using first company");
          }
        }

        // Si no hay empresa de localStorage o el parseo falló, usar la primera
        if (!companyToSelect) {
          // Verificar la estructura de la primera empresa
          const firstCompany = companies[0];
          console.log("First company structure:", firstCompany);

          // Manejar diferentes estructuras posibles
          if (firstCompany.company) {
            // Si es CompanyUser
            companyToSelect = firstCompany.company;
          } else if ('id' in firstCompany) {
            // Si es directamente Company
            companyToSelect = firstCompany as unknown as Company;
          }
        }

        // Establecer la empresa seleccionada
        if (companyToSelect) {
          console.log("Setting selected company:", companyToSelect);
          setSelectedCompany(companyToSelect);

          // Intentar guardar en localStorage
          try {
            localStorage.setItem("selectedCompany", JSON.stringify(companyToSelect));
          } catch (error) {
            console.error("Error saving company to localStorage:", error);
          }
        }
      } catch (error) {
        console.error("Error in company selection process:", error);
      }
    }
  }, [companies]);

  const handleCompanyChange = (companyUser: CompanyUser | Company) => {
    // Manejar diferentes estructuras de datos
    const company = 'company' in companyUser ? companyUser.company : companyUser;
    
    console.log("Changing company to:", company);
    
    try {
      setSelectedCompany(company);
      localStorage.setItem("selectedCompany", JSON.stringify(company));
    } catch (error) {
      console.error("Error changing company:", error);
    }
  };

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
        <Navbar.Brand className="text-white"></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"></Nav>
          <div className="d-flex align-items-center gap-3">
            {/* Selector de empresa */}
            <div className="d-flex align-items-center text-light">
              <Building size={16} className="me-2" />
              {isSuperUser && companies.length > 1 ? (
                <Dropdown>
                  <Dropdown.Toggle variant="outline-light" size="sm">
                    {selectedCompany?.name || "Seleccionar Empresa"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {companies.map((companyItem, index) => {
                      // Manejar diferentes estructuras de datos
                      const company = 'company' in companyItem 
                        ? companyItem.company 
                        : companyItem as Company;
                      
                      return (
                        <Dropdown.Item
                          key={company.id}
                          onClick={() => handleCompanyChange(companyItem)}
                        >
                          {company.name}
                        </Dropdown.Item>
                      );
                    })}
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <span>{selectedCompany?.name || "Sin empresa asignada"}</span>
              )}
            </div>
            <span className="text-light">
              <FiUser className="me-1" />
              Usuario: {user?.username}
            </span>
            <span className="text-light">
              <FiUsers className="me-1" />
              Perfil: {user?.groups?.[0] || "Sin grupo"}
            </span>
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