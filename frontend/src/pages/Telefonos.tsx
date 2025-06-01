import { useState } from 'react';
import { useTelefonos } from '../hooks/useTelefonos';
import { createTelefono, updateTelefono, deleteTelefono } from '../services/telefonos';
import { toast } from 'react-toastify';

function Telefonos() {
  const { data: telefonos, loading, refetch } = useTelefonos();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 5;

  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    codigo_pais: '',
    numero: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    const { nombre, codigo_pais, numero } = formData;

    if (!nombre || !codigo_pais || !numero) {
      toast.error('Por favor completa todos los campos obligatorios.');
      return;
    }

    try {
      await createTelefono(formData);
      toast.success('¡Teléfono creado con éxito!');
      refetch();
      setModalVisible(false);
    } catch (error) {
      toast.error('Error al crear el teléfono');
      console.error(error); // Add error logging
    }
  };

  const handleUpdate = async () => {
    if (!currentId) return;

    try {
      await updateTelefono(currentId, formData);
      toast.success('¡Teléfono actualizado con éxito!');
      refetch();
      setModalVisible(false);
    } catch (error) {
      toast.error('Error al actualizar el teléfono');
      console.error(error); // Add error logging
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteTelefono(pendingDelete);
      toast.success('¡Teléfono eliminado con éxito!');
      refetch();
    } catch (error) {
      toast.error('Error al eliminar el teléfono');
      console.error(error); // Add error logging
    } finally {
      setPendingDelete(null);
    }
  };

  const handleEdit = (telefono: any) => {
    setFormData({
      nombre: telefono.nombre,
      codigo_pais: telefono.codigo_pais,
      numero: telefono.numero,
    });
    setCurrentId(telefono.id_telefonos); // Changed from id_telefono to id_telefonos
    setEditMode(true);
    setModalVisible(true);
  };

  const openModalCrear = () => {
    setFormData({
      nombre: '',
      codigo_pais: '',
      numero: '',
    });
    setEditMode(false);
    setCurrentId(null);
    setModalVisible(true);
  };

  const filtered = telefonos.filter((t: any) =>
    t.nombre.toLowerCase().includes(search.toLowerCase()) ||
    t.numero.includes(search)
  );
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="container">
      <h2>Gestion de Teléfonos</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Buscar por nombre o número"
          className="form-control me-3"
          style={{ maxWidth: '300px' }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <button className="btn btn-success" onClick={openModalCrear}>
          Nuevo Teléfono
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
                <th>Código País</th>
                <th>Número</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((t: any) => (
                <tr key={t.id_telefonos}>
                  <td>{t.nombre}</td>
                  <td>{t.codigo_pais}</td>
                  <td>{t.numero}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(t)}>
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setPendingDelete(t.id_telefonos)}
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
                <h5>{editMode ? 'Editar Teléfono' : 'Crear Teléfono'}</h5>
                <button className="btn-close" onClick={() => setModalVisible(false)} />
              </div>
              <div className="modal-body">
                {['nombre', 'codigo_pais', 'numero'].map((field) => (
                  <div key={field} className="mb-3">
                    <label className="form-label">
                      {field === 'codigo_pais' ? 'Código País' : 
                       field === 'numero' ? 'Número' : 'Nombre'}
                    </label>
                    <input
                      type={field === 'numero' ? 'tel' : 'text'}
                      name={field}
                      placeholder={
                        field === 'codigo_pais' ? 'Código País (ej: +503)' : 
                        field === 'numero' ? 'Número de teléfono' : 'Nombre del contacto'
                      }
                      className="form-control"
                      value={(formData as any)[field]}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ))}
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
                <p>¿Estás seguro de eliminar este teléfono?</p>
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

export default Telefonos;