from database.database import get_connection
from ..models.entities.Pagos import Pago
from psycopg2.extras import DictCursor

class PagoModel:
    
    @classmethod
    def get_all(cls):
        connection = get_connection()
        try:
            with connection.cursor(cursor_factory=DictCursor) as cursor:
                cursor.execute("SELECT * FROM pagos ORDER BY fecha_pago DESC")
                return [Pago(*row).to_JSON() for row in cursor.fetchall()]
        finally:
            connection.close()

    @classmethod
    def get_by_id(cls, id_pago):
        connection = get_connection()
        try:
            with connection.cursor(cursor_factory=DictCursor) as cursor:
                cursor.execute("SELECT * FROM pagos WHERE id_pago = %s", (id_pago,))
                row = cursor.fetchone()
                return Pago(*row).to_JSON() if row else None
        finally:
            connection.close()

    @classmethod
    def add(cls, pago):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO pagos (
                        id_pago, factura_id, monto,
                        fecha_pago, metodo_pago_id, referencia
                    ) VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    pago.id_pago, pago.factura_id, pago.monto,
                    pago.fecha_pago, pago.metodo_pago_id, pago.referencia
                ))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()

    @classmethod
    def update(cls, pago):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE pagos SET
                        factura_id = %s,
                        monto = %s,
                        fecha_pago = %s,
                        metodo_pago_id = %s,
                        referencia = %s
                    WHERE id_pago = %s
                """, (
                    pago.factura_id, pago.monto, pago.fecha_pago,
                    pago.metodo_pago_id, pago.referencia, pago.id_pago
                ))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()

    @classmethod
    def delete(cls, id_pago):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM pagos WHERE id_pago = %s", (id_pago,))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()