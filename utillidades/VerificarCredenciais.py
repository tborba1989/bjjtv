from run import app
from app.services.auth_service import authenticate_user

with app.app_context():
    username = "admin"
    password = "admin"
    if authenticate_user(username, password):
        print("Usuário autenticado!")
        print(username, password)
    else:
        print("Credenciais inválidas.")
        print(username, password)


