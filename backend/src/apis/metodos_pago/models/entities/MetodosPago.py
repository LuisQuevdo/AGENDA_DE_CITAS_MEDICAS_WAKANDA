class MetodoPago:
    def __init__(self, id_metodo_pago=None, nombre=None):
        self.id_metodo_pago = id_metodo_pago
        self.nombre = nombre

    def to_JSON(self):
        return {
            "id_metodo_pago": self.id_metodo_pago,
            "nombre": self.nombre
        }