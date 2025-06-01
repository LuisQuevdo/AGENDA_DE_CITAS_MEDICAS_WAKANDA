from database.database import get_connection
from ..models.entities.MetodosPago import MetodoPago
from psycopg2.extras import DictCursor

class MetodoPagoModel:
    
    @classmethod
    def get_all(cls):
        connection = get_connection()
        try:
            with connection.cursor(cursor_factory=DictCursor) as cursor:
                cursor.execute("SELECT * FROM metodos_pago ORDER BY id_metodo_pago")
                return [MetodoPago(*row).to_JSON() for row in cursor.fetchall()]
        finally:
            connection.close()

    @classmethod
    def get_by_id(cls, id_metodo_pago):
        connection = get_connection()
        try:
            with connection.cursor(cursor_factory=DictCursor) as cursor:
                cursor.execute("SELECT * FROM metodos_pago WHERE id_metodo_pago = %s", (id_metodo_pago,))
                row = cursor.fetchone()
                return MetodoPago(*row).to_JSON() if row else None
        finally:
            connection.close()

    @classmethod
    def add(cls, metodo_pago):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO metodos_pago (nombre)
                    VALUES (%s) RETURNING id_metodo_pago
                """, (metodo_pago.nombre,))
                new_id = cursor.fetchone()[0]
                connection.commit()
                return new_id
        except:
            connection.rollback()
            raise
        finally:
            connection.close()

    @classmethod
    def update(cls, metodo_pago):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE metodos_pago SET
                        nombre = %s
                    WHERE id_metodo_pago = %s
                """, (metodo_pago.nombre, metodo_pago.id_metodo_pago))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()

    @classmethod
    def delete(cls, id_metodo_pago):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM metodos_pago WHERE id_metodo_pago = %s", (id_metodo_pago,))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()