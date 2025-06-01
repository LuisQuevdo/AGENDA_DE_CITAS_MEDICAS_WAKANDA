from database.database import get_connection
from ..models.entities.Pacientes import Paciente
from psycopg2.extras import DictCursor

class PacienteModel:
    
    @classmethod
    def get_all(cls):
        connection = get_connection()
        try:
            with connection.cursor(cursor_factory=DictCursor) as cursor:
                cursor.execute("SELECT * FROM pacientes ORDER BY nombre")
                return [Paciente(*row).to_JSON() for row in cursor.fetchall()]
        finally:
            connection.close()

    @classmethod
    def get_by_id(cls, id_paciente):
        connection = get_connection()
        try:
            with connection.cursor(cursor_factory=DictCursor) as cursor:
                cursor.execute("SELECT * FROM pacientes WHERE id_paciente = %s", (id_paciente,))
                row = cursor.fetchone()
                return Paciente(*row).to_JSON() if row else None
        finally:
            connection.close()

    @classmethod
    def add(cls, paciente):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO pacientes (
                        id_paciente, nombre, dui, isss, nit,
                        fecha_nacimiento, direccion, telefono, correo
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    paciente.id_paciente, paciente.nombre, paciente.dui, paciente.isss, paciente.nit,
                    paciente.fecha_nacimiento, paciente.direccion, paciente.telefono, paciente.correo
                ))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()

    @classmethod
    def update(cls, paciente):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE pacientes SET
                        nombre = %s,
                        dui = %s,
                        isss = %s,
                        nit = %s,
                        fecha_nacimiento = %s,
                        direccion = %s,
                        telefono = %s,
                        correo = %s
                    WHERE id_paciente = %s
                """, (
                    paciente.nombre, paciente.dui, paciente.isss, paciente.nit,
                    paciente.fecha_nacimiento, paciente.direccion,
                    paciente.telefono, paciente.correo, paciente.id_paciente
                ))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()

    @classmethod
    def delete(cls, id_paciente):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM pacientes WHERE id_paciente = %s", (id_paciente,))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()