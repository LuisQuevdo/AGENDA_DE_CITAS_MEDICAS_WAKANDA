import uuid

class Horario:
    def __init__(self, id_horario=None, medico_id=None, consultorio_id=None, 
                 dia_semana=None, hora_inicio=None, hora_fin=None):
        self.id_horario = id_horario or str(uuid.uuid4())
        self.medico_id = medico_id
        self.consultorio_id = consultorio_id
        self.dia_semana = dia_semana
        self.hora_inicio = hora_inicio
        self.hora_fin = hora_fin

    def to_JSON(self):
        return {
            "id_horario": self.id_horario,
            "medico_id": self.medico_id,
            "consultorio_id": self.consultorio_id,
            "dia_semana": self.dia_semana,
            "hora_inicio": str(self.hora_inicio),
            "hora_fin": str(self.hora_fin)
        }