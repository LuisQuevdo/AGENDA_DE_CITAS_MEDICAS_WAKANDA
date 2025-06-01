import uuid
from datetime import datetime

class Cita:
    def __init__(self, id_cita=None, paciente_id=None, medico_id=None, 
                 fecha_hora=None, consultorio_id=None, estado=None, notas=None):
        self.id_cita = id_cita or str(uuid.uuid4())
        self.paciente_id = paciente_id
        self.medico_id = medico_id
        self.fecha_hora = fecha_hora or datetime.now()
        self.consultorio_id = consultorio_id
        self.estado = estado or "programada"
        self.notas = notas

    def to_JSON(self):
        return {
            "id_cita": self.id_cita,
            "paciente_id": self.paciente_id,
            "medico_id": self.medico_id,
            "fecha_hora": self.fecha_hora.isoformat(),
            "consultorio_id": self.consultorio_id,
            "estado": self.estado,
            "notas": self.notas
        }