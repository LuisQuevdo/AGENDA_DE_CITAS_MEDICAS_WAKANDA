from flask import Blueprint, jsonify, request
from ..models.UsuariosModels import UsuarioModel
from ..models.entities.Usuarios import Usuario
import uuid

main = Blueprint("Usuario_blueprint", __name__)

@main.route('/', methods=['GET'])
def get_usuarios():
    try:
        usuarios = UsuarioModel.get_all()
        return jsonify({
            "success": True,
            "message": "Usuarios obtenidos",
            "data": usuarios,
            "count": len(usuarios)
        }), 200
    except Exception as ex:
        return jsonify({"success": False, "message": "Error al obtener los usuarios", "error": str(ex)}), 500

@main.route('/<id_usuario>', methods=['GET'])
def get_usuario(id_usuario):
    try:
        usuario = UsuarioModel.get_by_id(id_usuario)
        if usuario:
            return jsonify({"success": True, "message": "Usuario obtenido", "data": usuario}), 200
        return jsonify({"success": False, "message": "Usuario no encontrado"}), 404
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/add', methods=['POST'])
def add_usuario():
    try:
        data = request.get_json()

        required_fields = ['nombre', 'correo', 'contrasena', 'rol']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                "success": False,
                "error": f"Faltan campos: {', '.join(missing_fields)}"
            }), 400

        usuario = Usuario(
            id_usuario=str(uuid.uuid4()),
            nombre=data['nombre'],
            correo=data['correo'],
            contrasena=data['contrasena'],  # Idealmente deberías hashear esto
            rol=data['rol']
        )

        affected_rows = UsuarioModel.add(usuario)
        if affected_rows == 1:
            return jsonify({
                "success": True,
                "message": "Usuario registrado correctamente",
                "id": usuario.id_usuario
            }), 201
        return jsonify({"success": False, "error": "No se pudo registrar el usuario"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/update/<id_usuario>', methods=['PUT'])
def update_usuario(id_usuario):
    try:
        data = request.get_json()

        existing_user = UsuarioModel.get_by_id(id_usuario)
        if not existing_user:
            return jsonify({"success": False, "message": "Usuario no encontrado"}), 404

        required_fields = ['nombre', 'correo', 'contrasena', 'rol']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                "success": False,
                "error": f"Faltan campos: {', '.join(missing_fields)}"
            }), 400

        usuario = Usuario(
            id_usuario=id_usuario,
            nombre=data['nombre'],
            correo=data['correo'],
            contrasena=data['contrasena'],
            rol=data['rol']
        )

        affected_rows = UsuarioModel.update(usuario)
        if affected_rows == 1:
            return jsonify({
                "success": True,
                "message": "Usuario actualizado correctamente",
                "id": id_usuario
            }), 200
        return jsonify({"success": False, "error": "No se pudo actualizar el usuario"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/delete/<id_usuario>', methods=['DELETE'])
def delete_usuario(id_usuario):
    try:
        affected_rows = UsuarioModel.delete(id_usuario)
        if affected_rows == 1:
            return jsonify({"success": True, "message": "Usuario eliminado"}), 200
        return jsonify({"success": False, "error": "No se pudo eliminar el usuario"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500