import { useState, useEffect } from 'react';
import { useFacturas } from '../hooks/useFacturas';
import { useCitas } from '../hooks/useCitas';
import { createFactura, updateFactura, deleteFactura } from '../services/facturas';
import { toast } from 'react-toastify';

function Facturas() {
  const { data: facturas, loading, refetch } = useFacturas();
  const { data: citas } = useCitas();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 5;

  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    cita_id: '',
    numero_factura: '',
    fecha_emision: new Date().toISOString().split('T')[0], // Fecha actual por defecto
    nit_paciente: '',
    subtotal: '',
    iva: '',
  });

  // Calcular IVA automáticamente cuando cambia el subtotal
  useEffect(() => {
    if (formData.subtotal && !editMode) {
      const subtotalNum = parseFloat(formData.subtotal);
      if (!isNaN(subtotalNum)) {
        const ivaCalculado = (subtotalNum * 0.13).toFixed(2);
        setFormData(prev => ({ ...prev, iva: ivaCalculado }));
      }
    }
  }, [formData.subtotal, editMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    // Validar número de factura
    if (!formData.numero_factura.match(/^FACT-\d{4}-\d{4}$/)) {
      toast.error('Formato de factura inválido. Debe ser FACT-0000-0000');
      return false;
    }

    // Validar NIT
    if (!formData.nit_paciente.match(/^\d{4}-\d{6}-\d{3}-\d$/)) {
      toast.error('Formato de NIT inválido. Debe ser 0000-000000-000-0');
      return false;
    }

    // Validar subtotal positivo
    if (parseFloat(formData.subtotal) <= 0) {
      toast.error('El subtotal debe ser mayor a 0');
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    
    try {
      await createFactura(formData);
      toast.success('¡Factura creada con éxito!');
      refetch();
      setModalVisible(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al crear la factura');
    }
  };

  const handleUpdate = async () => {
    if (!currentId || !validateForm()) return;
    
    try {
      await updateFactura(currentId, formData);
      toast.success('¡Factura actualizada con éxito!');
      refetch();
      setModalVisible(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al actualizar la factura');
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteFactura(pendingDelete);
      toast.success('¡Factura eliminada con éxito!');
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al eliminar la factura');
    } finally {
      setPendingDelete(null);
    }
  };

  const handleEdit = (f: any) => {
    setFormData({
      cita_id: f.cita_id,
      numero_factura: f.numero_factura,
      fecha_emision: f.fecha_emision.split('T')[0],
      nit_paciente: f.nit_paciente,
      subtotal: f.subtotal,
      iva: f.iva,
    });
    setCurrentId(f.id_factura);
    setEditMode(true);
    setModalVisible(true);
  };

  const openModalCrear = () => {
    setFormData({
      cita_id: '',
      numero_factura: '',
      fecha_emision: new Date().toISOString().split('T')[0],
      nit_paciente: '',
      subtotal: '',
      iva: '',
    });
    setEditMode(false);
    setCurrentId(null);
    setModalVisible(true);
  };

  const filtered = facturas.filter((f: any) =>
    f.numero_factura.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="container">
      <h2>Facturas</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Buscar por número de factura"
          className="form-control me-3"
          style={{ maxWidth: '300px' }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <button className="btn btn-success" onClick={openModalCrear}>Nueva Factura</button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Número</th>
                <th>Fecha Emisión</th>
                <th>NIT Paciente</th>
                <th>Subtotal</th>
                <th>IVA</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((f: any) => (
                <tr key={f.id_factura}>
                  <td>{f.numero_factura}</td>
                  <td>{new Date(f.fecha_emision).toLocaleDateString()}</td>
                  <td>{f.nit_paciente}</td>
                  <td>${parseFloat(f.subtotal).toFixed(2)}</td>
                  <td>${parseFloat(f.iva).toFixed(2)}</td>
                  <td>${parseFloat(f.total).toFixed(2)}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(f)}>
                      Editar
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => setPendingDelete(f.id_factura)}>
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
                <h5>{editMode ? 'Editar Factura' : 'Crear Factura'}</h5>
                <button className="btn-close" onClick={() => setModalVisible(false)} />
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Cita *</label>
                    <select
                      name="cita_id"
                      className="form-control"
                      value={formData.cita_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Seleccionar Cita --</option>
                      {citas.map((c: any) => (
                        <option key={c.id_cita} value={c.id_cita}>
                          Cita #{c.id_cita} - {new Date(c.fecha).toLocaleDateString()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Número de Factura *</label>
                    <input
                      type="text"
                      name="numero_factura"
                      className="form-control"
                      placeholder="Ejemplo: FACT-0001-0001"
                      value={formData.numero_factura}
                      onChange={handleChange}
                      required
                    />
                    <small className="text-muted">Formato: FACT-0000-0000</small>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Fecha de Emisión *</label>
                    <input
                      type="date"
                      name="fecha_emision"
                      className="form-control"
                      value={formData.fecha_emision}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">NIT Paciente *</label>
                    <input
                      type="text"
                      name="nit_paciente"
                      className="form-control"
                      placeholder="Ejemplo: 1234-567890-123-4"
                      value={formData.nit_paciente}
                      onChange={handleChange}
                      required
                    />
                    <small className="text-muted">Formato: 0000-000000-000-0</small>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Subtotal *</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        name="subtotal"
                        className="form-control"
                        value={formData.subtotal}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">IVA (13%)</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        step="0.01"
                        name="iva"
                        className="form-control"
                        value={formData.iva}
                        onChange={handleChange}
                        readOnly={!editMode}
                      />
                    </div>
                  </div>
                  <div className="col-md-12 mb-3">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Total</h5>
                        <p className="card-text fs-4">
                          ${(parseFloat(formData.subtotal || '0') + parseFloat(formData.iva || '0')).toFixed(2)}
                        </p>
                      </div>
                    </div>
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
        <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header bg-warning">
                <h5 className="modal-title">Confirmar Eliminación</h5>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de eliminar esta factura?</p>
                <p className="text-danger">Esta acción no se puede deshacer.</p>
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

export default Facturas;