from database.database import get_connection
from ..models.entities.Citas import Cita
from psycopg2.extras import DictCursor

class CitaModel:
    
    @classmethod
    def get_all(cls):
        connection = get_connection()
        try:
            with connection.cursor(cursor_factory=DictCursor) as cursor:
                cursor.execute("SELECT * FROM citas ORDER BY fecha_hora DESC")
                return [Cita(*row).to_JSON() for row in cursor.fetchall()]
        finally:
            connection.close()

    @classmethod
    def get_by_id(cls, id_cita):
        connection = get_connection()
        try:
            with connection.cursor(cursor_factory=DictCursor) as cursor:
                cursor.execute("SELECT * FROM citas WHERE id_cita = %s", (id_cita,))
                row = cursor.fetchone()
                return Cita(*row).to_JSON() if row else None
        finally:
            connection.close()

    @classmethod
    def add(cls, cita: Cita):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO citas (
                        id_cita, paciente_id, medico_id, fecha_hora,
                        consultorio_id, estado, notas
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (
                    cita.id_cita, cita.paciente_id, cita.medico_id,
                    cita.fecha_hora, cita.consultorio_id,
                    cita.estado, cita.notas
                ))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()

    @classmethod
    def update(cls, cita):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE citas SET
                        paciente_id = %s,
                        medico_id = %s,
                        fecha_hora = %s,
                        consultorio_id = %s,
                        estado = %s,
                        notas = %s
                    WHERE id_cita = %s
                """, (
                    cita.paciente_id, cita.medico_id, cita.fecha_hora,
                    cita.consultorio_id, cita.estado, cita.notas,
                    cita.id_cita
                ))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()

    @classmethod
    def delete(cls, id_cita):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM citas WHERE id_cita = %s", (id_cita,))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()