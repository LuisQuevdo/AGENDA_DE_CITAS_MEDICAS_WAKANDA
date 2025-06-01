from database.database import get_connection
from ..models.entities.Especialidades import Especialidad
from psycopg2.extras import DictCursor

class EspecialidadModel:
    
    @classmethod
    def get_all(cls):
        connection = get_connection()
        try:
            with connection.cursor(cursor_factory=DictCursor) as cursor:
                cursor.execute("SELECT * FROM especialidades ORDER BY nombre")
                return [Especialidad(*row).to_JSON() for row in cursor.fetchall()]
        finally:
            connection.close()

    @classmethod
    def get_by_id(cls, id_especialidad):
        connection = get_connection()
        try:
            with connection.cursor(cursor_factory=DictCursor) as cursor:
                cursor.execute("SELECT * FROM especialidades WHERE id_especialidad = %s", (id_especialidad,))
                row = cursor.fetchone()
                return Especialidad(*row).to_JSON() if row else None
        finally:
            connection.close()

    @classmethod
    def add(cls, especialidad):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO especialidades (id_especialidad, nombre, descripcion)
                    VALUES (%s, %s, %s)
                """, (especialidad.id_especialidad, especialidad.nombre, especialidad.descripcion))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()

    @classmethod
    def update(cls, especialidad):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE especialidades SET
                        nombre = %s,
                        descripcion = %s
                    WHERE id_especialidad = %s
                """, (especialidad.nombre, especialidad.descripcion, especialidad.id_especialidad))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()

    @classmethod
    def delete(cls, id_especialidad):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM especialidades WHERE id_especialidad = %s", (id_especialidad,))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()