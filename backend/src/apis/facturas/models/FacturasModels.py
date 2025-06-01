from database.database import get_connection
from ..models.entities.Facturas import Factura
from psycopg2.extras import DictCursor

class FacturaModel:
    
    @classmethod
    def get_all_facturas(cls):
        connection = get_connection()
        try:
            with connection.cursor(cursor_factory=DictCursor) as cursor:
                cursor.execute("SELECT * FROM facturas ORDER BY fecha_emision DESC")
                facturas = []
                for row in cursor.fetchall():
                    # Create base factura object
                    factura_data = {
                        "id_factura": row['id_factura'],
                        "cita_id": row['cita_id'],
                        "numero_factura": row['numero_factura'],
                        "fecha_emision": str(row['fecha_emision']),
                        "nit_paciente": row['nit_paciente'],
                        "subtotal": float(row['subtotal']),
                        "iva": float(row['iva']),
                        "total": float(row['total'])  # Add the calculated field
                    }
                    facturas.append(factura_data)
                return facturas
        except Exception as ex:
            raise ex
        finally:
            connection.close()

    @classmethod
    def get_by_id(cls, id_factura):
        connection = get_connection()
        try:
            with connection.cursor(cursor_factory=DictCursor) as cursor:
                cursor.execute("SELECT * FROM facturas WHERE id_factura = %s", (id_factura,))
                row = cursor.fetchone()
                if row:
                    return {
                        "id_factura": row['id_factura'],
                        "cita_id": row['cita_id'],
                        "numero_factura": row['numero_factura'],
                        "fecha_emision": str(row['fecha_emision']),
                        "nit_paciente": row['nit_paciente'],
                        "subtotal": float(row['subtotal']),
                        "iva": float(row['iva']),
                        "total": float(row['total'])
                    }
                return None
        finally:
            connection.close()

    @classmethod
    def add(cls, factura):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO facturas (
                        id_factura, cita_id, numero_factura,
                        fecha_emision, nit_paciente, subtotal, iva
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (
                    factura.id_factura, factura.cita_id, factura.numero_factura,
                    factura.fecha_emision, factura.nit_paciente,
                    factura.subtotal, factura.iva
                ))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()

    @classmethod
    def update(cls, factura):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE facturas SET
                        cita_id = %s,
                        numero_factura = %s,
                        fecha_emision = %s,
                        nit_paciente = %s,
                        subtotal = %s,
                        iva = %s
                    WHERE id_factura = %s
                """, (
                    factura.cita_id, factura.numero_factura,
                    factura.fecha_emision, factura.nit_paciente,
                    factura.subtotal, factura.iva, factura.id_factura
                ))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()

    @classmethod
    def delete(cls, id_factura):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM facturas WHERE id_factura = %s", (id_factura,))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()