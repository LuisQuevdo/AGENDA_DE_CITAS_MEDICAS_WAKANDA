from database.database import get_connection
from ..models.entities.Horarios import Horario
from psycopg2.extras import DictCursor

class HorarioModel:
    
    @classmethod
    def get_all(cls):
        connection = get_connection()
        try:
            with connection.cursor(cursor_factory=DictCursor) as cursor:
                cursor.execute("SELECT * FROM horarios ORDER BY dia_semana, hora_inicio")
                return [Horario(*row).to_JSON() for row in cursor.fetchall()]
        finally:
            connection.close()

    @classmethod
    def get_by_id(cls, id_horario):
        connection = get_connection()
        try:
            with connection.cursor(cursor_factory=DictCursor) as cursor:
                cursor.execute("SELECT * FROM horarios WHERE id_horario = %s", (id_horario,))
                row = cursor.fetchone()
                return Horario(*row).to_JSON() if row else None
        finally:
            connection.close()

    @classmethod
    def add(cls, horario):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO horarios (
                        id_horario, medico_id, consultorio_id,
                        dia_semana, hora_inicio, hora_fin
                    ) VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    horario.id_horario, horario.medico_id, horario.consultorio_id,
                    horario.dia_semana, horario.hora_inicio, horario.hora_fin
                ))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()

    @classmethod
    def update(cls, horario):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE horarios SET
                        medico_id = %s,
                        consultorio_id = %s,
                        dia_semana = %s,
                        hora_inicio = %s,
                        hora_fin = %s
                    WHERE id_horario = %s
                """, (
                    horario.medico_id, horario.consultorio_id,
                    horario.dia_semana, horario.hora_inicio,
                    horario.hora_fin, horario.id_horario
                ))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()

    @classmethod
    def delete(cls, id_horario):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM horarios WHERE id_horario = %s", (id_horario,))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()