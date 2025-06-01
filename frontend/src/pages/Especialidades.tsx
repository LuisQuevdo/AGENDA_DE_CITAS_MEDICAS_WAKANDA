import { useState } from 'react';
import { useEspecialidades } from '../hooks/useEspecialidades';
import { createEspecialidad, updateEspecialidad, deleteEspecialidad } from '../services/especialidades';
import { toast } from 'react-toastify';

function Especialidades() {
  const { data: especialidades, loading, refetch } = useEspecialidades();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 5;

  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    if (!formData.nombre) {
      toast.error('El nombre es obligatorio');
      return;
    }

    try {
      await createEspecialidad(formData);
      toast.success('¡Especialidad creada con éxito!');
      refetch();
      setModalVisible(false);
    } catch {
      toast.error('Error al crear la especialidad');
    }
  };

  const handleUpdate = async () => {
    if (!currentId) return;
    
    if (!formData.nombre) {
      toast.error('El nombre es obligatorio');
      return;
    }

    try {
      await updateEspecialidad(currentId, formData);
      toast.success('¡Especialidad actualizada con éxito!');
      refetch();
      setModalVisible(false);
    } catch {
      toast.error('Error al actualizar la especialidad');
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteEspecialidad(pendingDelete);
      toast.success('¡Especialidad eliminada con éxito!');
      refetch();
    } catch {
      toast.error('Error al eliminar la especialidad');
    } finally {
      setPendingDelete(null);
    }
  };

  const handleEdit = (esp: any) => {
    setFormData({
      nombre: esp.nombre,
      descripcion: esp.descripcion || '',
    });
    setCurrentId(esp.id_especialidad);
    setEditMode(true);
    setModalVisible(true);
  };

  const openModalCrear = () => {
    setFormData({
      nombre: '',
      descripcion: '',
    });
    setEditMode(false);
    setCurrentId(null);
    setModalVisible(true);
  };

  const filtered = especialidades.filter((e: any) =>
    e.nombre.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="container">
      <h2>Especialidades</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Buscar por nombre"
          className="form-control me-3"
          style={{ maxWidth: '300px' }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <button className="btn btn-success" onClick={openModalCrear}>
          Nueva Especialidad
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((e: any) => (
                <tr key={e.id_especialidad}>
                  <td>{e.nombre}</td>
                  <td>{e.descripcion || '-'}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(e)}>
                      Editar
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => setPendingDelete(e.id_especialidad)}>
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
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{editMode ? 'Editar Especialidad' : 'Crear Especialidad'}</h5>
                <button className="btn-close" onClick={() => setModalVisible(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    name="descripcion"
                    className="form-control"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows={4}
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
                <p>¿Estás seguro de eliminar esta especialidad?</p>
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

export default Especialidades;