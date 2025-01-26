from run import app
from app import db
from app.models.models import Users
from app.services.auth_service import hash_password

with app.app_context():
    new_user = Users(username="admin", password=hash_password("admin"))
    db.session.add(new_user)
    db.session.commit()
    print("Usuário criado com sucesso!")



