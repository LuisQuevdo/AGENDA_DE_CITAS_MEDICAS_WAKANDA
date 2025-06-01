from database.database import get_connection
from ..models.entities.Medicos import Medico
from psycopg2.extras import DictCursor

class MedicoModel:
    
    @classmethod
    def get_all(cls):
        connection = get_connection()
        try:
            with connection.cursor(cursor_factory=DictCursor) as cursor:
                cursor.execute("SELECT * FROM medicos ORDER BY nombre")
                return [Medico(*row).to_JSON() for row in cursor.fetchall()]
        finally:
            connection.close()

    @classmethod
    def get_by_id(cls, id_medico):
        connection = get_connection()
        try:
            with connection.cursor(cursor_factory=DictCursor) as cursor:
                cursor.execute("SELECT * FROM medicos WHERE id_medico = %s", (id_medico,))
                row = cursor.fetchone()
                return Medico(*row).to_JSON() if row else None
        finally:
            connection.close()

    @classmethod
    def add(cls, medico):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO medicos (
                        id_medico, nombre, dui, isss, nit,
                        especialidad_id, consultorio_id, telefono, correo
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    medico.id_medico, medico.nombre, medico.dui, medico.isss, medico.nit,
                    medico.especialidad_id, medico.consultorio_id, medico.telefono, medico.correo
                ))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()

    @classmethod
    def update(cls, medico):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE medicos SET
                        nombre = %s,
                        dui = %s,
                        isss = %s,
                        nit = %s,
                        especialidad_id = %s,
                        consultorio_id = %s,
                        telefono = %s,
                        correo = %s
                    WHERE id_medico = %s
                """, (
                    medico.nombre, medico.dui, medico.isss, medico.nit,
                    medico.especialidad_id, medico.consultorio_id,
                    medico.telefono, medico.correo, medico.id_medico
                ))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()

    @classmethod
    def delete(cls, id_medico):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM medicos WHERE id_medico = %s", (id_medico,))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()