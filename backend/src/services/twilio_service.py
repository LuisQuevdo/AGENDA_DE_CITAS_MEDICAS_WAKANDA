# services/twilio_service.py
from twilio.rest import Client
from config.config import app_config

current_config = app_config['development']
client = Client(current_config.TWILIO_ACCOUNT_SID, current_config.TWILIO_AUTH_TOKEN)

# Para pruebas temporales (en services/twilio_service.py)
def enviar_whatsapp(destinatario: str, mensaje: str) -> str:
    try:
        # >>> CAMBIA ESTO SOLO PARA PRUEBAS <<<
        telefono = "+50377551423"  # Ej: "+50378787878" (formato internacional) Cambia a tu numero de WhatsApp
        # telefono = destinatario.replace("-", "")  # <<< Comenta esta línea durante pruebas
        
        if not telefono.startswith("+"):
            telefono = f"+503{telefono}"
            
        message = client.messages.create(
            body=mensaje,
            from_=current_config.TWILIO_WHATSAPP_NUMBER,  # Número Twilio
            to=f"whatsapp:{telefono}"  # Tu número verificado
        )
        return "enviado"
    except Exception as e:
        print(f"ERROR: {str(e)}")
        return "fallido"