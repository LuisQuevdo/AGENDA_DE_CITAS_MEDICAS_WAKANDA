from flask import Blueprint, jsonify, request
from ..models.PacientesModels import PacienteModel
from ..models.entities.Pacientes import Paciente
import uuid
from datetime import datetime

main = Blueprint("Paciente_blueprint", __name__)

@main.route('/', methods=['GET'])
def get_pacientes():
    try:
        pacientes = PacienteModel.get_all()
        return jsonify({
            "success": True,
            "message": "Lista de pacientes",
            "data": pacientes,
            "count": len(pacientes)
        }), 200
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/<id_paciente>', methods=['GET'])
def get_paciente(id_paciente):
    try:
        paciente = PacienteModel.get_by_id(id_paciente)
        if paciente:
            return jsonify({"success": True, "message": "Paciente encontrado!", "data": paciente}), 200
        return jsonify({"success": False, "message": "Paciente no encontrado"}), 404
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/add', methods=['POST'])
def add_paciente():
    try:
        data = request.get_json()
        
        required_fields = ['nombre', 'fecha_nacimiento']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                "success": False,
                "error": f"Faltan campos obligatorios: {', '.join(missing_fields)}"
            }), 400

        # Validar fecha de nacimiento
        try:
            fecha_nacimiento = datetime.strptime(data['fecha_nacimiento'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({
                "success": False,
                "error": "Formato de fecha inválido. Use YYYY-MM-DD"
            }), 400

        paciente = Paciente(
            id_paciente=str(uuid.uuid4()),
            nombre=data['nombre'],
            dui=data.get('dui'),
            isss=data.get('isss'),
            nit=data.get('nit'),
            fecha_nacimiento=fecha_nacimiento,
            direccion=data.get('direccion'),
            telefono=data.get('telefono'),
            correo=data.get('correo')
        )
        
        affected_rows = PacienteModel.add(paciente)
        if affected_rows == 1:
            return jsonify({
                "success": True,
                "message": "Paciente registrado",
                "id": paciente.id_paciente
            }), 201
            
        return jsonify({"success": False, "error": "No se pudo registrar"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/update/<id_paciente>', methods=['PUT'])
def update_paciente(id_paciente):
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Datos requeridos"}), 400

        paciente = Paciente(
            id_paciente=id_paciente,
            nombre=data.get('nombre'),
            dui=data.get('dui'),
            isss=data.get('isss'),
            nit=data.get('nit'),
            fecha_nacimiento=data.get('fecha_nacimiento'),
            direccion=data.get('direccion'),
            telefono=data.get('telefono'),
            correo=data.get('correo')
        )
        
        affected_rows = PacienteModel.update(paciente)
        if affected_rows == 1:
            return jsonify({"success": True, "message": "Paciente actualizado"}), 200
        return jsonify({"success": False, "error": "No se actualizó"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/delete/<id_paciente>', methods=['DELETE'])
def delete_paciente(id_paciente):
    try:
        affected_rows = PacienteModel.delete(id_paciente)
        if affected_rows == 1:
            return jsonify({"success": True, "message": "Paciente eliminado"}), 200
        return jsonify({"success": False, "error": "No se eliminó"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500