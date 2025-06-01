import { useState } from 'react';
import { useCitas } from '../hooks/useCitas';
import { usePacientes } from '../hooks/usePacientes';
import { useMedicos } from '../hooks/useMedicos';
import { useConsultorios } from '../hooks/useConsultorios';
import { createCita, updateCita, deleteCita } from '../services/citas';
import { toast } from 'react-toastify';

function Citas() {
  const { data: citas, loading, refetch } = useCitas();
  const { data: pacientes } = usePacientes();
  const { data: medicos } = useMedicos();
  const { data: consultorios } = useConsultorios();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 5;

  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fecha_hora: '',
    estado: 'programada',
    notas: '',
    paciente_id: '',
    medico_id: '',
    consultorio_id: '',
  });

  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const getNombrePaciente = (id: string) =>
    pacientes.find((p: any) => p.id_paciente === id)?.nombre || id;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      await createCita(formData);
      toast.success('¡Cita creada con éxito!');
      refetch();
      setModalVisible(false);
    } catch {
      toast.error('Error al crear la cita');
    }
  };

  const handleUpdate = async () => {
    if (!currentId) return;
    try {
      await updateCita(currentId, formData);
      toast.success('¡Cita actualizada con éxito!');
      refetch();
      setModalVisible(false);
    } catch {
      toast.error('Error al actualizar la cita');
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteCita(pendingDelete);
      toast.success('¡Cita eliminada con éxito!');
      refetch();
    } catch {
      toast.error('Error al eliminar la cita');
    } finally {
      setPendingDelete(null);
    }
  };

  const handleEdit = (cita: any) => {
    setFormData({
      fecha_hora: cita.fecha_hora.slice(0, 16),
      estado: cita.estado,
      notas: cita.notas || '',
      paciente_id: cita.paciente_id,
      medico_id: cita.medico_id,
      consultorio_id: cita.consultorio_id,
    });
    setCurrentId(cita.id_cita);
    setEditMode(true);
    setModalVisible(true);
  };

  const openModalCrear = () => {
    setFormData({
      fecha_hora: '',
      estado: 'programada',
      notas: '',
      paciente_id: '',
      medico_id: '',
      consultorio_id: '',
    });
    setEditMode(false);
    setCurrentId(null);
    setModalVisible(true);
  };

  const filtered = citas.filter((c: any) =>
    c.estado.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="container">
      <h2>Citas</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Buscar por estado"
          className="form-control me-3"
          style={{ maxWidth: '300px' }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <button className="btn btn-success" onClick={openModalCrear}>
          Nueva Cita
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Notas</th>
                <th>Paciente</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((c: any) => (
                <tr key={c.id_cita}>
                  <td>{new Date(c.fecha_hora).toLocaleString()}</td>
                  <td>{c.estado}</td>
                  <td>{c.notas}</td>
                  <td>{getNombrePaciente(c.paciente_id)}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(c)}>
                      Editar
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => setPendingDelete(c.id_cita)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center">
            <button className="btn btn-secondary" onClick={() => setPage(page - 1)} disabled={page === 1}>
              Anterior
            </button>
            <span>Página {page} de {totalPages}</span>
            <button className="btn btn-secondary" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
              Siguiente
            </button>
          </div>
        </>
      )}

      {/* Modal Crear/Editar */}
      {modalVisible && (
        <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{editMode ? 'Editar Cita' : 'Crear Cita'}</h5>
                <button className="btn-close" onClick={() => setModalVisible(false)} />
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Fecha y Hora *</label>
                    <input
                      type="datetime-local"
                      name="fecha_hora"
                      className="form-control"
                      value={formData.fecha_hora}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Estado *</label>
                    <select
                      name="estado"
                      className="form-control"
                      value={formData.estado}
                      onChange={handleChange}
                      required
                    >
                      <option value="programada">Programada</option>
                      <option value="completada">Completada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Notas</label>
                    <textarea
                      name="notas"
                      className="form-control"
                      value={formData.notas}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Paciente *</label>
                    <select
                      name="paciente_id"
                      className="form-control"
                      value={formData.paciente_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Seleccionar --</option>
                      {pacientes.map((p: any) => (
                        <option key={p.id_paciente} value={p.id_paciente}>{p.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Médico *</label>
                    <select
                      name="medico_id"
                      className="form-control"
                      value={formData.medico_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Seleccionar --</option>
                      {medicos.map((m: any) => (
                        <option key={m.id_medico} value={m.id_medico}>{m.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Consultorio *</label>
                    <select
                      name="consultorio_id"
                      className="form-control"
                      value={formData.consultorio_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Seleccionar --</option>
                      {consultorios.map((c: any) => (
                        <option key={c.id_consultorio} value={c.id_consultorio}>#{c.numero} (Piso {c.piso})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setModalVisible(false)}>
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={editMode ? handleUpdate : handleCreate}>
                  {editMode ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación */}
      {pendingDelete && (
        <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header bg-warning">
                <h5 className="modal-title">Confirmar Eliminación</h5>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de eliminar esta cita?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setPendingDelete(null)}>
                  Cancelar
                </button>
                <button className="btn btn-danger" onClick={handleDelete}>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Citas;