from flask import Blueprint, jsonify, request
from ..models.CitasModels import CitaModel
from ..models.entities.Citas import Cita
from apis.notificaciones.models.NotificacionesModels import NotificacionModel
from apis.notificaciones.models.entities.Notificaciones import Notificacion
from apis.pacientes.models.PacientesModels import PacienteModel
from apis.medicos.models.MedicosModels import MedicoModel
from apis.consultorios.models.ConsultoriosModels import ConsultorioModel
from services.twilio_service import enviar_whatsapp

import uuid
from datetime import datetime

main = Blueprint("Cita_blueprint", __name__)

@main.route('/', methods=['GET'])
def get_citas():
    try:
        citas = CitaModel.get_all()
        return jsonify({
            "success": True,
            "message": "Citas obtenidas",
            "data": citas,
            "count": len(citas)
        }), 200
    except Exception as ex:
        return jsonify({"success": False, "message": "Error al obtener las citas", "error": str(ex)}), 500

@main.route('/<id_cita>', methods=['GET'])
def get_cita(id_cita):
    try:
        cita = CitaModel.get_by_id(id_cita)
        if cita:
            return jsonify({"success": True, "message": "Cita obtenida", "data": cita}), 200
        return jsonify({"success": False, "message": "Cita no encontrada"}), 404
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/add', methods=['POST'])
def add_cita():
    try:
        data = request.get_json()
        
        # Validación de campos requeridos
        required_fields = ['paciente_id', 'medico_id', 'fecha_hora', 'consultorio_id']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                "success": False,
                "error": f"Faltan campos: {', '.join(missing_fields)}"
            }), 400

        # Validar formato de fecha
        try:
            fecha_hora = datetime.fromisoformat(data['fecha_hora'])
        except ValueError:
            return jsonify({
                "success": False,
                "error": "Formato de fecha inválido. Use ISO 8601"
            }), 400

        # Crear la cita
        cita = Cita(
            id_cita=str(uuid.uuid4()),
            paciente_id=data['paciente_id'],
            medico_id=data['medico_id'],
            fecha_hora=fecha_hora,
            consultorio_id=data['consultorio_id'],
            estado='programada',
            notas=data.get('notas')
        )
        
        affected_rows = CitaModel.add(cita)
        if affected_rows != 1:
            return jsonify({"success": False, "error": "No se pudo programar"}), 400

        # --- Logica de notificacion con Twilio ---
        # 1. Obtener datos necesarios
        paciente = PacienteModel.get_by_id(data['paciente_id'])
        medico = MedicoModel.get_by_id(data['medico_id'])
        consultorio = ConsultorioModel.get_by_id(data['consultorio_id'])
        
        if not paciente or not medico or not consultorio:
            return jsonify({
                "success": False,
                "error": "No se encontraron datos completos (paciente, médico o consultorio)"
            }), 404

        # 2. Formatear mensaje mejorado
        mensaje = f"""
        🏥 Confirmación de Cita Médica 🏥
        
        Paciente: {paciente['nombre']}
        Médico: {medico['nombre']}
        Fecha: {fecha_hora.strftime('%A %d/%m/%Y a las %H:%M')}
        Consultorio: N° {consultorio['numero']} (Piso {consultorio['piso']})
        
        ¡Gracias por confiar en nosotros!
        """
        
        # 3. Enviar WhatsApp (con numero fijo para pruebas)
        telefono_paciente = ""
        estado_envio = enviar_whatsapp(telefono_paciente, mensaje)

        # 4. Registrar notificacion en BD
        notificacion = Notificacion(
            id_notificacion=str(uuid.uuid4()),
            cita_id=cita.id_cita,
            tipo="whatsapp",
            contenido=mensaje,
            estado=estado_envio
        )
        NotificacionModel.add(notificacion)
        
        # Respuesta exitosa con más detalles
        return jsonify({
            "success": True,
            "message": "Cita programada y notificación enviada",
            "id": cita.id_cita,
            "notificacion_status": estado_envio,
            "detalles_cita": {
                "paciente": paciente['nombre'],
                "medico": medico['nombre'],
                "consultorio": f"N° {consultorio['numero']} (Piso {consultorio['piso']})",
                "fecha": fecha_hora.strftime('%Y-%m-%d %H:%M')
            }
        }), 201
        
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/update/<id_cita>', methods=['PUT'])
def update_cita(id_cita):
    try:
        data = request.get_json()
        
        # Verificar que la cita existe primero
        existing_cita = CitaModel.get_by_id(id_cita)
        if not existing_cita:
            return jsonify({"success": False, "message": "Cita no encontrada"}), 404

        # Validar campos requeridos
        required_fields = ['paciente_id', 'medico_id', 'fecha_hora', 'consultorio_id', 'estado']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                "success": False,
                "error": f"Faltan campos: {', '.join(missing_fields)}"
            }), 400

        # Validar formato de fecha
        try:
            fecha_hora = datetime.fromisoformat(data['fecha_hora'])
        except ValueError:
            return jsonify({
                "success": False,
                "error": "Formato de fecha inválido. Use ISO 8601"
            }), 400

        # Validar estado permitido
        estados_permitidos = ['programada', 'completada', 'cancelada']
        if data['estado'] not in estados_permitidos:
            return jsonify({
                "success": False,
                "error": f"Estado inválido. Debe ser uno de: {', '.join(estados_permitidos)}"
            }), 400

        cita = Cita(
            id_cita=id_cita,
            paciente_id=data['paciente_id'],
            medico_id=data['medico_id'],
            fecha_hora=fecha_hora,
            consultorio_id=data['consultorio_id'],
            estado=data['estado'],
            notas=data.get('notas', existing_cita.get('notas', ''))
        )
        
        affected_rows = CitaModel.update(cita)
        if affected_rows == 1:
            return jsonify({
                "success": True,
                "message": "Cita actualizada exitosamente",
                "id": id_cita
            }), 200
            
        return jsonify({"success": False, "error": "No se pudo actualizar la cita"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/delete/<id_cita>', methods=['DELETE'])
def delete_cita(id_cita):
    try:
        affected_rows = CitaModel.delete(id_cita)
        if affected_rows == 1:
            return jsonify({"success": True, "message": "Cita eliminada"}), 200
        return jsonify({"success": False, "error": "No se canceló"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500