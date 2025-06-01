import { useState } from 'react';
import { useConsultorios } from '../hooks/useConsultorios';
import { createConsultorio, updateConsultorio, deleteConsultorio } from '../services/consultorios';
import { toast } from 'react-toastify';

function Consultorios() {
  const { data: consultorios, loading, refetch } = useConsultorios();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 5;

  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    numero: '',
    piso: '',
    equipamiento: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    if (!formData.numero || !formData.piso) {
      toast.error('Número y piso son obligatorios');
      return;
    }

    try {
      await createConsultorio({
        ...formData,
        piso: Number(formData.piso),
      });
      toast.success('¡Consultorio creado con éxito!');
      refetch();
      setModalVisible(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al crear el consultorio');
    }
  };

  const handleUpdate = async () => {
    if (!currentId) return;
    
    if (!formData.numero || !formData.piso) {
      toast.error('Número y piso son obligatorios');
      return;
    }

    try {
      await updateConsultorio(currentId, {
        ...formData,
        piso: Number(formData.piso),
      });
      toast.success('¡Consultorio actualizado con éxito!');
      refetch();
      setModalVisible(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al actualizar el consultorio');
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteConsultorio(pendingDelete);
      toast.success('¡Consultorio eliminado con éxito!');
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al eliminar el consultorio');
    } finally {
      setPendingDelete(null);
    }
  };

  const handleEdit = (consultorio: any) => {
    setFormData({
      numero: consultorio.numero,
      piso: consultorio.piso.toString(),
      equipamiento: consultorio.equipamiento || '',
    });
    setCurrentId(consultorio.id_consultorio);
    setEditMode(true);
    setModalVisible(true);
  };

  const openModalCrear = () => {
    setFormData({
      numero: '',
      piso: '',
      equipamiento: '',
    });
    setEditMode(false);
    setCurrentId(null);
    setModalVisible(true);
  };

  const filtered = consultorios.filter((c: any) =>
    c.numero.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="container">
      <h2>Consultorios</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Buscar por número"
          className="form-control me-3"
          style={{ maxWidth: '300px' }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <button className="btn btn-success" onClick={openModalCrear}>
          Nuevo Consultorio
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Número</th>
                <th>Piso</th>
                <th>Equipamiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((c: any) => (
                <tr key={c.id_consultorio}>
                  <td>{c.numero}</td>
                  <td>{c.piso}</td>
                  <td>{c.equipamiento || '-'}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(c)}>
                      Editar
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => setPendingDelete(c.id_consultorio)}>
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
                <h5>{editMode ? 'Editar Consultorio' : 'Nuevo Consultorio'}</h5>
                <button className="btn-close" onClick={() => setModalVisible(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Número *</label>
                  <input
                    type="text"
                    name="numero"
                    className="form-control"
                    value={formData.numero}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Piso *</label>
                  <input
                    type="number"
                    name="piso"
                    className="form-control"
                    value={formData.piso}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Equipamiento</label>
                  <textarea
                    name="equipamiento"
                    className="form-control"
                    value={formData.equipamiento}
                    onChange={handleChange}
                    rows={3}
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

      {/* Modal de confirmación para eliminar */}
      {pendingDelete && (
        <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-warning">
                <h5 className="modal-title">Confirmar Eliminación</h5>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de eliminar este consultorio?</p>
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

export default Consultorios;