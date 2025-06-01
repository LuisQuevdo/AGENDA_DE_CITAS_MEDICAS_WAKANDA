import logging
from flask import Flask, jsonify
from flask_cors import CORS
from config.config import app_config

from apis.citas.routes import Cita
from apis.consultorios.routes import Consultorio
from apis.especialidades.routes import Especialidad
from apis.facturas.routes import Factura
from apis.horarios.routes import Horario
from apis.medicos.routes import Medico
from apis.metodos_pago.routes import MetodoPago
from apis.notificaciones.routes import Notificacion
from apis.pacientes.routes import Paciente
from apis.pagos.routes import Pago
from apis.usuarios.routes import Usuario
from apis.telefonos.routes import Telefono


app = Flask(__name__)

CORS(app)

# Configuración del logger
logging.basicConfig(
    filename='app.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Manejo de errores
@app.errorhandler(400)
def bad_request_error(error):
    app.logger.warning(f"Bad Request: {str(error)}")
    return jsonify({
        "success": False,
        "error": "bad_request",
        "message": "Solicitud incorrecta. Verifique los datos enviados."
    }), 400

@app.errorhandler(404)
def not_found_error(error):
    app.logger.warning(f"Not Found: {str(error)}")
    return jsonify({
        "success": False,
        "error": "not_found",
        "message": "Recurso no encontrado."
    }), 404

@app.errorhandler(405)
def method_not_allowed_error(error):
    app.logger.warning(f"Method Not Allowed: {str(error)}")
    return jsonify({
        "success": False,
        "error": "method_not_allowed",
        "message": "Método no permitido para esta ruta."
    }), 405

@app.errorhandler(500)
def internal_server_error(error):
    app.logger.error(f"Internal Server Error: {str(error)}")
    return jsonify({
        "success": False,
        "error": "internal_server_error",
        "message": "Ocurrió un error interno en el servidor."
    }), 500

@app.errorhandler(Exception)
def handle_unexpected_error(error):
    app.logger.error(f"Unexpected Error: {str(error)}")
    return jsonify({
        "success": False,
        "error": "unexpected_error",
        "message": "Ocurrió un error inesperado."
    }), 500


if __name__ == "__main__":
    app.config.from_object(app_config['development'])

    # Registra el manejo de errores

    # Apartado para rutas
    app.register_blueprint(Cita.main, url_prefix='/api/citas')
    app.register_blueprint(Consultorio.main, url_prefix='/api/consultorios')
    app.register_blueprint(Especialidad.main, url_prefix='/api/especialidades')
    app.register_blueprint(Factura.main, url_prefix='/api/facturas')
    app.register_blueprint(Horario.main, url_prefix='/api/horarios')
    app.register_blueprint(Medico.main, url_prefix='/api/medicos')
    app.register_blueprint(MetodoPago.main, url_prefix='/api/metodos_pago')
    app.register_blueprint(Notificacion.main, url_prefix='/api/notificaciones')
    app.register_blueprint(Paciente.main, url_prefix='/api/pacientes')
    app.register_blueprint(Pago.main, url_prefix='/api/pagos')
    app.register_blueprint(Usuario.main, url_prefix='/api/usuarios')
    app.register_blueprint(Telefono.main, url_prefix='/api/telefonos')


    app.run(host='0.0.0.0', port=5000, debug=True)