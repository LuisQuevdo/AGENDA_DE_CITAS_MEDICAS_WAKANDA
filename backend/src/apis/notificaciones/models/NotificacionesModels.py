from database.database import get_connection
from ..models.entities.Notificaciones import Notificacion
from psycopg2.extras import DictCursor

class NotificacionModel:
    
    @classmethod
    def get_all(cls):
        connection = get_connection()
        try:
            with connection.cursor(cursor_factory=DictCursor) as cursor:
                cursor.execute("SELECT * FROM notificaciones ORDER BY fecha_envio DESC")
                return [Notificacion(*row).to_JSON() for row in cursor.fetchall()]
        finally:
            connection.close()

    @classmethod
    def get_by_id(cls, id_notificacion):
        connection = get_connection()
        try:
            with connection.cursor(cursor_factory=DictCursor) as cursor:
                cursor.execute("SELECT * FROM notificaciones WHERE id_notificacion = %s", (id_notificacion,))
                row = cursor.fetchone()
                return Notificacion(*row).to_JSON() if row else None
        finally:
            connection.close()

    @classmethod
    def add(cls, notificacion):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO notificaciones (
                        id_notificacion, cita_id, tipo,
                        contenido, fecha_envio, estado
                    ) VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    notificacion.id_notificacion, notificacion.cita_id,
                    notificacion.tipo, notificacion.contenido,
                    notificacion.fecha_envio, notificacion.estado
                ))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()

    @classmethod
    def update(cls, notificacion):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE notificaciones SET
                        cita_id = %s,
                        tipo = %s,
                        contenido = %s,
                        fecha_envio = %s,
                        estado = %s
                    WHERE id_notificacion = %s
                """, (
                    notificacion.cita_id, notificacion.tipo,
                    notificacion.contenido, notificacion.fecha_envio,
                    notificacion.estado, notificacion.id_notificacion
                ))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()

    @classmethod
    def delete(cls, id_notificacion):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM notificaciones WHERE id_notificacion = %s", (id_notificacion,))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()