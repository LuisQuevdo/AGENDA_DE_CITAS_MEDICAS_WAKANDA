import uuid
from datetime import datetime

class Pago:
    def __init__(self, id_pago=None, factura_id=None, monto=None, 
                 fecha_pago=None, metodo_pago_id=None, referencia=None):
        self.id_pago = id_pago or str(uuid.uuid4())
        self.factura_id = factura_id
        self.monto = monto
        self.fecha_pago = fecha_pago or datetime.now()
        self.metodo_pago_id = metodo_pago_id
        self.referencia = referencia

    def to_JSON(self):
        return {
            "id_pago": self.id_pago,
            "factura_id": self.factura_id,
            "monto": float(self.monto),
            "fecha_pago": self.fecha_pago.isoformat(),
            "metodo_pago_id": self.metodo_pago_id,
            "referencia": self.referencia
        }