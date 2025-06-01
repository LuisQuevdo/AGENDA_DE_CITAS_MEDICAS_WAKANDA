from database.database import get_connection
from ..models.entities.Usuarios import Usuario
from psycopg2.extras import DictCursor

class UsuarioModel:

    @classmethod
    def get_all(cls):
        connection = get_connection()
        try:
            with connection.cursor(cursor_factory=DictCursor) as cursor:
                cursor.execute("SELECT * FROM usuarios ORDER BY fecha_creacion DESC")
                return [Usuario(**row).to_JSON() for row in cursor.fetchall()]
        finally:
            connection.close()

    @classmethod
    def get_by_id(cls, id_usuario):
        connection = get_connection()
        try:
            with connection.cursor(cursor_factory=DictCursor) as cursor:
                cursor.execute("SELECT * FROM usuarios WHERE id_usuario = %s", (id_usuario,))
                row = cursor.fetchone()
                return Usuario(**row).to_JSON() if row else None
        finally:
            connection.close()

    @classmethod
    def add(cls, usuario: Usuario):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO usuarios (
                        id_usuario, nombre, correo, contrasena, rol
                    ) VALUES (%s, %s, %s, %s, %s)
                """, (
                    usuario.id_usuario, usuario.nombre, usuario.correo,
                    usuario.contrasena, usuario.rol
                ))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()

    @classmethod
    def update(cls, usuario: Usuario):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE usuarios SET
                        nombre = %s,
                        correo = %s,
                        contrasena = %s,
                        rol = %s
                    WHERE id_usuario = %s
                """, (
                    usuario.nombre, usuario.correo, usuario.contrasena,
                    usuario.rol, usuario.id_usuario
                ))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()

    @classmethod
    def delete(cls, id_usuario):
        connection = get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM usuarios WHERE id_usuario = %s", (id_usuario,))
                connection.commit()
                return cursor.rowcount
        except:
            connection.rollback()
            raise
        finally:
            connection.close()