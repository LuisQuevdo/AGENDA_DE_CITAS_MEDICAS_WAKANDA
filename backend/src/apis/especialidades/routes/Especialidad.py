from flask import Blueprint, jsonify, request
from ..models.EspecialidadesModels import EspecialidadModel
from ..models.entities.Especialidades import Especialidad
import uuid

main = Blueprint("Especialidad_blueprint", __name__)

@main.route('/', methods=['GET'])
def get_especialidades():
    try:
        especialidades = EspecialidadModel.get_all()
        return jsonify({
            "success": True,
            "message": "Lista de especialidades",
            "data": especialidades,
            "count": len(especialidades)
        }), 200
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/<id_especialidad>', methods=['GET'])
def get_especialidad(id_especialidad):
    try:
        especialidad = EspecialidadModel.get_by_id(id_especialidad)
        if especialidad:
            return jsonify({"success": True, "message": "Especialidad encontrada!", "data": especialidad}), 200
        return jsonify({"success": False, "message": "Especialidad no encontrada"}), 404
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/add', methods=['POST'])
def add_especialidad():
    try:
        data = request.get_json()
        
        if not data.get('nombre'):
            return jsonify({"success": False, "error": "Nombre es requerido"}), 400

        especialidad = Especialidad(
            id_especialidad=str(uuid.uuid4()),
            nombre=data['nombre'],
            descripcion=data.get('descripcion')
        )
        
        affected_rows = EspecialidadModel.add(especialidad)
        if affected_rows == 1:
            return jsonify({
                "success": True,
                "message": "Especialidad creada",
                "id": especialidad.id_especialidad
            }), 201
            
        return jsonify({"success": False, "error": "No se pudo crear"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/update/<id_especialidad>', methods=['PUT'])
def update_especialidad(id_especialidad):
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Datos requeridos"}), 400

        especialidad = Especialidad(
            id_especialidad=id_especialidad,
            nombre=data.get('nombre'),
            descripcion=data.get('descripcion')
        )
        
        affected_rows = EspecialidadModel.update(especialidad)
        if affected_rows == 1:
            return jsonify({"success": True, "message": "Especialidad actualizada"}), 200
        return jsonify({"success": False, "error": "No se actualizó"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/delete/<id_especialidad>', methods=['DELETE'])
def delete_especialidad(id_especialidad):
    try:
        affected_rows = EspecialidadModel.delete(id_especialidad)
        if affected_rows == 1:
            return jsonify({"success": True, "message": "Especialidad eliminada"}), 200
        return jsonify({"success": False, "error": "No se eliminó"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500