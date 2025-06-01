from flask import Blueprint, jsonify, request
from ..models.ConsultoriosModels import ConsultorioModel
from ..models.entities.Consultorios import Consultorio
import uuid

main = Blueprint("Consultorio_blueprint", __name__)

@main.route('/', methods=['GET'])
def get_consultorios():
    try:
        consultorios = ConsultorioModel.get_all()
        return jsonify({
            "success": True,
            "message": "Lista de consultorios",
            "data": consultorios,
            "count": len(consultorios)
        }), 200
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/<id_consultorio>', methods=['GET'])
def get_consultorio(id_consultorio):
    try:
        consultorio = ConsultorioModel.get_by_id(id_consultorio)
        if consultorio:
            return jsonify({"success": True, "message":"Consultorio encontrado!", "data": consultorio}), 200
        return jsonify({"success": False, "message": "Consultorio no encontrado"}), 404
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/add', methods=['POST'])
def add_consultorio():
    try:
        data = request.get_json()
        
        required_fields = ['numero', 'piso']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                "success": False,
                "error": f"Faltan campos: {', '.join(missing_fields)}"
            }), 400

        consultorio = Consultorio(
            id_consultorio=str(uuid.uuid4()),
            numero=data['numero'],
            piso=data['piso'],
            equipamiento=data.get('equipamiento')
        )
        
        affected_rows = ConsultorioModel.add(consultorio)
        if affected_rows == 1:
            return jsonify({
                "success": True,
                "message": "Consultorio creado",
                "id": consultorio.id_consultorio
            }), 201
            
        return jsonify({"success": False, "error": "No se pudo crear"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/update/<id_consultorio>', methods=['PUT'])
def update_consultorio(id_consultorio):
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Datos requeridos"}), 400

        consultorio = Consultorio(
            id_consultorio=id_consultorio,
            numero=data.get('numero'),
            piso=data.get('piso'),
            equipamiento=data.get('equipamiento')
        )
        
        affected_rows = ConsultorioModel.update(consultorio)
        if affected_rows == 1:
            return jsonify({"success": True, "message": "Consultorio actualizado"}), 200
        return jsonify({"success": False, "error": "No se actualizó"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/delete/<id_consultorio>', methods=['DELETE'])
def delete_consultorio(id_consultorio):
    try:
        affected_rows = ConsultorioModel.delete(id_consultorio)
        if affected_rows == 1:
            return jsonify({"success": True, "message": "Consultorio eliminado"}), 200
        return jsonify({"success": False, "error": "No se eliminó"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500