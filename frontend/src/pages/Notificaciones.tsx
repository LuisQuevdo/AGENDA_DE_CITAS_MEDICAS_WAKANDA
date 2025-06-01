import { useState } from 'react';
import { useNotificaciones } from '../hooks/useNotificaciones';
import { createNotificacion, updateNotificacion, deleteNotificacion } from '../services/notificaciones';
import { toast } from 'react-toastify';

function Notificaciones() {
  const { data: notificaciones, loading, refetch } = useNotificaciones();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 5;

  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    cita_id: '',
    tipo: 'email', // Default to first option
    contenido: '',
    estado: 'pendiente', // Default state
    fecha_envio: new Date().toISOString().slice(0, 16) // Current date/time
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    const { tipo, contenido, estado } = formData;

    if (!tipo || !contenido || !estado) {
      toast.error('Por favor completa todos los campos obligatorios.');
      return;
    }

    try {
      await createNotificacion(formData);
      toast.success('¡Notificación creada con éxito!');
      refetch();
      setModalVisible(false);
    } catch (error) {
      toast.error('Error al crear la notificación');
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    if (!currentId) return;

    try {
      await updateNotificacion(currentId, formData);
      toast.success('¡Notificación actualizada con éxito!');
      refetch();
      setModalVisible(false);
    } catch (error) {
      toast.error('Error al actualizar la notificación');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteNotificacion(pendingDelete);
      toast.success('¡Notificación eliminada con éxito!');
      refetch();
    } catch (error) {
      toast.error('Error al eliminar la notificación');
      console.error(error);
    } finally {
      setPendingDelete(null);
    }
  };

  const handleEdit = (notificacion: any) => {
    setFormData({
      cita_id: notificacion.cita_id || '',
      tipo: notificacion.tipo,
      contenido: notificacion.contenido,
      estado: notificacion.estado,
      fecha_envio: new Date(notificacion.fecha_envio).toISOString().slice(0, 16)
    });
    setCurrentId(notificacion.id_notificacion);
    setEditMode(true);
    setModalVisible(true);
  };

  const openModalCrear = () => {
    setFormData({
      cita_id: '',
      tipo: 'email',
      contenido: '',
      estado: 'pendiente',
      fecha_envio: new Date().toISOString().slice(0, 16)
    });
    setEditMode(false);
    setCurrentId(null);
    setModalVisible(true);
  };

  const filtered = notificaciones.filter((n: any) =>
    n.tipo.toLowerCase().includes(search.toLowerCase()) ||
    n.estado.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  // Allowed values from your database CHECK constraints
  const tiposNotificacion = ['email', 'whatsapp', 'sms', 'app'];
  const estadosNotificacion = ['pendiente', 'enviado', 'fallido'];

  return (
    <div className="container">
      <h2>Notificaciones</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Buscar por tipo o estado"
          className="form-control me-3"
          style={{ maxWidth: '300px' }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <button className="btn btn-success" onClick={openModalCrear}>
          Nueva Notificación
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Tipo</th>
                <th>Contenido</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((n: any) => (
                <tr key={n.id_notificacion}>
                  <td>{n.tipo}</td>
                  <td>{n.contenido.length > 50 ? n.contenido.slice(0, 50) + '…' : n.contenido}</td>
                  <td>{new Date(n.fecha_envio).toLocaleString()}</td>
                  <td>{n.estado}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(n)}>
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setPendingDelete(n.id_notificacion)}
                    >
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
                <h5>{editMode ? 'Editar Notificación' : 'Crear Notificación'}</h5>
                <button className="btn-close" onClick={() => setModalVisible(false)} />
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Tipo *</label>
                    <select
                      name="tipo"
                      className="form-control"
                      value={formData.tipo}
                      onChange={handleChange}
                      required
                    >
                      {tiposNotificacion.map(tipo => (
                        <option key={tipo} value={tipo}>
                          {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Estado *</label>
                    <select
                      name="estado"
                      className="form-control"
                      value={formData.estado}
                      onChange={handleChange}
                      required
                    >
                      {estadosNotificacion.map(estado => (
                        <option key={estado} value={estado}>
                          {estado.charAt(0).toUpperCase() + estado.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Cita ID</label>
                  <input
                    type="text"
                    name="cita_id"
                    placeholder="ID de la cita relacionada"
                    className="form-control"
                    value={formData.cita_id}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Contenido *</label>
                  <textarea
                    name="contenido"
                    placeholder="Contenido de la notificación"
                    className="form-control"
                    rows={5}
                    value={formData.contenido}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Fecha de envío</label>
                  <input
                    type="datetime-local"
                    name="fecha_envio"
                    className="form-control"
                    value={formData.fecha_envio}
                    onChange={handleChange}
                    required
                  />
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
                <p>¿Estás seguro de eliminar esta notificación?</p>
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

export default Notificaciones;