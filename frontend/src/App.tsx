import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Usuarios';
import Pacientes from './pages/Pacientes';
import Medicos from './pages/Medicos';
import Citas from './pages/Citas';
import Notificaciones from './pages/Notificaciones';
import Especialidades from './pages/Especialidades';
import Consultorios from './pages/Consultorios';
import Horarios from './pages/Horarios';
import Facturas from './pages/Facturas';
import Pagos from './pages/Pagos';
import MetodosPago from './pages/MetodosPago';
import Telefonos from './pages/Telefonos';

import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Layout protegido con Sidebar */}
        <Route
          element={
            <ProtectedRoute>
              <Sidebar />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/medicos" element={<Medicos />} />
          <Route path="/citas" element={<Citas />} />
          <Route path="/notificaciones" element={<Notificaciones />} />
          <Route path="/especialidades" element={<Especialidades />} />
          <Route path="/consultorios" element={<Consultorios />} />
          <Route path="/horarios" element={<Horarios />} />
          <Route path="/facturas" element={<Facturas />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/metodospago" element={<MetodosPago />} />
          <Route path="/telefonos" element={<Telefonos />} />
        </Route>

        {/* Fallback: si no encuentra ruta, redirige al login */}
        <Route path="*" element={<Login />} />
      </Routes>

      {/* Notificaciones con react-toastify */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;