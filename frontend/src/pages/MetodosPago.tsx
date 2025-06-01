import { useState } from 'react';
import { useMetodosPago } from '../hooks/useMetodosPago';
import { createMetodoPago, updateMetodoPago, deleteMetodoPago } from '../services/metodospago';
import { toast } from 'react-toastify';

function MetodosPago() {
  const { data: metodos, loading, refetch } = useMetodosPago();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 5;

  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
  });

  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      await createMetodoPago(formData);
      toast.success('¡Método de pago creado con éxito!');
      refetch();
      setModalVisible(false);
    } catch (error) {
      toast.error('Error al crear el método de pago');
    }
  };

  const handleUpdate = async () => {
    if (!currentId) return;
    try {
      await updateMetodoPago(currentId, formData);
      toast.success('¡Método de pago actualizado con éxito!');
      refetch();
      setModalVisible(false);
    } catch (error) {
      toast.error('Error al actualizar el método de pago');
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteMetodoPago(pendingDelete);
      toast.success('¡Método de pago eliminado con éxito!');
      refetch();
    } catch (error) {
      toast.error('Error al eliminar el método de pago');
    } finally {
      setPendingDelete(null);
    }
  };

  const handleEdit = (metodo: any) => {
    setFormData({ nombre: metodo.nombre });
    setCurrentId(metodo.id_metodo_pago);
    setEditMode(true);
    setModalVisible(true);
  };

  const openModalCrear = () => {
    setFormData({ nombre: '' });
    setEditMode(false);
    setCurrentId(null);
    setModalVisible(true);
  };

  const filtered = metodos.filter((m: any) =>
    m.nombre.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="container">
      <h2>Métodos de Pago</h2>

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
          Nuevo Método
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
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((m: any) => (
                <tr key={m.id_metodo_pago}>
                  <td>{m.nombre}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(m)}>
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setPendingDelete(m.id_metodo_pago)}
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
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{editMode ? 'Editar Método de Pago' : 'Crear Método de Pago'}</h5>
                <button className="btn-close" onClick={() => setModalVisible(false)} />
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  className="form-control mb-2"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setModalVisible(false)}>Cancelar</button>
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
                <p>¿Estás seguro de eliminar este método de pago?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setPendingDelete(null)}>Cancelar</button>
                <button className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MetodosPago;