from database.database import get_connection
from ..models.entities.Consultorios import Consultorio
from psycopg2.extras import DictCursor

class ConsultorioModel:
    
    @classmethod
    def get_all(cls):
        connection = get_connection()
        try:
            with connection.cursor(cursor_factory=DictCursor) as cursor:
                cursor.execute("SELECT * FROM consultorios ORDER BY piso, numero")
                return [Consultorio(*row).to_JSON() for row in cursor.fetchall()]
        finally:
            connection.close()

    @classmethod
    def get_by_id(cls, id_consultorio):
        connection = get_connection()
        try:
            with connection.cursor(cursor_factory=DictCursor) as cursor:
                cursor.execute("SELECT * FROM consultorios WHERE id_consultorio = %s", (id_consultorio,))
                row = cursor.fetchone()
                return Consultorio(*row).to_JSON() if row else None
        finally:
            connection.close()

    @classmethod
    def add(cls, consultorio):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO consultorios (id_consultorio, numero, piso, equipamiento)
                    VALUES (%s, %s, %s, %s)
                """, (consultorio.id_consultorio, consultorio.numero, consultorio.piso, consultorio.equipamiento))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()

    @classmethod
    def update(cls, consultorio):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE consultorios SET
                        numero = %s,
                        piso = %s,
                        equipamiento = %s
                    WHERE id_consultorio = %s
                """, (consultorio.numero, consultorio.piso, consultorio.equipamiento, consultorio.id_consultorio))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()

    @classmethod
    def delete(cls, id_consultorio):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM consultorios WHERE id_consultorio = %s", (id_consultorio,))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()