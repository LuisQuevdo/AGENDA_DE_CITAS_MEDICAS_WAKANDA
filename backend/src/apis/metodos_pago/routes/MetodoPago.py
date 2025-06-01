from flask import Blueprint, jsonify, request
from ..models.MetodosPagoModels import MetodoPagoModel
from ..models.entities.MetodosPago import MetodoPago

main = Blueprint("MetodoPago_blueprint", __name__)

@main.route('/', methods=['GET'])
def get_metodos_pago():
    try:
        metodos = MetodoPagoModel.get_all()
        return jsonify({
            "success": True,
            "message": "Lista de métodos de pago",
            "data": metodos,
            "count": len(metodos)
        }), 200
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/<id_metodo>', methods=['GET'])
def get_metodo_pago(id_metodo):
    try:
        metodo = MetodoPagoModel.get_by_id(id_metodo)
        if metodo:
            return jsonify({
                "success": True,
                "message": "Método de pago encontrado",
                "data": metodo
            }), 200
        return jsonify({
            "success": False,
            "message": "Método de pago no encontrado"
        }), 404
    except Exception as ex:
        return jsonify({
            "success": False,
            "error": str(ex)
        }), 500

@main.route('/add', methods=['POST'])
def add_metodo_pago():
    try:
        data = request.get_json()
        
        if not data.get('nombre'):
            return jsonify({"success": False, "error": "Nombre es requerido"}), 400

        metodo = MetodoPago(
            nombre=data['nombre']
        )
        
        new_id = MetodoPagoModel.add(metodo)
        if new_id:
            return jsonify({
                "success": True,
                "message": "Método agregado",
                "id": new_id
            }), 201
            
        return jsonify({"success": False, "error": "No se agregó"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/update/<id_metodo>', methods=['PUT'])
def update_metodo_pago(id_metodo):
    try:
        data = request.get_json()
        
        if not data.get('nombre'):
            return jsonify({
                "success": False,
                "error": "Nombre es requerido"
            }), 400

        # Verificar que el método existe
        existing_metodo = MetodoPagoModel.get_by_id(id_metodo)
        if not existing_metodo:
            return jsonify({
                "success": False,
                "message": "Método de pago no encontrado"
            }), 404

        metodo = MetodoPago(
            id_metodo_pago=id_metodo,
            nombre=data['nombre']
        )
        
        affected_rows = MetodoPagoModel.update(metodo)
        if affected_rows == 1:
            return jsonify({
                "success": True,
                "message": "Método de pago actualizado",
                "id": id_metodo
            }), 200
            
        return jsonify({
            "success": False,
            "error": "No se pudo actualizar el método de pago"
        }), 400
    except Exception as ex:
        return jsonify({
            "success": False,
            "error": str(ex)
        }), 500

@main.route('/delete/<id_metodo>', methods=['DELETE'])
def delete_metodo_pago(id_metodo):
    try:
        affected_rows = MetodoPagoModel.delete(id_metodo)
        if affected_rows == 1:
            return jsonify({"success": True, "message": "Método de pago eliminado"}), 200
        return jsonify({"success": False, "error": "No se eliminó"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500