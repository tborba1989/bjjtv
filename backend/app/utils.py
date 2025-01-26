import jwt
import datetime
from flask import current_app

def gerar_token(usuario_id):
    payload = {
        'usuario_id': usuario_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)  # Token válido por 2 horas
    }
    token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')
    return token

def verificar_token(token):
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload['usuario_id']
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None
