# services/twilio_service.py
from twilio.rest import Client
from config.config import app_config

current_config = app_config['development']
client = Client(current_config.TWILIO_ACCOUNT_SID, current_config.TWILIO_AUTH_TOKEN)

def enviar_whatsapp(numero_con_codigo: str, mensaje: str) -> str:
    try:
        # Validar que el número incluya "+" al inicio
        if not numero_con_codigo.startswith("+"):
            numero_con_codigo = f"+{numero_con_codigo}"

        message = client.messages.create(
            body=mensaje,
            from_=current_config.TWILIO_WHATSAPP_NUMBER,
            to=f"whatsapp:{numero_con_codigo}"
        )
        return "enviado"
    except Exception as e:
        print(f"ERROR al enviar WhatsApp: {str(e)}")
        return "fallido"