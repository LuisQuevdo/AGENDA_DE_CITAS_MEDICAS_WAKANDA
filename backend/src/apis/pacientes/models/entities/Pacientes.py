import uuid

class Paciente:
    def __init__(self, id_paciente=None, nombre=None, dui=None, isss=None, nit=None, 
                 fecha_nacimiento=None, direccion=None, telefono=None, correo=None):
        self.id_paciente = id_paciente or str(uuid.uuid4())
        self.nombre = nombre
        self.dui = dui
        self.isss = isss
        self.nit = nit
        self.fecha_nacimiento = fecha_nacimiento
        self.direccion = direccion
        self.telefono = telefono
        self.correo = correo

    def to_JSON(self):
        return {
            "id_paciente": self.id_paciente,
            "nombre": self.nombre,
            "dui": self.dui,
            "isss": self.isss,
            "nit": self.nit,
            "fecha_nacimiento": str(self.fecha_nacimiento),
            "direccion": self.direccion,
            "telefono": self.telefono,
            "correo": self.correo
        }