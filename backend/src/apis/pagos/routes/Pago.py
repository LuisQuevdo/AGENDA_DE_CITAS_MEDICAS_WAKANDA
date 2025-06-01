from flask import Blueprint, jsonify, request
from ..models.PagosModels import PagoModel
from ..models.entities.Pagos import Pago
import uuid

main = Blueprint("Pago_blueprint", __name__)

@main.route('/', methods=['GET'])
def get_all():
    try:
        pagos = PagoModel.get_all()
        return jsonify({
            "success": True,
            "message": "Lista de pagos",
            "data": pagos,
            "count": len(pagos)
        }), 200
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/<id_pago>', methods=['GET'])
def get_factura_by_id(id_pago):
    try:
        pago = PagoModel.get_by_id(id_pago)
        if pago:
            return jsonify({"success": True, "message": "Pago encontrada!", "data": pago}), 200
        return jsonify({"success": False, "message": "Pago no encontrada"}), 404
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/add', methods=['POST'])
def add_pago():
    try:
        data = request.get_json()
        
        required_fields = ['factura_id', 'monto', 'metodo_pago_id']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                "success": False,
                "error": f"Faltan campos: {', '.join(missing_fields)}"
            }), 400

        pago = Pago(
            id_pago=str(uuid.uuid4()),
            factura_id=data['factura_id'],
            monto=data['monto'],
            metodo_pago_id=data['metodo_pago_id'],
            referencia=data.get('referencia')
        )
        
        affected_rows = PagoModel.add(pago)
        if affected_rows == 1:
            return jsonify({
                "success": True,
                "message": "Pago registrado",
                "id": pago.id_pago
            }), 201
            
        return jsonify({"success": False, "error": "No se registró"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500
    
@main.route('/update/<id_pago>', methods=['PUT'])
def update_pago(id_pago):
    try:
        data = request.get_json()
        
        # Verify payment exists
        existing_pago = PagoModel.get_by_id(id_pago)
        if not existing_pago:
            return jsonify({"success": False, "message": "Pago no encontrado"}), 404

        # Validate required fields
        required_fields = ['monto', 'metodo_pago_id']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                "success": False,
                "error": f"Faltan campos: {', '.join(missing_fields)}"
            }), 400

        # Validate amount is positive
        if float(data['monto']) <= 0:
            return jsonify({
                "success": False,
                "error": "El monto debe ser positivo"
            }), 400

        pago = Pago(
            id_pago=id_pago,
            factura_id=existing_pago['factura_id'],  # Can't change invoice
            monto=data['monto'],
            metodo_pago_id=data['metodo_pago_id'],
            referencia=data.get('referencia', existing_pago.get('referencia'))
        )
        
        affected_rows = PagoModel.update(pago)
        if affected_rows == 1:
            return jsonify({
                "success": True,
                "message": "Pago actualizado",
                "id": id_pago
            }), 200
            
        return jsonify({"success": False, "error": "No se actualizó"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/delete/<id_pago>', methods=['DELETE'])
def delete_pago(id_pago):
    try:
        affected_rows = PagoModel.delete(id_pago)
        if affected_rows == 1:
            return jsonify({"success": True, "message": "Pago eliminado"}), 200
        return jsonify({"success": False, "error": "No se eliminó"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500