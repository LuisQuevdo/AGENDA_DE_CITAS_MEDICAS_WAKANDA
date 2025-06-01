import { useState } from 'react';
import { useHorarios } from '../hooks/useHorarios';
import { useMedicos } from '../hooks/useMedicos';
import { useConsultorios } from '../hooks/useConsultorios';
import { createHorario, updateHorario, deleteHorario } from '../services/horarios';
import { toast } from 'react-toastify';
import type { HorarioInput } from '../types';

function Horarios() {
  const { data: horarios, loading, refetch } = useHorarios();
  const { data: medicos } = useMedicos();
  const { data: consultorios } = useConsultorios();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 5;

  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState<HorarioInput>({
    medico_id: '',
    consultorio_id: '',
    dia_semana: 0,
    hora_inicio: '',
    hora_fin: '',
  });

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    if (!formData.medico_id || !formData.dia_semana || !formData.hora_inicio || !formData.hora_fin) {
      toast.error('Por favor complete todos los campos obligatorios');
      return;
    }

    if (formData.hora_inicio >= formData.hora_fin) {
      toast.error('La hora de inicio debe ser anterior a la hora de fin');
      return;
    }

    try {
      await createHorario(formData);
      toast.success('¡Horario creado con éxito!');
      refetch();
      setModalVisible(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al crear el horario');
    }
  };

  const handleUpdate = async () => {
    if (!currentId) return;
    
    if (!formData.medico_id || !formData.dia_semana || !formData.hora_inicio || !formData.hora_fin) {
      toast.error('Por favor complete todos los campos obligatorios');
      return;
    }

    if (formData.hora_inicio >= formData.hora_fin) {
      toast.error('La hora de inicio debe ser anterior a la hora de fin');
      return;
    }

    try {
      await updateHorario(currentId, formData);
      toast.success('¡Horario actualizado con éxito!');
      refetch();
      setModalVisible(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al actualizar el horario');
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteHorario(pendingDelete);
      toast.success('¡Horario eliminado con éxito!');
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al eliminar el horario');
    } finally {
      setPendingDelete(null);
    }
  };

  const handleEdit = (horario: any) => {
    setFormData({
      medico_id: horario.medico_id,
      consultorio_id: horario.consultorio_id || '',
      dia_semana: horario.dia_semana,
      hora_inicio: horario.hora_inicio,
      hora_fin: horario.hora_fin,
    });
    setCurrentId(horario.id_horario);
    setEditMode(true);
    setModalVisible(true);
  };

  const openModalCrear = () => {
    setFormData({
      medico_id: '',
      consultorio_id: '',
      dia_semana: 0,
      hora_inicio: '',
      hora_fin: '',
    });
    setEditMode(false);
    setCurrentId(null);
    setModalVisible(true);
  };

  const filtered = horarios.filter((h: any) =>
    medicos.find((m: any) => m.id_medico === h.medico_id)?.nombre?.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="container">
      <h2>Horarios</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Buscar por nombre del médico"
          className="form-control me-3"
          style={{ maxWidth: '300px' }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <button className="btn btn-success" onClick={openModalCrear}>
          Nuevo Horario
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Médico</th>
                <th>Consultorio</th>
                <th>Día</th>
                <th>Hora Inicio</th>
                <th>Hora Fin</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((h: any) => (
                <tr key={h.id_horario}>
                  <td>{medicos.find((m: any) => m.id_medico === h.medico_id)?.nombre || 'Desconocido'}</td>
                  <td>
                    {consultorios.find((c: any) => c.id_consultorio === h.consultorio_id)
                      ? `No. ${consultorios.find((c: any) => c.id_consultorio === h.consultorio_id)?.numero}, Piso ${consultorios.find((c: any) => c.id_consultorio === h.consultorio_id)?.piso}`
                      : '-'}
                  </td>
                  <td>{diasSemana[h.dia_semana - 1]}</td>
                  <td>{h.hora_inicio}</td>
                  <td>{h.hora_fin}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(h)}>
                      Editar
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => setPendingDelete(h.id_horario)}>
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
                <h5>{editMode ? 'Editar Horario' : 'Crear Horario'}</h5>
                <button className="btn-close" onClick={() => setModalVisible(false)} />
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
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
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Consultorio</label>
                    <select
                      name="consultorio_id"
                      className="form-control"
                      value={formData.consultorio_id || ''}
                      onChange={handleChange}
                    >
                      <option value="">-- Seleccionar --</option>
                      {consultorios.map((c: any) => (
                        <option key={c.id_consultorio} value={c.id_consultorio}>#{c.numero} (Piso {c.piso})</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Día de la semana *</label>
                    <select
                      name="dia_semana"
                      className="form-control"
                      value={formData.dia_semana}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Seleccionar --</option>
                      {diasSemana.map((dia, idx) => (
                        <option key={idx + 1} value={idx + 1}>{dia}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Hora inicio *</label>
                    <input
                      type="time"
                      name="hora_inicio"
                      className="form-control"
                      value={formData.hora_inicio}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Hora fin *</label>
                    <input
                      type="time"
                      name="hora_fin"
                      className="form-control"
                      value={formData.hora_fin}
                      onChange={handleChange}
                      required
                    />
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
                <p>¿Estás seguro de eliminar este horario?</p>
                <p className="text-danger">Esta acción no se puede deshacer.</p>
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

export default Horarios;