import { useState } from 'react';
import { useMedicos } from '../hooks/useMedicos';
import { useEspecialidades } from '../hooks/useEspecialidades';
import { useConsultorios } from '../hooks/useConsultorios';
import { createMedico, updateMedico, deleteMedico } from '../services/medicos';
import { toast } from 'react-toastify';

function Medicos() {
  const { data: medicos, loading, refetch } = useMedicos();
  const { data: especialidades } = useEspecialidades();
  const { data: consultorios } = useConsultorios();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 5;

  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    dui: '',
    isss: '',
    nit: '',
    especialidad_id: '',
    consultorio_id: '',
    telefono: '',
    correo: '',
  });

  const getNombreEspecialidad = (id: string) =>
    especialidades.find((e: any) => e.id_especialidad === id)?.nombre || id;

  const getNombreConsultorio = (id: string) => {
    const c = consultorios.find((c: any) => c.id_consultorio === id);
    return c ? `#${c.numero} (Piso ${c.piso})` : id;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    const { nombre, dui, isss, especialidad_id } = formData;

    if (!nombre || !dui || !isss || !especialidad_id) {
      toast.error('Por favor completa todos los campos obligatorios.');
      return;
    }

    const dataToSend = {
      nombre,
      dui,
      isss,
      especialidad_id,
      nit: formData.nit || null,
      consultorio_id: formData.consultorio_id || null,
      telefono: formData.telefono || null,
      correo: formData.correo || null,
    };

    try {
      await createMedico(dataToSend);
      toast.success('¡Médico creado con éxito!');
      refetch();
      setModalVisible(false);
    } catch (error) {
      toast.error('Error al crear el médico');
    }
  };

  const handleUpdate = async () => {
    if (!currentId) return;

    const dataToSend = {
      ...formData,
      nit: formData.nit || null,
      consultorio_id: formData.consultorio_id || null,
      telefono: formData.telefono || null,
      correo: formData.correo || null,
    };

    try {
      await updateMedico(currentId, dataToSend);
      toast.success('¡Médico actualizado con éxito!');
      refetch();
      setModalVisible(false);
    } catch (error) {
      toast.error('Error al actualizar el médico');
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteMedico(pendingDelete);
      toast.success('¡Médico eliminado con éxito!');
      refetch();
    } catch (error) {
      toast.error('Error al eliminar el médico');
    } finally {
      setPendingDelete(null);
    }
  };

  const handleEdit = (medico: any) => {
    setFormData({
      nombre: medico.nombre,
      dui: medico.dui,
      isss: medico.isss,
      nit: medico.nit,
      especialidad_id: medico.especialidad_id,
      consultorio_id: medico.consultorio_id,
      telefono: medico.telefono || '',
      correo: medico.correo || '',
    });
    setCurrentId(medico.id_medico);
    setEditMode(true);
    setModalVisible(true);
  };

  const openModalCrear = () => {
    setFormData({
      nombre: '',
      dui: '',
      isss: '',
      nit: '',
      especialidad_id: '',
      consultorio_id: '',
      telefono: '',
      correo: '',
    });
    setEditMode(false);
    setCurrentId(null);
    setModalVisible(true);
  };

  const filtered = medicos.filter((m: any) =>
    m.nombre.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="container">
      <h2>Médicos</h2>

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
          Nuevo Médico
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
                <th>ISSS</th>
                <th>NIT</th>
                <th>Especialidad</th>
                <th>Consultorio</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((m: any) => (
                <tr key={m.id_medico}>
                  <td>{m.nombre}</td>
                  <td>{m.dui}</td>
                  <td>{m.isss}</td>
                  <td>{m.nit}</td>
                  <td>{getNombreEspecialidad(m.especialidad_id)}</td>
                  <td>{getNombreConsultorio(m.consultorio_id)}</td>
                  <td>{m.correo}</td>
                  <td>{m.telefono}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(m)}>
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setPendingDelete(m.id_medico)}
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
                <h5>{editMode ? 'Editar Médico' : 'Crear Médico'}</h5>
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
                  <label className="form-label">DUI *</label>
                  <input
                    type="text"
                    name="dui"
                    placeholder="00000000-0"
                    className="form-control"
                    value={formData.dui}
                    onChange={handleChange}
                    required
                    pattern="\d{8}-\d"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">ISSS *</label>
                  <input
                    type="text"
                    name="isss"
                    placeholder="9 dígitos"
                    className="form-control"
                    value={formData.isss}
                    onChange={handleChange}
                    required
                    pattern="\d{9}"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">NIT</label>
                  <input
                    type="text"
                    name="nit"
                    placeholder="0000-000000-000-0"
                    className="form-control"
                    value={formData.nit}
                    onChange={handleChange}
                    pattern="\d{4}-\d{6}-\d{3}-\d"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    placeholder="0000-0000"
                    className="form-control"
                    value={formData.telefono}
                    onChange={handleChange}
                    pattern="\d{4}-\d{4}"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    name="correo"
                    className="form-control"
                    value={formData.correo}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Especialidad *</label>
                  <select
                    name="especialidad_id"
                    className="form-control"
                    value={formData.especialidad_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Seleccionar Especialidad --</option>
                    {especialidades.map((e: any) => (
                      <option key={e.id_especialidad} value={e.id_especialidad}>
                        {e.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Consultorio</label>
                  <select
                    name="consultorio_id"
                    className="form-control"
                    value={formData.consultorio_id}
                    onChange={handleChange}
                  >
                    <option value="">-- Seleccionar Consultorio --</option>
                    {consultorios.map((c: any) => (
                      <option key={c.id_consultorio} value={c.id_consultorio}>
                        #{c.numero} (Piso {c.piso})
                      </option>
                    ))}
                  </select>
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
        <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header bg-warning">
                <h5 className="modal-title">Confirmar Eliminación</h5>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de eliminar este médico?</p>
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

export default Medicos;