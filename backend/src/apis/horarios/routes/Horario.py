from flask import Blueprint, jsonify, request
from ..models.HorariosModels import HorarioModel
from ..models.entities.Horarios import Horario
import uuid

main = Blueprint("Horario_blueprint", __name__)

@main.route('/', methods=['GET'])
def get_horarios():
    try:
        horarios = HorarioModel.get_all()
        return jsonify({
            "success": True,
            "message": "Lista de horarios",
            "data": horarios,
            "count": len(horarios)
        }), 200
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/<id_horario>', methods=['GET'])
def get_by_id(id_horario):
    try:
        horario = HorarioModel.get_by_id(id_horario)
        if horario:
            return jsonify({"success": True, "message": "Horario encontrada!", "data": horario}), 200
        return jsonify({"success": False, "message": "Horario no encontrada"}), 404
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/add', methods=['POST'])
def add_horario():
    try:
        data = request.get_json()
        
        required_fields = ['medico_id', 'dia_semana', 'hora_inicio', 'hora_fin']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                "success": False,
                "error": f"Faltan campos: {', '.join(missing_fields)}"
            }), 400

        horario = Horario(
            id_horario=str(uuid.uuid4()),
            medico_id=data['medico_id'],
            consultorio_id=data.get('consultorio_id'),
            dia_semana=data['dia_semana'],
            hora_inicio=data['hora_inicio'],
            hora_fin=data['hora_fin']
        )
        
        affected_rows = HorarioModel.add(horario)
        if affected_rows == 1:
            return jsonify({
                "success": True,
                "message": "Horario creado",
                "id": horario.id_horario
            }), 201
            
        return jsonify({"success": False, "error": "No se pudo crear"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/update/<id_horario>', methods=['PUT'])
def update_horario(id_horario):
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Datos requeridos"}), 400

        horario = Horario(
            id_horario=id_horario,
            medico_id=data.get('medico_id'),
            consultorio_id=data.get('consultorio_id'),
            dia_semana=data.get('dia_semana'),
            hora_inicio=data.get('hora_inicio'),
            hora_fin=data.get('hora_fin')
        )
        
        affected_rows = HorarioModel.update(horario)
        if affected_rows == 1:
            return jsonify({"success": True, "message": "Horario actualizado"}), 200
        return jsonify({"success": False, "error": "No se actualizó"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/delete/<id_horario>', methods=['DELETE'])
def delete_horario(id_horario):
    try:
        affected_rows = HorarioModel.delete(id_horario)
        if affected_rows == 1:
            return jsonify({"success": True, "message": "Horario eliminado"}), 200
        return jsonify({"success": False, "error": "No se eliminó"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500