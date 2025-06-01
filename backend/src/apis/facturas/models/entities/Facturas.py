import uuid
from datetime import datetime

class Factura:
    def __init__(self, id_factura, cita_id, numero_factura, 
                 fecha_emision, nit_paciente, subtotal, iva):
        self.id_factura = id_factura or str(uuid.uuid4())
        self.cita_id = cita_id
        self.numero_factura = numero_factura
        self.fecha_emision = fecha_emision or datetime.now().date()
        self.nit_paciente = nit_paciente
        self.subtotal = subtotal
        self.iva = iva

    def to_JSON(self):
        return {
            "id_factura": self.id_factura,
            "cita_id": self.cita_id,
            "numero_factura": self.numero_factura,
            "fecha_emision": str(self.fecha_emision),
            "nit_paciente": self.nit_paciente,
            "subtotal": float(self.subtotal),
            "iva": float(self.iva),
        }