import { usePacientes } from '../hooks/usePacientes';
import { useCitas } from '../hooks/useCitas';
import { useMedicos } from '../hooks/useMedicos';
import { useNotificaciones } from '../hooks/useNotificaciones';
import './pages.css';
import type { Paciente, Medico, Cita, Notificacion } from '../types';
import { FaUserInjured, FaUserMd, FaCalendarAlt, FaBell, FaArrowRight } from 'react-icons/fa';

function Dashboard() {
  const { data: pacientes = [] } = usePacientes() as { data: Paciente[] };
  const { data: medicos = [] } = useMedicos() as { data: Medico[] };
  const { data: citas = [] } = useCitas() as { data: Cita[] };
  const { data: notificaciones = [] } = useNotificaciones() as { data: Notificacion[] };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Panel de Control</h2>
      </div>

      {/* Tarjetas de resumen */}
      <div className="summary-cards">
        <div className="summary-card patient-card">
          <div className="card-icon">
            <FaUserInjured size={24} />
          </div>
          <div className="card-content">
            <h3>Pacientes</h3>
            <p className="count">{pacientes.length}</p>
            <p className="trend">+5 este mes</p>
          </div>
        </div>

        <div className="summary-card doctor-card">
          <div className="card-icon">
            <FaUserMd size={24} />
          </div>
          <div className="card-content">
            <h3>Médicos</h3>
            <p className="count">{medicos.length}</p>
            <p className="trend">+2 este mes</p>
          </div>
        </div>

        <div className="summary-card appointment-card">
          <div className="card-icon">
            <FaCalendarAlt size={24} />
          </div>
          <div className="card-content">
            <h3>Citas</h3>
            <p className="count">{citas.length}</p>
            <p className="trend">+12 hoy</p>
          </div>
        </div>

        <div className="summary-card notification-card">
          <div className="card-icon">
            <FaBell size={24} />
          </div>
          <div className="card-content">
            <h3>Notificaciones</h3>
            <p className="count">{notificaciones.length}</p>
            <p className="trend">+3 hoy</p>
          </div>
        </div>
      </div>

      {/* Últimos registros */}
      <div className="recent-activity">
        <div className="activity-section">
          <h3>
            <FaUserInjured className="icon" /> Últimos Pacientes
            <a href="/pacientes" className="view-all">
              Ver todos <FaArrowRight />
            </a>
          </h3>
          <div className="activity-list">
            {pacientes.slice(0, 5).map((p) => (
              <div key={p.id_paciente} className="activity-item">
                <div className="avatar">{p.nombre.charAt(0)}</div>
                <div className="info">
                  <p className="name">{p.nombre}</p>
                  <p className="detail">{p.telefono}</p>
                </div>
                <span className="time">Hoy</span>
              </div>
            ))}
          </div>
        </div>

        <div className="activity-section">
          <h3>
            <FaUserMd className="icon" /> Últimos Médicos
            <a href="/medicos" className="view-all">
              Ver todos <FaArrowRight />
            </a>
          </h3>
          <div className="activity-list">
            {medicos.slice(0, 5).map((m) => (
              <div key={m.id_medico} className="activity-item">
                <div className="avatar">{m.nombre.charAt(0)}</div>
                <div className="info">
                  <p className="name">{m.nombre}</p>
                  <p className="detail">{m.correo}</p>
                </div>
                <span className="time">Ayer</span>
              </div>
            ))}
          </div>
        </div>

        <div className="activity-section">
          <h3>
            <FaCalendarAlt className="icon" /> Próximas Citas
            <a href="/citas" className="view-all">
              Ver todas <FaArrowRight />
            </a>
          </h3>
          <div className="activity-list">
            {citas.slice(0, 5).map((c) => (
              <div key={c.id_cita} className="activity-item">
                <div className="avatar calendar">
                  {new Date(c.fecha_hora).getDate()}
                </div>
                <div className="info">
                  <p className="name">
                    {new Date(c.fecha_hora).toLocaleDateString()}
                  </p>
                  <p className="detail">
                    <span className={`status-badge ${c.estado}`}>
                      {c.estado}
                    </span>
                  </p>
                </div>
                <span className="time">
                  {new Date(c.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="activity-section">
          <h3>
            <FaBell className="icon" /> Últimas Notificaciones
            <a href="/notificaciones" className="view-all">
              Ver todas <FaArrowRight />
            </a>
          </h3>
          <div className="activity-list">
            {notificaciones.slice(0, 5).map((n) => (
              <div key={n.id_notificacion} className="activity-item">
                <div className="avatar">{n.tipo.charAt(0)}</div>
                <div className="info">
                  <p className="name">{n.tipo}</p>
                  <p className="detail">{n.contenido.substring(0, 30)}...</p>
                </div>
                <span className="time">
                  {new Date(n.fecha_envio).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;