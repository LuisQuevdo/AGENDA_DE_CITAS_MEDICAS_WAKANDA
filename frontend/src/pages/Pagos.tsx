import { useState } from 'react';
import { usePagos } from '../hooks/usePagos';
import { useFacturas } from '../hooks/useFacturas';
import { useMetodosPago } from '../hooks/useMetodosPago';
import { createPago, updatePago, deletePago } from '../services/pagos';
import { toast } from 'react-toastify';
import type { MetodoPago, Factura, Pago } from '../types'; // Importamos las interfaces

function Pagos() {
  const { data: pagos, loading, refetch } = usePagos();
  const { data: facturas } = useFacturas();
  const { data: metodosPago } = useMetodosPago();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 5;

  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    factura_id: '',
    monto: '',
    metodo_pago_id: '',
    referencia: '',
  });

  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.factura_id) {
      toast.error('Debe seleccionar una factura');
      return false;
    }

    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      toast.error('El monto debe ser mayor a 0');
      return false;
    }

    if (!formData.metodo_pago_id) {
      toast.error('Debe seleccionar un método de pago');
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    
    try {
      await createPago({
        factura_id: formData.factura_id,
        monto: parseFloat(formData.monto),
        metodo_pago_id: parseInt(formData.metodo_pago_id),
        referencia: formData.referencia
      });
      toast.success('¡Pago registrado con éxito!');
      refetch();
      setModalVisible(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al registrar el pago');
    }
  };

  const handleUpdate = async () => {
    if (!currentId || !validateForm()) return;
    
    try {
      await updatePago(currentId, {
        factura_id: formData.factura_id,
        monto: parseFloat(formData.monto),
        metodo_pago_id: parseInt(formData.metodo_pago_id),
        referencia: formData.referencia
      });
      toast.success('¡Pago actualizado con éxito!');
      refetch();
      setModalVisible(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al actualizar el pago');
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deletePago(pendingDelete);
      toast.success('¡Pago eliminado con éxito!');
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al eliminar el pago');
    } finally {
      setPendingDelete(null);
    }
  };

  const handleEdit = (pago: Pago) => {
    setFormData({
      factura_id: pago.factura_id,
      monto: pago.monto.toString(),
      metodo_pago_id: pago.metodo_pago_id.toString(),
      referencia: pago.referencia || '',
    });
    setCurrentId(pago.id_pago);
    setEditMode(true);
    setModalVisible(true);
  };

  const openModalCrear = () => {
    setFormData({ 
      factura_id: '', 
      monto: '', 
      metodo_pago_id: '', 
      referencia: '' 
    });
    setEditMode(false);
    setCurrentId(null);
    setModalVisible(true);
  };

  const filtered = (pagos as Pago[]).filter((p) =>
    p.referencia?.toLowerCase().includes(search.toLowerCase()) ||
    p.factura_id.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="container">
      <h2>Pagos</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Buscar por referencia o número de factura"
          className="form-control me-3"
          style={{ maxWidth: '300px' }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <button className="btn btn-success" onClick={openModalCrear}>
          Nuevo Pago
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Factura</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Método de Pago</th>
                <th>Referencia</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((p) => (
                <tr key={p.id_pago}>
                  <td>FACT-{p.factura_id.substring(0, 8)}</td>
                  <td>${p.monto.toFixed(2)}</td>
                  <td>{new Date(p.fecha_pago).toLocaleDateString()} {new Date(p.fecha_pago).toLocaleTimeString()}</td>
                  <td>
                    {(metodosPago as MetodoPago[]).find(m => m.id_metodo_pago === p.metodo_pago_id)?.nombre || p.metodo_pago_id}
                  </td>
                  <td>{p.referencia || '-'}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(p)}>
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setPendingDelete(p.id_pago)}
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
                <h5>{editMode ? 'Editar Pago' : 'Registrar Pago'}</h5>
                <button className="btn-close" onClick={() => setModalVisible(false)} />
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Factura *</label>
                    <select
                      name="factura_id"
                      className="form-select"
                      value={formData.factura_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Seleccionar Factura --</option>
                      {(facturas as Factura[]).map((f) => (
                        <option key={f.id_factura} value={f.id_factura}>
                          {f.numero_factura} - ${(f.subtotal + f.iva).toFixed(2)}
                        </option>
                      ))}
                    </select>
                    <small className="text-muted">Seleccione la factura a pagar</small>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Método de Pago *</label>
                    <select
                      name="metodo_pago_id"
                      className="form-select"
                      value={formData.metodo_pago_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Seleccionar Método --</option>
                      {(metodosPago as MetodoPago[]).map((m) => (
                        <option key={m.id_metodo_pago} value={m.id_metodo_pago}>
                          {m.nombre}
                        </option>
                      ))}
                    </select>
                    <small className="text-muted">Seleccione cómo se realizó el pago</small>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Monto *</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        name="monto"
                        className="form-control"
                        value={formData.monto}
                        onChange={handleChange}
                        min="0.01"
                        step="0.01"
                        required
                        placeholder="0.00"
                      />
                    </div>
                    <small className="text-muted">Ingrese el monto pagado</small>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Referencia</label>
                    <input
                      type="text"
                      name="referencia"
                      className="form-control"
                      value={formData.referencia}
                      onChange={handleChange}
                      placeholder="Número de transacción, cheque, etc."
                    />
                    <small className="text-muted">Opcional: referencia del pago</small>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setModalVisible(false)}>
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={editMode ? handleUpdate : handleCreate}>
                  {editMode ? 'Actualizar' : 'Registrar'}
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
                <p>¿Estás seguro de eliminar este pago?</p>
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

export default Pagos;