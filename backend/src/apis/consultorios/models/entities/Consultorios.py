import uuid

class Consultorio:
    def __init__(self, id_consultorio=None, numero=None, piso=None, equipamiento=None):
        self.id_consultorio = id_consultorio or str(uuid.uuid4())
        self.numero = numero
        self.piso = piso
        self.equipamiento = equipamiento

    def to_JSON(self):
        return {
            "id_consultorio": self.id_consultorio,
            "numero": self.numero,
            "piso": self.piso,
            "equipamiento": self.equipamiento
        }