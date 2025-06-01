from database.database import get_connection
from ..models.entities.Telefonos import Telefono
from psycopg2.extras import DictCursor

class TelefonosModel:

    @classmethod
    def get_all(cls):
        connection = get_connection()
        try:
            with connection.cursor(cursor_factory=DictCursor) as cursor:
                cursor.execute("SELECT * FROM telefonos ORDER BY nombre")
                return [Telefono(*row).to_JSON() for row in cursor.fetchall()]
        finally:
            connection.close()

    @classmethod
    def get_by_id(cls, id_telefonos):
        connection = get_connection()
        try:
            with connection.cursor(cursor_factory=DictCursor) as cursor:
                cursor.execute("SELECT * FROM telefonos WHERE id_telefonos = %s", (id_telefonos,))
                row = cursor.fetchone()
                return Telefono(*row).to_JSON() if row else None
        finally:
            connection.close()

    @classmethod
    def add(cls, telefono):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO telefonos (
                        id_telefonos, nombre, codigo_pais, numero
                    ) VALUES (%s, %s, %s, %s)
                """, (
                    telefono.id_telefonos, telefono.nombre,
                    telefono.codigo_pais, telefono.numero
                ))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()

    @classmethod
    def update(cls, telefono):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE telefonos SET
                        nombre = %s,
                        codigo_pais = %s,
                        numero = %s
                    WHERE id_telefonos = %s
                """, (
                    telefono.nombre, telefono.codigo_pais,
                    telefono.numero, telefono.id_telefonos
                ))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()

    @classmethod
    def delete(cls, id_telefonos):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM telefonos WHERE id_telefonos = %s", (id_telefonos,))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()