import { useState } from 'react';
import { usePacientes } from '../hooks/usePacientes';
import { createPaciente, updatePaciente, deletePaciente } from '../services/pacientes';
import { toast } from 'react-toastify';
import type { Paciente, PacienteCreate } from '../types';

function Pacientes() {
  const { data: pacientes = [], loading, refetch } = usePacientes();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 5;

  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const initialFormData: Omit<Paciente, 'id_paciente'> = {
    nombre: '',
    dui: '',
    isss: '',
    nit: '',
    fecha_nacimiento: '',
    direccion: '',
    telefono: '',
    correo: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const cleanFormData = () => {
  const cleaned: Partial<typeof formData> = {};
    for (const key in formData) {
      const value = formData[key as keyof typeof formData];
      if (value && value.trim() !== '') {
        cleaned[key as keyof typeof formData] = value;
      }
    }
    return cleaned;
  };

  const handleCreate = async () => {
    if (!formData.nombre || !formData.fecha_nacimiento) {
      toast.error('Nombre y Fecha de Nacimiento son obligatorios');
      return;
    }

    try {
      const payload = cleanFormData();
      await createPaciente(payload as PacienteCreate);
      toast.success('¡Paciente creado con éxito!');
      refetch();
      setModalVisible(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al crear el paciente');
    }
  };

  const handleUpdate = async () => {
    if (!currentId) return;

    if (!formData.nombre || !formData.fecha_nacimiento) {
      toast.error('Nombre y Fecha de Nacimiento son obligatorios');
      return;
    }

    try {
      const payload = cleanFormData();
      await updatePaciente(currentId, payload);
      toast.success('¡Paciente actualizado con éxito!');
      refetch();
      setModalVisible(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al actualizar el paciente');
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deletePaciente(pendingDelete);
      toast.success('¡Paciente eliminado con éxito!');
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al eliminar el paciente');
    } finally {
      setPendingDelete(null);
    }
  };

  const handleEdit = (p: Paciente) => {
    const { id_paciente, ...rest } = p;
    setFormData(rest);
    setCurrentId(p.id_paciente ?? null);
    setEditMode(true);
    setModalVisible(true);
  };

  const openModalCrear = () => {
    setFormData(initialFormData);
    setEditMode(false);
    setCurrentId(null);
    setModalVisible(true);
  };

  const filtered = pacientes.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="container">
      <h2>Pacientes</h2>

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
          Nuevo Paciente
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
                <th>DUI</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((p) => (
                <tr key={p.id_paciente}>
                  <td>{p.nombre}</td>
                  <td>{p.dui}</td>
                  <td>{p.telefono}</td>
                  <td>{p.correo}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(p)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => setPendingDelete(p.id_paciente ?? null)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center">
            <button className="btn btn-secondary" onClick={() => setPage(page - 1)} disabled={page === 1}>Anterior</button>
            <span>Página {page} de {totalPages}</span>
            <button className="btn btn-secondary" onClick={() => setPage(page + 1)} disabled={page === totalPages}>Siguiente</button>
          </div>
        </>
      )}

      {/* Modal Crear/Editar */}
      {modalVisible && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{editMode ? 'Editar Paciente' : 'Nuevo Paciente'}</h5>
                <button className="btn-close" onClick={() => setModalVisible(false)} />
              </div>
              <div className="modal-body">
                <div className="row">
                  {[
                    ['nombre', 'Nombre'],
                    ['dui', 'DUI (00000000-0)'],
                    ['isss', 'ISSS (9 dígitos)'],
                    ['nit', 'NIT (0000-000000-000-0)'],
                    ['fecha_nacimiento', 'Fecha de nacimiento'],
                    ['telefono', 'Teléfono (0000-0000)'],
                    ['correo', 'Correo electrónico']
                  ].map(([name, placeholder]) => (
                    <div className="col-md-6 mb-3" key={name}>
                      <input
                        type={name === 'fecha_nacimiento' ? 'date' : name === 'correo' ? 'email' : 'text'}
                        name={name}
                        placeholder={placeholder}
                        className="form-control"
                        value={(formData as any)[name]}
                        onChange={handleChange}
                      />
                    </div>
                  ))}
                  <div className="col-12 mb-3">
                    <textarea
                      name="direccion"
                      placeholder="Dirección"
                      className="form-control"
                      value={formData.direccion}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>
                </div>
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
        <div className="modal fade show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header bg-warning">
                <h5 className="modal-title">Confirmar Eliminación</h5>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de eliminar este paciente?</p>
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

export default Pacientes;