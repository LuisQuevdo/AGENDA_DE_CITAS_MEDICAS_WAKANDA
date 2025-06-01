import uuid
from datetime import datetime

class Usuario:
    def __init__(self, id_usuario=None, nombre=None, correo=None, contrasena=None, rol='usuario', fecha_creacion=None):
        self.id_usuario = id_usuario or str(uuid.uuid4())
        self.nombre = nombre
        self.correo = correo
        self.contrasena = contrasena
        self.rol = rol
        self.fecha_creacion = fecha_creacion or datetime.now()

    def to_JSON(self):
        return {
            "id_usuario": self.id_usuario,
            "nombre": self.nombre,
            "correo": self.correo,
            "contrasena": self.contrasena,
            "rol": self.rol,
            "fecha_creacion": self.fecha_creacion.isoformat()
        }