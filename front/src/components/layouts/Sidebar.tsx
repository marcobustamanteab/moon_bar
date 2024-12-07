import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import SidebarHeader from "./SidebarHeader";

interface SubMenuItem {
  path: string;
  name: string;
  icon?: React.ReactNode;
}

interface MenuItem {
  path: string;
  name: string;
  icon?: React.ReactNode;
  subItems?: SubMenuItem[];
}

interface SidebarProps {
  menuItems: MenuItem[];
  expanded: boolean;
}

const Sidebar = ({ menuItems, expanded }: SidebarProps) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleSubmenu = (path: string) => {
    setExpandedItems((prev) =>
      prev.includes(path)
        ? prev.filter((item) => item !== path)
        : [...prev, path]
    );
  };

  const isActive = (path: string) => location.pathname === path;
  const isSubActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="d-flex flex-column h-100">
      <SidebarHeader expanded={expanded} />
      <Nav className="flex-column p-3">
        {menuItems.map((item) => (
          <div key={item.path} className="nav-item-container">
            {item.subItems ? (
              // Menú con subítems
              <>
                <div
                  className={`nav-link d-flex align-items-center justify-content-between cursor-pointer ${
                    isSubActive(item.path) ? "active" : ""
                  }`}
                  onClick={() => toggleSubmenu(item.path)}
                >
                  <span className="d-flex align-items-center">
                    {item.icon}
                    {expanded && <span className="ms-2">{item.name}</span>}
                  </span>
                  {expanded &&
                    (expandedItems.includes(item.path) ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    ))}
                </div>

                {/* Submenú */}
                {expandedItems.includes(item.path) && expanded && (
                  <Nav className="flex-column ms-3">
                    {item.subItems.map((subItem) => (
                      <Nav.Link
                        key={subItem.path}
                        as={Link}
                        to={subItem.path}
                        className={`nav-link ${
                          isActive(subItem.path) ? "active" : ""
                        }`}
                      >
                        {subItem.icon}
                        <span className="ms-2">{subItem.name}</span>
                      </Nav.Link>
                    ))}
                  </Nav>
                )}
              </>
            ) : (
              // Menú simple sin subítems
              <Nav.Link
                as={Link}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? "active" : ""}`}
              >
                {item.icon}
                {expanded && <span className="ms-2">{item.name}</span>}
              </Nav.Link>
            )}
          </div>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;
