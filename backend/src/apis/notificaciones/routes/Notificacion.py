from flask import Blueprint, jsonify, request
from ..models.NotificacionesModels import NotificacionModel
from ..models.entities.Notificaciones import Notificacion
import uuid

main = Blueprint("Notificacion_blueprint", __name__)

@main.route('/', methods=['GET'])
def get_notificaciones():
    try:
        notificaciones = NotificacionModel.get_all()
        return jsonify({
            "success": True,
            "message": "Listado de notificaciones",
            "data": notificaciones,
            "count": len(notificaciones)
        }), 200
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/<id_notificacion>', methods=['GET'])
def get_factura_by_id(id_notificacion):
    try:
        notificacion = NotificacionModel.get_by_id(id_notificacion)
        if notificacion:
            return jsonify({"success": True, "message": "Factura encontrada!", "data": notificacion}), 200
        return jsonify({"success": False, "message": "Factura no encontrada"}), 404
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/add', methods=['POST'])
def add_notificacion():
    try:
        data = request.get_json()
        
        required_fields = ['cita_id', 'tipo', 'contenido']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                "success": False,
                "error": f"Faltan campos: {', '.join(missing_fields)}"
            }), 400

        notificacion = Notificacion(
            id_notificacion=str(uuid.uuid4()),
            cita_id=data['cita_id'],
            tipo=data['tipo'],
            contenido=data['contenido'],
            estado='pendiente'
        )
        
        affected_rows = NotificacionModel.add(notificacion)
        if affected_rows == 1:
            return jsonify({
                "success": True,
                "message": "Notificación creada",
                "id": notificacion.id_notificacion
            }), 201
            
        return jsonify({"success": False, "error": "No se creó"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/update/<id_notificacion>', methods=['PUT'])
def update_notificacion(id_notificacion):
    try:
        data = request.get_json()
        
        # Verificar que la notificación existe
        existing_notif = NotificacionModel.get_by_id(id_notificacion)
        if not existing_notif:
            return jsonify({"success": False, "message": "Notificación no encontrada"}), 404

        # Validar campos requeridos
        required_fields = ['estado']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                "success": False,
                "error": f"Faltan campos: {', '.join(missing_fields)}"
            }), 400

        # Validar estado permitido
        estados_permitidos = ['pendiente', 'enviado', 'fallido']
        if data['estado'] not in estados_permitidos:
            return jsonify({
                "success": False,
                "error": f"Estado inválido. Debe ser: {', '.join(estados_permitidos)}"
            }), 400

        notificacion = Notificacion(
            id_notificacion=id_notificacion,
            cita_id=existing_notif['cita_id'],  # No se puede cambiar
            tipo=existing_notif['tipo'],        # No se puede cambiar
            contenido=data.get('contenido', existing_notif['contenido']),
            estado=data['estado']
        )
        
        affected_rows = NotificacionModel.update(notificacion)
        if affected_rows == 1:
            return jsonify({
                "success": True,
                "message": "Notificación actualizada",
                "id": id_notificacion
            }), 200
            
        return jsonify({"success": False, "error": "No se actualizó"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500
    
@main.route('/delete/<id_notificacion>', methods=['DELETE'])
def delete_notificacion(id_notificacion):
    try:
        affected_rows = NotificacionModel.delete(id_notificacion)
        if affected_rows == 1:
            return jsonify({"success": True, "message": "Notificación eliminada"}), 200
        return jsonify({"success": False, "error": "No se eliminó"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500