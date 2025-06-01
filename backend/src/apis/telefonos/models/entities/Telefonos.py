import uuid

class Telefono:
    def __init__(self, id_telefonos=None, nombre=None, codigo_pais=None, numero=None):
        self.id_telefonos = id_telefonos or str(uuid.uuid4())
        self.nombre = nombre
        self.codigo_pais = codigo_pais
        self.numero = numero

    def to_JSON(self):
        return {
            "id_telefonos": self.id_telefonos,
            "nombre": self.nombre,
            "codigo_pais": self.codigo_pais,
            "numero": self.numero
        }