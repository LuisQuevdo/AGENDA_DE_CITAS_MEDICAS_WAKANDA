from flask import Blueprint, jsonify, request
from ..models.TelefonosModels import TelefonosModel
from ..models.entities.Telefonos import Telefono
import uuid
from services.twilio_service2 import enviar_whatsapp
from apis.notificaciones.models.NotificacionesModels import NotificacionModel
from apis.notificaciones.models.entities.Notificaciones import Notificacion

main = Blueprint("Telefono_blueprint", __name__)

@main.route('/', methods=['GET'])
def get_all():
    try:
        telefonos = TelefonosModel.get_all()
        return jsonify({
            "success": True,
            "message": "Lista de teléfonos",
            "data": telefonos,
            "count": len(telefonos)
        }), 200
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/<id_telefonos>', methods=['GET'])
def get_telefono_by_id(id_telefonos):
    try:
        telefono = TelefonosModel.get_by_id(id_telefonos)
        if telefono:
            return jsonify({"success": True, "message": "Teléfono encontrado", "data": telefono}), 200
        return jsonify({"success": False, "message": "Teléfono no encontrado"}), 404
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/add', methods=['POST'])
def add_telefono():
    try:
        data = request.get_json()

        required_fields = ['nombre', 'codigo_pais', 'numero']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                "success": False,
                "error": f"Faltan campos: {', '.join(missing_fields)}"
            }), 400

        telefono = Telefono(
            id_telefonos=str(uuid.uuid4()),
            nombre=data['nombre'],
            codigo_pais=data['codigo_pais'],
            numero=data['numero']
        )

        affected_rows = TelefonosModel.add(telefono)
        if affected_rows != 1:
            return jsonify({"success": False, "error": "No se registró"}), 400

        # --- Enviar notificación WhatsApp ---
        numero_completo = f"{data['codigo_pais']}{data['numero']}"
        mensaje = f"""
📲 Hola {data['nombre']},

Has sido registrado en nuestro sistema medico Wakanda Salud.

¡Gracias por formar parte de nuestra familia!
"""
        estado_envio = enviar_whatsapp(numero_completo, mensaje)
        
        # --- Registrar notificación en BD ---
        notificacion = Notificacion(
            id_notificacion=str(uuid.uuid4()),
            cita_id=None,
            tipo="whatsapp",
            contenido=mensaje,
            estado=estado_envio
        )
        NotificacionModel.add(notificacion)

        return jsonify({
            "success": True,
            "message": "Teléfono registrado y notificación enviada",
            "id": telefono.id_telefonos,
            "notificacion_status": estado_envio,
            "notificacion_id": notificacion.id_notificacion
        }), 201

    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/update/<id_telefonos>', methods=['PUT'])
def update_telefono(id_telefonos):
    try:
        data = request.get_json()

        existing_telefono = TelefonosModel.get_by_id(id_telefonos)
        if not existing_telefono:
            return jsonify({"success": False, "message": "Teléfono no encontrado"}), 404

        required_fields = ['nombre', 'codigo_pais', 'numero']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                "success": False,
                "error": f"Faltan campos: {', '.join(missing_fields)}"
            }), 400

        telefono = Telefono(
            id_telefonos=id_telefonos,
            nombre=data['nombre'],
            codigo_pais=data['codigo_pais'],
            numero=data['numero']
        )

        affected_rows = TelefonosModel.update(telefono)
        if affected_rows != 1:
            return jsonify({"success": False, "error": "No se actualizó"}), 400

        # --- Notificación de actualización ---
        try:
            numero_completo = f"{data['codigo_pais']}{data['numero']}"
            mensaje = f"""
📲 Hola {data['nombre']},

Tus datos de contacto han sido actualizados en nuestro sistema.

Nuevo número: {numero_completo}
            
Si no realizaste este cambio, por favor contáctanos.
"""
            estado_envio = enviar_whatsapp(numero_completo, mensaje)
            
            # Registrar notificación
            notificacion = Notificacion(
                id_notificacion=str(uuid.uuid4()),
                cita_id=None,
                tipo="whatsapp",
                contenido=mensaje,
                estado=estado_envio
            )
            NotificacionModel.add(notificacion)

            return jsonify({
                "success": True,
                "message": "Teléfono actualizado y notificación enviada",
                "id": id_telefonos,
                "notificacion_status": estado_envio
            }), 200

        except Exception as notif_error:
            return jsonify({
                "success": True,
                "message": "Teléfono actualizado pero falló la notificación",
                "id": id_telefonos,
                "error": str(notif_error)
            }), 200

    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/delete/<id_telefonos>', methods=['DELETE'])
def delete_telefono(id_telefonos):
    try:
        affected_rows = TelefonosModel.delete(id_telefonos)
        if affected_rows == 1:
            return jsonify({"success": True, "message": "Teléfono eliminado"}), 200
        return jsonify({"success": False, "error": "No se eliminó"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500