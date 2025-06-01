import uuid

class Medico:
    def __init__(self, id_medico=None, nombre=None, dui=None, isss=None, nit=None, 
                 especialidad_id=None, consultorio_id=None, telefono=None, correo=None):
        self.id_medico = id_medico or str(uuid.uuid4())
        self.nombre = nombre
        self.dui = dui
        self.isss = isss
        self.nit = nit
        self.especialidad_id = especialidad_id
        self.consultorio_id = consultorio_id
        self.telefono = telefono
        self.correo = correo

    def to_JSON(self):
        return {
            "id_medico": self.id_medico,
            "nombre": self.nombre,
            "dui": self.dui,
            "isss": self.isss,
            "nit": self.nit,
            "especialidad_id": self.especialidad_id,
            "consultorio_id": self.consultorio_id,
            "telefono": self.telefono,
            "correo": self.correo
        }