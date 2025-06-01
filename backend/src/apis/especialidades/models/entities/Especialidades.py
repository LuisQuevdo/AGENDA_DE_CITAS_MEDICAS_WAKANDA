import uuid

class Especialidad:
    def __init__(self, id_especialidad=None, nombre=None, descripcion=None):
        self.id_especialidad = id_especialidad or str(uuid.uuid4())
        self.nombre = nombre
        self.descripcion = descripcion

    def to_JSON(self):
        return {
            "id_especialidad": self.id_especialidad,
            "nombre": self.nombre,
            "descripcion": self.descripcion
        }