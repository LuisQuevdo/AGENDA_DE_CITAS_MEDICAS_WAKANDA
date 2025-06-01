import uuid
from datetime import datetime

class Notificacion:
    def __init__(self, id_notificacion=None, cita_id=None, tipo=None, 
                 contenido=None, fecha_envio=None, estado=None):
        self.id_notificacion = id_notificacion or str(uuid.uuid4())
        self.cita_id = cita_id
        self.tipo = tipo
        self.contenido = contenido
        self.fecha_envio = fecha_envio or datetime.now()
        self.estado = estado or "pendiente"

    def to_JSON(self):
        return {
            "id_notificacion": self.id_notificacion,
            "cita_id": self.cita_id,
            "tipo": self.tipo,
            "contenido": self.contenido,
            "fecha_envio": self.fecha_envio.isoformat(),
            "estado": self.estado
        }