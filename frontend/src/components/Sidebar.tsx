import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaBars, FaUserMd, FaUserInjured, FaCalendarCheck, FaBell, FaStethoscope,
  FaBuilding, FaClock, FaFileInvoice, FaMoneyCheckAlt, FaCreditCard, FaTachometerAlt, FaPhone
} from 'react-icons/fa';

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();

  const menuItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { to: '/pacientes', label: 'Pacientes', icon: <FaUserInjured /> },
    { to: '/medicos', label: 'Médicos', icon: <FaUserMd /> },
    { to: '/citas', label: 'Citas', icon: <FaCalendarCheck /> },
    { to: '/notificaciones', label: 'Notificaciones', icon: <FaBell /> },
    { to: '/especialidades', label: 'Especialidades', icon: <FaStethoscope /> },
    { to: '/consultorios', label: 'Consultorios', icon: <FaBuilding /> },
    { to: '/horarios', label: 'Horarios', icon: <FaClock /> },
    { to: '/facturas', label: 'Facturas', icon: <FaFileInvoice /> },
    { to: '/pagos', label: 'Pagos', icon: <FaMoneyCheckAlt /> },
    { to: '/metodospago', label: 'Métodos de Pago', icon: <FaCreditCard /> },
    { to: '/telefonos', label: 'Telefonos', icon: <FaPhone /> },
  ];

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div
        className="bg-dark text-white d-flex flex-column"
        style={{
          width: isCollapsed ? '60px' : '250px',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
        }}
      >
        <div className="text-center py-3 border-bottom border-secondary">
          {!isCollapsed && <h5 className="mb-0">GESTIONES WAKANDA</h5>}
        </div>

        <ul className="nav nav-pills flex-column mt-2">
          {menuItems.map(({ to, label, icon }) => (
            <li className="nav-item" key={to}>
              <Link
                to={to}
                className="nav-link text-white d-flex align-items-center px-3 py-2"
                style={{ whiteSpace: 'nowrap' }}
              >
                <span style={{ fontSize: '1.2rem', width: '30px' }}>{icon}</span>
                {!isCollapsed && <span className="ms-2">{label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content with Navbar */}
      <div className="flex-grow-1 bg-light">
        <nav className="navbar navbar-dark bg-dark d-flex align-items-center px-3 justify-content-between">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-light me-2"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label="Toggle Sidebar"
            >
              <FaBars />
            </button>
            <span className="navbar-brand mb-0 h1">WAKANDA SALUD</span>
          </div>

          {user && (
            <div className="d-flex align-items-center text-white">
              {user.picture && (
                <img
                  src={user.picture}
                  alt="Perfil"
                  style={{ width: 32, height: 32, borderRadius: '50%', marginRight: '0.5rem' }}
                />
              )}
              <span className="me-2">{user.name}</span>
              <button className="btn btn-outline-light btn-sm" onClick={logout}>
                Cerrar sesión
              </button>
            </div>
          )}
        </nav>

        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;