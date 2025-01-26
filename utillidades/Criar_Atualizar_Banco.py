from app import create_app, db
from app.models.models import Users
import bcrypt
from datetime import datetime

def recreate_database():
    app = create_app()
    with app.app_context():
        # Recria todas as tabelas
        db.drop_all()
        db.create_all()

        # Cria usuário admin com todos os campos preenchidos
        hashed_password = bcrypt.hashpw('admin'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        admin = Users(
            username='admin',
            password=hashed_password,
            email='admin@example.com',
            full_name='Administrador do Sistema',
            first_name='Administrador',
            last_name='Sistema',
            cpf='000.000.000-00',
            cell_phone='+55 (00) 00000-0000',
            role='admin',
            created_at=datetime.utcnow(),
            is_active=True
        )

        db.session.add(admin)
        db.session.commit()

        print("✅ Banco de dados recriado com sucesso!")
        print("👤 Usuário admin criado!")

if __name__ == '__main__':
    recreate_database()
