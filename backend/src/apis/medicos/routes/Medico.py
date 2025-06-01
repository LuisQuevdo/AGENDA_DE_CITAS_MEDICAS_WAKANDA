from flask import Blueprint, jsonify, request
from ..models.MedicosModels import MedicoModel
from ..models.entities.Medicos import Medico
import uuid

main = Blueprint("Medico_blueprint", __name__)

@main.route('/', methods=['GET'])
def get_medicos():
    try:
        medicos = MedicoModel.get_all()
        return jsonify({
            "success": True,
            "message": "Lista de médicos",
            "data": medicos,
            "count": len(medicos)
        }), 200
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/<id_medico>', methods=['GET'])
def get_medico(id_medico):
    try:
        medico = MedicoModel.get_by_id(id_medico)
        if medico:
            return jsonify({"success": True, "message": "Medico encontrado!", "data": medico}), 200
        return jsonify({"success": False, "message": "Médico no encontrado"}), 404
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/add', methods=['POST'])
def add_medico():
    try:
        data = request.get_json()
        
        required_fields = ['nombre', 'dui', 'isss', 'especialidad_id']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                "success": False,
                "error": f"Faltan campos obligatorios: {', '.join(missing_fields)}"
            }), 400

        medico = Medico(
            id_medico=str(uuid.uuid4()),
            nombre=data['nombre'],
            dui=data['dui'],
            isss=data['isss'],
            nit=data.get('nit'),
            especialidad_id=data['especialidad_id'],
            consultorio_id=data.get('consultorio_id'),
            telefono=data.get('telefono'),
            correo=data.get('correo')
        )
        
        affected_rows = MedicoModel.add(medico)
        if affected_rows == 1:
            return jsonify({
                "success": True,
                "message": "Médico registrado",
                "id": medico.id_medico
            }), 201
            
        return jsonify({"success": False, "error": "No se pudo registrar"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/update/<id_medico>', methods=['PUT'])
def update_medico(id_medico):
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Datos requeridos"}), 400

        medico = Medico(
            id_medico=id_medico,
            nombre=data.get('nombre'),
            dui=data.get('dui'),
            isss=data.get('isss'),
            nit=data.get('nit'),
            especialidad_id=data.get('especialidad_id'),
            consultorio_id=data.get('consultorio_id'),
            telefono=data.get('telefono'),
            correo=data.get('correo')
        )
        
        affected_rows = MedicoModel.update(medico)
        if affected_rows == 1:
            return jsonify({"success": True, "message": "Médico actualizado"}), 200
        return jsonify({"success": False, "error": "No se actualizó"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/delete/<id_medico>', methods=['DELETE'])
def delete_medico(id_medico):
    try:
        affected_rows = MedicoModel.delete(id_medico)
        if affected_rows == 1:
            return jsonify({"success": True, "message": "Médico eliminado"}), 200
        return jsonify({"success": False, "error": "No se eliminó"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500